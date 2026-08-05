import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

function verifySignature(req: NextRequest, dataId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    // Todavía no configurado en el dashboard de Mercado Pago - no bloquea (la fuente de
    // verdad real es el re-fetch a la API de MP más abajo), pero queda registrado.
    console.error("MERCADOPAGO_WEBHOOK_SECRET no configurado - verificación de firma deshabilitada");
    return true;
  }
  const signatureHeader = req.headers.get("x-signature") || "";
  const requestId = req.headers.get("x-request-id") || "";
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k?.trim(), v?.trim()];
    })
  );
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const hash = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  return hash === v1;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || body.type !== "payment" || !body.data?.id) {
    // Mercado Pago manda otros tipos de eventos (merchant_order, etc) - los ignoramos.
    return NextResponse.json({ ok: true });
  }

  const paymentId = String(body.data.id);
  if (!verifySignature(req, paymentId)) {
    console.error("Mercado Pago webhook: firma inválida, ignorado", paymentId);
    return NextResponse.json({ ok: true });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("MERCADOPAGO_ACCESS_TOKEN no configurado, no se puede verificar el pago", paymentId);
    return NextResponse.json({ ok: true });
  }

  // Nunca confiar en el status que venga en el body del webhook - siempre re-consultar
  // el pago real en la API de Mercado Pago antes de disparar cualquier aprobación.
  const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payment = await payRes.json();

  if (!payRes.ok || payment.status !== "approved") {
    return NextResponse.json({ ok: true });
  }

  const leadId = payment.external_reference;
  if (!leadId) {
    console.error("Pago aprobado sin external_reference, no se puede asociar a un lead", paymentId);
    return NextResponse.json({ ok: true });
  }

  const n8nWebhookUrl = process.env.N8N_MERCADOPAGO_WEBHOOK_URL;
  if (!n8nWebhookUrl) {
    console.error("N8N_MERCADOPAGO_WEBHOOK_URL no configurado - pago aprobado pero no se disparó la aprobación por Telegram", paymentId);
    return NextResponse.json({ ok: true });
  }

  const webhookHeaders: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.N8N_WEBHOOK_SECRET) {
    webhookHeaders["X-VenBraX-Webhook-Secret"] = process.env.N8N_WEBHOOK_SECRET;
  }

  try {
    await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: webhookHeaders,
      body: JSON.stringify({
        lead_id: leadId,
        payment_id: paymentId,
        monto: payment.transaction_amount,
        moneda: payment.currency_id,
        correo: payment.payer?.email,
      }),
    });
  } catch (e) {
    console.error("No se pudo notificar a n8n del pago aprobado", paymentId, e);
  }

  return NextResponse.json({ ok: true });
}
