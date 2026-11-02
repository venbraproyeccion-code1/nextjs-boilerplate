import Hero from "./components/Hero";
import {
  Colaboradores,
  Contacto,
  EcosistemaTech,
  EcosistemaVenbrax,
  Empresas,
  Pie,
  Proyectos,
  Secundarias,
  Soluciones,
} from "./components/Secciones";
import { ProgresoScroll } from "./components/ui";

const NAV = [
  ["Inicio", "#inicio"],
  ["Soluciones", "#soluciones"],
  ["Proyectos", "#proyectos"],
  ["Ecosistema", "#ecosistema"],
  ["Colaboradores", "#colaboradores"],
  ["Academia", "/academia"],
  ["Contacto", "#contacto"],
];

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col bg-[#0a0b0d] text-[#f1eee6]"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <ProgresoScroll />

      {/* ---------------------------------------------------------- NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07070a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[66px] w-full max-w-[1280px] items-center justify-between px-6">
          <a href="#inicio" aria-label="VenBraTech, inicio" className="flex items-center">
            <img
              src="/brand/nombre.webp"
              alt="VenBraTech"
              width={900}
              height={160}
              className="h-[21px] w-auto sm:h-[26px]"
            />
          </a>
          <div className="hidden items-center gap-8 lg:flex">
            {NAV.slice(1, -1).map(([n, h]) => (
              <a
                key={h}
                href={h}
                className="text-[0.9rem] text-[#a8a498] transition-colors hover:text-[#f1eee6]"
              >
                {n}
              </a>
            ))}
          </div>
          <a
            href="#contacto"
            className="rounded-xl bg-[#e8b93f] px-3.5 py-2.5 text-[0.8rem] font-semibold text-[#17120a] transition-colors hover:bg-[#f6dc86] sm:px-5 sm:text-[0.9rem]"
          >
            Hablar con VenBraTech
          </a>
        </div>
      </nav>

      <main>
        <Hero />
        <Soluciones />
        <Empresas />
        <EcosistemaTech />
        <Proyectos />
        <EcosistemaVenbrax />
        <Colaboradores />
        <Secundarias />
        <Contacto />
      </main>

      <Pie nav={NAV} />
    </div>
  );
}
