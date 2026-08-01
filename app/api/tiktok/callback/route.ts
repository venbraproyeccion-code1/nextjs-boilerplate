import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Recibe el redirect de TikTok tras el login OAuth (sandbox o producción),
// intercambia el code por access_token/refresh_token y los guarda en Supabase
// (tabla tiktok_oauth_tokens, creada 2026-07-31) para que n8n los use después.
export async function GET(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venbratech.com";
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xshannxyjzrhgnsqmhun.supabase.co";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!clientKey || !clientSecret) {
    return NextResponse.json({ error: "TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET no configurados" }, { status: 500 });
  }
  if (!supabaseServiceKey) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY no configurado" }, { status: 500 });
  }

  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  if (error) {
    return NextResponse.redirect(`${siteUrl}/?tiktok=error&reason=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return NextResponse.json({ error: "Falta 'code' en el callback" }, { status: 400 });
  }

  const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${siteUrl}/api/tiktok/callback`,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || tokenData.error) {
    return NextResponse.json({ error: "Fallo al intercambiar el code por token", detail: tokenData }, { status: 502 });
  }

  const now = Date.now();
  const row = {
    open_id: tokenData.open_id,
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    access_token_expires_at: new Date(now + tokenData.expires_in * 1000).toISOString(),
    refresh_token_expires_at: new Date(now + tokenData.refresh_expires_in * 1000).toISOString(),
    scope: tokenData.scope,
    updated_at: new Date().toISOString(),
  };

  const upsertRes = await fetch(`${supabaseUrl}/rest/v1/tiktok_oauth_tokens?on_conflict=open_id`, {
    method: "POST",
    headers: {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(row),
  });

  if (!upsertRes.ok) {
    const detail = await upsertRes.text();
    return NextResponse.json({ error: "Token obtenido pero fallo al guardarlo en Supabase", detail }, { status: 502 });
  }

  return NextResponse.redirect(`${siteUrl}/?tiktok=conectado`);
}
