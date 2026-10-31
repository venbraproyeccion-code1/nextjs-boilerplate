"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import {
  BufferGeometry,
  Color,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  MathUtils,
  Object3D,
  PerspectiveCamera,
  PointLight,
} from "three";

/**
 * Escena 3D procedural (cero archivos de modelos ni texturas: se genera en
 * codigo, asi es nitida a cualquier resolucion).
 *
 * Idea: "ideas -> sistemas". Fragmentos sueltos flotan en el aire; a medida
 * que haces scroll la camara avanza a traves de ellos y, hacia el final de la
 * pagina, se ordenan en una red cristalina (el sistema).
 */

const PI2 = Math.PI * 2;
const RECORRIDO = 58; // cuanto avanza la camara a lo largo del scroll
const CENTRO_Z = -64; // centro de la red final

/** Estado compartido entre cuadros (puntero y scroll). */
const entrada = { mx: 0, my: 0, p: 0, v: 0 };

const suave = (a: number, b: number, x: number) => {
  const t = MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/* ----------------------------------------------------------------- datos */

type Celda = [number, number, number];

function crearRed(compacto: boolean): { celdas: Celda[]; paso: number } {
  const [cx, cy, cz, paso] = compacto ? [4, 5, 4, 1.15] : [7, 5, 4, 2.3];
  const celdas: Celda[] = [];
  for (let i = 0; i < cx; i++)
    for (let j = 0; j < cy; j++)
      for (let k = 0; k < cz; k++)
        celdas.push([(i - (cx - 1) / 2) * paso, (j - (cy - 1) / 2) * paso, CENTRO_Z + (k - (cz - 1) / 2) * paso]);
  return { celdas, paso };
}

/** Pseudoaleatorio determinista: misma escena en servidor, cliente y recarga. */
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------ fragmentos */

function Fragmentos({ compacto }: { compacto: boolean }) {
  const malla = useRef<InstancedMesh>(null);
  const { celdas } = useMemo(() => crearRed(compacto), [compacto]);
  const n = celdas.length;

  const datos = useMemo(() => {
    const r = mulberry(7);
    const dispersion = new Float32Array(n * 3);
    const giro = new Float32Array(n * 3);
    const vel = new Float32Array(n * 3);
    const param = new Float32Array(n * 4); // escala xz, escala y, fase, retraso
    const anchoX = compacto ? 7 : 15;
    const altoY = compacto ? 10 : 9;
    for (let i = 0; i < n; i++) {
      let x = (r() - 0.5) * 2 * anchoX;
      let y = (r() - 0.5) * 2 * altoY;
      const z = 7 - r() * (RECORRIDO + 12);
      // Corredor libre alrededor del eje de la camara para no atravesarla.
      const d = Math.hypot(x, y);
      if (d < 2.4) {
        const k = 2.4 / Math.max(d, 0.001);
        x *= k;
        y *= k;
      }
      dispersion.set([x, y, z], i * 3);
      giro.set([r() * PI2, r() * PI2, r() * PI2], i * 3);
      vel.set([(r() - 0.5) * 0.7, (r() - 0.5) * 0.7, (r() - 0.5) * 0.7], i * 3);
      const s = 0.22 + r() * 0.5;
      param.set([s, s * (1.5 + r() * 1.6), r() * PI2, r() * 0.05], i * 4);
    }
    return { dispersion, giro, vel, param };
  }, [n, compacto]);

  // Colores por instancia: menta dominante, violeta y hielo de apoyo.
  useEffect(() => {
    const m = malla.current;
    if (!m) return;
    const r = mulberry(11);
    const c = new Color();
    for (let i = 0; i < n; i++) {
      const t = r();
      if (t < 0.58) c.set("#00e0a4").offsetHSL(0, 0, (r() - 0.5) * 0.12);
      else if (t < 0.84) c.set("#8b6cff").offsetHSL(0, 0, (r() - 0.5) * 0.1);
      else c.set("#bdf4ff");
      m.setColorAt(i, c);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [n]);

  const o = useMemo(() => new Object3D(), []);
  useFrame(({ clock }) => {
    const m = malla.current;
    if (!m) return;
    const t = clock.elapsedTime;
    const p = entrada.p;
    const { dispersion: d, giro: g, vel: v, param: q } = datos;
    const lado = compacto ? 0.27 : 0.38;
    for (let i = 0; i < n; i++) {
      const a = suave(0.6 + q[i * 4 + 3], 0.93 + q[i * 4 + 3], p);
      const f = q[i * 4 + 2];
      const flota = 1 - a;
      const cel = celdas[i];
      const x = MathUtils.lerp(d[i * 3] + Math.sin(t * 0.35 + f) * 0.45 * flota, cel[0], a);
      const y = MathUtils.lerp(d[i * 3 + 1] + Math.cos(t * 0.3 + f * 1.3) * 0.5 * flota, cel[1], a);
      const z = MathUtils.lerp(d[i * 3 + 2] + Math.sin(t * 0.25 + f * 2) * 0.4 * flota, cel[2], a);
      o.position.set(x, y, z);
      o.rotation.set(
        ((g[i * 3] + t * v[i * 3]) % PI2) * flota,
        ((g[i * 3 + 1] + t * v[i * 3 + 1]) % PI2) * flota,
        ((g[i * 3 + 2] + t * v[i * 3 + 2]) % PI2) * flota
      );
      const sx = MathUtils.lerp(q[i * 4], lado, a);
      const sy = MathUtils.lerp(q[i * 4 + 1], lado, a);
      o.scale.set(sx, sy, sx);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={malla} args={[undefined, undefined, n]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.2} envMapIntensity={1.5} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------ red (aristas) */

function Red({ compacto }: { compacto: boolean }) {
  const mat = useRef<{ opacity: number } | null>(null);
  const geo = useMemo(() => {
    const { celdas, paso } = crearRed(compacto);
    const pts: number[] = [];
    for (let i = 0; i < celdas.length; i++)
      for (let j = i + 1; j < celdas.length; j++) {
        const dx = celdas[i][0] - celdas[j][0];
        const dy = celdas[i][1] - celdas[j][1];
        const dz = celdas[i][2] - celdas[j][2];
        if (Math.abs(Math.hypot(dx, dy, dz) - paso) < 0.01) pts.push(...celdas[i], ...celdas[j]);
      }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return g;
  }, [compacto]);
  useFrame(() => {
    if (mat.current) mat.current.opacity = suave(0.82, 0.98, entrada.p) * 0.5;
  });
  return (
    <lineSegments geometry={geo} frustumCulled={false}>
      <lineBasicMaterial ref={mat as never} color="#00e0a4" transparent opacity={0} depthWrite={false} />
    </lineSegments>
  );
}

/* ----------------------------------------------------------------- nucleo */

function Nucleo({ posicion, escala = 1 }: { posicion: [number, number, number]; escala?: number }) {
  const grupo = useRef<Group>(null);
  const aro1 = useRef<Group>(null);
  const aro2 = useRef<Group>(null);
  const geo = useMemo(() => new IcosahedronGeometry(1.25, 1), []);
  const aristas = useMemo(() => new EdgesGeometry(new IcosahedronGeometry(1.34, 1)), []);

  useFrame(({ clock }, dt) => {
    const g = grupo.current;
    if (!g) return;
    const t = clock.elapsedTime;
    // Reacciona al puntero y se acelera con el scroll.
    const impulso = 1 + Math.min(Math.abs(entrada.v) * 30, 6);
    g.rotation.y += dt * 0.22 * impulso;
    g.rotation.x = MathUtils.damp(g.rotation.x, Math.sin(t * 0.4) * 0.18 - entrada.my * 0.45, 3, dt);
    g.position.y = posicion[1] + Math.sin(t * 0.8) * 0.12;
    g.position.x = MathUtils.damp(g.position.x, posicion[0] + entrada.mx * 0.35, 3, dt);
    if (aro1.current) aro1.current.rotation.z += dt * 0.35 * impulso;
    if (aro2.current) aro2.current.rotation.y -= dt * 0.28 * impulso;
  });

  return (
    <group ref={grupo} position={posicion} scale={escala}>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#0a1b16" metalness={1} roughness={0.14} flatShading envMapIntensity={1.8} />
      </mesh>
      <lineSegments geometry={aristas}>
        <lineBasicMaterial color="#00e0a4" transparent opacity={0.85} />
      </lineSegments>
      <group ref={aro1} rotation={[1.25, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[2.1, 0.012, 6, 160]} />
          <meshBasicMaterial color="#8b6cff" />
        </mesh>
      </group>
      <group ref={aro2} rotation={[0.3, 0, 0.9]}>
        <mesh>
          <torusGeometry args={[2.55, 0.01, 6, 180]} />
          <meshBasicMaterial color="#bdf4ff" transparent opacity={0.55} />
        </mesh>
      </group>
    </group>
  );
}

/* --------------------------------------------------------- polvo estelar */

function Polvo({ cantidad }: { cantidad: number }) {
  const geo = useMemo(() => {
    const r = mulberry(23);
    const a = new Float32Array(cantidad * 3);
    for (let i = 0; i < cantidad; i++) {
      a[i * 3] = (r() - 0.5) * 34;
      a[i * 3 + 1] = (r() - 0.5) * 22;
      a[i * 3 + 2] = 9 - r() * (RECORRIDO + 24);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(a, 3));
    return g;
  }, [cantidad]);
  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial color="#bfeede" size={0.055} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

/* ------------------------------------------------------ camara y entrada */

function Camara() {
  const luz = useRef<PointLight>(null);
  const altoDoc = useRef(1);
  const suav = useRef(0);
  const fov = useRef(50);
  const { camera } = useThree();

  useEffect(() => {
    const medir = () => {
      altoDoc.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(document.body);
    window.addEventListener("resize", medir);
    const mover = (e: PointerEvent) => {
      entrada.mx = (e.clientX / window.innerWidth) * 2 - 1;
      entrada.my = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", medir);
      window.removeEventListener("pointermove", mover);
    };
  }, []);

  const suaveX = useRef(0);
  const suaveY = useRef(0);
  useFrame(({ clock }, dt) => {
    const objetivo = MathUtils.clamp(window.scrollY / altoDoc.current, 0, 1);
    const antes = suav.current;
    suav.current = MathUtils.damp(antes, objetivo, 4.5, dt);
    entrada.p = suav.current;
    entrada.v = dt > 0 ? (suav.current - antes) / dt : 0;

    const p = suav.current;
    const t = clock.elapsedTime;
    // Mouse suavizado (en tactil se queda en 0 y manda el vaiven propio).
    suaveX.current = MathUtils.damp(suaveX.current, entrada.mx, 3, dt);
    suaveY.current = MathUtils.damp(suaveY.current, entrada.my, 3, dt);

    const cam = camera as PerspectiveCamera;
    const sx = Math.sin(p * Math.PI * 2.2) * 1.1 + Math.sin(t * 0.3) * 0.12;
    const sy = Math.cos(p * Math.PI * 1.7) * 0.5 + Math.cos(t * 0.25) * 0.08;
    cam.position.set(sx + suaveX.current * 0.55, sy + suaveY.current * 0.35, 8 - p * RECORRIDO);
    cam.lookAt(sx * 0.35 + suaveX.current * 1.3, sy * 0.35 + suaveY.current * 0.8, cam.position.z - 12);

    // "Salto" de campo de vision con la velocidad del scroll.
    const objFov = 50 + Math.min(Math.abs(entrada.v) * 34, 9);
    fov.current = MathUtils.damp(fov.current, objFov, 6, dt);
    if (Math.abs(cam.fov - fov.current) > 0.02) {
      cam.fov = fov.current;
      cam.updateProjectionMatrix();
    }
    if (luz.current) luz.current.position.set(cam.position.x + 3, cam.position.y + 3, cam.position.z + 2);
  });

  return <pointLight ref={luz} intensity={55} color="#8b6cff" distance={26} decay={2} />;
}

/* ------------------------------------------------------------- composicion */

export default function Scene3D() {
  const [nivel, setNivel] = useState(0);
  const [compacto, setCompacto] = useState<boolean | null>(null);

  useEffect(() => {
    setCompacto(window.innerWidth / window.innerHeight < 0.95);
  }, []);

  const dprMax = Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 2);
  // Si el equipo se queda corto de cuadros, baja la resolucion interna y quita lo accesorio.
  const dpr = Math.max(1, nivel === 0 ? dprMax : nivel === 1 ? Math.min(dprMax, 1.5) : 1);

  if (compacto === null) return null;
  const heroPos: [number, number, number] = compacto ? [0, 1.8, 0] : [3.2, 0.1, 0];

  return (
    <div
      className="vt-canvas"
      aria-hidden="true"
    >
      <Canvas
        dpr={dpr}
        camera={{ fov: 50, near: 0.1, far: 90, position: [0, 0, 8] }}
        gl={{ antialias: dprMax < 2, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          const root = document.documentElement;
          root.classList.add("vt-3d");
          // Si el navegador pierde el contexto, vuelve el cartel estatico.
          gl.domElement.addEventListener("webglcontextlost", () => root.classList.remove("vt-3d"));
        }}
      >
        <PerformanceMonitor onDecline={() => setNivel((n) => Math.min(2, n + 1))} flipflops={3} />
        <fog attach="fog" args={["#06070a", 10, 42]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} color="#d6fff1" />
        <Suspense fallback={null}>
          <Environment resolution={64} frames={1}>
            <Lightformer form="rect" intensity={5} color="#00e0a4" position={[-6, 3, -2]} scale={[9, 3, 1]} />
            <Lightformer form="rect" intensity={4} color="#8b6cff" position={[6, -2, -3]} scale={[9, 4, 1]} />
            <Lightformer form="ring" intensity={3} color="#ffffff" position={[0, 6, 3]} scale={5} />
            <Lightformer form="rect" intensity={2} color="#bdf4ff" position={[0, -5, 4]} scale={[10, 2, 1]} />
          </Environment>
        </Suspense>
        <Camara />
        <Fragmentos compacto={compacto} />
        <Red compacto={compacto} />
        <Nucleo posicion={heroPos} escala={compacto ? 0.8 : 1.25} />
        <Nucleo posicion={[0, 0, CENTRO_Z]} escala={compacto ? 0.55 : 0.95} />
        {nivel < 2 && <Polvo cantidad={compacto ? 260 : 520} />}
      </Canvas>
    </div>
  );
}
