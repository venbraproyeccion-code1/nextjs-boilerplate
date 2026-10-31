/**
 * Cartel estatico: lo primero que se ve y lo unico que ve un equipo sin
 * 3D (movimiento reducido, ahorro de datos, poca potencia, sin WebGL).
 * Vectores puros: nitido a cualquier resolucion, cero imagenes.
 */

type Cubo = { x: number; y: number; s: number; o: number };

/** Cubo isometrico como tres rombos (cara superior, izquierda, derecha). */
function Cubo({ x, y, s, o }: Cubo) {
  const w = s * 0.866;
  const top = `${x},${y - s} ${x + w},${y - s / 2} ${x},${y} ${x - w},${y - s / 2}`;
  const left = `${x - w},${y - s / 2} ${x},${y} ${x},${y + s} ${x - w},${y + s / 2}`;
  const right = `${x + w},${y - s / 2} ${x},${y} ${x},${y + s} ${x + w},${y + s / 2}`;
  return (
    <g opacity={o} strokeLinejoin="round">
      <polygon points={top} fill="url(#vt-top)" stroke="#00e0a4" strokeOpacity=".75" strokeWidth="1.2" />
      <polygon points={left} fill="url(#vt-izq)" stroke="#00e0a4" strokeOpacity=".4" strokeWidth="1.2" />
      <polygon points={right} fill="url(#vt-der)" stroke="#8b6cff" strokeOpacity=".5" strokeWidth="1.2" />
    </g>
  );
}

const CUBOS: Cubo[] = [
  { x: 500, y: 430, s: 150, o: 1 },
  { x: 703, y: 312, s: 62, o: 0.9 },
  { x: 288, y: 288, s: 48, o: 0.75 },
  { x: 770, y: 600, s: 40, o: 0.7 },
  { x: 215, y: 620, s: 66, o: 0.85 },
  { x: 560, y: 780, s: 34, o: 0.6 },
  { x: 380, y: 150, s: 30, o: 0.55 },
  { x: 850, y: 440, s: 24, o: 0.5 },
];

export default function Poster() {
  return (
    <div className="vt-poster" aria-hidden="true">
      <div className="vt-poster-glow a" />
      <div className="vt-poster-glow b" />
      <svg className="vt-poster-svg" viewBox="0 0 1000 920" fill="none" focusable="false">
        <defs>
          <linearGradient id="vt-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00e0a4" stopOpacity=".5" />
            <stop offset="1" stopColor="#8b6cff" stopOpacity=".18" />
          </linearGradient>
          <linearGradient id="vt-izq" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0b2a24" />
            <stop offset="1" stopColor="#06100f" />
          </linearGradient>
          <linearGradient id="vt-der" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#15123a" />
            <stop offset="1" stopColor="#07080f" />
          </linearGradient>
        </defs>
        <ellipse cx="500" cy="500" rx="430" ry="150" stroke="#00e0a4" strokeOpacity=".22" strokeDasharray="3 9" />
        <ellipse cx="500" cy="500" rx="330" ry="360" stroke="#8b6cff" strokeOpacity=".2" strokeDasharray="2 12" />
        {CUBOS.map((c, i) => (
          <Cubo key={i} {...c} />
        ))}
      </svg>
    </div>
  );
}
