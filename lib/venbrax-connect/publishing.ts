// Orquestacion del ciclo de publicacion programada. Toda la logica vive
// aca para que el endpoint que la dispara (app/api/cron/publish) sea un
// wrapper delgado -- da igual si lo llama Vercel Cron o un Schedule
// Trigger de n8n (que ya corre local 24/7, ver vault), el ciclo es el mismo.

import { getPlatform } from "./platforms";
import { supabaseAdmin } from "./supabase-admin";
import { getSignedMediaUrl } from "./storage";

const CLAIM_BATCH_SIZE = 5;
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // refrescar si vence en <5min

interface PublicationJob {
  id: string;
  client_id: string;
  platform: string;
  media_asset_id: string | null;
  title: string | null;
  caption: string | null;
  attempts: number;
}

interface MediaAsset {
  id: string;
  storage_path: string;
}

async function ensureValidAccessToken(
  clientId: string,
  platformName: string
): Promise<{ accessToken: string; externalAccountId: string | null }> {
  const [connection] = await supabaseAdmin.select(
    "vc_social_connections",
    `client_id=eq.${clientId}&platform=eq.${platformName}&select=id,external_account_id,status`
  );
  if (!connection || connection.status !== "connected") {
    throw new Error(`Cliente ${clientId} no tiene ${platformName} conectado`);
  }

  const [token] = await supabaseAdmin.select(
    "vc_oauth_tokens",
    `connection_id=eq.${connection.id}&connection_type=eq.social&select=*`
  );
  if (!token) throw new Error(`Sin tokens guardados para ${platformName}/${clientId}`);

  const expiresAt = token.expires_at ? new Date(token.expires_at as string).getTime() : null;
  const needsRefresh = expiresAt !== null && expiresAt - Date.now() < TOKEN_REFRESH_BUFFER_MS;
  const externalAccountId = (connection.external_account_id as string | null) ?? null;

  if (!needsRefresh) {
    return { accessToken: token.access_token as string, externalAccountId };
  }

  const platform = getPlatform(platformName);
  if (!platform?.refreshAccessToken || !token.refresh_token) {
    // Sin mecanismo de refresh disponible: se intenta con el token actual y
    // que la propia API de la plataforma falle explicito si de verdad esta
    // vencido, en vez de bloquear la publicacion por una estimacion propia.
    return { accessToken: token.access_token as string, externalAccountId };
  }

  const clientIdEnv = process.env[platform.envClientId];
  const clientSecretEnv = process.env[platform.envClientSecret];
  if (!clientIdEnv || !clientSecretEnv) {
    throw new Error(`${platformName} no configurado (faltan credenciales de app)`);
  }

  const refreshed = await platform.refreshAccessToken({
    refreshToken: token.refresh_token as string,
    clientId: clientIdEnv,
    clientSecret: clientSecretEnv,
  });

  const newExpiresAt = refreshed.expires_in ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString() : null;
  await supabaseAdmin.update("vc_oauth_tokens", `id=eq.${token.id}`, {
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token ?? token.refresh_token,
    expires_at: newExpiresAt,
    updated_at: new Date().toISOString(),
  });

  return { accessToken: refreshed.access_token, externalAccountId };
}

// Reclama el job cambiandolo a "publishing" SOLO si sigue en "queued" --
// es la guarda de concurrencia: si dos ciclos corren pegados (cron +
// disparo manual, por ejemplo), el segundo que llega aca se queda sin
// filas devueltas y lo salta, en vez de publicar el mismo post dos veces.
async function claimJob(jobId: string): Promise<boolean> {
  const claimed = await supabaseAdmin.updateReturning("vc_publication_jobs", `id=eq.${jobId}&status=eq.queued`, {
    status: "publishing",
    updated_at: new Date().toISOString(),
  });
  return Array.isArray(claimed) && claimed.length > 0;
}

async function markResult(jobId: string, patch: Record<string, unknown>) {
  await supabaseAdmin.update("vc_publication_jobs", `id=eq.${jobId}`, {
    ...patch,
    updated_at: new Date().toISOString(),
  });
}

async function publishOne(job: PublicationJob): Promise<boolean> {
  const platform = getPlatform(job.platform);
  if (!platform?.publish) {
    await markResult(job.id, { status: "failed", error: `Publicacion no implementada para ${job.platform}` });
    return false;
  }

  try {
    const [asset]: MediaAsset[] = job.media_asset_id
      ? await supabaseAdmin.select("vc_media_assets", `id=eq.${job.media_asset_id}&select=id,storage_path`)
      : [];
    if (!asset) throw new Error("El job no tiene un media asset valido");

    const { accessToken, externalAccountId } = await ensureValidAccessToken(job.client_id, job.platform);
    const mediaUrl = await getSignedMediaUrl(asset.storage_path);

    const result = await platform.publish({
      accessToken,
      externalAccountId,
      mediaUrl,
      title: job.title,
      caption: job.caption,
    });

    await markResult(job.id, {
      status: "published",
      published_at: new Date().toISOString(),
      external_post_id: result.externalPostId,
      error: null,
    });
    await supabaseAdmin.insert("vc_connection_logs", {
      client_id: job.client_id,
      platform: job.platform,
      event_type: "publish_success",
      detail: `job ${job.id} -> ${result.externalPostId}`,
    });
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // No hay reintento automatico a proposito (fase inicial, pocos
    // clientes): queda en "failed" con el error real guardado para que
    // Alfonso intervenga a mano, tal como se pidio.
    await markResult(job.id, { status: "failed", error: message, attempts: (job.attempts ?? 0) + 1 });
    await supabaseAdmin.insert("vc_connection_logs", {
      client_id: job.client_id,
      platform: job.platform,
      event_type: "publish_error",
      detail: `job ${job.id}: ${message}`,
    });
    return false;
  }
}

export async function runPublishCycle() {
  const now = new Date().toISOString();
  const due: PublicationJob[] = await supabaseAdmin.select(
    "vc_publication_jobs",
    `status=eq.queued&or=(scheduled_at.is.null,scheduled_at.lte.${now})&order=scheduled_at.asc&limit=${CLAIM_BATCH_SIZE}&select=*`
  );

  const result = { seen: due.length, claimed: 0, published: 0, failed: 0 };
  for (const job of due) {
    const ok = await claimJob(job.id);
    if (!ok) continue; // otro ciclo ya lo tomo
    result.claimed += 1;
    const success = await publishOne(job);
    if (success) result.published += 1;
    else result.failed += 1;
  }
  return result;
}
