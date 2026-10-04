import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/venbrax-connect/supabase-admin";

export const runtime = "nodejs";

// Aprueba o cancela los trabajos de publicacion de UN dia (hora de Manaus, UTC-4
// sin horario de verano). Lo llama n8n cuando Alfonso pulsa el boton en Telegram.
// Mismo secreto que /api/cron/publish.
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { fecha?: string; accion?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }
  const { fecha, accion } = body;
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha) || (accion !== "aprobar" && accion !== "cancelar")) {
    return NextResponse.json({ error: "Se espera { fecha: 'AAAA-MM-DD', accion: 'aprobar' | 'cancelar' }" }, { status: 400 });
  }

  const start = new Date(`${fecha}T04:00:00.000Z`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const nuevoEstado = accion === "aprobar" ? "queued" : "cancelled";

  const changed = await supabaseAdmin.updateReturning(
    "vc_publication_jobs",
    `status=eq.pending_approval&scheduled_at=gte.${start.toISOString()}&scheduled_at=lt.${end.toISOString()}`,
    { status: nuevoEstado, updated_at: new Date().toISOString() }
  );

  return NextResponse.json({ ok: true, fecha, accion, trabajos: Array.isArray(changed) ? changed.length : 0 });
}
