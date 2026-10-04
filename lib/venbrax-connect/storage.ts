// Envoltorio minimo sobre la API REST de Supabase Storage -- mismo patron
// que supabase-admin.ts (fetch directo, sin el SDK). Sube y firma archivos
// de media de clientes en el bucket "media" (ya existia, publico).

function baseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xshannxyjzrhgnsqmhun.supabase.co";
}

function serviceKey(): string {
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!k) throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurado");
  return k;
}

export async function uploadMedia(bucket: string, objectPath: string, body: ArrayBuffer, contentType: string): Promise<void> {
  const res = await fetch(`${baseUrl()}/storage/v1/object/${bucket}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: serviceKey(),
      Authorization: `Bearer ${serviceKey()}`,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body,
  });
  if (!res.ok) throw new Error(`No se pudo subir el archivo: ${res.status} ${await res.text()}`);
}

// storagePath se guarda en vc_media_assets como "bucket/ruta/al/archivo.mp4"
// -- convencion de este modulo, no habia ningun escritor de esa tabla antes.
export async function getSignedMediaUrl(storagePath: string, expiresIn = 3600): Promise<string> {
  const [bucket, ...rest] = storagePath.split("/");
  const objectPath = rest.join("/");
  if (!bucket || !objectPath) {
    throw new Error(`storage_path invalido, se espera "bucket/ruta": ${storagePath}`);
  }
  const res = await fetch(`${baseUrl()}/storage/v1/object/sign/${bucket}/${objectPath}`, {
    method: "POST",
    headers: { apikey: serviceKey(), Authorization: `Bearer ${serviceKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn }),
  });
  if (!res.ok) throw new Error(`No se pudo firmar la URL del media asset: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return `${baseUrl()}/storage/v1${data.signedURL}`;
}
