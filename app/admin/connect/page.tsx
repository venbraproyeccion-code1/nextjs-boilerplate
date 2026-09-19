"use client";
import { useEffect, useState } from "react";

interface Connection {
  platform: string;
  status: string;
}
interface ClientRow {
  id: string;
  name: string;
  slug: string;
  status: string;
  connections: Connection[];
  onboarding: { token: string; expires_at: string } | null;
}

// Solo lo que de verdad se ofrece a clientes (ver app/connect/[token]/page.tsx).
// Pinterest sigue siendo canal propio de VenBraX, fuera de este panel.
const ALL_PLATFORMS = ["facebook", "instagram", "threads", "tiktok", "youtube"];

export default function AdminConnectPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients");
      const data = await res.json();
      if (!res.ok) {
        setLoadError(data.error ?? `Error ${res.status} al cargar clientes`);
        return;
      }
      setLoadError(null);
      setClients(data.clients ?? []);
    } catch {
      setLoadError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setNewName("");
    setCreating(false);
    load();
  }

  function linkFor(token: string) {
    return `${typeof window !== "undefined" ? window.location.origin : ""}/connect/${token}`;
  }

  function copyLink(id: string, token: string) {
    navigator.clipboard.writeText(linkFor(token));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <main style={{ maxWidth: 780, margin: "40px auto", padding: "0 20px", fontFamily: "system-ui", color: "#f4f5f3", background: "#060b08", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 4 }}>VenBraX Connect — Panel</h1>
      <p style={{ color: "#888", marginBottom: 28 }}>Crea un cliente, copia su link, mándaselo por WhatsApp.</p>

      <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, marginBottom: 32 }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre del cliente (ej. Eduardo Mora)"
          style={{ flex: 1, padding: "10px 14px", background: "#111", border: "1px solid #262922", borderRadius: 8, color: "#fff" }}
        />
        <button type="submit" disabled={creating} style={{ padding: "10px 20px", background: "#2FE6A8", color: "#060b08", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
          {creating ? "Creando…" : "+ Nuevo cliente"}
        </button>
      </form>

      {loadError && (
        <div style={{ background: "rgba(224,90,90,0.12)", border: "1px solid #e05a5a", color: "#e05a5a", padding: "12px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
          ⚠ No se pudo cargar la lista de clientes: {loadError}
        </div>
      )}

      {clients.map((c) => {
        const statusMap = Object.fromEntries(c.connections.map((k) => [k.platform, k.status]));
        return (
          <div key={c.id} style={{ border: "1px solid #262922", borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <strong>{c.name}</strong>
              {c.onboarding && (
                <button
                  onClick={() => copyLink(c.id, c.onboarding!.token)}
                  style={{ fontSize: 12, padding: "6px 12px", background: "#141a17", border: "1px solid #2FE6A8", color: "#2FE6A8", borderRadius: 999, cursor: "pointer" }}
                >
                  {copiedId === c.id ? "¡Copiado!" : "Copiar link"}
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALL_PLATFORMS.map((p) => {
                const st = statusMap[p];
                const connected = st === "connected";
                return (
                  <span
                    key={p}
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: connected ? "rgba(47,230,168,0.12)" : "rgba(255,255,255,0.04)",
                      color: connected ? "#2FE6A8" : "#666",
                      border: `1px solid ${connected ? "#2FE6A8" : "#262922"}`,
                    }}
                  >
                    {connected ? "✓" : "○"} {p}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}

      {!loading && !loadError && clients.length === 0 && <p style={{ color: "#666" }}>Todavía no hay clientes creados.</p>}
    </main>
  );
}
