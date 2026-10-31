import type { CSSProperties } from "react";
import { CAPACIDADES } from "../../contenido";
import { Cabecera } from "./Words";
import {
  GlifoAudiovisual,
  GlifoAutomatizacion,
  GlifoDatos,
  GlifoIA,
  GlifoInteractivo,
  GlifoSoftware,
} from "./Glyphs";

const GLIFOS = [GlifoSoftware, GlifoIA, GlifoAutomatizacion, GlifoDatos, GlifoInteractivo, GlifoAudiovisual];

export default function Soluciones() {
  return (
    <section id="soluciones" className="vt-sec vt-sec--dim">
      <div className="vt-wrap">
        <Cabecera etiqueta="Qué hacemos" titulo="Construimos tecnología para resolver problemas reales." />
        <div className="vt-bento">
          {CAPACIDADES.map((c, i) => {
            const Glifo = GLIFOS[i];
            return (
              <div key={c.n} className={`b${i + 1}`} data-reveal style={{ "--d": i * 0.07 } as CSSProperties}>
                <article className="vt-card vt-glass vt-tilt" data-tilt>
                  <Glifo />
                  <span className="vt-num">{c.n}</span>
                  {i === 0 && (
                    <div className="vt-codelines" aria-hidden="true">
                      <i />
                      <i style={{ width: "78%" }} />
                      <i style={{ width: "92%" }} />
                      <i style={{ width: "56%" }} />
                    </div>
                  )}
                  <h3 className="vt-h3">{c.titulo}</h3>
                  <p>{c.texto}</p>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
