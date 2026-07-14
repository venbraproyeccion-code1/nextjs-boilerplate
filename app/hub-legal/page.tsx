import Link from "next/link";

const C = {
  black: "#080808", card: "rgba(18,18,22,0.85)",
  gold: "#c5a455", goldL: "#d4b76a", white: "#f5f5f0",
  gray: "#888", lgray: "#bbb", border: "rgba(197,164,85,0.15)",
};

const FEATURES = [
  { i: "◈", t: "Auditoría con IA", d: "Sube un documento legal y recibe un análisis de riesgo estructurado en segundos: aprobado, en revisión o alerta." },
  { i: "⬡", t: "Multi-cliente", d: "Cada despacho tiene su propio espacio aislado. Tus documentos y los de otro estudio nunca se mezclan." },
  { i: "◉", t: "Panel simple", d: "Sin curva de aprendizaje. Métricas, auditorías y pagos en un solo panel, pensado para quien no es técnico." },
  { i: "⬢", t: "30 días gratis", d: "Prueba el sistema completo un mes. Sin tarjeta, sin compromiso. Después, $20 USD/mes por despacho." },
];

export default function HubLegal() {
  return (
    <div style={{ background: C.black, minHeight: "100vh", color: C.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .hl-serif { font-family: 'Cormorant Garamond', serif; }
        .hl-sans { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <section style={{ maxWidth: 960, margin: "0 auto", padding: "6rem 1.5rem 4rem", textAlign: "center" }}>
        <div className="hl-sans" style={{ color: C.gold, letterSpacing: "0.15em", fontSize: 13, marginBottom: 16 }}>
          VENBRAX · HUB LEGAL
        </div>
        <h1 className="hl-serif" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 500, lineHeight: 1.15 }}>
          Auditoría legal asistida por IA,<br />sin complicaciones técnicas.
        </h1>
        <p className="hl-sans" style={{ color: C.lgray, fontSize: 18, marginTop: 24, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
          Sube tus documentos, recibe un diagnóstico de riesgo claro, y lleva el control de tu despacho desde un solo panel.
        </p>
        <div style={{ marginTop: 40, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/hub-legal/registro" className="hl-sans" style={{
            background: C.gold, color: C.black, padding: "14px 32px", borderRadius: 8,
            fontWeight: 600, textDecoration: "none",
          }}>
            Comenzar prueba gratis →
          </Link>
          <Link href="/hub-legal/login" className="hl-sans" style={{
            border: `1px solid ${C.border}`, color: C.white, padding: "14px 32px", borderRadius: 8,
            textDecoration: "none",
          }}>
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem 6rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.t} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24,
            }}>
              <div style={{ color: C.gold, fontSize: 24, marginBottom: 12 }}>{f.i}</div>
              <div className="hl-sans" style={{ fontWeight: 600, marginBottom: 8 }}>{f.t}</div>
              <div className="hl-sans" style={{ color: C.gray, fontSize: 14, lineHeight: 1.6 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
