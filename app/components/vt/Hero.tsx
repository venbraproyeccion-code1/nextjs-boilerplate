import type { CSSProperties } from "react";
import { W } from "./Words";

export default function Hero() {
  return (
    <header id="inicio" className="vt-hero">
      <div className="vt-wrap">
        <div data-hero-out>
          <span className="vt-badge vt-rise">
            <i className="vt-dot" />
            VenBraTech · La división tecnológica de VenBraX
          </span>
          <h1
            className="vt-display vt-h1 vt-split vt-hero-split"
            style={{ marginTop: "1.6rem", maxWidth: "13ch" }}
          >
            <W i={0}>Tecnología</W>
            <W i={1}>que</W>
            <W i={2}>convierte</W>
            <W i={3} className="vt-outline">
              ideas
            </W>
            <W i={4}>en</W>
            <W i={5} className="vt-grad">
              sistemas.
            </W>
          </h1>
          <p className="vt-lead vt-rise" style={{ "--d": 0.35, marginTop: "1.8rem" } as CSSProperties}>
            Desarrollo de software, inteligencia artificial, automatización, datos e
            ingeniería para construir soluciones digitales reales.
          </p>
          <div
            className="vt-rise"
            style={{ "--d": 0.5, display: "flex", flexWrap: "wrap", gap: ".8rem", marginTop: "2.2rem" } as CSSProperties}
          >
            <a href="#soluciones" className="vt-btn vt-btn--ghost" data-magnetic>
              Conocer VenBraTech
            </a>
            <a href="#contacto" className="vt-btn vt-btn--solid" data-magnetic>
              Desarrollar un proyecto <span className="ar">→</span>
            </a>
          </div>
        </div>
        <div className="vt-rise" style={{ "--d": 0.9, marginTop: "3rem" } as CSSProperties} aria-hidden="true">
          <span className="vt-cue">
            <i /> Desliza
          </span>
        </div>
      </div>
    </header>
  );
}
