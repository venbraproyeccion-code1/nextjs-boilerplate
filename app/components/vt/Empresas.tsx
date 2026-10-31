import { PARA_EMPRESAS } from "../../contenido";
import { Words } from "./Words";

export default function Empresas() {
  return (
    <section className="vt-sec">
      <div className="vt-wrap vt-split2">
        <div className="vt-sticky">
          <span className="vt-eyebrow" data-reveal>
            Tecnología para empresas
          </span>
          <h2 className="vt-display vt-h2 vt-split" style={{ marginTop: "1.1rem" }}>
            <Words text="Lo que podemos construir para tu operación." />
          </h2>
          <p className="vt-lead" data-reveal style={{ marginTop: "1.4rem" }}>
            Desarrollamos soluciones para empresas y profesionales, partiendo del proceso que ya
            tienes y no de una plantilla.
          </p>
          <div data-reveal style={{ marginTop: "2rem" }}>
            <a href="#contacto" className="vt-btn vt-btn--solid" data-magnetic>
              Cuéntanos qué necesitas <span className="ar">→</span>
            </a>
          </div>
        </div>
        <ul className="vt-rows" data-reveal>
          {PARA_EMPRESAS.map((s, i) => (
            <li key={s}>
              <span className="vt-num">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
