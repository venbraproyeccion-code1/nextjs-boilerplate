import type { CSSProperties, ReactNode } from "react";

/** Una palabra que se revela subiendo desde una mascara. `i` ordena la cascada. */
export function W({ i, className = "", children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <>
      <span className="w">
        <span className={`wi ${className}`} style={{ "--i": i } as CSSProperties}>
          {children}
        </span>
      </span>{" "}
    </>
  );
}

/** Divide un texto en palabras reveladas (el texto sigue siendo texto real,
 *  legible por buscadores y lectores de pantalla). */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((p, k) => (
        <W key={k} i={start + k}>
          {p}
        </W>
      ))}
    </>
  );
}

/** Cabecera de seccion: etiqueta + titulo grande cinetico + bajada. */
export function Cabecera({
  etiqueta,
  titulo,
  intro,
}: {
  etiqueta: string;
  titulo: string;
  intro?: string;
}) {
  return (
    <div className="vt-head">
      <span className="vt-eyebrow" data-reveal>
        {etiqueta}
      </span>
      <h2 className="vt-display vt-h2 vt-split">
        <Words text={titulo} />
      </h2>
      {intro && (
        <p className="vt-lead" data-reveal style={{ "--d": 0.15 } as CSSProperties}>
          {intro}
        </p>
      )}
    </div>
  );
}
