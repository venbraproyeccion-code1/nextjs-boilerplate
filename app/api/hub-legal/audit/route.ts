import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const { data: profile } = await supabase
    .from("legal_profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();
  if (!profile) return NextResponse.json({ error: "Perfil no encontrado." }, { status: 403 });

  const { name, documentText } = await req.json();
  if (!name || !documentText) {
    return NextResponse.json({ error: "Falta el nombre o el texto del documento." }, { status: 400 });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return NextResponse.json({ error: "Servicio de IA no configurado." }, { status: 500 });

  const prompt = `Eres un auditor legal experto. Analiza el siguiente documento y responde SOLO con JSON válido, sin texto adicional, con este formato exacto:
{"riskScore": 0-100, "status": "aprobado"|"revision"|"alerta", "summary": "una oración clara en español", "findings": ["hallazgo 1", "hallazgo 2"]}
riskScore 0-30=aprobado, 31-60=revision, 61-100=alerta.

Documento:
${documentText.slice(0, 15000)}`;

  const geminiResp = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: { "x-goog-api-key": geminiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
      }),
    }
  );

  if (!geminiResp.ok) {
    return NextResponse.json({ error: "El análisis de IA falló. Intenta de nuevo." }, { status: 502 });
  }

  const geminiData = await geminiResp.json();
  let parsed;
  try {
    parsed = JSON.parse(geminiData.candidates[0].content.parts[0].text);
  } catch {
    parsed = { riskScore: 0, status: "revision", summary: "No se pudo interpretar el análisis.", findings: [] };
  }

  const { data: audit, error: insertError } = await supabase
    .from("legal_audits")
    .insert({
      organization_id: profile.organization_id,
      created_by: user.id,
      name,
      status: parsed.status ?? "revision",
      summary: parsed.summary ?? "",
      risk_score: parsed.riskScore ?? 0,
      findings: parsed.findings ?? [],
    })
    .select()
    .single();

  if (insertError) return NextResponse.json({ error: "No se pudo guardar la auditoría." }, { status: 500 });

  return NextResponse.json({ audit });
}
