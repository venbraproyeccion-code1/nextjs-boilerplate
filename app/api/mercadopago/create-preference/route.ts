import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Precio real confirmado por Alfonso (2026-07-27): lanzamiento R$97, precio normal R$197
// (el R$197 solo se usa en el copy de la página, no en el cobro). Mismo número que
// se muestra en app/audit/page.tsx - si se cambia el precio, actualizar ambos lados.
const AUDIT_PRICE_BRL = 97;

export async function POST(req: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venbratech.com";

  if (!accessToken) {
    return NextResponse.json({ error: "MERCADOPAGO_ACCESS_TOKEN no configurado" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const leadId = body?.leadId;
  const email = body?.email;
  const company = body?.company;
  if (!leadId || !email) {
    return NextResponse.json({ error: "leadId y email son requeridos" }, { status: 400 });
  }

  const preference = {
    items: [
      {
        title: "VenBraX AI Security Audit",
        quantity: 1,
        unit_price: AUDIT_PRICE_BRL,
        currency_id: "BRL",
      },
    ],
    payer: { email },
    external_reference: leadId,
    notification_url: `${siteUrl}/api/mercadopago/webhook`,
    back_urls: {
      success: `${siteUrl}/audit?pago=exitoso`,
      pending: `${siteUrl}/audit?pago=pendiente`,
      failure: `${siteUrl}/audit?pago=fallido`,
    },
    auto_return: "approved",
    metadata: { company: company || "" },
  };

  const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preference),
  });

  const data = await mpRes.json();
  if (!mpRes.ok) {
    return NextResponse.json({ error: "Mercado Pago rechazó la preferencia", detail: data }, { status: 502 });
  }

  return NextResponse.json({ init_point: data.init_point, preference_id: data.id });
}
