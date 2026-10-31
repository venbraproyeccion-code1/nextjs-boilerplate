import "./vt.css";
import Enhancer from "./components/vt/Enhancer";
import Nav from "./components/vt/Nav";
import Poster from "./components/vt/Poster";
import SceneLoader from "./components/vt/SceneLoader";
import Hero from "./components/vt/Hero";
import Marquesinas from "./components/vt/Marquesinas";
import Soluciones from "./components/vt/Soluciones";
import Empresas from "./components/vt/Empresas";
import { TecnologiaEcosistema, Unidades } from "./components/vt/Ecosistema";
import Proyectos from "./components/vt/Proyectos";
import Colaboradores from "./components/vt/Colaboradores";
import { AcademiaCapri, Contacto } from "./components/vt/Cierre";
import Pie from "./components/vt/Pie";

/**
 * Portada de VenBraTech — rediseno visual 2026-11.
 * Server Component: todo el HTML llega completo; el movimiento (Enhancer) y el
 * 3D (SceneLoader) se cargan aparte y de forma diferida. El contenido real
 * vive en ./contenido.ts.
 */
export default function Home() {
  return (
    <div className="vt">
      <a className="vt-skip" href="#contenido">
        Saltar al contenido
      </a>
      <div className="vt-world" aria-hidden="true">
        <Poster />
        <SceneLoader />
      </div>
      <div className="vt-grain" aria-hidden="true" />
      <div className="vt-bar" aria-hidden="true" />
      <Nav />
      <div className="vt-main">
        <main id="contenido">
          <Hero />
          <Marquesinas />
          <Soluciones />
          <Empresas />
          <TecnologiaEcosistema />
          <Proyectos />
          <Unidades />
          <Colaboradores />
          <AcademiaCapri />
          <Contacto />
        </main>
        <Pie />
      </div>
      <Enhancer />
    </div>
  );
}
