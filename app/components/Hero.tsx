"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Hero de la portada de VenBraTech.
 *
 * Una sola escena que se resuelve con el scroll:
 *   1. Entrada: el emblema sube desde el desenfoque, el titular se revela
 *      palabra por palabra.
 *   2. Scroll: el globo se expande hasta llenar la escena, el emblema y el
 *      titular se retiran.
 *   3. Cierre: el lema de la marca (Innovacion, Conexion, Crecimiento) toma la
 *      escena y el hero se funde con la siguiente seccion.
 *
 * Todo el movimiento va en transform/opacity y se maneja con motion values
 * (sin useState en scroll ni en puntero). Con prefers-reduced-motion la escena
 * queda estatica y completa, sin pin de scroll.
 *
 * Contenido: solo copy ya publicado (titular, texto, CTAs, lema de la marca).
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const ORO = "#e8b93f";

// [palabra, resaltada en oro]
const LINEAS: [string, boolean][][] = [
  [["Tecnología", false], ["que", false]],
  [["convierte", false], ["ideas", true]],
  [["en", true], ["sistemas.", true]],
];
const LEMA = ["Innovación", "Conexión", "Crecimiento"];

/* ------------------------------------------------------------ piezas */

function Palabra({
  children,
  i,
  oro,
  reduce,
}: {
  children: string;
  i: number;
  oro?: boolean;
  reduce: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className="inline-block"
        style={oro ? { color: ORO } : undefined}
        initial={reduce ? false : { y: "115%", rotate: 4 }}
        animate={{ y: "0%", rotate: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.35 + i * 0.07 }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Enlace que se acerca un poco al cursor (movimiento fisico, sin re-render). */
function Magnetico({
  href,
  className,
  children,
  reduce,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  reduce: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  return (
    <motion.a
      href={href}
      className={className}
      style={reduce ? undefined : { x: sx, y: sy }}
      whileTap={{ scale: 0.98 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const b = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (b.left + b.width / 2)) * 0.18);
        y.set((e.clientY - (b.top + b.height / 2)) * 0.28);
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

function PalabraLema({
  texto,
  p,
  rango,
  reduce,
}: {
  texto: string;
  p: MotionValue<number>;
  rango: [number, number];
  reduce: boolean;
}) {
  const o = useTransform(p, rango, [0, 1]);
  const y = useTransform(p, rango, [46, 0]);
  const b = useTransform(p, rango, [10, 0]);
  const filtro = useTransform(b, (v) => `blur(${v}px)`);
  return (
    <motion.span
      className="whitespace-nowrap font-medium tracking-[-0.03em]"
      style={reduce ? undefined : { opacity: o, y, filter: filtro }}
    >
      {texto}
    </motion.span>
  );
}

/* -------------------------------------------------------------- hero */

export default function Hero() {
  const reduce = useReducedMotion() ?? false;
  const seccion = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: seccion,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // puntero -> inclinacion 3D del emblema y paralaje de fondos
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 90, damping: 18 });
  const smy = useSpring(my, { stiffness: 90, damping: 18 });
  const rotY = useTransform(smx, [-0.5, 0.5], [-11, 11]);
  const rotX = useTransform(smy, [-0.5, 0.5], [8, -8]);
  const fondoX = useTransform(smx, [-0.5, 0.5], [14, -14]);
  const rayoX = useTransform(smx, [-0.5, 0.5], [-26, 26]);

  // guion del scroll
  const globoEscala = useTransform(p, [0, 1], [1, 1.85]);
  const globoY = useTransform(p, [0, 1], ["0%", "-9%"]);
  const globoLuz = useTransform(p, [0, 0.8], [0.82, 1]);
  const embEscala = useTransform(p, [0, 0.55, 0.85], [1, 0.9, 0.5]);
  const embY = useTransform(p, [0, 0.85], [0, -110]);
  const embOpac = useTransform(p, [0, 0.5, 0.78], [1, 1, 0]);
  const textoY = useTransform(p, [0, 0.5], [0, -80]);
  const textoOpac = useTransform(p, [0.22, 0.5], [1, 0]);
  const cierre = useTransform(p, [0.86, 1], [0, 1]);
  const lemaVelo = useTransform(p, [0.5, 0.75], [0, 0.55]);

  const fijo = !reduce;

  return (
    <section
      id="inicio"
      ref={seccion}
      className="relative bg-[#07070a]"
      style={{
        height: fijo ? "270dvh" : undefined,
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      <div
        className={`${fijo ? "sticky top-[66px]" : "relative"} flex h-[calc(100dvh-66px)] min-h-[600px] w-full items-center overflow-hidden`}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse") return;
          const b = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - b.left) / b.width - 0.5);
          my.set((e.clientY - b.top) / b.height - 0.5);
        }}
      >
        {/* luz de fondo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 620px at 78% 18%, rgba(232,185,63,0.16), transparent 70%), radial-gradient(700px 500px at 5% 100%, rgba(185,140,34,0.09), transparent 70%)",
          }}
        />
        {/* haces diagonales de la marca */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-[-10%] right-[8%] w-[2px] rotate-[28deg]"
          style={{
            x: reduce ? 0 : rayoX,
            background: `linear-gradient(transparent, ${ORO}, transparent)`,
            opacity: 0.45,
          }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-[-10%] right-[2%] w-[2px] rotate-[28deg]"
          style={{
            x: reduce ? 0 : rayoX,
            background: `linear-gradient(transparent, ${ORO}, transparent)`,
            opacity: 0.22,
          }}
        />

        {/* globo: se expande con el scroll */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] origin-bottom"
          style={{
            scale: reduce ? 1 : globoEscala,
            y: reduce ? 0 : globoY,
            opacity: reduce ? 0.9 : globoLuz,
            x: reduce ? 0 : fondoX,
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 38%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, #000 38%)",
          }}
        >
          <img
            src="/brand/globo.webp"
            alt=""
            width={1672}
            height={471}
            className="h-full w-full object-cover object-top"
            fetchPriority="high"
          />
        </motion.div>

        {/* lectura del texto sobre el globo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,7,10,0.94) 0%, rgba(7,7,10,0.78) 34%, rgba(7,7,10,0) 62%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,7,10,0.2) 0%, rgba(7,7,10,0.85) 70%)",
          }}
        />

        {/* velo para dar lectura al lema final */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#07070a]"
          style={{ opacity: reduce ? 0 : lemaVelo }}
        />

        {/* contenido */}
        <div className="relative z-10 mx-auto grid h-full w-full max-w-[1280px] items-center gap-2 px-6 pb-6 pt-8 md:grid-cols-[1.05fr_0.95fr] md:gap-4">
          <motion.div style={reduce ? undefined : { y: textoY, opacity: textoOpac }}>
            <h1 className="text-[clamp(2.3rem,5.2vw,4.7rem)] font-medium leading-[1.04] tracking-[-0.04em] text-[#f1eee6]">
              {LINEAS.map((linea, l) => (
                <span key={l} className="block">
                  {linea.map(([w, oro], i) => (
                    <span key={w}>
                      <Palabra i={l * 2 + i} oro={oro} reduce={reduce}>
                        {w}
                      </Palabra>
                      {i < linea.length - 1 ? " " : ""}
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p
              className="mt-6 max-w-[46ch] text-[clamp(1rem,1.35vw,1.15rem)] leading-relaxed text-[#a8a498]"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}
            >
              Desarrollo de software, inteligencia artificial, automatización, datos e
              ingeniería para construir soluciones digitales reales.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1.1 }}
            >
              <Magnetico
                href="#contacto"
                reduce={reduce}
                className="inline-flex items-center rounded-xl bg-[#e8b93f] px-7 py-3.5 text-[0.95rem] font-semibold text-[#17120a] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-colors hover:bg-[#f6dc86]"
              >
                Desarrollar un proyecto
              </Magnetico>
              <Magnetico
                href="#soluciones"
                reduce={reduce}
                className="inline-flex items-center rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3.5 text-[0.95rem] font-medium text-[#f1eee6] backdrop-blur transition-colors hover:border-[#e8b93f]/60"
              >
                Conocer VenBraTech
              </Magnetico>
            </motion.div>
          </motion.div>

          {/* emblema 3D */}
          <motion.div
            className="relative mx-auto w-[min(88%,640px)] [perspective:1200px] md:justify-self-end"
            style={reduce ? undefined : { scale: embEscala, y: embY, opacity: embOpac }}
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.86, filter: "blur(22px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease: EASE, delay: 0.2 }}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -12, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="relative"
                  style={reduce ? undefined : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
                >
                  <img
                    src="/brand/emblema.webp"
                    alt="Emblema de VenBraTech"
                    width={710}
                    height={460}
                    className="relative block w-full select-none [mask-image:radial-gradient(ellipse_58%_60%_at_50%_50%,#000_84%,transparent_100%)]"
                    draggable={false}
                    fetchPriority="high"
                  />
                  {/* destello que cruza el emblema */}
                  {!reduce && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        WebkitMaskImage: "url(/brand/emblema.webp)",
                        maskImage: "url(/brand/emblema.webp)",
                        WebkitMaskSize: "100% 100%",
                        maskSize: "100% 100%",
                        backgroundImage:
                          "linear-gradient(105deg, transparent 42%, rgba(255,244,214,0.75) 50%, transparent 58%)",
                        backgroundSize: "260% 100%",
                        mixBlendMode: "screen",
                      }}
                      initial={{ backgroundPosition: "130% 0" }}
                      animate={{ backgroundPosition: ["130% 0", "-30% 0"] }}
                      transition={{
                        duration: 2.4,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 5.5,
                        delay: 2.2,
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* cierre: lema de la marca */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
          <div
            className="flex flex-col items-center gap-3 text-[clamp(1.9rem,4.9vw,4.4rem)] leading-[1.05] text-[#f1eee6] md:flex-row md:gap-0"
            style={{ opacity: reduce ? 0 : 1 }}
          >
            {LEMA.map((w, i) => (
              <span key={w} className="flex items-center">
                <PalabraLema
                  texto={w}
                  p={p}
                  rango={[0.58 + i * 0.09, 0.7 + i * 0.09]}
                  reduce={reduce}
                />
                {i < LEMA.length - 1 && (
                  <span
                    aria-hidden
                    className="mx-[0.7em] hidden h-[0.7em] w-px bg-[#e8b93f]/60 md:block"
                  />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* fundido hacia la siguiente seccion */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-1/2 bg-gradient-to-t from-[#0a0b0d] to-transparent"
          style={{ opacity: reduce ? 0 : cierre }}
        />
      </div>
    </section>
  );
}
