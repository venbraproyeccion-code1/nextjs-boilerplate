import { NextRequest, NextResponse } from "next/server";
import { getPlatform } from "@/lib/venbrax-connect/platforms";
import { signState } from "@/lib/venbrax-connect/state";
import { supabaseAdmin } from "@/lib/venbrax-connect/supabase-admin";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

// GET /api/connect/tiktok/authorize?token=<onboarding_token>&shop=tienda.myshopify.com
// El cliente llega aqui al pulsar "Conectar X" en /connect/[token]. Resuelve
// el token de onboarding a un client_id real, arma la URL de la plataforma,
// y redirige. Nunca se le pide contraseña ni API key al cliente en ningun punto.
export async function GET(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform: platformName } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venbratech.com";
  const onboardingToken = req.nextUrl.searchParams.get("token");
  const shop = req.nextUrl.searchParams.get("shop") ?? undefined;

  const platform = getPlatform(platformName);
  if (!platform) {
    return NextResponse.json({ error: `Plataforma desconocida: ${platformName}` }, { status: 404 });
  }
  if (!onboardingToken) {
    return NextResponse.json({ error: "Falta 'token' de onboarding" }, { status: 400 });
  }

  const clientId = process.env[platform.envClientId];
  if (!clientId) {
    // La plataforma esta en el registro pero Alfonso todavia no creo la app
    // de desarrollador correspondiente -- error explicito, nunca un flujo a medias.
    return NextResponse.json(
      { error: `${platform.label} no esta configurado todavia (falta ${platform.envClientId})` },
      { status: 501 }
    );
  }

  // Resolver el token de onboarding a un client_id real, verificando vigencia.
  const sessions = await supabaseAdmin.select(
    "vc_onboarding_sessions",
    `token=eq.${onboardingToken}&select=client_id,expires_at`
  );
  const session = sessions?.[0];
  if (!session) {
    return NextResponse.json({ error: "Link de onboarding invalido" }, { status: 404 });
  }
  if (new Date(session.expires_at) < new Date()) {
    return NextResponse.json({ error: "Link de onboarding vencido" }, { status: 410 });
  }

  if (platform.kind === "commerce" && platformName === "shopify" && !shop) {
    return NextResponse.json({ error: "Falta el dominio de la tienda (?shop=tu-tienda.myshopify.com)" }, { status: 400 });
  }

  const state = signState({
    clientId: session.client_id,
    platform: platformName,
    onboardingToken,
    shop,
    nonce: randomUUID(),
  });

  const redirectUri = `${siteUrl}/api/connect/${platformName}/callback`;

  try {
    const authorizeUrl = platform.buildAuthorizeUrl({ clientId, redirectUri, state, shop });
    return NextResponse.redirect(authorizeUrl);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
