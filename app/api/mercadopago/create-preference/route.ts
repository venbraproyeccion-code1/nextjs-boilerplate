import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Precio real confirmado por Alfonso (2026-07-27): lanzamiento R$97, precio normal R$197
// (el R$197 solo se usa en el copy de la página, no en el cobro). Mismo número que
// se muestra en app/audit/page.tsx - si se cambia el precio, actualizar ambos lados.
const AUDIT_PRICE_BRL = 97;

// Enterprise Audit - precios aprobados por Alfonso 2026-07-28, confirmado 2026-07-30
// que el cobro debe ser en USD real (no conversión a BRL). Requiere que la cuenta de
// Mercado Pago tenga habilitado Checkout Multi-Moneda - SIN CONFIRMAR todavía si esta
// cuenta lo tiene activo (ver [[05 Checklist y Pendientes]] en el vault). Si Mercado
// Pago rechaza currency_id "USD", este endpoint devuelve el error real de la API, no
// un fallback silencioso a BRL - regla #22, nunca asumir que algo no probado funciona.
const PRODUCTS = {
  audit: { title: "VenBraX AI Security Audit", price: AUDIT_PRICE_BRL, currency: "BRL" },
  enterprise_audit: { title: "VenBraX Enterprise Audit", price: 2000, currency: "USD" },
  enterprise_full: { title: "VenBraX Enterprise + Acompañamiento 30 días", price: 5000, currency: "USD" },
} as const;
type ProductKey = keyof typeof PRODUCTS;

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
  const productKey: ProductKey = PRODUCTS[body?.product as ProductKey] ? body.product : "audit";
  const product = PRODUCTS[productKey];
  if (!leadId || !email) {
    return NextResponse.json({ error: "leadId y email son requeridos" }, { status: 400 });
  }

  const backOrigin = productKey === "audit" ? "audit" : "enterprise-audit";
  const preference = {
    items: [
      {
        title: product.title,
        quantity: 1,
        unit_price: product.price,
        currency_id: product.currency,
      },
    ],
    payer: { email },
    external_reference: leadId,
    notification_url: `${siteUrl}/api/mercadopago/webhook`,
    back_urls: {
      success: `${siteUrl}/${backOrigin}?pago=exitoso`,
      pending: `${siteUrl}/${backOrigin}?pago=pendiente`,
      failure: `${siteUrl}/${backOrigin}?pago=fallido`,
    },
    auto_return: "approved",
    metadata: { company: company || "", product: productKey },
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
