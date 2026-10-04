import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/venbrax-connect/supabase-admin";
import { uploadMedia } from "@/lib/venbrax-connect/storage";

export const runtime = "nodejs";

interface ClientRow {
  id: string;
  name: string;
}

// GET: lista los ultimos posts programados con el nombre del cliente, para el panel.
export async function GET() {
  const jobs = await supabaseAdmin.select(
    "vc_publication_jobs",
    "select=id,client_id,platform,title,caption,status,scheduled_at,published_at,external_post_id,error,attempts,created_at&order=created_at.desc&limit=50"
  );
  const clients: ClientRow[] = await supabaseAdmin.select("vc_clients", "select=id,name");
  const nameById = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  const result = (jobs ?? []).map((j: Record<string, unknown>) => ({
    ...j,
    client_name: nameById[j.client_id as string] ?? "?",
  }));
  return NextResponse.json({ jobs: result });
}

// POST multipart/form-data { client_id, platform, title?, caption?, scheduled_at?, file }
// Sube el video al bucket "media" de Supabase Storage y encola el post --
// el ciclo de publicacion (lib/venbrax-connect/publishing.ts, disparado por
// n8n) hace el resto cuando llegue scheduled_at.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const clientId = String(form.get("client_id") ?? "");
  const platform = String(form.get("platform") ?? "");
  const title = String(form.get("title") ?? "").trim() || null;
  const caption = String(form.get("caption") ?? "").trim() || null;
  const scheduledAtRaw = String(form.get("scheduled_at") ?? "");
  const file = form.get("file");

  if (!clientId || !platform || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Faltan campos obligatorios: client_id, platform y file" }, { status: 400 });
  }

  const scheduledAt = scheduledAtRaw ? new Date(scheduledAtRaw).toISOString() : null;
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "mp4";
  const objectPath = `${clientId}/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  const contentType = file.type || "video/mp4";

  try {
    await uploadMedia("media", objectPath, await file.arrayBuffer(), contentType);
  } catch (err) {
    return NextResponse.json({ error: `Fallo la subida del archivo: ${String(err)}` }, { status: 500 });
  }

  const [asset] = await supabaseAdmin.insert("vc_media_assets", {
    client_id: clientId,
    type: "video",
    storage_path: `media/${objectPath}`,
    metadata: { original_name: file.name, size: file.size, content_type: contentType },
  });
  if (!asset?.id) {
    return NextResponse.json({ error: "El archivo se subio pero no se pudo registrar el media asset" }, { status: 500 });
  }

  const [job] = await supabaseAdmin.insert("vc_publication_jobs", {
    client_id: clientId,
    platform,
    media_asset_id: asset.id,
    title,
    caption,
    scheduled_at: scheduledAt,
    status: "queued",
  });

  return NextResponse.json({ job: job ?? null });
}
