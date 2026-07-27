import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SUPABASE_URL = "https://xshannxyjzrhgnsqmhun.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaGFubnh5anpyaGduc3FtaHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMDcwODUsImV4cCI6MjA5MTU4MzA4NX0.l6wJsUAYSVE6RAZn-unPPMsGprrzXmBHy7y7wHrWfBw";

// Endpoint de lead scoring vectorial (fase 1: genera y guarda el embedding real).
// A propósito NO clasifica todavía (Corporate/Qualified/Cold) - no hay ejemplos reales
// en corporate_examples para calibrar umbrales, y umbrales inventados no sirven de nada.
// Se llama sin bloquear el flujo de pago (fire-and-forget desde /audit).
export async function POST(req: NextRequest) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "NVIDIA_API_KEY no configurado" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const text = body?.text;
  const leadId = body?.leadId;
  if (!text) {
    return NextResponse.json({ error: "text es requerido" }, { status: 400 });
  }

  const nvRes = await fetch("https://integrate.api.nvidia.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "nvidia/nv-embedqa-e5-v5",
      input: [text],
      input_type: "query",
    }),
  });

  const data = await nvRes.json();
  if (!nvRes.ok) {
    return NextResponse.json({ error: "NVIDIA rechazó la petición", detail: data }, { status: 502 });
  }

  const embedding = data?.data?.[0]?.embedding;
  const dimension = Array.isArray(embedding) ? embedding.length : null;

  let stored = false;
  if (leadId && embedding) {
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/lead_embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        lead_id: leadId,
        embedding,
        model: "nvidia/nv-embedqa-e5-v5",
      }),
    });
    stored = insertRes.ok;
  }

  return NextResponse.json({ dimension, model: data?.model ?? "nvidia/nv-embedqa-e5-v5", stored });
}
