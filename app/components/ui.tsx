"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";

/**
 * Lenguaje de movimiento de la portada (todas las secciones lo comparten):
 *  - Texto: sube enmascarado, palabra por palabra  (Titulo)
 *  - Bloques: aparecen con desenfoque y ascenso    (Reveal)
 *  - Lineas: se dibujan de lado a lado             (Linea)
 *  - Botones: se acercan al cursor                 (Magnetico)
 *  - Tarjetas: luz que sigue al cursor             (Foco)
 * Cada seccion agrega UN movimiento propio (marquee, pan horizontal, pila,
 * linea de progreso...) sobre esta base. Todo en transform/opacity.
 */

export const EASE = [0.16, 1, 0.3, 1] as const;
export const ORO = "#e8b93f";

/* ------------------------------------------------------------ texto */

export function Titulo({
  texto,
  className = "",
  as = "h2",
  delay = 0,
  oro = [],
}: {
  texto: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  /** indices de palabras resaltadas en oro */
  oro?: number[];
}) {
  const reduce = useReducedMotion() ?? false;
  const palabras = texto.split(" ");
  const Tag = motion[as];
  // El observador va en el titulo (no en cada palabra): las palabras estan
  // recortadas por overflow-hidden mientras esperan y nunca "entrarian".
  return (
    <Tag
      className={className}
      aria-label={texto}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      {palabras.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            style={oro.includes(i) ? { color: ORO } : undefined}
            variants={{
              hidden: { y: "115%", rotate: 3 },
              show: {
                y: "0%",
                rotate: 0,
                transition: { duration: 0.95, ease: EASE, delay: delay + i * 0.045 },
              },
            }}
          >
            {w}
          </motion.span>
          {i < palabras.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 30,
  x = 0,
  amount = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, x, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Linea({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      aria-hidden
      className={`h-px origin-left bg-gradient-to-r from-[#e8b93f] via-[#e8b93f]/40 to-transparent ${className}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    />
  );
}

/* ------------------------------------------------------- interaccion */

/** Enlace que se acerca al cursor (sin re-render: motion values). */
export function Magnetico({
  href,
  className,
  children,
  target,
  rel,
  fuerza = 1,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  fuerza?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={reduce ? undefined : { x: sx, y: sy }}
      whileTap={{ scale: 0.98 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const b = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (b.left + b.width / 2)) * 0.16 * fuerza);
        y.set((e.clientY - (b.top + b.height / 2)) * 0.26 * fuerza);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.a>
  );
}

/** Contenedor con luz dorada que sigue al cursor (variables CSS, sin estado). */
export function Foco({
  children,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={`group relative overflow-hidden ${className}`}
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        const el = e.currentTarget;
        const b = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - b.left}px`);
        el.style.setProperty("--my", `${e.clientY - b.top}px`);
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(232,185,63,0.16), transparent 62%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 ring-1 ring-inset ring-[#e8b93f]/45 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative h-full">{children}</div>
    </Tag>
  );
}

/** Barra de progreso de lectura en el borde superior. */
export function ProgresoScroll() {
  const { scrollYProgress } = useScroll();
  const s = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#b98c22] via-[#e8b93f] to-[#f6dc86]"
      style={{ scaleX: s }}
    />
  );
}
