import type { CSSProperties } from "react";
import { COLABORADORES } from "../../contenido";
import { Cabecera } from "./Words";

export default function Colaboradores() {
  return (
    <section id="colaboradores" className="vt-sec">
      <div className="vt-wrap">
        <Cabecera
          etiqueta="Red de colaboradores"
          titulo="Formar parte del ecosistema VenBraX"
          intro="Una capacidad complementaria del ecosistema, no su centro. Toda participación se define por escrito antes de empezar."
        />
        <div className="vt-collabs">
          {COLABORADORES.map((c, i) => (
            <div key={c.n} data-reveal style={{ "--d": i * 0.08 } as CSSProperties}>
              <article className="vt-card vt-glass vt-tilt vt-collab" data-tilt>
                <span className="big" aria-hidden="true">
                  {c.n}
                </span>
                <h3 className="vt-h3">{c.titulo}</h3>
                <p>{c.texto}</p>
              </article>
            </div>
          ))}
        </div>
        <div data-reveal style={{ marginTop: "2rem" }}>
          <a href="#contacto" className="vt-btn vt-btn--ghost" data-magnetic>
            Formar parte del ecosistema <span className="ar">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
