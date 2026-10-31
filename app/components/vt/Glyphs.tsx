/**
 * Glifos vectoriales abstractos de las seis capacidades. Dibujados a mano,
 * sin referencias a marcas ajenas; nitidos a cualquier tamano.
 */
const base = {
  viewBox: "0 0 120 120",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  className: "vt-glyph",
};

export function GlifoSoftware() {
  return (
    <svg {...base}>
      <rect x="12" y="20" width="96" height="74" rx="10" />
      <path d="M12 38h96" opacity=".5" />
      <circle cx="24" cy="29" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="33" cy="29" r="2.2" fill="currentColor" stroke="none" opacity=".6" />
      <path d="M46 56 34 66l12 10M74 56l12 10-12 10" />
      <path d="M64 52 56 80" className="pulse" />
      <path d="M30 104h60" opacity=".35" />
    </svg>
  );
}

export function GlifoIA() {
  const col = [
    [24, [34, 60, 86]],
    [60, [24, 47, 73, 96]],
    [96, [42, 78]],
  ] as const;
  return (
    <svg {...base} strokeWidth={1.6}>
      <g opacity=".45">
        {col[0][1].map((a) =>
          col[1][1].map((b) => <path key={`${a}-${b}`} d={`M24 ${a}L60 ${b}`} />)
        )}
        {col[1][1].map((a) =>
          col[2][1].map((b) => <path key={`${a}-${b}`} d={`M60 ${a}L96 ${b}`} />)
        )}
      </g>
      {col.map(([x, ys]) =>
        ys.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5.5" fill="#06070a" className="pulse" />)
      )}
    </svg>
  );
}

export function GlifoAutomatizacion() {
  return (
    <svg {...base}>
      <g className="spin">
        <path d="M95 52a36 36 0 0 0-64-14" />
        <path d="M31 38l-2-16M31 38l16 0" />
        <path d="M25 68a36 36 0 0 0 64 14" />
        <path d="M89 82l2 16M89 82l-16 0" />
      </g>
      <circle cx="60" cy="60" r="9" />
      <circle cx="60" cy="60" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GlifoDatos() {
  return (
    <svg {...base}>
      <ellipse cx="60" cy="30" rx="38" ry="12" />
      <path d="M22 30v24c0 6.6 17 12 38 12s38-5.4 38-12V30" />
      <path d="M22 54v24c0 6.6 17 12 38 12s38-5.4 38-12V54" />
      <path d="M22 78v14c0 6.6 17 12 38 12s38-5.4 38-12V78" opacity=".5" />
      <circle cx="84" cy="48" r="2" fill="currentColor" stroke="none" className="pulse" />
      <circle cx="84" cy="72" r="2" fill="currentColor" stroke="none" className="pulse" />
    </svg>
  );
}

export function GlifoInteractivo() {
  return (
    <svg {...base}>
      <path d="M34 40h52c12 0 20 10 22 28l2 14c1 8-8 12-14 6L84 78H36l-12 10c-6 6-15 2-14-6l2-14c2-18 10-28 22-28z" />
      <path d="M42 52v14M35 59h14" />
      <circle cx="80" cy="54" r="3" />
      <circle cx="90" cy="64" r="3" className="pulse" />
      <path d="M44 28c4-8 28-8 32 0" opacity=".5" />
    </svg>
  );
}

export function GlifoAudiovisual() {
  return (
    <svg {...base}>
      <circle cx="60" cy="60" r="40" />
      <g className="spin2">
        <circle cx="60" cy="60" r="28" strokeDasharray="4 7" opacity=".6" />
      </g>
      <path d="M51 44l30 16-30 16z" fill="currentColor" fillOpacity=".15" />
      <path d="M20 60h8M92 60h8M60 20v8M60 92v8" opacity=".5" />
    </svg>
  );
}
