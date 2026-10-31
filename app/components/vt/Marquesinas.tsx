import { CAPACIDADES, PARA_EMPRESAS } from "../../contenido";

function Pista({ items, outline }: { items: string[]; outline?: boolean }) {
  return (
    <div className="vt-marq-track">
      {items.map((t, i) => (
        <span key={i} style={{ display: "contents" }}>
          <span className={(i % 2 === 1) === !!outline ? "o" : undefined}>{t}</span>
          <span className="s">✦</span>
        </span>
      ))}
    </div>
  );
}

/** Dos cintas en sentido contrario que se inclinan con la velocidad del scroll.
 *  Decorativas: el mismo contenido ya esta en texto en las secciones. */
export default function Marquesinas() {
  const a = CAPACIDADES.map((c) => c.titulo);
  return (
    <div className="vt-marqs" aria-hidden="true">
      <div className="vt-marq">
        <Pista items={a} />
        <Pista items={a} />
      </div>
      <div className="vt-marq rev">
        <Pista items={PARA_EMPRESAS} outline />
        <Pista items={PARA_EMPRESAS} outline />
      </div>
    </div>
  );
}
