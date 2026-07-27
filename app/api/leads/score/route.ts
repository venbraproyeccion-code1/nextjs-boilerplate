import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Endpoint de lead scoring vectorial (fase 1: solo genera y devuelve el embedding real).
// A propósito NO clasifica todavía (Corporate/Qualified/Cold) - no hay ejemplos reales
// en corporate_examples para calibrar umbrales, y umbrales inventados no sirven de nada.
export async function POST(req: NextRequest) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "NVIDIA_API_KEY no configurado" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  const text = body?.text;
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
  return NextResponse.json({
    dimension: Array.isArray(embedding) ? embedding.length : null,
    model: data?.model ?? "nvidia/nv-embedqa-e5-v5",
  });
}
