"use client";

import { useCallback, useEffect, useState } from "react";

const ENLACES: [string, string][] = [
  ["Soluciones", "#soluciones"],
  ["Proyectos", "#proyectos"],
  ["Ecosistema", "#ecosistema"],
  ["Colaboradores", "#colaboradores"],
  ["Academia", "/academia"],
  ["Contacto", "#contacto"],
];

export default function Nav() {
  const [abierto, setAbierto] = useState(false);

  const cambiar = useCallback((v: boolean) => {
    setAbierto(v);
    document.documentElement.classList.toggle("vt-menu-open", v);
    window.dispatchEvent(new CustomEvent("vt:menu", { detail: { abierto: v } }));
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && cambiar(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [abierto, cambiar]);

  // Al salir de la pagina (navegacion) nunca se deja el scroll bloqueado.
  useEffect(() => () => document.documentElement.classList.remove("vt-menu-open"), []);

  return (
    <>
      <header className="vt-nav">
        <nav className="vt-nav-pill" aria-label="Principal">
          <a href="#inicio" className="vt-logo" data-cursor="Inicio" onClick={() => abierto && cambiar(false)}>
            VenBra<b>Tech</b>
          </a>
          <div className="vt-links">
            {ENLACES.slice(0, -1).map(([n, h]) => (
              <a key={h} href={h}>
                {n}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <a href="#contacto" className="vt-btn vt-btn--solid vt-nav-cta" data-magnetic="0.25">
              Hablar con VenBraTech
            </a>
            <button
              type="button"
              className="vt-burger"
              aria-expanded={abierto}
              aria-controls="vt-menu"
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              onClick={() => cambiar(!abierto)}
            >
              <i />
              <i />
              <i />
            </button>
          </div>
        </nav>
      </header>

      <div id="vt-menu" className={`vt-menu${abierto ? " open" : ""}`} aria-hidden={!abierto}>
        {ENLACES.map(([n, h], i) => (
          <a
            key={h}
            href={h}
            className="l"
            tabIndex={abierto ? 0 : -1}
            onClick={() => cambiar(false)}
          >
            {n}
            <small>0{i + 1}</small>
          </a>
        ))}
        <a
          href="#contacto"
          className="vt-btn vt-btn--solid"
          style={{ marginTop: "1.6rem", alignSelf: "flex-start" }}
          tabIndex={abierto ? 0 : -1}
          onClick={() => cambiar(false)}
        >
          Hablar con VenBraTech <span className="ar">→</span>
        </a>
      </div>
    </>
  );
}
