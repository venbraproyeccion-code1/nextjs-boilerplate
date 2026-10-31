import Image from "next/image";
import type { CSSProperties } from "react";
import { PROYECTOS } from "../../contenido";
import { Cabecera } from "./Words";

/** Acento y fondo decorativos por tarjeta (solo ornamento, no identidad del cliente). */
const TONOS = [
  { acento: "#ffb454", fondo: "#2a1707" },
  { acento: "#7aa2ff", fondo: "#0c1530" },
  { acento: "#a78bfa", fondo: "#17102e" },
  { acento: "#ff8fb1", fondo: "#2a0e1a" },
];

/** Arte vectorial generativo: anillos, malla de puntos y el numero del proyecto.
 *  Se usa mientras el proyecto no tenga captura real en el repositorio. */
function Arte({ i, acento }: { i: number; acento: string }) {
  const cx = 120 + ((i * 97) % 220);
  const cy = 330 - ((i * 61) % 150);
  return (
    <svg className="gen" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`pt${i}`} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill={acento} opacity=".38" />
        </pattern>
        <radialGradient id={`rg${i}`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor={acento} stopOpacity=".5" />
          <stop offset="1" stopColor={acento} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="520" fill={`url(#pt${i})`} />
      <circle cx={cx} cy={cy} r="210" fill={`url(#rg${i})`} />
      {[60, 110, 165, 225].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={acento} strokeOpacity={0.55 - r / 600} strokeWidth="1.2" />
      ))}
      <text
        x="28"
        y="470"
        fill="none"
        stroke={acento}
        strokeWidth="1.6"
        style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 210, letterSpacing: "-0.07em" }}
      >
        {String(i + 1).padStart(2, "0")}
      </text>
    </svg>
  );
}

export default function Proyectos() {
  const total = PROYECTOS.length;
  return (
    <section id="proyectos" className="vt-sec">
      <div className="vt-wrap">
        <Cabecera
          etiqueta="Proyectos"
          titulo="Proyectos que estamos construyendo"
          intro="Trabajos entregados y publicados. Cada uno se puede abrir y revisar."
        />
        <div className="vt-stack">
          {PROYECTOS.map((p, i) => {
            const tono = TONOS[i % TONOS.length];
            const dominio = p.enlace?.replace(/^https?:\/\//, "");
            return (
              <article
                key={p.nombre}
                className="vt-proj"
                style={{ "--i": i, "--art-accent": tono.acento, "--art-bg": tono.fondo } as CSSProperties}
              >
                <div className="vt-proj-art">
                  {p.captura ? (
                    <Image
                      src={p.captura}
                      alt={`Captura del sitio de ${p.nombre}`}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      quality={85}
                    />
                  ) : (
                    <Arte i={i} acento={tono.acento} />
                  )}
                  {dominio && (
                    <span className="vt-url">
                      <i /> {dominio}
                    </span>
                  )}
                </div>
                <div className="vt-proj-body">
                  <span className="vt-num" style={{ color: tono.acento }}>
                    {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                  <h3 className="vt-display vt-proj-title">{p.nombre}</h3>
                  <p>{p.descripcion}</p>
                  <dl className="vt-dl">
                    <div>
                      <dt>Problema</dt>
                      <dd>{p.problema}</dd>
                    </div>
                    <div>
                      <dt>Resultado</dt>
                      <dd>{p.resultado}</dd>
                    </div>
                    <div className="full">
                      <dt>Tecnología</dt>
                      <dd>{p.tecnologia}</dd>
                    </div>
                  </dl>
                  {p.enlace && (
                    <a href={p.enlace} target="_blank" rel="noopener" className="vt-link" data-cursor="Abrir">
                      Abrir el proyecto <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
                <span className="vt-proj-shade" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
