import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Capa de movimiento de la portada. Todo se engancha por atributos:
 *   data-reveal            aparece al entrar en pantalla
 *   .vt-split              titulo que se revela palabra por palabra
 *   data-parallax="0.12"   desplazamiento paralaje ligado al scroll
 *   data-magnetic          boton que se acerca al puntero (escritorio)
 *   data-tilt              tarjeta con inclinacion 3D y foco de luz (escritorio)
 *   data-cursor="Ver"      etiqueta del cursor propio sobre el elemento
 * Devuelve la funcion que lo desmonta todo (StrictMode / navegacion).
 */
export function iniciar(): () => void {
  const root = document.documentElement;
  const limpiar: Array<() => void> = [];
  const escuchar = (
    t: Document | Window | HTMLElement,
    ev: string,
    fn: EventListenerOrEventListenerObject,
    opts?: AddEventListenerOptions
  ) => {
    t.addEventListener(ev, fn, opts);
    limpiar.push(() => t.removeEventListener(ev, fn, opts));
  };

  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fino = matchMedia("(hover: hover) and (pointer: fine)").matches;

  root.classList.add("vt-ready");

  /* ---- Aparicion al entrar en pantalla (tambien con movimiento reducido:
          el CSS lo neutraliza, aqui solo se marca) ---------------------- */
  const io = new IntersectionObserver(
    (es) => {
      for (const e of es) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll("[data-reveal], .vt-split").forEach((el) => io.observe(el));
  limpiar.push(() => io.disconnect());

  if (reducido) {
    return () => limpiar.forEach((f) => f());
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---- Scroll suave (Lenis) sincronizado con ScrollTrigger ------------- */
  const lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    anchors: { offset: -88 },
    autoRaf: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  limpiar.push(() => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  });
  // El menu movil bloquea el scroll mientras esta abierto.
  escuchar(window, "vt:menu", ((e: CustomEvent<{ abierto: boolean }>) => {
    if (e.detail.abierto) lenis.stop();
    else lenis.start();
  }) as EventListener);

  /* ---- Barra de progreso de lectura ----------------------------------- */
  const barra = document.querySelector<HTMLElement>(".vt-bar");
  if (barra) {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (s) => {
        barra.style.transform = `scaleX(${s.progress})`;
      },
    });
  }

  /* ---- Paralaje --------------------------------------------------------- */
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const v = parseFloat(el.dataset.parallax || "0.1");
    gsap.fromTo(
      el,
      { yPercent: -v * 60 },
      {
        yPercent: v * 60,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });

  /* ---- Titular de portada: se aleja al hacer scroll -------------------- */
  const portada = document.querySelector<HTMLElement>("[data-hero-out]");
  if (portada) {
    gsap.to(portada, {
      yPercent: -14,
      opacity: 0.0,
      ease: "none",
      scrollTrigger: { trigger: ".vt-hero", start: "top top", end: "bottom 15%", scrub: true },
    });
  }

  /* ---- Marquesinas: se inclinan con la velocidad del scroll ----------- */
  const marq = gsap.utils.toArray<HTMLElement>(".vt-marq");
  if (marq.length) {
    const prox = { v: 0 };
    const aplicar = () => marq.forEach((m) => m.style.setProperty("--skew", `${prox.v}deg`));
    ScrollTrigger.create({
      onUpdate: (s) => {
        const v = gsap.utils.clamp(-8, 8, s.getVelocity() / -240);
        if (Math.abs(v) > Math.abs(prox.v)) {
          prox.v = v;
          aplicar();
          gsap.to(prox, { v: 0, duration: 0.9, ease: "power3.out", overwrite: true, onUpdate: aplicar });
        }
      },
    });
  }

  /* ---- Proyectos: las tarjetas se apilan y se oscurecen ---------------- */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 1024px)", () => {
    const tarjetas = gsap.utils.toArray<HTMLElement>(".vt-proj");
    tarjetas.forEach((t, i) => {
      const sig = tarjetas[i + 1];
      if (!sig) return;
      const sombra = t.querySelector<HTMLElement>(".vt-proj-shade");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sig, start: "top 88%", end: "top 12%", scrub: true },
      });
      tl.to(t, { scale: 0.93, ease: "none" }, 0);
      if (sombra) tl.to(sombra, { opacity: 0.72, ease: "none" }, 0);
    });
  });
  limpiar.push(() => mm.revert());

  /* ---- Punteros finos (escritorio): cursor, magnetismo, tilt ----------- */
  if (fino) {
    // Cursor propio
    const punto = document.createElement("div");
    punto.className = "vt-cur";
    punto.innerHTML = '<div class="vt-cur-dot"></div>';
    const anillo = document.createElement("div");
    anillo.className = "vt-cur";
    anillo.innerHTML = '<div class="vt-cur-ring"><span></span></div>';
    punto.setAttribute("aria-hidden", "true");
    anillo.setAttribute("aria-hidden", "true");
    document.body.append(punto, anillo);
    const aro = anillo.firstElementChild as HTMLElement;
    const etiqueta = aro.firstElementChild as HTMLElement;
    const px = gsap.quickTo(punto, "x", { duration: 0.12, ease: "power3" });
    const py = gsap.quickTo(punto, "y", { duration: 0.12, ease: "power3" });
    const ax = gsap.quickTo(anillo, "x", { duration: 0.5, ease: "power3" });
    const ay = gsap.quickTo(anillo, "y", { duration: 0.5, ease: "power3" });
    escuchar(document, "pointermove", ((e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      root.classList.add("vt-cursor-on");
      px(e.clientX);
      py(e.clientY);
      ax(e.clientX);
      ay(e.clientY);
    }) as EventListener);
    escuchar(document, "pointerover", ((e: PointerEvent) => {
      const t = (e.target as Element).closest<HTMLElement>("a, button, [data-cursor]");
      const txt = t?.dataset.cursor;
      aro.classList.toggle("link", !!t && !txt);
      aro.classList.toggle("label", !!txt);
      etiqueta.textContent = txt || "";
    }) as EventListener);
    escuchar(document, "pointerdown", (() => aro.classList.add("down")) as EventListener);
    escuchar(document, "pointerup", (() => aro.classList.remove("down")) as EventListener);
    escuchar(document.documentElement, "mouseleave", (() => root.classList.remove("vt-cursor-on")) as EventListener);
    limpiar.push(() => {
      root.classList.remove("vt-cursor-on");
      punto.remove();
      anillo.remove();
    });

    // Botones magneticos
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      const fuerza = parseFloat(el.dataset.magnetic || "0.35") || 0.35;
      const mover = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: dx * fuerza, y: dy * fuerza, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      };
      const soltar = () =>
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
      escuchar(el, "pointermove", mover as EventListener);
      escuchar(el, "pointerleave", soltar);
    });

    // Tarjetas con inclinacion 3D y foco de luz
    document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
      let raf = 0;
      const mover = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
          el.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
          el.style.setProperty("--mx", `${x * 100}%`);
          el.style.setProperty("--my", `${y * 100}%`);
        });
      };
      escuchar(el, "pointerenter", (() => el.classList.add("on")) as EventListener);
      escuchar(el, "pointermove", mover as EventListener);
      escuchar(el, "pointerleave", (() => {
        cancelAnimationFrame(raf);
        el.classList.remove("on");
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      }) as EventListener);
    });
  }

  /* ---- Recalcular cuando cargan las fuentes y la pagina ---------------- */
  const refrescar = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refrescar);
  if (document.readyState === "complete") refrescar();
  else escuchar(window, "load", refrescar);

  return () => {
    ScrollTrigger.getAll().forEach((s) => s.kill());
    limpiar.forEach((f) => f());
  };
}
