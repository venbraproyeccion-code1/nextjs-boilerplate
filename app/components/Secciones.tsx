"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ARQUITECTURA,
  CAPACIDADES,
  COLABORADORES,
  CONTACTO,
  PARA_EMPRESAS,
  PROYECTOS,
  TECNOLOGIA_ECOSISTEMA,
  UNIDADES,
} from "../contenido";
import { EASE, Foco, Linea, Magnetico, Reveal, Titulo } from "./ui";

/* Estilos compartidos ---------------------------------------------------- */

const H2 =
  "text-[clamp(2rem,4.2vw,3.7rem)] font-medium leading-[1.05] tracking-[-0.035em] text-[#f1eee6]";
const BTN_ORO =
  "inline-flex items-center rounded-xl bg-[#e8b93f] px-7 py-3.5 text-[0.95rem] font-semibold text-[#17120a] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-colors hover:bg-[#f6dc86]";
const BTN_LINEA =
  "inline-flex items-center rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3.5 text-[0.95rem] font-medium text-[#f1eee6]  transition-colors hover:border-[#e8b93f]/60";
const MONO = "font-[family-name:var(--font-geist-mono)]";

function Contenedor({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-6 ${className}`}>{children}</div>;
}

/* ============================================================== 1. QUÉ HACEMOS
   Movimiento propio: el foco sigue la lectura. La fila que cruza el centro de
   la pantalla se enciende; las demas se atenuan. La linea lateral avanza con
   el scroll.                                                                  */

function Fila({ n, titulo, texto }: { n: string; titulo: string; texto: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 88%", "end 38%"] });
  const opacidad = useTransform(p, [0, 0.35, 0.75, 1], [0.25, 1, 1, 0.35]);
  const x = useTransform(p, [0, 0.4], [36, 0]);
  const linea = useTransform(p, [0, 0.45], [0, 1]);
  return (
    <li ref={ref} className="relative py-9 md:py-11">
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-[#e8b93f] to-white/10"
        style={reduce ? undefined : { scaleX: linea }}
      />
      <motion.div
        className="grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-3 md:gap-x-10"
        style={reduce ? undefined : { opacity: opacidad, x }}
      >
        <span
          className={`${MONO} pt-1 text-[0.85rem] text-[#e8b93f] md:text-[0.95rem]`}
        >
          {n}
        </span>
        <div>
          <h3 className="text-[clamp(1.5rem,2.6vw,2.3rem)] font-medium tracking-[-0.03em] text-[#f1eee6]">
            {titulo}
          </h3>
          <p className="mt-3 max-w-[52ch] text-[1rem] leading-relaxed text-[#a8a498]">{texto}</p>
        </div>
      </motion.div>
    </li>
  );
}

export function Soluciones() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const barra = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  return (
    <section id="soluciones" ref={ref} className="relative bg-[#0a0b0d] py-[clamp(5rem,10vw,9rem)]">
      <Contenedor className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Titulo
            texto="Construimos tecnología para resolver problemas reales."
            className={H2}
            oro={[2, 5]}
          />
          <div className="mt-10 hidden h-[2px] w-40 overflow-hidden rounded-full bg-white/10 lg:block">
            <motion.div
              className="h-full origin-left bg-[#e8b93f]"
              style={{ scaleX: reduce ? 1 : barra }}
            />
          </div>
        </div>
        <ol className="relative">
          {CAPACIDADES.map((c) => (
            <Fila key={c.n} n={c.n} titulo={c.titulo} texto={c.texto} />
          ))}
          <li aria-hidden className="h-px bg-white/10" />
        </ol>
      </Contenedor>
    </section>
  );
}

/* ================================================ 2. TECNOLOGÍA PARA EMPRESAS
   Movimiento propio: dos cintas en sentido contrario (unico marquee de la
   pagina); se detienen al pasar el cursor.                                    */

function Cinta({ items, inversa = false }: { items: string[]; inversa?: boolean }) {
  const lista = [...items, ...items];
  return (
    <div
      className="cinta flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_9%,#000_91%,transparent)] motion-reduce:flex-wrap motion-reduce:justify-center"
    >
      <ul
        className={`marquee flex shrink-0 gap-4 pr-4 motion-reduce:flex-wrap motion-reduce:justify-center ${inversa ? "marquee-inversa" : ""}`}
      >
        {lista.map((t, i) => (
          <li
            key={`${t}-${i}`}
            aria-hidden={i >= items.length}
            className={`${i >= items.length ? "motion-reduce:hidden" : ""} whitespace-nowrap rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 text-[clamp(1.05rem,1.8vw,1.5rem)] font-medium tracking-[-0.02em] text-[#f1eee6] transition-colors hover:border-[#e8b93f]/60 hover:text-[#e8b93f]`}
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Empresas() {
  const mitad = Math.ceil(PARA_EMPRESAS.length / 2);
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#0d0e12] py-[clamp(5rem,9vw,8rem)]">
      <Contenedor>
        <Titulo texto="Lo que podemos construir para tu operación." className={`${H2} max-w-[18ch]`} oro={[5, 6]} />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[56ch] text-[1.05rem] leading-relaxed text-[#a8a498]">
            Desarrollamos soluciones para empresas y profesionales, partiendo del proceso que ya
            tienes y no de una plantilla.
          </p>
        </Reveal>
      </Contenedor>
      <div className="mt-14 space-y-4">
        <Cinta items={PARA_EMPRESAS.slice(0, mitad)} />
        <Cinta items={PARA_EMPRESAS.slice(mitad)} inversa />
      </div>
      <Contenedor className="mt-14">
        <Reveal>
          <Magnetico href="#contacto" className={BTN_ORO}>
            Cuéntanos qué necesitas
          </Magnetico>
        </Reveal>
      </Contenedor>
    </section>
  );
}

/* ====================================== 3. TECNOLOGÍA QUE CONECTA EL ECOSISTEMA
   Movimiento propio: pan horizontal anclado (la pantalla se queda quieta y las
   areas pasan de lado). En movil se apila verticalmente.                      */

function PanelArea({ i, area, texto }: { i: number; area: string; texto: string }) {
  return (
    <Foco
      as="article"
      className="flex h-full w-[min(44vw,540px)] shrink-0 flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-9"
    >
      <span className={`${MONO} text-[0.85rem] text-[#e8b93f]`}>
        {String(i + 1).padStart(2, "0")} / {String(TECNOLOGIA_ECOSISTEMA.length).padStart(2, "0")}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-4 text-[clamp(8rem,15vw,13rem)] font-medium leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(232,185,63,0.28)] transition-[-webkit-text-stroke-color] duration-500 group-hover:[-webkit-text-stroke:1px_rgba(232,185,63,0.7)]"
      >
        {String(i + 1).padStart(2, "0")}
      </span>
      <div className="relative">
        <h3 className="text-[clamp(2.2rem,4vw,3.6rem)] font-medium leading-none tracking-[-0.04em] text-[#f1eee6]">
          {area}
        </h3>
        <p className="mt-5 max-w-[32ch] text-[1.05rem] leading-relaxed text-[#a8a498]">{texto}</p>
      </div>
    </Foco>
  );
}

export function EcosistemaTech() {
  const reduce = useReducedMotion() ?? false;
  const alto = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLDivElement>(null);
  const max = useMotionValue(0);
  const { scrollYProgress: p } = useScroll({ target: alto, offset: ["start start", "end end"] });
  const sp = useSpring(p, { stiffness: 110, damping: 28, mass: 0.4 });
  const x = useTransform(() => -sp.get() * max.get());

  useEffect(() => {
    const medir = () => {
      if (pista.current) max.set(Math.max(0, pista.current.scrollWidth - window.innerWidth + 48));
    };
    medir();
    const ro = new ResizeObserver(medir);
    if (pista.current) ro.observe(pista.current);
    window.addEventListener("resize", medir);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, [max]);

  const intro = (
    <>
      <Titulo
        texto="Tecnología que conecta el ecosistema VenBraX"
        className={`${H2} max-w-[14ch]`}
        oro={[3, 4]}
      />
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-[40ch] text-[1.02rem] leading-relaxed text-[#a8a498]">
          VenBraTech aporta la infraestructura tecnológica y digital de las distintas áreas del
          ecosistema. No somos un despacho jurídico, contable ni una productora: damos la
          tecnología que esas áreas usan.
        </p>
      </Reveal>
    </>
  );

  return (
    <section className="relative bg-[#0a0b0d]">
      {/* escritorio: pan horizontal anclado */}
      {!reduce && (
        <div ref={alto} className="relative hidden md:block" style={{ height: "300dvh" }}>
          <div className="sticky top-[66px] flex h-[calc(100dvh-66px)] flex-col justify-center overflow-hidden">
            <motion.div
              ref={pista}
              className="flex w-max items-stretch gap-8 pl-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] pr-12"
              style={{ x, height: "62%" }}
            >
              <div className="flex w-[min(34vw,460px)] shrink-0 flex-col justify-center pr-6">{intro}</div>
              {TECNOLOGIA_ECOSISTEMA.map((t, i) => (
                <PanelArea key={t.area} i={i} area={t.area} texto={t.texto} />
              ))}
            </motion.div>
            <div className="absolute inset-x-0 bottom-10 mx-auto h-[2px] w-[min(1280px,calc(100%-3rem))] overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full origin-left bg-[#e8b93f]" style={{ scaleX: sp }} />
            </div>
          </div>
        </div>
      )}
      {/* movil y reduced-motion: apilado */}
      <div className={`${reduce ? "" : "md:hidden"} py-[clamp(4.5rem,9vw,7rem)]`}>
        <Contenedor>
          {intro}
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {TECNOLOGIA_ECOSISTEMA.map((t, i) => (
              <Reveal key={t.area} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                  <span className={`${MONO} text-[0.8rem] text-[#e8b93f]`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-[1.7rem] font-medium tracking-[-0.03em] text-[#f1eee6]">
                    {t.area}
                  </h3>
                  <p className="mt-2 text-[0.95rem] text-[#a8a498]">{t.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Contenedor>
      </div>
    </section>
  );
}

/* ================================================================ 4. PROYECTOS
   Movimiento propio: pila. Cada proyecto se ancla y la tarjeta anterior se
   reduce y se atenua cuando llega la siguiente.                               */

function slug(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.split(".")[0];
  } catch {
    return "";
  }
}

function TarjetaProyecto({ i, p }: { i: number; p: (typeof PROYECTOS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const escala = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const brillo = useTransform(scrollYProgress, [0, 1], [1, 0.45]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const img = `/proyectos/${slug(p.enlace)}.webp`;
  const filas: [string, string][] = [
    ["Problema", p.problema],
    ["Resultado", p.resultado],
    ["Tecnología", p.tecnologia],
  ];
  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: reduce ? "auto" : "88dvh", marginBottom: reduce ? "1.5rem" : 0 }}
    >
      <motion.article
        className="sticky grid overflow-hidden rounded-2xl border border-white/10 bg-[#101116] lg:grid-cols-[1fr_1.05fr]"
        style={{
          top: reduce ? undefined : `${88 + i * 22}px`,
          scale: reduce ? 1 : escala,
          opacity: reduce ? 1 : brillo,
          transformOrigin: "50% 0%",
        }}
      >
        <div className="flex flex-col p-8 md:p-11">
          <span className={`${MONO} text-[0.85rem] text-[#e8b93f]`}>
            {String(i + 1).padStart(2, "0")} / {String(PROYECTOS.length).padStart(2, "0")}
          </span>
          <h3 className="mt-5 text-[clamp(1.7rem,3vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.035em] text-[#f1eee6]">
            {p.nombre}
          </h3>
          <p className="mt-4 max-w-[46ch] text-[1rem] leading-relaxed text-[#a8a498]">{p.descripcion}</p>
          <dl className="mt-7 space-y-4 text-[0.92rem]">
            {filas.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.4rem_1fr] gap-4 border-t border-white/10 pt-4">
                <dt className={`${MONO} text-[0.72rem] uppercase tracking-[0.1em] text-[#e8b93f]`}>{k}</dt>
                <dd className="text-[#a8a498]">{v}</dd>
              </div>
            ))}
          </dl>
          {p.enlace && (
            <a
              href={p.enlace}
              target="_blank"
              rel="noopener"
              className="mt-8 inline-flex w-fit items-center gap-2 text-[0.95rem] font-medium text-[#e8b93f] transition-transform hover:translate-x-1"
            >
              Abrir el proyecto <span aria-hidden>→</span>
            </a>
          )}
        </div>
        <a
          href={p.enlace}
          target="_blank"
          rel="noopener"
          aria-label={`Abrir ${p.nombre}`}
          className="relative block min-h-[260px] overflow-hidden border-t border-white/10 lg:border-l lg:border-t-0"
        >
          <motion.img
            src={img}
            alt={`Vista del sitio ${p.nombre}`}
            width={1200}
            height={750}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top"
            style={reduce ? undefined : { scale: zoom }}
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#101116]/70 via-transparent to-transparent"
          />
        </a>
      </motion.article>
    </div>
  );
}

export function Proyectos() {
  return (
    <section id="proyectos" className="relative bg-[#0d0e12] py-[clamp(5rem,10vw,9rem)]">
      <Contenedor>
        <Titulo texto="Proyectos que estamos construyendo" className={`${H2} max-w-[16ch]`} oro={[3, 4]} />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-[#a8a498]">
            Trabajos entregados y publicados. Cada uno se puede abrir y revisar.
          </p>
        </Reveal>
        <div className="mt-14">
          {PROYECTOS.map((p, i) => (
            <TarjetaProyecto key={p.nombre} i={i} p={p} />
          ))}
        </div>
      </Contenedor>
    </section>
  );
}

/* ============================================================ 5. ECOSISTEMA VENBRAX
   Movimiento propio: mosaico que se arma en cascada; cada tarjeta lleva luz
   que sigue al cursor. Debajo, la arquitectura de marca se dibuja fila a
   fila.                                                                        */

const MOSAICO = [
  "md:col-span-2 md:row-span-2",
  "",
  "",
  "",
  "",
  "md:col-span-2",
  "md:col-span-2",
];

export function EcosistemaVenbrax() {
  const reduce = useReducedMotion() ?? false;
  return (
    <section id="ecosistema" className="relative bg-[#0a0b0d] py-[clamp(5rem,10vw,9rem)]">
      <Contenedor>
        <Titulo texto="Conoce el ecosistema VenBraX" className={`${H2} max-w-[14ch]`} oro={[2, 3]} />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[56ch] text-[1.05rem] leading-relaxed text-[#a8a498]">
            Cada unidad conserva su especialización y su propio espacio. VenBraTech no las
            sustituye ni las comercializa.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-4 md:auto-rows-[minmax(200px,auto)]">
          {UNIDADES.map((u, i) => {
            const grande = i === 0;
            return (
              <motion.div
                key={u.nombre}
                className={`${MOSAICO[i]} rounded-2xl`}
                initial={reduce ? false : { opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, ease: EASE, delay: (i % 4) * 0.08 }}
              >
                <Foco
                  className={`flex h-full flex-col rounded-2xl border border-white/10 p-7 ${
                    grande
                      ? "bg-gradient-to-br from-[#e8b93f]/[0.16] via-[#101116] to-[#101116] md:p-10"
                      : "bg-white/[0.03]"
                  }`}
                >
                  {grande && (
                    <img
                      src="/brand/emblema.webp"
                      alt=""
                      width={770}
                      height={505}
                      loading="lazy"
                      className="pointer-events-none absolute -bottom-6 -right-10 w-[78%] opacity-90"
                    />
                  )}
                  <div className="relative flex items-start justify-between gap-3">
                    <h3
                      className={`font-medium tracking-[-0.03em] text-[#f1eee6] ${
                        grande ? "text-[clamp(2rem,3.4vw,3rem)]" : "text-[1.35rem]"
                      }`}
                    >
                      {u.nombre}
                    </h3>
                    {u.pendiente && (
                      <span className="shrink-0 rounded-lg border border-white/15 px-2.5 py-1 text-[0.7rem] text-[#a8a498]">
                        En incorporación
                      </span>
                    )}
                  </div>
                  <p className="relative mt-1.5 text-[0.9rem] text-[#e8b93f]">{u.bajada}</p>
                  <p className="relative mt-4 max-w-[40ch] flex-1 text-[0.95rem] leading-relaxed text-[#a8a498]">
                    {u.texto}
                  </p>
                  {u.enlace && (
                    <a
                      href={u.enlace}
                      target="_blank"
                      rel="noopener"
                      className="relative mt-5 inline-flex w-fit items-center gap-2 text-[0.92rem] font-medium text-[#e8b93f] transition-transform hover:translate-x-1"
                    >
                      Ver sitio <span aria-hidden>→</span>
                    </a>
                  )}
                </Foco>
              </motion.div>
            );
          })}
        </div>

        {/* arquitectura de marca */}
        <div className="mt-24">
          <Reveal>
            <h3 className="text-[1.5rem] font-medium tracking-[-0.03em] text-[#f1eee6]">
              Arquitectura de marca
            </h3>
          </Reveal>
          <Linea className="mt-6" />
          <ul className="mt-2 grid gap-x-14 md:grid-cols-2">
            {ARQUITECTURA.map(([marca, rol], i) => (
              <motion.li
                key={marca}
                className="relative flex items-baseline justify-between gap-6 py-4"
                initial={reduce ? false : { opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.8, ease: EASE, delay: (i % 5) * 0.06 }}
              >
                <span className="text-[1.02rem] font-medium text-[#f1eee6]">{marca}</span>
                <span className="text-right text-[0.92rem] text-[#a8a498]">{rol}</span>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-white/[0.08]" />
              </motion.li>
            ))}
          </ul>
        </div>
      </Contenedor>
    </section>
  );
}

/* ============================================================ 6. COLABORADORES
   Movimiento propio: una linea de progreso baja por el centro y cada nodo se
   enciende cuando la linea lo alcanza.                                        */

function ItemColab({
  c,
  i,
  progreso,
}: {
  c: (typeof COLABORADORES)[number];
  i: number;
  progreso: MotionValue<number>;
}) {
  const reduce = useReducedMotion() ?? false;
  const izquierda = i % 2 === 0;
  const nodo = useTransform(progreso, [i / 3 + 0.02, i / 3 + 0.12], [0, 1]);
  return (
    <li className="relative grid md:grid-cols-2 md:gap-24">
      <span
        aria-hidden
        className="absolute left-[11px] top-8 z-10 h-[11px] w-[11px] rounded-full border border-[#e8b93f] bg-[#0a0b0d] md:left-1/2 md:-translate-x-1/2"
      />
      <motion.span
        aria-hidden
        className="absolute left-[11px] top-8 z-10 h-[11px] w-[11px] rounded-full bg-[#e8b93f] shadow-[0_0_0_6px_rgba(232,185,63,0.15)] md:left-1/2 md:-translate-x-1/2"
        style={{ scale: reduce ? 1 : nodo }}
      />
      <Reveal
        x={izquierda ? -50 : 50}
        y={0}
        className={`pl-12 md:pl-0 ${izquierda ? "md:col-start-1 md:pr-0 md:text-right" : "md:col-start-2"}`}
      >
        <span className={`${MONO} text-[0.85rem] text-[#e8b93f]`}>{c.n}</span>
        <h3 className="mt-3 text-[clamp(1.5rem,2.4vw,2.1rem)] font-medium tracking-[-0.03em] text-[#f1eee6]">
          {c.titulo}
        </h3>
        <p
          className={`mt-3 max-w-[46ch] text-[1rem] leading-relaxed text-[#a8a498] ${izquierda ? "md:ml-auto" : ""}`}
        >
          {c.texto}
        </p>
      </Reveal>
    </li>
  );
}

export function Colaboradores() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 55%"] });
  const sp = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  return (
    <section id="colaboradores" className="relative border-t border-white/[0.06] bg-[#0d0e12] py-[clamp(5rem,10vw,9rem)]">
      <Contenedor>
        <Titulo texto="Formar parte del ecosistema VenBraX" className={`${H2} max-w-[16ch]`} oro={[3, 4]} />
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[56ch] text-[1.05rem] leading-relaxed text-[#a8a498]">
            Una capacidad complementaria del ecosistema, no su centro. Toda participación se
            define por escrito antes de empezar.
          </p>
        </Reveal>
        <div ref={ref} className="relative mt-16">
          <div aria-hidden className="absolute bottom-0 left-[16px] top-0 w-px bg-white/10 md:left-1/2" />
          <motion.div
            aria-hidden
            className="absolute bottom-0 left-[16px] top-0 w-px origin-top bg-gradient-to-b from-[#e8b93f] to-[#e8b93f]/30 md:left-1/2"
            style={{ scaleY: reduce ? 1 : sp }}
          />
          <ol className="space-y-16 md:space-y-20">
            {COLABORADORES.map((c, i) => (
              <ItemColab key={c.n} c={c} i={i} progreso={sp} />
            ))}
          </ol>
        </div>
        <Reveal className="mt-16">
          <Magnetico href="#contacto" className={BTN_LINEA}>
            Formar parte del ecosistema
          </Magnetico>
        </Reveal>
      </Contenedor>
    </section>
  );
}

/* =================================================== ACADEMIA Y PUNTO FÍSICO
   Movimiento propio: los dos paneles entran desde lados opuestos.             */

export function Secundarias() {
  return (
    <section className="relative bg-[#0a0b0d] py-[clamp(3rem,7vw,5.5rem)]">
      <Contenedor className="grid gap-5 lg:grid-cols-2">
        <Reveal x={-60} y={0} amount={0.3}>
          <Foco className="flex h-full min-h-[300px] flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-9">
            <h2 className="text-[clamp(1.7rem,2.6vw,2.3rem)] font-medium tracking-[-0.03em] text-[#f1eee6]">
              VenBraX Academy
            </h2>
            <p className="mt-2 text-[0.92rem] text-[#e8b93f]">Unidad de formación</p>
            <p className="mt-5 flex-1 text-[1rem] leading-relaxed text-[#a8a498]">
              Formación en inteligencia artificial, automatización, tecnología, herramientas
              digitales y desarrollo. Funciona como unidad independiente dentro del ecosistema.
            </p>
            <a
              href="/academia"
              className="mt-6 inline-flex w-fit items-center gap-2 text-[0.95rem] font-medium text-[#e8b93f] transition-transform hover:translate-x-1"
            >
              Ir a VenBraX Academy <span aria-hidden>→</span>
            </a>
          </Foco>
        </Reveal>
        <Reveal x={60} y={0} amount={0.3} delay={0.08}>
          <Foco className="flex h-full min-h-[300px] flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-9">
            <h2 className="text-[clamp(1.7rem,2.6vw,2.3rem)] font-medium tracking-[-0.03em] text-[#f1eee6]">
              Capri — Morón, Carabobo
            </h2>
            <p className="mt-2 text-[0.92rem] text-[#e8b93f]">Punto físico</p>
            <p className="mt-5 flex-1 text-[1rem] leading-relaxed text-[#a8a498]">
              Punto físico del ecosistema VenBraX: dos locales en el Centro Comercial Capri
              destinados a tecnología, producción audiovisual, equipamiento, servicios digitales,
              formación y reuniones.
            </p>
            <span className="mt-6 inline-block w-fit rounded-lg border border-white/15 px-2.5 py-1 text-[0.72rem] text-[#a8a498]">
              En preparación
            </span>
          </Foco>
        </Reveal>
      </Contenedor>
    </section>
  );
}

/* ================================================================== CONTACTO
   Movimiento propio: el globo de la portada reaparece y se desplaza con el
   scroll (cierra el recorrido); los dos canales entran como paneles grandes.   */

export function Contacto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const globoY = useTransform(scrollYProgress, [0, 1], ["16%", "-6%"]);
  const globoEsc = useTransform(scrollYProgress, [0, 1], [1.05, 1.28]);
  return (
    <section id="contacto" ref={ref} className="relative isolate overflow-hidden bg-[#0a0b0d] py-[clamp(6rem,12vw,11rem)]">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[75%] origin-bottom"
        style={{
          y: reduce ? 0 : globoY,
          scale: reduce ? 1 : globoEsc,
          opacity: 0.55,
        }}
      >
        <img
          src="/brand/globo.webp"
          alt=""
          width={1672}
          height={471}
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      </motion.div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 500px at 20% 0%, rgba(232,185,63,0.12), transparent 70%), linear-gradient(to bottom, #0a0b0d 0%, #0a0b0d 30%, rgba(10,11,13,0.55) 62%, #0a0b0d 100%)",
        }}
      />
      <Contenedor>
        <Titulo
          texto="Cuéntanos qué necesitas construir."
          className="max-w-[16ch] text-[clamp(2.4rem,6.4vw,5.6rem)] font-medium leading-[1.02] tracking-[-0.045em] text-[#f1eee6]"
          oro={[3, 4]}
        />
        <Reveal delay={0.1}>
          <p className="mt-7 max-w-[54ch] text-[1.1rem] leading-relaxed text-[#a8a498]">
            Describe tu proceso o tu idea y te decimos qué haría falta para llevarlo a un sistema
            que funcione. Sin compromiso.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <Reveal y={50}>
            <Magnetico
              href={CONTACTO.whatsappUrl}
              target="_blank"
              rel="noopener"
              fuerza={0.4}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8b93f]/40 bg-gradient-to-br from-[#e8b93f]/[0.14] to-[#101116]/80 p-9 transition-colors hover:border-[#e8b93f]"
            >
              <span className="text-[0.95rem] font-medium text-[#e8b93f]">WhatsApp</span>
              <span className="mt-3 text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium tracking-[-0.03em] text-[#f1eee6]">
                {CONTACTO.whatsapp}
              </span>
              <span className="mt-3 text-[1rem] text-[#a8a498]">
                La vía más rápida. Escríbenos y conversamos hoy mismo.
              </span>
              <span aria-hidden className="mt-8 text-[1.6rem] text-[#e8b93f] transition-transform group-hover:translate-x-2">
                →
              </span>
            </Magnetico>
          </Reveal>
          <Reveal y={50} delay={0.1}>
            <Magnetico
              href={`mailto:${CONTACTO.correo}?subject=Proyecto%20con%20VenBraTech`}
              fuerza={0.4}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#101116]/80 p-9 transition-colors hover:border-[#e8b93f]/70"
            >
              <span className="text-[0.95rem] font-medium text-[#e8b93f]">Correo</span>
              <span className="mt-3 text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium tracking-[-0.03em] text-[#f1eee6]">
                {CONTACTO.correo}
              </span>
              <span className="mt-3 text-[1rem] text-[#a8a498]">
                Si prefieres escribir con detalle o adjuntar documentos.
              </span>
              <span aria-hidden className="mt-8 text-[1.6rem] text-[#e8b93f] transition-transform group-hover:translate-x-2">
                →
              </span>
            </Magnetico>
          </Reveal>
        </div>
      </Contenedor>
    </section>
  );
}

/* ====================================================================== PIE */

export function Pie({ nav }: { nav: string[][] }) {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07070a] py-14">
      <Contenedor>
        <Reveal amount={0.1}>
          <div className="flex flex-wrap justify-between gap-10">
            <div className="max-w-[340px]">
              <img
                src="/brand/nombre.webp"
                alt="VenBraTech"
                width={900}
                height={160}
                loading="lazy"
                className="h-[26px] w-auto"
              />
              <p className="mt-4 text-[0.9rem] leading-relaxed text-[#a8a498]">
                División tecnológica del ecosistema VenBraX. Software, inteligencia artificial,
                automatización, datos e ingeniería.
              </p>
            </div>
            <nav className="flex gap-14">
              <div>
                <p className="text-[0.85rem] font-medium text-[#e8b93f]">Sitio</p>
                {nav.slice(1).map(([n, h]) => (
                  <a key={h} href={h} className="mt-3 block text-[0.9rem] text-[#a8a498] transition-colors hover:text-[#f1eee6]">
                    {n}
                  </a>
                ))}
              </div>
              <div>
                <p className="text-[0.85rem] font-medium text-[#e8b93f]">Legal</p>
                <a href="/privacidad" className="mt-3 block text-[0.9rem] text-[#a8a498] transition-colors hover:text-[#f1eee6]">
                  Privacidad
                </a>
                <a href="/terminos" className="mt-3 block text-[0.9rem] text-[#a8a498] transition-colors hover:text-[#f1eee6]">
                  Términos
                </a>
              </div>
            </nav>
          </div>
        </Reveal>
        <p className="mt-12 border-t border-white/[0.08] pt-6 text-[0.82rem] text-[#a8a498]">
          © 2026 VenBraTech · Unidad del ecosistema VenBraX
        </p>
        <p className="mt-2 text-[0.82rem] text-[#a8a498]">
          VenBra Tech es el nombre comercial bajo el cual opera Alfonso Enrique Grammatica Rivero,
          persona física con domicilio en Brasil.
        </p>
      </Contenedor>
    </footer>
  );
}
