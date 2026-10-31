import type { CSSProperties } from "react";
import { ARQUITECTURA, TECNOLOGIA_ECOSISTEMA, UNIDADES } from "../../contenido";
import { Cabecera } from "./Words";

/** Orbita decorativa: VenBraTech al centro, las areas del ecosistema alrededor. */
function Orbita() {
  const nodos = TECNOLOGIA_ECOSISTEMA.map((_, k) => {
    const a = ((-90 + (360 / TECNOLOGIA_ECOSISTEMA.length) * k) * Math.PI) / 180;
    return [220 + Math.cos(a) * 150, 220 + Math.sin(a) * 150] as const;
  });
  return (
    <div className="vt-orbit" aria-hidden="true">
      <svg viewBox="0 0 440 440" fill="none" focusable="false">
        <defs>
          <radialGradient id="vt-nuc" cx=".5" cy=".4" r=".7">
            <stop offset="0" stopColor="#00e0a4" stopOpacity=".55" />
            <stop offset="1" stopColor="#06070a" />
          </radialGradient>
        </defs>
        <circle cx="220" cy="220" r="205" stroke="#fff" strokeOpacity=".1" strokeDasharray="2 8" />
        <g className="ring2">
          <circle cx="220" cy="220" r="205" stroke="#8b6cff" strokeOpacity=".4" strokeDasharray="30 400" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="ring">
          <circle cx="220" cy="220" r="150" stroke="#00e0a4" strokeOpacity=".28" />
          {nodos.map(([x, y], k) => (
            <g key={k}>
              <line x1="220" y1="220" x2={x} y2={y} stroke="#00e0a4" strokeOpacity=".22" />
              <circle cx={x} cy={y} r="13" fill="#06070a" stroke="#00e0a4" />
              <circle cx={x} cy={y} r="4.5" fill="#00e0a4" />
            </g>
          ))}
        </g>
        <circle cx="220" cy="220" r="62" fill="url(#vt-nuc)" stroke="#00e0a4" strokeOpacity=".7" />
        <text
          x="220"
          y="226"
          textAnchor="middle"
          fill="#f1f3f5"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-0.04em" }}
        >
          VenBraTech
        </text>
      </svg>
    </div>
  );
}

export function TecnologiaEcosistema() {
  return (
    <section className="vt-sec">
      <div className="vt-wrap">
        <Cabecera
          etiqueta="Dentro del ecosistema"
          titulo="Tecnología que conecta el ecosistema VenBraX"
          intro="VenBraTech aporta la infraestructura tecnológica y digital de las distintas áreas del ecosistema. No somos un despacho jurídico, contable ni una productora: damos la tecnología que esas áreas usan."
        />
        <div className="vt-split2" style={{ alignItems: "center" }}>
          <div data-reveal>
            <Orbita />
          </div>
          <div className="vt-areas">
            {TECNOLOGIA_ECOSISTEMA.map((t, i) => (
              <div key={t.area} data-reveal style={{ "--d": i * 0.07 } as CSSProperties}>
                <div className="vt-card vt-area">
                  <h3>{t.area}</h3>
                  <p>{t.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Unidades() {
  return (
    <section id="ecosistema" className="vt-sec vt-sec--dim">
      <div className="vt-wrap">
        <Cabecera
          etiqueta="Ecosistema"
          titulo="Conoce el ecosistema VenBraX"
          intro="Cada unidad conserva su especialización y su propio espacio. VenBraTech no las sustituye ni las comercializa."
        />
        <div className="vt-units">
          {UNIDADES.map((u, i) => (
            <div key={u.nombre} className={`u${i}`} data-reveal style={{ "--d": (i % 4) * 0.06 } as CSSProperties}>
              <article className={`vt-card vt-glass vt-tilt vt-unit${i === 0 ? " big" : ""}`} data-tilt>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: ".75rem" }}>
                  <h3 className="vt-h3">{u.nombre}</h3>
                  {u.pendiente && <span className="vt-tag">En incorporación</span>}
                </div>
                <p className="bj">{u.bajada}</p>
                <p>{u.texto}</p>
                {u.enlace && (
                  <a href={u.enlace} target="_blank" rel="noopener" className="vt-link" data-cursor="Abrir">
                    Ver sitio <span aria-hidden="true">→</span>
                  </a>
                )}
              </article>
            </div>
          ))}
        </div>

        {/* Arquitectura de marca — seccion 8 del brief */}
        <div className="vt-arch" data-reveal>
          <p className="vt-eyebrow">Arquitectura de marca</p>
          <ul>
            {ARQUITECTURA.map(([marca, rol]) => (
              <li key={marca}>
                <span style={{ fontWeight: 600 }}>{marca}</span>
                <span>{rol}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
