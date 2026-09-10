"use client";

import { useEffect, useRef, useState } from "react";
import {
  ARQUITECTURA,
  CAPACIDADES,
  COLABORADORES,
  CONTACTO,
  PARA_EMPRESAS,
  PROYECTOS,
  TECNOLOGIA_ECOSISTEMA,
  UNIDADES,
} from "./contenido";

/* ------------------------------------------------------------------ piezas */

/** Envoltorio de aparicion al hacer scroll. El estado de reposo del CSS es
 *  visible; esto solo adelanta la animacion cuando hay JavaScript. */
function Rev({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("dentro");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("dentro");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    // Ultimo recurso: nada puede quedar invisible pasados 4 s.
    const t = setTimeout(() => el.classList.add("dentro"), 4000);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);
  return (
    <div ref={ref} className={`rev ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-plex text-[0.72rem] uppercase tracking-[0.14em] text-acento">
      {children}
    </span>
  );
}

function Titulo({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
      {children}
    </h2>
  );
}

function Seccion({
  id,
  etiqueta,
  titulo,
  intro,
  children,
  fondo = false,
}: {
  id?: string;
  etiqueta: string;
  titulo: string;
  intro?: string;
  children: React.ReactNode;
  fondo?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-[clamp(4rem,9vw,7rem)] ${
        fondo ? "bg-panel border-y border-linea" : ""
      }`}
    >
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <Rev>
          <div className="mb-12 max-w-[660px]">
            <Etiqueta>{etiqueta}</Etiqueta>
            <div className="mt-3">
              <Titulo>{titulo}</Titulo>
            </div>
            {intro && <p className="mt-4 text-tenue">{intro}</p>}
          </div>
        </Rev>
        {children}
      </div>
    </section>
  );
}

const NAV = [
  ["Inicio", "#inicio"],
  ["Soluciones", "#soluciones"],
  ["Proyectos", "#proyectos"],
  ["Ecosistema", "#ecosistema"],
  ["Colaboradores", "#colaboradores"],
  ["Academia", "/academia"],
  ["Contacto", "#contacto"],
];

/* -------------------------------------------------------------------- vista */

export default function Home() {
  const [correo, setCorreo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo || listo) return;
    setEnviando(true);
    try {
      // Endpoint heredado de la etapa anterior. Se conserva para no perder la
      // unica via de captura que ya existe; el utm distingue los contactos
      // comerciales de tecnologia de los registros antiguos.
      await fetch(
        "https://xshannxyjzrhgnsqmhun.supabase.co/functions/v1/register-member",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: correo,
            utm_source: "venbratech_home_tecnologia",
          }),
        }
      );
    } catch {
      /* el usuario ya tiene WhatsApp y correo como alternativa */
    }
    setEnviando(false);
    setListo(true);
    setCorreo("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-fondo font-cuerpo text-texto">
      {/* ---------------------------------------------------------- NAV */}
      <nav className="sticky top-0 z-50 border-b border-linea bg-fondo/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[66px] w-full max-w-[1180px] items-center justify-between px-6">
          <a href="#inicio" className="font-display text-[1.06rem] font-bold tracking-[-0.02em]">
            VenBra<span className="text-acento">Tech</span>
          </a>
          <div className="hidden items-center gap-7 lg:flex">
            {NAV.slice(1, -1).map(([n, h]) => (
              <a
                key={h}
                href={h}
                className="text-[0.88rem] text-tenue transition-colors hover:text-texto"
              >
                {n}
              </a>
            ))}
          </div>
          <a
            href="#contacto"
            className="rounded-lg bg-acento px-5 py-2.5 text-[0.9rem] font-semibold text-[#04140f] transition hover:bg-acento2"
          >
            Hablar con VenBraTech
          </a>
        </div>
      </nav>

      <main>
        {/* ------------------------------------------------------- HERO */}
        <header id="inicio" className="relative py-[clamp(4.5rem,11vw,8.5rem)]">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-160px] h-[560px] w-[900px] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,224,164,0.10), transparent 68%)",
            }}
          />
          <div className="relative mx-auto w-full max-w-[1180px] px-6">
            <div className="max-w-[860px]">
              <Rev>
                <Etiqueta>VenBraTech · La división tecnológica de VenBraX</Etiqueta>
                <h1 className="mt-6 font-display text-[clamp(2.1rem,5.4vw,3.9rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                  Tecnología que convierte{" "}
                  <span className="text-tenue">ideas en sistemas.</span>
                </h1>
                <p className="mt-6 max-w-[62ch] text-[clamp(1rem,1.6vw,1.14rem)] text-tenue">
                  Desarrollo de software, inteligencia artificial, automatización,
                  datos e ingeniería para construir soluciones digitales reales.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href="#soluciones"
                    className="rounded-lg border border-linea2 px-6 py-3 font-medium transition hover:border-acento hover:text-acento"
                  >
                    Conocer VenBraTech
                  </a>
                  <a
                    href="#contacto"
                    className="rounded-lg bg-acento px-6 py-3 font-semibold text-[#04140f] transition hover:bg-acento2"
                  >
                    Desarrollar un proyecto
                  </a>
                </div>
              </Rev>
            </div>
          </div>
        </header>

        {/* ------------------------------------------- 2. QUÉ HACEMOS */}
        <Seccion
          id="soluciones"
          etiqueta="Qué hacemos"
          titulo="Construimos tecnología para resolver problemas reales."
          fondo
        >
          <Rev>
            <div className="grid gap-px overflow-hidden rounded-xl border border-linea bg-linea sm:grid-cols-2 lg:grid-cols-3">
              {CAPACIDADES.map((c) => (
                <div key={c.n} className="bg-panel p-7">
                  <span className="font-plex text-[0.74rem] text-acento">{c.n}</span>
                  <h3 className="mt-3 font-display text-[1.06rem] font-semibold">
                    {c.titulo}
                  </h3>
                  <p className="mt-2 text-[0.9rem] text-tenue">{c.texto}</p>
                </div>
              ))}
            </div>
          </Rev>
        </Seccion>

        {/* ------------------------------ 3. TECNOLOGÍA PARA EMPRESAS */}
        <Seccion
          etiqueta="Tecnología para empresas"
          titulo="Lo que podemos construir para tu operación."
          intro="Desarrollamos soluciones para empresas y profesionales, partiendo del proceso que ya tienes y no de una plantilla."
        >
          <Rev>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PARA_EMPRESAS.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-3 rounded-lg border border-linea bg-panel px-4 py-3.5 text-[0.94rem]"
                >
                  <span aria-hidden className="h-[7px] w-[7px] shrink-0 rounded-sm bg-acento" />
                  {s}
                </li>
              ))}
            </ul>
            <a
              href="#contacto"
              className="mt-10 inline-block rounded-lg bg-acento px-6 py-3 font-semibold text-[#04140f] transition hover:bg-acento2"
            >
              Cuéntanos qué necesitas
            </a>
          </Rev>
        </Seccion>

        {/* ------------------- 4. VENBRATECH DENTRO DEL ECOSISTEMA */}
        <Seccion
          etiqueta="Dentro del ecosistema"
          titulo="Tecnología que conecta el ecosistema VenBraX"
          intro="VenBraTech aporta la infraestructura tecnológica y digital de las distintas áreas del ecosistema. No somos un despacho jurídico, contable ni una productora: damos la tecnología que esas áreas usan."
          fondo
        >
          <Rev>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TECNOLOGIA_ECOSISTEMA.map((t) => (
                <div key={t.area} className="rounded-xl border border-linea bg-fondo p-6">
                  <h3 className="font-plex text-[0.78rem] uppercase tracking-[0.12em] text-acento">
                    {t.area}
                  </h3>
                  <p className="mt-3 text-[0.94rem] text-tenue">{t.texto}</p>
                </div>
              ))}
            </div>
          </Rev>
        </Seccion>

        {/* ---------------------------------------- 6. PROYECTOS */}
        <Seccion
          id="proyectos"
          etiqueta="Proyectos"
          titulo="Proyectos que estamos construyendo"
          intro="Trabajos entregados y publicados. Cada uno se puede abrir y revisar."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            {PROYECTOS.map((p, i) => (
              <Rev key={p.nombre} delay={i * 0.06}>
                <article className="flex h-full flex-col rounded-xl border border-linea bg-panel p-7">
                  <h3 className="font-display text-[1.24rem] font-semibold">{p.nombre}</h3>
                  <p className="mt-3 text-[0.92rem] text-tenue">{p.descripcion}</p>
                  <dl className="mt-5 space-y-3 text-[0.86rem]">
                    <div>
                      <dt className="font-plex text-[0.7rem] uppercase tracking-[0.12em] text-acento">
                        Problema
                      </dt>
                      <dd className="mt-1 text-tenue">{p.problema}</dd>
                    </div>
                    <div>
                      <dt className="font-plex text-[0.7rem] uppercase tracking-[0.12em] text-acento">
                        Resultado
                      </dt>
                      <dd className="mt-1 text-tenue">{p.resultado}</dd>
                    </div>
                    <div>
                      <dt className="font-plex text-[0.7rem] uppercase tracking-[0.12em] text-acento">
                        Tecnología
                      </dt>
                      <dd className="mt-1 text-tenue">{p.tecnologia}</dd>
                    </div>
                  </dl>
                  {p.enlace && (
                    <a
                      href={p.enlace}
                      target="_blank"
                      rel="noopener"
                      className="mt-6 inline-block border-b border-acento/40 pb-0.5 font-plex text-[0.84rem] text-acento transition hover:border-acento"
                    >
                      Abrir el proyecto →
                    </a>
                  )}
                </article>
              </Rev>
            ))}
          </div>
        </Seccion>

        {/* ---------------------------------- 5. ECOSISTEMA VENBRAX */}
        <Seccion
          id="ecosistema"
          etiqueta="Ecosistema"
          titulo="Conoce el ecosistema VenBraX"
          intro="Cada unidad conserva su especialización y su propio espacio. VenBraTech no las sustituye ni las comercializa."
          fondo
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {UNIDADES.map((u, i) => (
              <Rev key={u.nombre} delay={i * 0.04}>
                <div className="flex h-full flex-col rounded-xl border border-linea bg-fondo p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[1.08rem] font-semibold">{u.nombre}</h3>
                    {u.pendiente && (
                      <span className="shrink-0 rounded border border-linea2 px-2 py-0.5 font-plex text-[0.62rem] uppercase tracking-wider text-tenue">
                        En incorporación
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-plex text-[0.72rem] uppercase tracking-[0.1em] text-acento">
                    {u.bajada}
                  </p>
                  <p className="mt-3 flex-1 text-[0.9rem] text-tenue">{u.texto}</p>
                  {u.enlace && (
                    <a
                      href={u.enlace}
                      target="_blank"
                      rel="noopener"
                      className="mt-4 font-plex text-[0.82rem] text-acento"
                    >
                      Ver sitio →
                    </a>
                  )}
                </div>
              </Rev>
            ))}
          </div>

          {/* Arquitectura de marca — seccion 8 del brief */}
          <Rev>
            <div className="mt-10 overflow-x-auto rounded-xl border border-linea bg-fondo p-6">
              <p className="font-plex text-[0.72rem] uppercase tracking-[0.14em] text-acento">
                Arquitectura de marca
              </p>
              <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {ARQUITECTURA.map(([marca, rol]) => (
                  <li
                    key={marca}
                    className="flex items-baseline justify-between gap-4 border-b border-linea py-2 text-[0.88rem]"
                  >
                    <span className="font-medium">{marca}</span>
                    <span className="text-right text-tenue">{rol}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Rev>
        </Seccion>

        {/* ------------------------------- 7. RED DE COLABORADORES */}
        <Seccion
          id="colaboradores"
          etiqueta="Red de colaboradores"
          titulo="Formar parte del ecosistema VenBraX"
          intro="Una capacidad complementaria del ecosistema, no su centro. Toda participación se define por escrito antes de empezar."
        >
          <Rev>
            <div className="grid gap-px overflow-hidden rounded-xl border border-linea bg-linea lg:grid-cols-3">
              {COLABORADORES.map((c) => (
                <div key={c.n} className="bg-panel p-7">
                  <span className="font-plex text-[0.74rem] text-acento">{c.n}</span>
                  <h3 className="mt-3 font-display text-[1.06rem] font-semibold">{c.titulo}</h3>
                  <p className="mt-2 text-[0.9rem] text-tenue">{c.texto}</p>
                </div>
              ))}
            </div>
            <a
              href="#contacto"
              className="mt-8 inline-block rounded-lg border border-linea2 px-6 py-3 font-medium transition hover:border-acento hover:text-acento"
            >
              Formar parte del ecosistema
            </a>
          </Rev>
        </Seccion>

        {/* --------------------------- ACADEMIA + CAPRI (secundarios) */}
        <section className="py-[clamp(3rem,7vw,5rem)]">
          <div className="mx-auto grid w-full max-w-[1180px] gap-5 px-6 lg:grid-cols-2">
            <Rev>
              <div className="flex h-full flex-col rounded-xl border border-linea bg-panel p-7">
                <Etiqueta>Unidad de formación</Etiqueta>
                <h2 className="mt-3 font-display text-[1.5rem] font-semibold">
                  VenBraX Academy
                </h2>
                <p className="mt-3 flex-1 text-[0.94rem] text-tenue">
                  Formación en inteligencia artificial, automatización, tecnología,
                  herramientas digitales y desarrollo. Funciona como unidad
                  independiente dentro del ecosistema.
                </p>
                <a
                  href="/academia"
                  className="mt-5 font-plex text-[0.84rem] text-acento"
                >
                  Ir a VenBraX Academy →
                </a>
              </div>
            </Rev>
            <Rev delay={0.06}>
              <div className="flex h-full flex-col rounded-xl border border-linea bg-panel p-7">
                <Etiqueta>Punto físico</Etiqueta>
                <h2 className="mt-3 font-display text-[1.5rem] font-semibold">
                  Capri — Morón, Carabobo
                </h2>
                <p className="mt-3 flex-1 text-[0.94rem] text-tenue">
                  Punto físico del ecosistema VenBraX: dos locales en el Centro
                  Comercial Capri destinados a tecnología, producción audiovisual,
                  equipamiento, servicios digitales, formación y reuniones.
                </p>
                <span className="mt-5 inline-block w-fit rounded border border-linea2 px-2 py-0.5 font-plex text-[0.62rem] uppercase tracking-wider text-tenue">
                  En preparación
                </span>
              </div>
            </Rev>
          </div>
        </section>

        {/* ------------------------------------------------ CONTACTO */}
        <Seccion
          id="contacto"
          etiqueta="Empecemos"
          titulo="Cuéntanos qué necesitas construir."
          intro="Describe tu proceso o tu idea y te decimos qué haría falta para llevarlo a un sistema que funcione."
          fondo
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <Rev>
              <div className="rounded-xl border border-linea bg-fondo p-7">
                {!listo ? (
                  <form onSubmit={enviar}>
                    <label htmlFor="correo" className="block text-[0.9rem] text-tenue">
                      Déjanos tu correo y te contactamos.
                    </label>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <input
                        id="correo"
                        type="email"
                        required
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="tu@empresa.com"
                        className="flex-1 rounded-lg border border-linea2 bg-panel px-4 py-3 outline-none focus:border-acento"
                      />
                      <button
                        type="submit"
                        disabled={enviando}
                        className="rounded-lg bg-acento px-6 py-3 font-semibold text-[#04140f] transition hover:bg-acento2 disabled:opacity-60"
                      >
                        {enviando ? "Enviando…" : "Solicitar proyecto"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-acento">
                    ✓ Recibido. Te escribimos al correo que dejaste.
                  </p>
                )}
                <p className="mt-4 text-[0.82rem] text-tenue">
                  ¿Prefieres hablar directo? Escríbenos por WhatsApp o correo.
                </p>
              </div>
            </Rev>
            <Rev delay={0.06}>
              <div className="flex h-full flex-col justify-center gap-4">
                <a
                  href={CONTACTO.whatsappUrl}
                  target="_blank"
                  rel="noopener"
                  className="rounded-lg border border-linea2 px-6 py-4 transition hover:border-acento"
                >
                  <span className="block font-plex text-[0.72rem] uppercase tracking-[0.12em] text-acento">
                    WhatsApp
                  </span>
                  <span className="mt-1 block">{CONTACTO.whatsapp}</span>
                </a>
                <a
                  href={`mailto:${CONTACTO.correo}?subject=Proyecto%20con%20VenBraTech`}
                  className="rounded-lg border border-linea2 px-6 py-4 transition hover:border-acento"
                >
                  <span className="block font-plex text-[0.72rem] uppercase tracking-[0.12em] text-acento">
                    Correo
                  </span>
                  <span className="mt-1 block">{CONTACTO.correo}</span>
                </a>
              </div>
            </Rev>
          </div>
        </Seccion>
      </main>

      {/* -------------------------------------------------- PIE */}
      <footer className="border-t border-linea py-10">
        <div className="mx-auto w-full max-w-[1180px] px-6">
          <div className="flex flex-wrap justify-between gap-8">
            <div className="max-w-[320px]">
              <p className="font-display text-[1.06rem] font-bold">
                VenBra<span className="text-acento">Tech</span>
              </p>
              <p className="mt-3 text-[0.86rem] text-tenue">
                División tecnológica del ecosistema VenBraX. Software, inteligencia
                artificial, automatización, datos e ingeniería.
              </p>
            </div>
            <nav className="flex gap-12">
              <div>
                <p className="font-plex text-[0.68rem] uppercase tracking-[0.14em] text-acento">
                  Sitio
                </p>
                {NAV.slice(1).map(([n, h]) => (
                  <a key={h} href={h} className="mt-2.5 block text-[0.86rem] text-tenue hover:text-texto">
                    {n}
                  </a>
                ))}
              </div>
              <div>
                <p className="font-plex text-[0.68rem] uppercase tracking-[0.14em] text-acento">
                  Legal
                </p>
                <a href="/privacidad" className="mt-2.5 block text-[0.86rem] text-tenue hover:text-texto">
                  Privacidad
                </a>
                <a href="/terminos" className="mt-2.5 block text-[0.86rem] text-tenue hover:text-texto">
                  Términos
                </a>
              </div>
            </nav>
          </div>
          <p className="mt-10 border-t border-linea pt-6 text-[0.8rem] text-tenue">
            © 2026 VenBraTech · Unidad del ecosistema VenBraX
          </p>
        </div>
      </footer>
    </div>
  );
}
