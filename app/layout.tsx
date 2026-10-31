import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";

// Geist se conserva: lo usan /industrial, /hub-legal, /audit y /enterprise-audit.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Titulos cineticos de la portada. Geist (arriba) hace de texto corrido y
// Geist Mono de etiquetas: una sola familia menos que antes, menos bytes.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const SITIO = "https://venbratech.com";

export const viewport: Viewport = {
  themeColor: "#06070a",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default:
      "VenBraTech — Desarrollo de software, IA y automatización empresarial",
    template: "%s · VenBraTech",
  },
  description:
    "División tecnológica del ecosistema VenBraX. Desarrollo de software y web, inteligencia artificial, automatización de procesos, bases de datos e ingeniería de sistemas para empresas.",
  keywords: [
    "desarrollo de software",
    "desarrollo web",
    "inteligencia artificial",
    "automatización empresarial",
    "integraciones y APIs",
    "bases de datos",
    "ingeniería de software",
    "desarrollo de videojuegos",
    "tecnología para empresas",
    "soluciones digitales",
  ],
  alternates: { canonical: SITIO },
  openGraph: {
    type: "website",
    url: SITIO,
    siteName: "VenBraTech",
    locale: "es_LA",
    title: "VenBraTech — La división tecnológica de VenBraX",
    description:
      "Software, inteligencia artificial, automatización, datos e ingeniería para construir soluciones digitales reales.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VenBraTech — La división tecnológica de VenBraX",
    description: "Software, IA, automatización, datos e ingeniería para empresas.",
  },
  robots: { index: true, follow: true },
};

/** Datos estructurados: describen a VenBraTech como organizacion tecnologica,
 *  no como plataforma financiera. Solo hechos confirmados. */
const JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VenBraTech",
  url: SITIO,
  description:
    "División tecnológica del ecosistema VenBraX. Desarrollo de software, inteligencia artificial, automatización, datos e ingeniería.",
  parentOrganization: { "@type": "Organization", name: "VenBraX" },
  email: "hola@venbratech.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <head>
        {/* Verificacion de Impact.com (programa de afiliados Nexo). No tocar. */}
        <meta
          name="impact-site-verification"
          // eslint-disable-next-line react/no-unknown-property
          {...({ value: "185ca6ea-9d54-4a01-a0c4-8d61cbb3d0b7" } as unknown as React.MetaHTMLAttributes<HTMLMetaElement>)}
        />
        {/* Verificacion de dominio en Meta Business (VENBRAX CONNECT). No tocar. */}
        <meta
          name="facebook-domain-verification"
          content="slk9qzi5anvtlhnhy0msa0auvzjsqn"
        />
        {/* Marca la presencia de JavaScript antes del primer pintado: si no
            corre, .js nunca se anade y el CSS deja el contenido visible. */}
        <script
          dangerouslySetInnerHTML={{
            // .js: el CSS puede preparar las animaciones de entrada.
            // Red de seguridad: si el script de animacion no llega en 6 s,
            // .vt-sin-anim deja todo el contenido visible.
            __html:
              "var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('vt-ready'))d.classList.add('vt-sin-anim')},6000)",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
