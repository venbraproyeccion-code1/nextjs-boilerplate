const SITIO: [string, string][] = [
  ["Soluciones", "#soluciones"],
  ["Proyectos", "#proyectos"],
  ["Ecosistema", "#ecosistema"],
  ["Colaboradores", "#colaboradores"],
  ["Academia", "/academia"],
  ["Contacto", "#contacto"],
];

export default function Pie() {
  return (
    <footer className="vt-foot">
      <div className="vt-wrap">
        <span className="vt-wordmark" aria-hidden="true" data-parallax="0.05">
          VenBra<b>Tech</b>
        </span>
        <div className="vt-foot-grid">
          <div style={{ maxWidth: 340 }}>
            <p className="vt-logo" style={{ fontSize: "1.2rem" }}>
              VenBra<b>Tech</b>
            </p>
            <p style={{ marginTop: ".8rem", color: "var(--mute)", fontSize: ".92rem", lineHeight: 1.6 }}>
              División tecnológica del ecosistema VenBraX. Software, inteligencia artificial,
              automatización, datos e ingeniería.
            </p>
          </div>
          <nav aria-label="Pie" style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
            <div>
              <h4>Sitio</h4>
              {SITIO.map(([n, h]) => (
                <a key={h} href={h}>
                  {n}
                </a>
              ))}
            </div>
            <div>
              <h4>Legal</h4>
              <a href="/privacidad">Privacidad</a>
              <a href="/terminos">Términos</a>
            </div>
          </nav>
        </div>
        <div className="vt-legal">
          <p>© 2026 VenBraTech · Unidad del ecosistema VenBraX</p>
          <p style={{ marginTop: ".5rem" }}>
            VenBra Tech es el nombre comercial bajo el cual opera Alfonso Enrique Grammatica Rivero,
            persona física con domicilio en Brasil.
          </p>
        </div>
      </div>
    </footer>
  );
}
