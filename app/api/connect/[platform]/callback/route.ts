import { NextRequest, NextResponse } from "next/server";
import { getPlatform } from "@/lib/venbrax-connect/platforms";
import { verifyState } from "@/lib/venbrax-connect/state";
import { supabaseAdmin } from "@/lib/venbrax-connect/supabase-admin";

export const runtime = "nodejs";

// GET /api/connect/[platform]/callback -- destino del redirect de la plataforma
// tras el consentimiento del cliente. Valida el `state` firmado, intercambia
// el `code` por tokens reales, y guarda todo aislado por client_id.
export async function GET(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform: platformName } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venbratech.com";
  const platform = getPlatform(platformName);

  const code = req.nextUrl.searchParams.get("code");
  const stateRaw = req.nextUrl.searchParams.get("state");
  const oauthError = req.nextUrl.searchParams.get("error");
  const shopParam = req.nextUrl.searchParams.get("shop"); // Shopify devuelve el shop tambien en el callback

  if (!platform) {
    return NextResponse.json({ error: `Plataforma desconocida: ${platformName}` }, { status: 404 });
  }

  const redirectBack = (status: "conectado" | "error", reason?: string) => {
    const u = new URL(`${siteUrl}/connect/status`);
    u.searchParams.set("platform", platformName);
    u.searchParams.set("result", status);
    if (reason) u.searchParams.set("reason", reason);
    return NextResponse.redirect(u.toString());
  };

  if (oauthError) {
    return redirectBack("error", oauthError);
  }
  if (!code || !stateRaw) {
    return redirectBack("error", "faltan_parametros");
  }

  let state;
  try {
    state = verifyState(stateRaw);
  } catch {
    return redirectBack("error", "state_invalido");
  }

  const clientId = process.env[platform.envClientId];
  const clientSecret = process.env[platform.envClientSecret];
  if (!clientId || !clientSecret) {
    return redirectBack("error", "plataforma_no_configurada");
  }

  const redirectUri = `${siteUrl}/api/connect/${platformName}/callback`;

  let tokenResult;
  try {
    tokenResult = await platform.exchangeToken({
      code,
      clientId,
      clientSecret,
      redirectUri,
      // @ts-expect-error -- shop solo aplica a shopify, el resto lo ignora
      shop: state.shop ?? shopParam,
    });
  } catch (err) {
    await supabaseAdmin.insert("vc_connection_logs", {
      client_id: state.clientId,
      platform: platformName,
      event_type: "error",
      detail: String(err),
    });
    return redirectBack("error", "intercambio_de_token_fallo");
  }

  const now = new Date();
  const expiresAt = tokenResult.expires_in ? new Date(now.getTime() + tokenResult.expires_in * 1000).toISOString() : null;

  const connectionTable = platform.kind === "social" ? "vc_social_connections" : "vc_commerce_connections";
  const connectionRow: Record<string, unknown> = {
    client_id: state.clientId,
    platform: platformName,
    external_account_id: tokenResult.external_account_id ?? null,
    display_name: tokenResult.display_name ?? null,
    status: "connected",
    connected_at: now.toISOString(),
    last_checked_at: now.toISOString(),
    last_error: null,
    updated_at: now.toISOString(),
  };
  if (platform.kind === "commerce" && platformName === "shopify") {
    connectionRow.shop_domain = state.shop ?? shopParam;
  }

  const savedConnection = await supabaseAdmin.upsert(connectionTable, connectionRow, "client_id,platform");
  const connectionId = savedConnection?.[0]?.id;

  if (connectionId) {
    await supabaseAdmin.insert("vc_oauth_tokens", {
      client_id: state.clientId,
      connection_type: platform.kind,
      connection_id: connectionId,
      access_token: tokenResult.access_token,
      refresh_token: tokenResult.refresh_token ?? null,
      expires_at: expiresAt,
      scope: tokenResult.scope ?? null,
    });
  }

  await supabaseAdmin.insert("vc_connection_logs", {
    client_id: state.clientId,
    platform: platformName,
    event_type: "connected",
    detail: `Conectado via onboarding token ${state.onboardingToken.slice(0, 8)}...`,
  });

  return redirectBack("conectado");
}
