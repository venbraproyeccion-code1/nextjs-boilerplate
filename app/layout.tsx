import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Space_Grotesk,
  Inter,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";

// Geist se conserva: lo usan /industrial, /hub-legal, /audit y /enterprise-audit.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Tipografias de la identidad VenBraTech, para la portada.
const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITIO = "https://venbratech.com";

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
      className={`${geistSans.variable} ${geistMono.variable} ${space.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        {/* Verificacion de Impact.com (programa de afiliados Nexo). No tocar. */}
        <meta
          name="impact-site-verification"
          // eslint-disable-next-line react/no-unknown-property
          {...({ value: "185ca6ea-9d54-4a01-a0c4-8d61cbb3d0b7" } as unknown as React.MetaHTMLAttributes<HTMLMetaElement>)}
        />
        {/* Marca la presencia de JavaScript antes del primer pintado: si no
            corre, .js nunca se anade y el CSS deja el contenido visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
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
