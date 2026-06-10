"use client";
import { useState, useEffect, useRef } from "react";

const C = {
  black: "#080808", dark: "#0d0d0d", card: "rgba(18,18,22,0.85)",
  gold: "#c5a455", goldL: "#d4b76a", white: "#f5f5f0",
  gray: "#888", lgray: "#bbb", border: "rgba(197,164,85,0.15)",
};

const DEMO_URL = "https://primary-production-a1d21.up.railway.app/webhook/venbrax-industrial";

const PLCS = ["Siemens", "Allen-Bradley", "Schneider", "OMRON", "Mitsubishi"];

const STEPS = [
  { n: "01", t: "Describe el error", d: "El operador escribe lo que ve, en su idioma, desde el piso de planta. Sin códigos, sin manuales, sin esperar al técnico." },
  { n: "02", t: "Análisis en segundos", d: "El sistema identifica la causa probable analizando el programa de la máquina con IA de grado industrial." },
  { n: "03", t: "Corrección paso a paso", d: "Recibe el procedimiento exacto y el código corregido. Listo para validar y aplicar bajo sus protocolos de seguridad." },
];

const FEATURES = [
  { i: "◈", t: "PWA instalable", d: "Funciona en cualquier teléfono o tablet Android desde el navegador. Sin licencias, sin instalación de software." },
  { i: "⬡", t: "5 fabricantes PLC", d: "Siemens, Allen-Bradley, Schneider, OMRON y Mitsubishi. Lógica escalera, texto estructurado y bloques." },
  { i: "◉", t: "5 idiomas", d: "Español, portugués, inglés, francés y alemán. El operador trabaja en su lengua, el sistema entiende todas." },
  { i: "⬢", t: "Salida estructurada", d: "Resumen, lista de errores y código corregido en formato estándar. Integrable con sus sistemas de mantenimiento." },
];

function useInView(th = 0.12) {
  const r = useRef<HTMLDivElement>(null);
  const [v, s] = useState(false);
  useEffect(() => {
    const el = r.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) s(true) }, { threshold: th });
    o.observe(el); return () => o.disconnect();
  }, [th]);
  return [r, v] as const;
}

function FI({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [r, v] = useInView();
  return (
    <div ref={r} style={{
      opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s,transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`
    }}>
      {children}
    </div>
  );
}

export default function Industrial() {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const h = () => setSc(window.scrollY > 60);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ background: C.black, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
        ::selection{background:rgba(197,164,85,0.25)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d0d0d}::-webkit-scrollbar-thumb{background:#c5a455;border-radius:2px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .cta-gold:hover{background:#d4b76a!important;transform:scale(1.02)}
        .cta-outline:hover{border-color:#c5a455!important;color:#c5a455!important}
        .nav-a:hover{color:#c5a455!important}
        .feat-card{transition:all 0.3s}.feat-card:hover{transform:translateY(-4px);border-color:rgba(197,164,85,0.4)!important}
        @media(max-width:768px){
          .hide-m{display:none!important}.hero-h{font-size:2.2rem!important}
          .steps-g{grid-template-columns:1fr!important}
          .feat-g{grid-template-columns:1fr!important}
          .pilot-g{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* Grain */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`, pointerEvents: "none", zIndex: 9999, opacity: 0.6 }} />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: sc ? "rgba(8,8,8,0.96)" : "transparent", backdropFilter: sc ? "blur(24px)" : "none",
        borderBottom: sc ? `1px solid ${C.border}` : "none", transition: "all 0.4s", padding: "0 6%"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: C.gold, letterSpacing: 2 }}>VENBRATECH</span>
            <span style={{ fontSize: 9, color: C.gray, letterSpacing: 3, fontFamily: "'DM Sans',sans-serif", textTransform: "uppercase", marginTop: 3 }}>INDUSTRIAL</span>
          </a>
          <div className="hide-m" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {[{ n: "Sistema", h: "#sistema" }, { n: "Demo", h: "#demo" }, { n: "Piloto", h: "#piloto" }, { n: "Inicio", h: "/" }].map((l, i) => (
              <a key={i} href={l.h} className="nav-a"
                style={{ color: C.lgray, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", transition: "color 0.2s" }}>
                {l.n}
              </a>
            ))}
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="cta-outline"
              style={{ padding: "9px 24px", border: `1px solid rgba(197,164,85,0.4)`, color: C.gold, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", transition: "all 0.2s" }}>
              Demo en vivo
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "180px 6% 100px", position: "relative" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FI>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 24 }}>
              VenBraX Industrial — Diagnóstico de errores PLC
            </div>
          </FI>
          <FI delay={0.1}>
            <h1 className="hero-h" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.4rem,5vw,4.2rem)", fontWeight: 300, color: C.white, lineHeight: 1.12, letterSpacing: -0.5, maxWidth: 880 }}>
              Cuando la máquina se detiene,<br />
              <span style={{ color: C.gold, fontStyle: "italic" }}>cada minuto tiene precio.</span>
            </h1>
          </FI>
          <FI delay={0.2}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.lgray, lineHeight: 1.85, maxWidth: 620, margin: "32px 0 44px" }}>
              El operador describe el error en lenguaje natural. El sistema identifica la causa probable
              y entrega el procedimiento de corrección paso a paso — en segundos, no en horas.
              Directo desde el piso de planta.
            </p>
          </FI>
          <FI delay={0.3}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="cta-gold"
                style={{ padding: "16px 40px", background: C.gold, color: C.black, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", transition: "all 0.2s" }}>
                Ver el sistema en vivo →
              </a>
              <a href="#piloto" className="cta-outline"
                style={{ padding: "16px 40px", border: `1px solid rgba(197,164,85,0.4)`, color: C.gold, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", transition: "all 0.2s" }}>
                Piloto 30 días
              </a>
            </div>
          </FI>
          <FI delay={0.4}>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginTop: 56, alignItems: "center" }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, color: C.gray, textTransform: "uppercase" }}>Compatible con</span>
              {PLCS.map((p, i) => (
                <span key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.lgray, letterSpacing: 1 }}>{p}</span>
              ))}
            </div>
          </FI>
        </div>
      </section>

      {/* LA PRUEBA */}
      <section id="demo" style={{ padding: "100px 6%", background: C.dark, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
          <FI>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>Sin promesas — evidencia</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,3vw,2.7rem)", fontWeight: 300, color: C.white, marginBottom: 24 }}>
              No le mostramos testimonios.<br /><span style={{ color: C.gold, fontStyle: "italic" }}>Le mostramos el sistema funcionando.</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.lgray, lineHeight: 1.85, maxWidth: 560, margin: "0 auto 40px" }}>
              El sistema está en producción, operativo 24/7, con ejemplos reales de código PLC incluidos.
              Ábralo ahora, pruebe un error y juzgue usted mismo. Esa es toda nuestra publicidad.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 24px", border: `1px solid ${C.border}`, background: C.card }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2, color: C.lgray, textTransform: "uppercase" }}>Sistema en producción — disponible ahora</span>
            </div>
          </FI>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="sistema" style={{ padding: "100px 6%" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FI>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>El método</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,3vw,2.7rem)", fontWeight: 300, color: C.white, marginBottom: 64 }}>
              Tres pasos. <span style={{ color: C.gold, fontStyle: "italic" }}>Segundos, no horas.</span>
            </h2>
          </FI>
          <div className="steps-g" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {STEPS.map((s, i) => (
              <FI key={i} delay={i * 0.12}>
                <div style={{ padding: "36px 28px", border: `1px solid ${C.border}`, background: C.card, height: "100%" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, color: C.gold, fontWeight: 300, marginBottom: 20 }}>{s.n}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: C.white, marginBottom: 14, letterSpacing: 0.5 }}>{s.t}</div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.lgray, lineHeight: 1.8 }}>{s.d}</p>
                </div>
              </FI>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "40px 6% 100px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="feat-g" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <FI key={i} delay={i * 0.1}>
                <div className="feat-card" style={{ padding: "30px 24px", border: `1px solid ${C.border}`, background: C.card, height: "100%" }}>
                  <div style={{ fontSize: 22, color: C.gold, marginBottom: 18 }}>{f.i}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 12 }}>{f.t}</div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: C.lgray, lineHeight: 1.75 }}>{f.d}</p>
                </div>
              </FI>
            ))}
          </div>
        </div>
      </section>

      {/* PILOTO */}
      <section id="piloto" style={{ padding: "100px 6%", background: C.dark, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="pilot-g" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <FI>
              <div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>Piloto 30 días</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.8rem,3vw,2.7rem)", fontWeight: 300, color: C.white, marginBottom: 24 }}>
                  Si no resuelve errores reales,<br /><span style={{ color: C.gold, fontStyle: "italic" }}>no renueva.</span>
                </h2>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: C.lgray, lineHeight: 1.85, marginBottom: 32 }}>
                  Precio fijo, sin permanencia. En 30 días el sistema queda configurado para sus máquinas
                  y su equipo entrenado para usarlo. El riesgo es nuestro, no suyo.
                </p>
                {["Levantamiento de los errores más frecuentes de su planta", "Sistema configurado para sus máquinas y fabricantes", "Capacitación del equipo de operación y mantenimiento", "Soporte directo durante todo el piloto"].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ color: C.gold, marginTop: 2, fontSize: 10 }}>◆</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.lgray }}>{f}</span>
                  </div>
                ))}
                <a href="mailto:hola@venbratech.com?subject=Piloto VenBraX Industrial — 30 días"
                  className="cta-gold" style={{ display: "inline-block", marginTop: 32, padding: "16px 40px", background: C.gold, color: C.black, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", transition: "all 0.2s" }}>
                  Agendar 25 min →
                </a>
              </div>
            </FI>
            <FI delay={0.15}>
              <div style={{ padding: "44px 36px", border: `1px solid rgba(197,164,85,0.35)`, background: "rgba(197,164,85,0.05)" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, color: C.gold, textTransform: "uppercase", marginBottom: 24 }}>Lo que cuesta no tenerlo</div>
                {[
                  { t: "Parada no planificada", d: "Cada hora de máquina detenida es producción que no vuelve." },
                  { t: "Conocimiento concentrado", d: "El diagnóstico depende de 1–2 técnicos. Cuando no están, la planta espera." },
                  { t: "Manuales dispersos", d: "La información existe, pero encontrarla toma más que repararla." },
                ].map((r, i) => (
                  <div key={i} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 8 }}>{r.t}</div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: C.lgray, lineHeight: 1.7 }}>{r.d}</p>
                  </div>
                ))}
              </div>
            </FI>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "60px 6% 36px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
            <div style={{ maxWidth: 320 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, color: C.gold, letterSpacing: 2, marginBottom: 12 }}>VENBRATECH</div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.gray, lineHeight: 1.75 }}>
                VenBraX Industrial — diagnóstico y corrección de errores PLC asistido por IA, desde el piso de planta.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: 3.5, color: C.gold, textTransform: "uppercase", marginBottom: 16 }}>Contacto</div>
              <a href="mailto:hola@venbratech.com" style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.gray, textDecoration: "none" }}>hola@venbratech.com</a>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.gray }}>© 2026 VenBraTech · Santa Catarina, Brasil</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.gray, maxWidth: 580, lineHeight: 1.6 }}>
              Herramienta de apoyo al diagnóstico. Toda corrección debe validarse bajo los procedimientos de seguridad de su planta.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
