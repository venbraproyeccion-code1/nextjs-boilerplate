import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Precio real confirmado por Alfonso (2026-07-27): lanzamiento R$97, precio normal R$197
// (el R$197 solo se usa en el copy de la página, no en el cobro). Mismo número que
// se muestra en app/audit/page.tsx - si se cambia el precio, actualizar ambos lados.
const AUDIT_PRICE_BRL = 97;

// Enterprise Audit - precios aprobados por Alfonso 2026-07-28 en USD (US$2,000/US$5,000).
// Probado real 2026-07-30 contra la API de Mercado Pago: currency_id "USD" es rechazado
// ("invalid_items") - el Checkout Pro estándar de esta cuenta brasileña solo cobra BRL.
// Alfonso pidió fijar el precio en reales usando referencias reales de mercado (no
// adivinadas): cotización USD/BRL de julio 2026 (~R$5,10) + rango real de mercado
// brasileño para auditorías/proyectos de IA-automatización (R$3.000-10.000 diagnóstico,
// R$15.000-120.000 proyectos, fuentes: clicksoft.com.br/blog, waxi.com.br/blog). R$10.000
// y R$25.000 caen justo en la conversión real y dentro del rango de mercado observado.
const PRODUCTS = {
  audit: { title: "VenBraX AI Security Audit", price: AUDIT_PRICE_BRL, currency: "BRL" },
  enterprise_audit: { title: "VenBraX Enterprise Audit", price: 10000, currency: "BRL" },
  enterprise_full: { title: "VenBraX Enterprise + Acompañamiento 30 días", price: 25000, currency: "BRL" },
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
