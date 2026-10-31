"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// El 3D vive en su propio paquete: no pesa nada hasta que el equipo lo pide.
const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

/** WebGL disponible y con GPU real. Un renderizador por software (SwiftShader,
 *  llvmpipe...) pinta el 3D a cuadros por minuto y bloquea el hilo principal:
 *  en ese caso es mejor quedarse con el cartel estatico. */
function hayWebGLConGPU(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const nombre = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|microsoft basic/i.test(nombre);
  } catch {
    return false;
  }
}

/** Decide si este equipo merece el 3D y cuando cargarlo. Si no: se queda el
 *  cartel estatico (Poster), que ya es una portada completa. */
export default function SceneLoader() {
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ahorro = !!nav.connection?.saveData || nav.connection?.effectiveType === "2g";
    const pocaPotencia =
      (nav.hardwareConcurrency ?? 4) < 4 || (nav.deviceMemory !== undefined && nav.deviceMemory < 2);
    // ?3d=1 fuerza el 3D (pruebas); ?3d=0 lo apaga. Nunca se salta prefers-reduced-motion.
    const forzar = new URLSearchParams(location.search).get("3d");
    if (reducido || forzar === "0") return;
    if (forzar !== "1" && (ahorro || pocaPotencia || !hayWebGLConGPU())) return;

    let hecho = false;
    const encender = () => {
      if (hecho) return;
      hecho = true;
      setActivo(true);
    };
    // Tras la carga y un respiro, o ante la primera interaccion, lo que ocurra antes.
    const tras = () => window.setTimeout(encender, 1800);
    let t = 0;
    if (document.readyState === "complete") t = tras();
    else window.addEventListener("load", () => (t = tras()), { once: true });
    const eventos = ["pointerdown", "touchstart", "wheel", "keydown"] as const;
    eventos.forEach((e) => window.addEventListener(e, encender, { once: true, passive: true }));
    return () => {
      clearTimeout(t);
      eventos.forEach((e) => window.removeEventListener(e, encender));
    };
  }, []);

  return activo ? <Scene3D /> : null;
}
