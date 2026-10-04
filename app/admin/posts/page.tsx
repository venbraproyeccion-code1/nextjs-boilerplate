"use client";
import { useEffect, useState } from "react";

// Solo las plataformas que de verdad saben publicar hoy (ver platforms.ts,
// metodo `publish`) -- mostrar Facebook/Instagram aca seria prometer algo
// que el backend todavia no hace.
const PUBLISH_PLATFORMS = ["tiktok", "youtube"];

interface Connection {
  platform: string;
  status: string;
}
interface ClientRow {
  id: string;
  name: string;
  connections: Connection[];
}
interface JobRow {
  id: string;
  client_name: string;
  platform: string;
  title: string | null;
  caption: string | null;
  status: string;
  scheduled_at: string | null;
  published_at: string | null;
  external_post_id: string | null;
  error: string | null;
  attempts: number;
}

const STATUS_COLOR: Record<string, string> = {
  queued: "#888",
  publishing: "#e6c02f",
  published: "#2FE6A8",
  failed: "#e05a5a",
};

export default function AdminPostsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [clientId, setClientId] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function fetchData() {
    const [clientsRes, jobsRes] = await Promise.all([fetch("/api/admin/clients"), fetch("/api/admin/posts")]);
    const clientsData = await clientsRes.json();
    const jobsData = await jobsRes.json();
    return { clients: clientsData.clients ?? [], jobs: jobsData.jobs ?? [] };
  }

  useEffect(() => {
    let ignore = false;
    fetchData().then((data) => {
      if (!ignore) {
        setClients(data.clients);
        setJobs(data.jobs);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  // Solo clientes que ya conectaron la plataforma elegida -- publicar sin
  // conexion real falla igual en el ciclo, mejor no ofrecerlo aca.
  const eligibleClients = clients.filter((c) => c.connections.some((k) => k.platform === platform && k.status === "connected"));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !file) {
      setMessage("Falta elegir cliente y archivo de video");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    const form = new FormData();
    form.set("client_id", clientId);
    form.set("platform", platform);
    form.set("title", title);
    form.set("caption", caption);
    form.set("scheduled_at", scheduledAt);
    form.set("file", file);

    const res = await fetch("/api/admin/posts", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) {
      setMessage(`Error: ${data.error ?? res.status}`);
    } else {
      setMessage("Post encolado ✓");
      setTitle("");
      setCaption("");
      setScheduledAt("");
      setFile(null);
      const data = await fetchData();
      setClients(data.clients);
      setJobs(data.jobs);
    }
    setSubmitting(false);
  }

  return (
    <main
      style={{
        maxWidth: 780,
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "system-ui",
        color: "#f4f5f3",
        background: "#060b08",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <h1>Posts programados</h1>
        <a href="/admin/connect" style={{ color: "#2FE6A8", fontSize: 14 }}>
          ← Clientes
        </a>
      </div>
      <p style={{ color: "#888", marginBottom: 28 }}>
        Cargar un video a mano para un cliente ya conectado. El ciclo de publicacion (disparado por n8n) lo
        publica solo cuando llega la hora.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12, border: "1px solid #262922", borderRadius: 12, padding: 18, marginBottom: 32 }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <select
            value={platform}
            onChange={(e) => {
              setPlatform(e.target.value);
              setClientId("");
            }}
            style={selectStyle}
          >
            {PUBLISH_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
            <option value="">{eligibleClients.length ? "Elegi el cliente…" : `Nadie conecto ${platform} todavia`}</option>
            {eligibleClients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          style={{ color: "#f4f5f3" }}
        />

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titulo (YouTube)" style={inputStyle} />
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption / descripcion"
          rows={3}
          style={{ ...inputStyle, resize: "vertical" as const }}
        />

        <label style={{ fontSize: 13, color: "#888" }}>
          Publicar el
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            style={{ ...inputStyle, marginLeft: 8, width: "auto" }}
          />
          <span style={{ marginLeft: 6 }}>(vacio = apenas corra el ciclo)</span>
        </label>

        <button type="submit" disabled={submitting} style={buttonStyle}>
          {submitting ? "Subiendo…" : "Encolar post"}
        </button>
        {message && <p style={{ fontSize: 13, color: message.startsWith("Error") ? "#e05a5a" : "#2FE6A8" }}>{message}</p>}
      </form>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Ultimos 50</h2>
      {jobs.length === 0 && <p style={{ color: "#666" }}>Todavia no hay posts cargados.</p>}
      {jobs.map((j) => (
        <div key={j.id} style={{ border: "1px solid #262922", borderRadius: 10, padding: 14, marginBottom: 10, fontSize: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <strong>
              {j.client_name} · {j.platform}
            </strong>
            <span style={{ color: STATUS_COLOR[j.status] ?? "#888" }}>● {j.status}</span>
          </div>
          {j.title && <div style={{ color: "#ccc" }}>{j.title}</div>}
          <div style={{ color: "#888" }}>
            {j.scheduled_at ? new Date(j.scheduled_at).toLocaleString() : "sin hora fija"}
            {j.attempts > 0 && ` · ${j.attempts} intento(s)`}
          </div>
          {j.external_post_id && <div style={{ color: "#2FE6A8" }}>id externo: {j.external_post_id}</div>}
          {j.error && <div style={{ color: "#e05a5a", marginTop: 4 }}>{j.error}</div>}
        </div>
      ))}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  background: "#111",
  border: "1px solid #262922",
  borderRadius: 8,
  color: "#fff",
  fontFamily: "system-ui",
};
const selectStyle: React.CSSProperties = { ...inputStyle };
const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  background: "#2FE6A8",
  color: "#060b08",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
  cursor: "pointer",
};
