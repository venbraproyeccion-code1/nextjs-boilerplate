"use client";

import { useEffect } from "react";

/**
 * Carga la capa de movimiento (GSAP, ScrollTrigger, Lenis, cursor, tilt,
 * botones magneticos) DESPUES de hidratar y en un momento ocioso, para que
 * no compita con el primer pintado. El HTML ya viene completo del servidor:
 * si esto no llega, el contenido sigue visible (ver .vt-sin-anim).
 */
export default function Enhancer() {
  useEffect(() => {
    let apagar: (() => void) | undefined;
    let cancelado = false;
    const arrancar = () => {
      import("./enhance").then((m) => {
        if (!cancelado) apagar = m.iniciar();
      });
    };
    const hayIdle = "requestIdleCallback" in window;
    const id = hayIdle
      ? window.requestIdleCallback(arrancar, { timeout: 1000 })
      : window.setTimeout(arrancar, 250);
    return () => {
      cancelado = true;
      if (hayIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
      apagar?.();
    };
  }, []);
  return null;
}
