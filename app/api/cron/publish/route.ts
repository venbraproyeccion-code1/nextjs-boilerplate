import { NextRequest, NextResponse } from "next/server";
import { runPublishCycle } from "@/lib/venbrax-connect/publishing";

export const runtime = "nodejs";
// Subir video a YouTube puede tardar mas que el timeout default de una
// funcion serverless -- 300s es el maximo del plan Pro de Vercel (Hobby
// tope en 60s). Si el plan real es Hobby, videos grandes pueden cortarse:
// bajar el limite manteniendo archivos chicos, o mover la subida a n8n.
export const maxDuration = 300;

// Dispara un ciclo de publicacion. Deliberadamente no le importa quien lo
// llama -- Vercel Cron y un Schedule Trigger de n8n (que ya corre local
// 24/7, ver vault de Arquitectura) sirven igual, mientras traigan el secreto.
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    console.error("CRON_SECRET no configurado -- endpoint de publicacion deshabilitado por seguridad");
    return false;
  }
  const header = (req.headers.get("authorization") ?? "").trim();
  return header === `Bearer ${secret}` || header === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const result = await runPublishCycle();
  return NextResponse.json({ ok: true, ...result });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
