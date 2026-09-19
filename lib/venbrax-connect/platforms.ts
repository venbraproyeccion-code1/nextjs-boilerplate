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
