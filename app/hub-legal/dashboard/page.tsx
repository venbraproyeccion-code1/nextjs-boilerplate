"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const C = {
  black: "#080808", card: "rgba(18,18,22,0.85)", gold: "#c5a455", white: "#f5f5f0",
  gray: "#888", lgray: "#bbb", border: "rgba(197,164,85,0.15)",
  success: "#4ca37a", warning: "#c9a96e", danger: "#c0594b",
};

type Org = { id: string; name: string; trial_started_at: string; subscription_status: string };
type Audit = { id: string; name: string; status: string; risk_score: number; summary: string; created_at: string };

const STATUS_COLOR: Record<string, string> = { aprobado: C.success, revision: C.warning, alerta: C.danger };

export default function Dashboard() {
  const router = useRouter();
  const [org, setOrg] = useState<Org | null>(null);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [docName, setDocName] = useState("");
  const [docText, setDocText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/hub-legal/login"); return; }

      const { data: profile } = await supabase
        .from("legal_profiles").select("organization_id").eq("id", user.id).single();
      if (!profile) { router.push("/hub-legal/login"); return; }

      const { data: orgData } = await supabase
        .from("legal_organizations").select("*").eq("id", profile.organization_id).single();
      setOrg(orgData);

      const { data: auditsData } = await supabase
        .from("legal_audits").select("*").eq("organization_id", profile.organization_id)
        .order("created_at", { ascending: false }).limit(20);
      setAudits(auditsData ?? []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setAnalyzing(true);
    const res = await fetch("/api/hub-legal/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: docName, documentText: docText }),
    });
    const data = await res.json();
    setAnalyzing(false);
    if (!res.ok) { setFormError(data.error ?? "Error al analizar."); return; }
    setAudits((prev) => [data.audit, ...prev]);
    setShowForm(false);
    setDocName(""); setDocText("");
  }

  if (loading) return <div style={{ background: C.black, minHeight: "100vh" }} />;

  const trialActive = org?.subscription_status === "trial";
  const trialExpired = false;

  return (
    <div style={{ background: C.black, minHeight: "100vh", color: C.white, padding: "3rem 1.5rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32 }}>{org?.name}</div>

        {trialActive ? (
          <div style={{ color: C.gold, fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginTop: 8 }}>
            Acceso gratuito activo — sin límite de tiempo
          </div>
        ) : null}

        {!trialExpired && (
          <div style={{ marginTop: 32 }}>
            {!showForm ? (
              <button onClick={() => setShowForm(true)} className="hl-btn" style={{
                background: C.gold, color: C.black, border: "none", borderRadius: 8, padding: "12px 24px",
                fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              }}>
                + Nueva auditoría
              </button>
            ) : (
              <form onSubmit={handleAnalyze} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                {formError && <div style={{ background: "rgba(192,89,75,0.12)", color: C.danger, padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>{formError}</div>}
                <input required placeholder="Nombre del documento" value={docName} onChange={(e) => setDocName(e.target.value)}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.white, fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }} />
                <textarea required placeholder="Pega aquí el texto del documento a analizar" value={docText} onChange={(e) => setDocText(e.target.value)}
                  rows={8}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.white, fontFamily: "'DM Sans', sans-serif", marginBottom: 12, resize: "vertical" }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="submit" disabled={analyzing} style={{
                    background: C.gold, color: C.black, border: "none", borderRadius: 8, padding: "10px 20px",
                    fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: analyzing ? "not-allowed" : "pointer", opacity: analyzing ? 0.6 : 1,
                  }}>
                    {analyzing ? "Analizando…" : "Analizar con IA"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} style={{
                    background: "transparent", color: C.gray, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 20px",
                    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  }}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", color: C.gray, fontSize: 13, marginBottom: 12 }}>AUDITORÍAS RECIENTES</div>
          {audits.length === 0 ? (
            <div style={{ color: C.gray, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Aún no hay auditorías.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {audits.map((a) => (
                <div key={a.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", color: C.gray, fontSize: 13, marginTop: 4 }}>{a.summary}</div>
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 999,
                    color: STATUS_COLOR[a.status] ?? C.gray, border: `1px solid ${STATUS_COLOR[a.status] ?? C.gray}`, whiteSpace: "nowrap",
                  }}>
                    {a.status.toUpperCase()} · {a.risk_score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
