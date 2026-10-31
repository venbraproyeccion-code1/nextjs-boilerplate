import type { CSSProperties } from "react";
import { CONTACTO } from "../../contenido";
import { Words } from "./Words";

/** Academia + Capri: unidades secundarias. */
export function AcademiaCapri() {
  return (
    <section className="vt-sec vt-sec--dim" style={{ paddingBlock: "clamp(3.5rem,8vw,6rem)" }}>
      <div className="vt-wrap vt-duo">
        <div data-reveal>
          <article className="vt-card vt-glass vt-tilt vt-feature" data-tilt style={{ height: "100%" }}>
            <span className="vt-eyebrow">Unidad de formación</span>
            <h2 className="vt-display">VenBraX Academy</h2>
            <p>
              Formación en inteligencia artificial, automatización, tecnología, herramientas
              digitales y desarrollo. Funciona como unidad independiente dentro del ecosistema.
            </p>
            <a href="/academia" className="vt-btn vt-btn--ghost" style={{ alignSelf: "flex-start" }} data-magnetic>
              Ir a VenBraX Academy <span className="ar">→</span>
            </a>
          </article>
        </div>
        <div data-reveal style={{ "--d": 0.08 } as CSSProperties}>
          <article className="vt-card vt-glass vt-tilt vt-feature" data-tilt style={{ height: "100%" }}>
            <span className="vt-eyebrow">Punto físico</span>
            <h2 className="vt-display">Capri — Morón, Carabobo</h2>
            <p>
              Punto físico del ecosistema VenBraX: dos locales en el Centro Comercial Capri
              destinados a tecnología, producción audiovisual, equipamiento, servicios digitales,
              formación y reuniones.
            </p>
            <span className="vt-tag" style={{ alignSelf: "flex-start" }}>
              En preparación
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Contacto() {
  return (
    <section id="contacto" className="vt-sec vt-contact">
      <div className="vt-wrap">
        <span className="vt-eyebrow" data-reveal>
          Empecemos
        </span>
        <h2
          className="vt-display vt-split"
          style={{ marginTop: "1.1rem", fontSize: "clamp(2.6rem, 9.4vw, 8rem)", lineHeight: 0.9, letterSpacing: "-0.05em", maxWidth: "15ch" }}
        >
          <Words text="Cuéntanos qué necesitas construir." />
        </h2>
        <p className="vt-lead" data-reveal style={{ marginTop: "1.6rem" }}>
          Describe tu proceso o tu idea y te decimos qué haría falta para llevarlo a un sistema que
          funcione. Sin compromiso.
        </p>
        <div className="vt-contact-grid">
          <div data-reveal>
            <a href={CONTACTO.whatsappUrl} target="_blank" rel="noopener" className="vt-ct" data-magnetic="0.12" data-cursor="Escribir" style={{ height: "100%" }}>
              <span className="go" aria-hidden="true">↗</span>
              <span className="vt-eyebrow">WhatsApp</span>
              <span className="big">{CONTACTO.whatsapp}</span>
              <span className="sm">La vía más rápida. Escríbenos y conversamos hoy mismo.</span>
            </a>
          </div>
          <div data-reveal style={{ "--d": 0.08 } as CSSProperties}>
            <a
              href={`mailto:${CONTACTO.correo}?subject=Proyecto%20con%20VenBraTech`}
              className="vt-ct"
              data-magnetic="0.12"
              data-cursor="Escribir"
              style={{ height: "100%" }}
            >
              <span className="go" aria-hidden="true">↗</span>
              <span className="vt-eyebrow">Correo</span>
              <span className="big">{CONTACTO.correo}</span>
              <span className="sm">Si prefieres escribir con detalle o adjuntar documentos.</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
