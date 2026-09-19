// Cliente Supabase de servidor con service_role -- pasa por encima de RLS.
// Nunca importar esto en un componente de cliente ni exponer la key al navegador.
// Sigue el mismo patron REST directo que ya usa app/api/tiktok/callback,
// en vez de sumar otra dependencia (@supabase/supabase-js) solo para esto.

function baseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xshannxyjzrhgnsqmhun.supabase.co";
}

function serviceKey(): string {
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!k) throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurado");
  return k;
}

async function request(path: string, init: RequestInit & { preferReturn?: boolean } = {}) {
  const res = await fetch(`${baseUrl()}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: serviceKey(),
      Authorization: `Bearer ${serviceKey()}`,
      "Content-Type": "application/json",
      ...(init.preferReturn ? { Prefer: "return=representation" } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Supabase REST ${init.method ?? "GET"} ${path} -> ${res.status}: ${detail}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const supabaseAdmin = {
  select: (table: string, query: string) => request(`/${table}?${query}`),
  insert: (table: string, row: Record<string, unknown>) =>
    request(`/${table}`, { method: "POST", body: JSON.stringify(row), preferReturn: true }),
  upsert: (table: string, row: Record<string, unknown>, onConflict: string) =>
    request(`/${table}?on_conflict=${onConflict}`, {
      method: "POST",
      body: JSON.stringify(row),
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    }),
  update: (table: string, query: string, patch: Record<string, unknown>) =>
    request(`/${table}?${query}`, { method: "PATCH", body: JSON.stringify(patch) }),
};
