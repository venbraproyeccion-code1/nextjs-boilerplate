import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/venbrax-connect/supabase-admin";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

function slugify(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "cliente"
  );
}

// GET: lista clientes con su estado de conexion por plataforma, para el panel.
export async function GET() {
  const clients = await supabaseAdmin.select("vc_clients", "select=id,name,slug,status,created_at&order=created_at.desc");
  const social = await supabaseAdmin.select("vc_social_connections", "select=client_id,platform,status");
  const commerce = await supabaseAdmin.select("vc_commerce_connections", "select=client_id,platform,status");
  const sessions = await supabaseAdmin.select(
    "vc_onboarding_sessions",
    "select=client_id,token,expires_at&order=created_at.desc"
  );

  const byClient: Record<string, { platform: string; status: string }[]> = {};
  for (const row of [...(social ?? []), ...(commerce ?? [])]) {
    (byClient[row.client_id] ??= []).push({ platform: row.platform, status: row.status });
  }
  const latestSession: Record<string, { token: string; expires_at: string }> = {};
  for (const s of sessions ?? []) {
    if (!latestSession[s.client_id]) latestSession[s.client_id] = { token: s.token, expires_at: s.expires_at };
  }

  const result = (clients ?? []).map((c: any) => ({
    ...c,
    connections: byClient[c.id] ?? [],
    onboarding: latestSession[c.id] ?? null,
  }));

  return NextResponse.json({ clients: result });
}

// POST { name }: crea un cliente nuevo + su sesion de onboarding (el link).
export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Falta 'name'" }, { status: 400 });
  }

  let slug = slugify(name);
  const existing = await supabaseAdmin.select("vc_clients", `slug=eq.${slug}&select=id`);
  if (existing?.length) {
    slug = `${slug}-${randomUUID().slice(0, 4)}`;
  }

  const created = await supabaseAdmin.insert("vc_clients", { name: name.trim(), slug });
  const client = created?.[0];
  if (!client) {
    return NextResponse.json({ error: "No se pudo crear el cliente" }, { status: 500 });
  }

  const session = await supabaseAdmin.insert("vc_onboarding_sessions", { client_id: client.id });
  const token = session?.[0]?.token;

  return NextResponse.json({ client, token });
}
