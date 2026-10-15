// VENBRAX CONNECT — registro central de plataformas.
// Agregar una plataforma nueva es agregar UNA entrada aqui una vez que exista
// su app de desarrollador (client id/secret reales) — las rutas genericas
// de /api/connect/[platform]/authorize y /callback leen de este archivo,
// nunca hay que tocarlas por plataforma.

export type ConnectionKind = "social" | "commerce";

export interface PlatformConfig {
  kind: ConnectionKind;
  /** Nombre para mostrar en el onboarding */
  label: string;
  /** Variables de entorno donde viven las credenciales de la app (nunca hardcodear) */
  envClientId: string;
  envClientSecret: string;
  /** Construye la URL de autorizacion. `redirectUri` y `state` ya vienen listos. */
  buildAuthorizeUrl: (params: { clientId: string; redirectUri: string; state: string; shop?: string }) => string;
  /** Intercambia el `code` del callback por tokens reales. */
  exchangeToken: (params: {
    code: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    /** Solo Meta: Pagina de Facebook fija de este cliente (vc_social_connections.preferred_page_id). */
    preferredPageId?: string | null;
  }) => Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
    external_account_id?: string;
    display_name?: string;
  }>;
  /** Cambia un refresh_token vencido/por vencer por un access_token nuevo. */
  refreshAccessToken?: (params: {
    refreshToken: string;
    clientId: string;
    clientSecret: string;
    preferredPageId?: string | null;
  }) => Promise<{ access_token: string; refresh_token?: string; expires_in?: number }>;
  /** Publica el contenido programado. Solo implementado donde ya hay fase real de publicacion (TikTok/YouTube). */
  publish?: (params: {
    accessToken: string;
    externalAccountId: string | null;
    /** URL firmada y temporal del archivo en Supabase Storage. */
    mediaUrl: string;
    /** Solo carruseles de imagenes (Facebook): URLs firmadas de cada foto, en orden. */
    mediaUrls?: string[];
    title?: string | null;
    caption?: string | null;
  }) => Promise<{ externalPostId: string }>;
}

// Meta (Facebook/Instagram) no deja publicar con el token de usuario que
// devuelve el login -- hace falta el token de la Pagina que administra ese
// usuario (via /me/accounts), y para Instagram ademas el ID de la cuenta de
// Instagram Business/Creator vinculada a esa Pagina. Se guarda el token de
// usuario de LARGA duracion (no el de la Pagina) en `refresh_token` para
// poder re-sacar el token de Pagina mas adelante sin pedir login de nuevo.
// Si el usuario administra varias Paginas, se usa la fijada en
// vc_social_connections.preferred_page_id; sin preferencia se toma la primera
// que devuelve /me/accounts (orden no garantizado por Meta).
async function metaGetPageToken(
  clientId: string,
  clientSecret: string,
  shortLivedUserToken: string,
  preferredPageId?: string | null
) {
  const llUrl = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
  llUrl.searchParams.set("grant_type", "fb_exchange_token");
  llUrl.searchParams.set("client_id", clientId);
  llUrl.searchParams.set("client_secret", clientSecret);
  llUrl.searchParams.set("fb_exchange_token", shortLivedUserToken);
  const llRes = await fetch(llUrl.toString());
  const llData = await llRes.json();
  if (!llRes.ok || llData.error) throw new Error(`Meta: fallo el canje a token de larga duracion: ${JSON.stringify(llData)}`);
  const longLivedUserToken = llData.access_token as string;
  const expiresIn = llData.expires_in as number | undefined;

  const { page } = await metaPickPage(longLivedUserToken, preferredPageId);
  return { longLivedUserToken, expiresIn, page };
}

async function metaPickPage(userToken: string, preferredPageId?: string | null) {
  const res = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?limit=100&access_token=${encodeURIComponent(userToken)}`
  );
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`Meta: fallo al listar Paginas: ${JSON.stringify(data)}`);
  const pages = data.data as Array<{ id: string; name: string; access_token: string }> | undefined;
  if (preferredPageId) {
    // Con una Pagina fijada nunca se cae a otra en silencio: publicar en la Pagina equivocada es peor que fallar.
    const fixed = pages?.find((p) => p.id === preferredPageId);
    if (!fixed) throw new Error(`Meta: la Pagina fijada (${preferredPageId}) ya no esta entre las que este usuario autorizo`);
    return { page: fixed };
  }
  const page = pages?.[0];
  if (!page) throw new Error("Meta: este usuario no administra ninguna Pagina de Facebook (se requiere al menos una para publicar)");
  return { page };
}

// NOTA: cada `buildAuthorizeUrl`/`exchangeToken` de abajo sigue el flujo OAuth2
// oficial documentado de cada plataforma al momento de escribir esto (sep-2026).
// Verificar contra la documentacion oficial vigente antes de ir a produccion
// con una plataforma nueva -- las APIs de redes sociales cambian permisos con
// frecuencia (Meta en particular exige App Review para casi todo scope de
// publicacion en Business/Creator accounts).

export const PLATFORMS: Record<string, PlatformConfig> = {
  tiktok: {
    kind: "social",
    label: "TikTok",
    envClientId: "TIKTOK_CLIENT_KEY", // ya existe y funciona (ver app/api/tiktok/callback)
    envClientSecret: "TIKTOK_CLIENT_SECRET",
    buildAuthorizeUrl: ({ clientId, redirectUri, state }) => {
      const u = new URL("https://www.tiktok.com/v2/auth/authorize/");
      u.searchParams.set("client_key", clientId);
      u.searchParams.set("scope", "user.info.basic,video.upload");
      u.searchParams.set("response_type", "code");
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("state", state);
      // Fuerza la pantalla de consentimiento: sin esto TikTok reautoriza en silencio la cuenta que ya dio permiso y varias cuentas terminan enlazadas a la misma.
      u.searchParams.set("disable_auto_auth", "1");
      return u.toString();
    },
    exchangeToken: async ({ code, clientId, clientSecret, redirectUri }) => {
      const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
        body: new URLSearchParams({
          client_key: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`TikTok token exchange failed: ${JSON.stringify(data)}`);
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        scope: data.scope,
        external_account_id: data.open_id,
      };
    },
    refreshAccessToken: async ({ refreshToken, clientId, clientSecret }) => {
      const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
        body: new URLSearchParams({
          client_key: clientId,
          client_secret: clientSecret,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`TikTok refresh fallo: ${JSON.stringify(data)}`);
      return { access_token: data.access_token, refresh_token: data.refresh_token, expires_in: data.expires_in };
    },
    publish: async ({ accessToken, mediaUrl }) => {
      // Sube el video como BORRADOR a la bandeja de la app de TikTok (scope
      // video.upload): el dueno elige el sonido y publica con un toque. Se usa
      // FILE_UPLOAD (el servidor descarga el archivo y lo sube por trozos) porque
      // PULL_FROM_URL exige verificar el dominio de Supabase en TikTok. En borrador
      // no se puede fijar el caption por API; lo escribe el dueno en la app.
      const file = await fetch(mediaUrl);
      if (!file.ok) throw new Error(`No se pudo descargar el video: ${file.status}`);
      const bytes = Buffer.from(await file.arrayBuffer());
      const size = bytes.length;
      const MAX_CHUNK = 64 * 1024 * 1024;
      const chunk = Math.min(size, MAX_CHUNK);
      const total = Math.ceil(size / chunk);

      const init = await fetch("https://open.tiktokapis.com/v2/post/publish/inbox/video/init/", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: chunk, total_chunk_count: total } }),
      });
      const data = await init.json();
      if (!init.ok || data.error?.code !== "ok") throw new Error(`TikTok init de borrador fallo: ${JSON.stringify(data)}`);

      for (let i = 0; i < total; i++) {
        const start = i * chunk;
        const end = Math.min(start + chunk, size) - 1;
        const put = await fetch(data.data.upload_url, {
          method: "PUT",
          headers: { "Content-Type": "video/mp4", "Content-Length": String(end - start + 1), "Content-Range": `bytes ${start}-${end}/${size}` },
          body: bytes.subarray(start, end + 1),
        });
        if (![200, 201, 206].includes(put.status)) throw new Error(`TikTok subida de trozo ${i + 1}/${total} fallo: ${put.status} ${await put.text()}`);
      }
      return { externalPostId: data.data.publish_id };
    },
  },

  // --- Pendientes de app de desarrollador (ver checklist entregado a Alfonso) ---
  // Cada entrada de abajo es un ESQUELETO: la forma de authorize/token de cada
  // plataforma ya esta correcta segun su documentacion oficial, pero falta
  // el CLIENT_ID/SECRET real (solo Alfonso puede crear esas apps). Sin esas
  // env vars, la ruta genérica responde "no configurado" en vez de fallar
  // a medias o inventar un flujo.

  facebook: {
    kind: "social",
    label: "Facebook",
    envClientId: "META_APP_ID",
    envClientSecret: "META_APP_SECRET",
    buildAuthorizeUrl: ({ clientId, redirectUri, state }) => {
      const u = new URL("https://www.facebook.com/v21.0/dialog/oauth");
      u.searchParams.set("client_id", clientId);
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("state", state);
      u.searchParams.set("scope", "pages_show_list,pages_manage_posts,pages_read_engagement");
      return u.toString();
    },
    exchangeToken: async ({ code, clientId, clientSecret, redirectUri, preferredPageId }) => {
      const u = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
      u.searchParams.set("client_id", clientId);
      u.searchParams.set("client_secret", clientSecret);
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("code", code);
      const res = await fetch(u.toString());
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`Facebook token exchange failed: ${JSON.stringify(data)}`);

      const { longLivedUserToken, expiresIn, page } = await metaGetPageToken(
        clientId,
        clientSecret,
        data.access_token,
        preferredPageId
      );
      return {
        access_token: page.access_token,
        refresh_token: longLivedUserToken,
        expires_in: expiresIn,
        external_account_id: page.id,
        display_name: page.name,
      };
    },
    refreshAccessToken: async ({ refreshToken, preferredPageId }) => {
      const { page } = await metaPickPage(refreshToken, preferredPageId);
      return { access_token: page.access_token, refresh_token: refreshToken };
    },
    publish: async ({ accessToken, externalAccountId, mediaUrl, mediaUrls, caption }) => {
      if (!externalAccountId) throw new Error("Falta el ID de la Pagina de Facebook para publicar");

      // Carrusel de fotos: cada foto se sube SIN publicar (published=false) y despues
      // un unico post del feed las adjunta todas, asi sale como una sola publicacion.
      if (mediaUrls && mediaUrls.length > 0) {
        const photoIds: string[] = [];
        for (const url of mediaUrls) {
          const pr = await fetch(`https://graph.facebook.com/v21.0/${externalAccountId}/photos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, published: false, access_token: accessToken }),
          });
          const pd = await pr.json();
          if (!pr.ok || pd.error) throw new Error(`Facebook: fallo al subir una foto del carrusel: ${JSON.stringify(pd)}`);
          photoIds.push(pd.id as string);
        }
        const postRes = await fetch(`https://graph.facebook.com/v21.0/${externalAccountId}/feed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: caption ?? "",
            attached_media: photoIds.map((id) => ({ media_fbid: id })),
            access_token: accessToken,
          }),
        });
        const postData = await postRes.json();
        if (!postRes.ok || postData.error) throw new Error(`Facebook: fallo al publicar el carrusel: ${JSON.stringify(postData)}`);
        return { externalPostId: postData.id as string };
      }

      const videoRes = await fetch(mediaUrl);
      if (!videoRes.ok) throw new Error(`No se pudo descargar el video fuente: ${videoRes.status}`);
      const bytes = Buffer.from(await videoRes.arrayBuffer());

      const form = new FormData();
      form.append("access_token", accessToken);
      if (caption) form.append("description", caption);
      form.append("source", new Blob([bytes]), "video.mp4");

      const res = await fetch(`https://graph-video.facebook.com/v21.0/${externalAccountId}/videos`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`Facebook publish fallo: ${JSON.stringify(data)}`);
      return { externalPostId: data.id };
    },
  },

  instagram: {
    kind: "social",
    label: "Instagram",
    envClientId: "META_APP_ID", // Instagram Business se conecta via la misma app de Meta
    envClientSecret: "META_APP_SECRET",
    buildAuthorizeUrl: ({ clientId, redirectUri, state }) => {
      const u = new URL("https://www.facebook.com/v21.0/dialog/oauth");
      u.searchParams.set("client_id", clientId);
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("state", state);
      u.searchParams.set("scope", "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement");
      return u.toString();
    },
    exchangeToken: async ({ code, clientId, clientSecret, redirectUri, preferredPageId }) => {
      const u = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
      u.searchParams.set("client_id", clientId);
      u.searchParams.set("client_secret", clientSecret);
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("code", code);
      const res = await fetch(u.toString());
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`Instagram token exchange failed: ${JSON.stringify(data)}`);

      const { longLivedUserToken, expiresIn, page } = await metaGetPageToken(
        clientId,
        clientSecret,
        data.access_token,
        preferredPageId
      );

      // La publicacion en Instagram se hace con el token de la Pagina de
      // Facebook, nunca con un token "propio" de Instagram -- por eso hace
      // falta que esa Pagina tenga una cuenta de Instagram Business/Creator
      // vinculada (se configura desde la propia app de Instagram/Facebook).
      const igRes = await fetch(
        `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${encodeURIComponent(page.access_token)}`
      );
      const igData = await igRes.json();
      if (!igRes.ok || igData.error) throw new Error(`Instagram: fallo al leer la cuenta vinculada a la Pagina: ${JSON.stringify(igData)}`);
      const igAccountId = igData.instagram_business_account?.id as string | undefined;
      if (!igAccountId) throw new Error(`Instagram: la Pagina "${page.name}" no tiene ninguna cuenta de Instagram Business/Creator vinculada`);

      return {
        access_token: page.access_token,
        refresh_token: longLivedUserToken,
        expires_in: expiresIn,
        external_account_id: igAccountId,
        display_name: page.name,
      };
    },
    refreshAccessToken: async ({ refreshToken, preferredPageId }) => {
      const { page } = await metaPickPage(refreshToken, preferredPageId);
      return { access_token: page.access_token, refresh_token: refreshToken };
    },
    publish: async ({ accessToken, externalAccountId, mediaUrl, caption }) => {
      if (!externalAccountId) throw new Error("Falta el ID de la cuenta de Instagram Business para publicar");
      // Instagram Content Publishing API: primero se crea un contenedor de
      // medio apuntando a la URL del video (la firmada de Supabase Storage
      // sirve, Meta la descarga por su cuenta), despues se espera a que
      // termine de procesarse, y recien ahi se publica -- no admite subir
      // los bytes directo como TikTok/Facebook.
      const createRes = await fetch(`https://graph.facebook.com/v21.0/${externalAccountId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "REELS",
          video_url: mediaUrl,
          caption: caption ?? "",
          access_token: accessToken,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok || createData.error) throw new Error(`Instagram: fallo al crear el contenedor de medio: ${JSON.stringify(createData)}`);
      const creationId = createData.id as string;

      const deadline = Date.now() + 90_000;
      let status = "IN_PROGRESS";
      while (status === "IN_PROGRESS" && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 3000));
        const statusRes = await fetch(
          `https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${encodeURIComponent(accessToken)}`
        );
        const statusData = await statusRes.json();
        status = statusData.status_code ?? "ERROR";
      }
      if (status !== "FINISHED") throw new Error(`Instagram: el video no termino de procesarse a tiempo (status=${status})`);

      const publishRes = await fetch(`https://graph.facebook.com/v21.0/${externalAccountId}/media_publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creation_id: creationId, access_token: accessToken }),
      });
      const publishData = await publishRes.json();
      if (!publishRes.ok || publishData.error) throw new Error(`Instagram: fallo al publicar: ${JSON.stringify(publishData)}`);
      return { externalPostId: publishData.id };
    },
  },

  threads: {
    kind: "social",
    label: "Threads",
    envClientId: "THREADS_CLIENT_ID",
    envClientSecret: "THREADS_CLIENT_SECRET",
    buildAuthorizeUrl: ({ clientId, redirectUri, state }) => {
      const u = new URL("https://threads.net/oauth/authorize");
      u.searchParams.set("client_id", clientId);
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("scope", "threads_basic,threads_content_publish");
      u.searchParams.set("response_type", "code");
      u.searchParams.set("state", state);
      return u.toString();
    },
    exchangeToken: async ({ code, clientId, clientSecret, redirectUri }) => {
      const res = await fetch("https://graph.threads.net/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`Threads token exchange failed: ${JSON.stringify(data)}`);
      return { access_token: data.access_token, external_account_id: String(data.user_id ?? "") };
    },
  },

  pinterest: {
    kind: "social",
    label: "Pinterest",
    envClientId: "PINTEREST_APP_ID",
    envClientSecret: "PINTEREST_APP_SECRET",
    buildAuthorizeUrl: ({ clientId, redirectUri, state }) => {
      const u = new URL("https://www.pinterest.com/oauth/");
      u.searchParams.set("client_id", clientId);
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("response_type", "code");
      u.searchParams.set("scope", "boards:read,pins:read,pins:write");
      u.searchParams.set("state", state);
      return u.toString();
    },
    exchangeToken: async ({ code, clientId, clientSecret, redirectUri }) => {
      const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const res = await fetch("https://api.pinterest.com/v5/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basic}`,
        },
        body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`Pinterest token exchange failed: ${JSON.stringify(data)}`);
      return { access_token: data.access_token, refresh_token: data.refresh_token, expires_in: data.expires_in, scope: data.scope };
    },
  },

  youtube: {
    kind: "social",
    label: "YouTube",
    envClientId: "GOOGLE_YOUTUBE_CLIENT_ID",
    envClientSecret: "GOOGLE_YOUTUBE_CLIENT_SECRET",
    // OAuth2 estandar de Google (Google Cloud Console -> OAuth client ID,
    // tipo "Web application"). access_type=offline + prompt=consent para
    // recibir refresh_token tambien en reconexiones, no solo la primera vez.
    buildAuthorizeUrl: ({ clientId, redirectUri, state }) => {
      const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      u.searchParams.set("client_id", clientId);
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("response_type", "code");
      u.searchParams.set("access_type", "offline");
      u.searchParams.set("prompt", "consent");
      u.searchParams.set(
        "scope",
        "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly"
      );
      u.searchParams.set("state", state);
      return u.toString();
    },
    exchangeToken: async ({ code, clientId, clientSecret, redirectUri }) => {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`YouTube token exchange failed: ${JSON.stringify(data)}`);
      // Identifica el canal conectado (youtube.readonly alcanza para
      // channels.list con mine=true). Si falla no se rompe la conexion:
      // solo queda sin nombre.
      let channelId: string | undefined;
      let channelTitle: string | undefined;
      try {
        const chRes = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const ch = await chRes.json();
        channelId = ch?.items?.[0]?.id;
        channelTitle = ch?.items?.[0]?.snippet?.title;
      } catch {
        // sin nombre de canal; la conexion sigue valida
      }
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        scope: data.scope,
        external_account_id: channelId,
        display_name: channelTitle,
      };
    },
    refreshAccessToken: async ({ refreshToken, clientId, clientSecret }) => {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`YouTube refresh fallo: ${JSON.stringify(data)}`);
      // Google no reenvia refresh_token en cada refresh -- el original sigue
      // siendo valido, quien llama debe conservarlo (ver publishing.ts).
      return { access_token: data.access_token, expires_in: data.expires_in };
    },
    publish: async ({ accessToken, mediaUrl, title, caption }) => {
      // YouTube Data API no tiene "publicar desde URL": hay que bajar el
      // archivo real y resubirlo via upload resumable. Se transmite en
      // streaming (request body = el mismo stream de la descarga) para no
      // cargar el video entero en memoria dentro de la funcion serverless.
      const videoRes = await fetch(mediaUrl);
      if (!videoRes.ok || !videoRes.body) throw new Error(`No se pudo descargar el video fuente: ${videoRes.status}`);
      const contentType = videoRes.headers.get("content-type") ?? "video/mp4";

      const initRes = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=UTF-8",
            "X-Upload-Content-Type": contentType,
          },
          body: JSON.stringify({
            snippet: { title: title || "Sin titulo", description: caption ?? "" },
            // Alfonso decidio (2026-10-10) publicar en publico. Mientras el
            // proyecto de Google Cloud no pase la auditoria de cumplimiento de
            // la API de YouTube, YouTube fuerza estos videos a privado; al
            // aprobarse la auditoria salen publicos sin tocar el codigo.
            status: { privacyStatus: "public" },
          }),
        }
      );
      if (!initRes.ok) throw new Error(`YouTube init de subida fallo: ${initRes.status} ${await initRes.text()}`);
      const uploadUrl = initRes.headers.get("location");
      if (!uploadUrl) throw new Error("YouTube no devolvio URL de subida resumable");

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
        body: videoRes.body,
        // @ts-expect-error -- "duplex" habilita streaming del body de request en fetch de Node 18+; el tipo RequestInit del DOM aun no lo declara.
        duplex: "half",
      });
      const data = await uploadRes.json();
      if (!uploadRes.ok || data.error) throw new Error(`YouTube subida fallo: ${JSON.stringify(data)}`);
      return { externalPostId: data.id };
    },
  },

  shopify: {
    kind: "commerce",
    label: "Shopify",
    envClientId: "SHOPIFY_APP_CLIENT_ID",
    envClientSecret: "SHOPIFY_APP_CLIENT_SECRET",
    // Shopify necesita el dominio de la tienda ANTES de construir la URL --
    // el onboarding debe pedirle al cliente "tu-tienda.myshopify.com" primero.
    buildAuthorizeUrl: ({ clientId, redirectUri, state, shop }) => {
      if (!shop) throw new Error("Shopify requiere el dominio de la tienda (shop) antes de autorizar");
      const u = new URL(`https://${shop}/admin/oauth/authorize`);
      u.searchParams.set("client_id", clientId);
      u.searchParams.set("scope", "read_products,write_products,read_orders");
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("state", state);
      return u.toString();
    },
    exchangeToken: async ({ code, clientId, clientSecret }) => {
      // Shopify no usa redirect_uri en el intercambio, pero SI requiere el shop
      // -- se resuelve leyendo el mismo `shop` que vino en el callback (?shop=).
      throw new Error("Shopify exchangeToken requiere `shop` explicito -- ver callback/route.ts, caso especial");
    },
  },

  hotmart: {
    kind: "commerce",
    label: "Hotmart",
    envClientId: "HOTMART_CLIENT_ID",
    envClientSecret: "HOTMART_CLIENT_SECRET",
    buildAuthorizeUrl: ({ clientId, redirectUri, state }) => {
      const u = new URL("https://api-sec-vlc.hotmart.com/security/oauth/authorize");
      u.searchParams.set("client_id", clientId);
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("response_type", "code");
      u.searchParams.set("state", state);
      return u.toString();
    },
    exchangeToken: async ({ code, clientId, clientSecret, redirectUri }) => {
      const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const res = await fetch("https://api-sec-vlc.hotmart.com/security/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basic}`,
        },
        body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`Hotmart token exchange failed: ${JSON.stringify(data)}`);
      return { access_token: data.access_token, refresh_token: data.refresh_token, expires_in: data.expires_in };
    },
  },
};

export function getPlatform(name: string): PlatformConfig | null {
  return PLATFORMS[name] ?? null;
}
