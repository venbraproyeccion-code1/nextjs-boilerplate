import { supabaseAdmin } from "@/lib/venbrax-connect/supabase-admin";
import { PLATFORMS } from "@/lib/venbrax-connect/platforms";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Alfonso decidio (2026-09-19): Facebook/Instagram/Threads/TikTok/YouTube se
// ofrecen a clientes. Pinterest queda como canal propio de VenBraX
// (single-tenant, fuera de este sistema). Shopify y Hotmart quedan en el
// registro de plataformas (lib/venbrax-connect/platforms.ts) por si se
// retoman, pero no se muestran aqui hasta que haya app registrada.
const SOCIAL = ["facebook", "instagram", "threads", "tiktok", "youtube"] as const;

async function getClientByToken(token: string) {
  const sessions = await supabaseAdmin.select(
    "vc_onboarding_sessions",
    `token=eq.${token}&select=client_id,expires_at`
  );
  const session = sessions?.[0];
  if (!session) return null;
  const clients = await supabaseAdmin.select("vc_clients", `id=eq.${session.client_id}&select=id,name`);
  const client = clients?.[0];
  if (!client) return null;
  const expired = new Date(session.expires_at) < new Date();
  return { client, expired };
}

async function getConnectionStatuses(clientId: string) {
  // Solo social por ahora -- vc_commerce_connections (Shopify/Hotmart) no se
  // usa en el onboarding de clientes mientras esas plataformas esten fuera.
  const social = await supabaseAdmin.select(
    "vc_social_connections",
    `client_id=eq.${clientId}&select=platform,status`
  );
  const map: Record<string, string> = {};
  for (const row of social ?? []) {
    map[row.platform] = row.status;
  }
  return map;
}

function ConnectButton({ token, platform, status }: { token: string; platform: string; status?: string }) {
  const label = PLATFORMS[platform]?.label ?? platform;
  const configured = true; // el propio /authorize responde 501 si falta credencial; aqui solo mostramos UI
  const connected = status === "connected";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: "1px solid #2a2a2a", borderRadius: 10, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: connected ? "#2FE6A8" : "#888" }}>{connected ? "✓" : "○"}</span>
        <span>{label}</span>
      </div>
      {connected ? (
        <span style={{ color: "#2FE6A8", fontSize: 13 }}>Conectado</span>
      ) : (
        <a
          href={`/api/connect/${platform}/authorize?token=${token}`}
          style={{ padding: "8px 16px", background: "#2FE6A8", color: "#060b08", borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: "none" }}
        >
          Conectar
        </a>
      )}
    </div>
  );
}

export default async function ConnectPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const resolved = await getClientByToken(token);
  if (!resolved) notFound();
  const { client, expired } = resolved;

  if (expired) {
    return (
      <main style={{ maxWidth: 480, margin: "80px auto", fontFamily: "system-ui", textAlign: "center" }}>
        <h1>Este enlace venció</h1>
        <p>Pide a VenBraTech que te genere uno nuevo.</p>
      </main>
    );
  }

  const statuses = await getConnectionStatuses(client.id);

  return (
    <main style={{ maxWidth: 560, margin: "60px auto", fontFamily: "system-ui", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 4 }}>VenBraX Connect</h1>
      <p style={{ color: "#888", marginBottom: 32 }}>
        Conecta tus cuentas para que VenBraTech pueda automatizar tu contenido y operaciones, {client.name}.
      </p>

      <h2 style={{ fontSize: 15, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>Redes sociales</h2>
      {SOCIAL.map((p) => (
        <ConnectButton key={p} token={token} platform={p} status={statuses[p]} />
      ))}
    </main>
  );
}
