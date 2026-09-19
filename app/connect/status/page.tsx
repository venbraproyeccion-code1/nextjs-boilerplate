export const dynamic = "force-dynamic";

export default async function ConnectStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; result?: string; reason?: string }>;
}) {
  const { platform, result, reason } = await searchParams;
  const ok = result === "conectado";
  return (
    <main style={{ maxWidth: 480, margin: "100px auto", fontFamily: "system-ui", textAlign: "center", padding: "0 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{ok ? "✓" : "⚠"}</div>
      <h1>{ok ? `${platform} conectado` : "No se pudo conectar"}</h1>
      {!ok && reason && <p style={{ color: "#888" }}>Motivo: {reason}</p>}
      <p style={{ color: "#888", marginTop: 20 }}>Puedes cerrar esta pestaña y volver a tu enlace de VenBraX Connect.</p>
    </main>
  );
}
