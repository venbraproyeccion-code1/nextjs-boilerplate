"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const C = { black: "#080808", card: "rgba(18,18,22,0.85)", gold: "#c5a455", white: "#f5f5f0", gray: "#888", border: "rgba(197,164,85,0.15)", danger: "#c0594b" };

export default function Registro() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message === "User already registered" ? "Este correo ya está registrado." : signUpError.message);
      setLoading(false);
      return;
    }

    const { error: rpcError } = await supabase.rpc("legal_complete_signup", {
      org_name: orgName,
      user_full_name: fullName,
      user_phone: phone,
    });
    if (rpcError) {
      setError("Tu cuenta se creó pero hubo un problema configurando tu despacho. Contacta soporte.");
      setLoading(false);
      return;
    }

    router.push("/hub-legal/dashboard");
  }

  return (
    <div style={{ background: C.black, minHeight: "100vh", color: C.white, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420, width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, marginBottom: 4 }}>Crea tu despacho</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: C.gray, fontSize: 14, marginBottom: 24 }}>30 días gratis. Sin tarjeta.</div>

        {error && <div style={{ background: "rgba(192,89,75,0.12)", color: C.danger, padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}

        {[
          { label: "Nombre del despacho", value: orgName, set: setOrgName, type: "text" },
          { label: "Tu nombre completo", value: fullName, set: setFullName, type: "text" },
          { label: "Teléfono", value: phone, set: setPhone, type: "tel" },
          { label: "Correo electrónico", value: email, set: setEmail, type: "email" },
          { label: "Contraseña", value: password, set: setPassword, type: "password" },
        ].map((f) => (
          <div key={f.label} style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.gray, display: "block", marginBottom: 6 }}>{f.label}</label>
            <input
              required
              type={f.type}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
                borderRadius: 8, padding: "12px 14px", color: C.white, fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              }}
            />
          </div>
        ))}

        <button type="submit" disabled={loading} style={{
          width: "100%", background: C.gold, color: C.black, border: "none", borderRadius: 8,
          padding: "14px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", fontSize: 15, marginTop: 8,
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
        }}>
          {loading ? "Creando…" : "Crear cuenta gratis"}
        </button>
      </form>
    </div>
  );
}
