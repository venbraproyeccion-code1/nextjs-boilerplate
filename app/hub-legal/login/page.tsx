"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const C = { black: "#080808", card: "rgba(18,18,22,0.85)", gold: "#c5a455", white: "#f5f5f0", gray: "#888", border: "rgba(197,164,85,0.15)", danger: "#c0594b" };

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }
    router.push("/hub-legal/dashboard");
  }

  return (
    <div style={{ background: C.black, minHeight: "100vh", color: C.white, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <form onSubmit={handleSubmit} style={{ maxWidth: 380, width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, marginBottom: 24 }}>Entrar a tu panel</div>

        {error && <div style={{ background: "rgba(192,89,75,0.12)", color: C.danger, padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.gray, display: "block", marginBottom: 6 }}>Correo electrónico</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", color: C.white, fontFamily: "'DM Sans', sans-serif", fontSize: 15 }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.gray, display: "block", marginBottom: 6 }}>Contraseña</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", color: C.white, fontFamily: "'DM Sans', sans-serif", fontSize: 15 }} />
        </div>

        <button type="submit" disabled={loading} style={{
          width: "100%", background: C.gold, color: C.black, border: "none", borderRadius: 8,
          padding: "14px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", fontSize: 15,
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
        }}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
