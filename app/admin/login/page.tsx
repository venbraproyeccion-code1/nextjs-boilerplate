"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Contraseña incorrecta.");
      return;
    }
    router.push("/admin/connect");
  }

  return (
    <div style={{ background: "#060b08", minHeight: "100vh", color: "#f4f5f3", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 360, width: "100%", padding: 32, border: "1px solid #262922", borderRadius: 14 }}>
        <h1 style={{ fontSize: 20, marginBottom: 20 }}>VenBraX Connect — Admin</h1>
        {error && <div style={{ color: "#e05a5a", fontSize: 13, marginBottom: 14 }}>{error}</div>}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "12px 14px", background: "#111", border: "1px solid #262922", borderRadius: 8, color: "#fff", marginBottom: 14 }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, background: "#2FE6A8", color: "#060b08", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
