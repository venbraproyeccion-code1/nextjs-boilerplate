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
  }) => Promise<{ access_token: string; refresh_token?: string; expires_in?: number }>;
  /** Publica el contenido programado. Solo implementado donde ya hay fase real de publicacion (TikTok/YouTube). */
  publish?: (params: {
    accessToken: string;
    externalAccountId: string | null;
    /** URL firmada y temporal del archivo en Supabase Storage. */
    mediaUrl: string;
    title?: string | null;
    caption?: string | null;
  }) => Promise<{ externalPostId: string }>;
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
      u.searchParams.set("scope", "user.info.basic,video.publish,video.upload");
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
    publish: async ({ accessToken, mediaUrl, caption }) => {
      // PULL_FROM_URL exige que el dominio de mediaUrl este verificado en el
      // TikTok Developer Portal (archivo de verificacion de dominio) -- sin
      // eso, TikTok rechaza la llamada con url_ownership_unverified.
      // privacy_level se deja en SELF_ONLY a proposito: una app sin auditar
      // de TikTok (Content Posting API) NO PUEDE publicar PUBLIC_TO_EVERYONE
      // -- lo fuerza el lado de TikTok, no es timidez nuestra. Subir a
      // publico real requiere pasar la revision de la app en TikTok.
      const res = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          post_info: {
            title: caption ?? "",
            privacy_level: "SELF_ONLY",
            disable_duet: false,
            disable_comment: false,
            disable_stitch: false,
          },
          source_info: { source: "PULL_FROM_URL", video_url: mediaUrl },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error?.code !== "ok") throw new Error(`TikTok publish fallo: ${JSON.stringify(data)}`);
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
    exchangeToken: async ({ code, clientId, clientSecret, redirectUri }) => {
      const u = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
      u.searchParams.set("client_id", clientId);
      u.searchParams.set("client_secret", clientSecret);
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("code", code);
      const res = await fetch(u.toString());
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`Facebook token exchange failed: ${JSON.stringify(data)}`);
      return { access_token: data.access_token, expires_in: data.expires_in };
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
      u.searchParams.set("scope", "instagram_basic,instagram_content_publish,pages_show_list");
      return u.toString();
    },
    exchangeToken: async ({ code, clientId, clientSecret, redirectUri }) => {
      const u = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
      u.searchParams.set("client_id", clientId);
      u.searchParams.set("client_secret", clientSecret);
      u.searchParams.set("redirect_uri", redirectUri);
      u.searchParams.set("code", code);
      const res = await fetch(u.toString());
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(`Instagram token exchange failed: ${JSON.stringify(data)}`);
      return { access_token: data.access_token, expires_in: data.expires_in };
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
      return { access_token: data.access_token, refresh_token: data.refresh_token, expires_in: data.expires_in, scope: data.scope };
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
            // privacyStatus "private" a proposito, mismo criterio que TikTok:
            // publicacion real la decide Alfonso a mano hasta que el flujo se
            // valide end-to-end -- cambiar a "public" es una linea, pero es
            // una decision de negocio, no algo para dejar en automatico.
            status: { privacyStatus: "private" },
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
