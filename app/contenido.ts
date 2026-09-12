/**
 * Contenido de la home de VenBraTech.
 *
 * Vive separado de la vista para que agregar un proyecto, una unidad del
 * ecosistema o una capacidad sea editar una lista, no tocar el JSX.
 *
 * REGLA DEL PROYECTO: aqui no se inventa nada. Sin clientes, certificaciones,
 * premios, estadisticas, cantidad de proyectos, testimonios, socios ni cifras
 * que no esten confirmados. Lo que falte se marca con `pendiente: true` y se
 * muestra como tal.
 */

export type Capacidad = { n: string; titulo: string; texto: string };

/** Seccion 2 — Que hacemos. */
export const CAPACIDADES: Capacidad[] = [
  {
    n: "01",
    titulo: "Software",
    texto:
      "Desarrollo de plataformas, aplicaciones y sistemas empresariales a la medida del proceso real de cada negocio.",
  },
  {
    n: "02",
    titulo: "Inteligencia artificial",
    texto:
      "Integración de IA, agentes, procesamiento inteligente de información y soluciones automatizadas.",
  },
  {
    n: "03",
    titulo: "Automatización",
    texto:
      "Automatización de procesos empresariales, integraciones, APIs, CRM, WhatsApp y flujos digitales.",
  },
  {
    n: "04",
    titulo: "Datos e infraestructura",
    texto:
      "Bases de datos, arquitectura, integraciones y sistemas de información que sostienen la operación.",
  },
  {
    n: "05",
    titulo: "Desarrollo interactivo",
    texto: "Videojuegos y experiencias digitales.",
  },
  {
    n: "06",
    titulo: "Soluciones audiovisuales tecnológicas",
    texto:
      "Tecnología aplicada a la producción audiovisual: flujos de trabajo, equipamiento y herramientas digitales.",
  },
];

/** Seccion 3 — Tecnologia para empresas. */
export const PARA_EMPRESAS: string[] = [
  "Automatización de procesos",
  "Sistemas internos",
  "Plataformas web",
  "CRM",
  "Chatbots",
  "Inteligencia artificial",
  "Bases de datos",
  "Integraciones",
  "Digitalización de procesos",
  "Herramientas personalizadas",
];

/** Seccion 4 — Tecnologia que conecta el ecosistema. */
export const TECNOLOGIA_ECOSISTEMA = [
  { area: "Legal", texto: "Tecnología y digitalización documental." },
  { area: "Inmobiliario", texto: "Herramientas digitales y automatización de procesos." },
  { area: "Contabilidad", texto: "Sistemas, automatización y gestión de información." },
  { area: "Audiovisual", texto: "Tecnología, producción y herramientas digitales." },
  { area: "Ingeniería", texto: "Software, bases de datos e infraestructura." },
];

export type Unidad = {
  nombre: string;
  bajada: string;
  texto: string;
  enlace?: string;
  pendiente?: boolean;
};

/** Seccion 5 — Ecosistema VenBraX. Cada unidad conserva su especializacion. */
export const UNIDADES: Unidad[] = [
  {
    nombre: "VenBraTech",
    bajada: "Tecnología e innovación",
    texto:
      "División tecnológica del ecosistema: software, IA, automatización, datos e ingeniería.",
  },
  {
    nombre: "Denise Vargas",
    bajada: "Servicios jurídicos",
    texto: "Derecho inmobiliario, mercantil y corporativo. Caracas, Venezuela.",
    enlace: "https://vargas-juridicas.pages.dev",
  },
  {
    nombre: "Juan Rodríguez",
    bajada: "Documentación y servicios jurídicos",
    texto:
      "Documentación digital y servicios jurídicos especializados, incluida documentación de litigio y bienes raíces. Valencia, Venezuela.",
    enlace: "https://juan-rodriguez-abogado.pages.dev",
  },
  {
    nombre: "Área contable",
    bajada: "Servicios contables y financieros",
    texto: "Unidad en incorporación al ecosistema.",
    pendiente: true,
  },
  {
    nombre: "Área audiovisual",
    bajada: "Producción y equipamiento",
    texto:
      "Producción audiovisual y tecnología para producción: cámaras, drones, trípodes, iluminación y audio.",
    pendiente: true,
  },
  {
    nombre: "Ingeniería",
    bajada: "Sistemas, datos y desarrollo",
    texto:
      "Ingeniería de software, bases de datos, infraestructura y desarrollo de videojuegos.",
  },
  {
    nombre: "Capri — Morón",
    bajada: "Punto físico / operativo",
    texto:
      "Dos locales en el Centro Comercial Capri, Morón, estado Carabobo, destinados a actividades de negocios digitales, tecnología y producción audiovisual.",
    pendiente: true,
  },
];

export type Proyecto = {
  nombre: string;
  descripcion: string;
  tecnologia: string;
  problema: string;
  resultado: string;
  enlace?: string;
};

/**
 * Seccion 6 — Proyectos.
 * Solo trabajos entregados y publicados. Para agregar uno nuevo basta con
 * anadir un objeto a esta lista.
 */
export const PROYECTOS: Proyecto[] = [
  {
    nombre: "YOOL Coffee and Tea",
    descripcion:
      "Sitio de una cafetería en Arauca, Colombia, con carta completa, galería de productos y pedido directo por WhatsApp.",
    tecnologia: "HTML, CSS y JavaScript · Cloudflare Pages",
    problema:
      "El negocio solo existía en redes sociales: los clientes no encontraban la carta ni los precios sin preguntar.",
    resultado:
      "Carta por categorías con precios, fotografía real de cada producto y pedido en un toque, sin costo mensual de hosting.",
    enlace: "https://yool-coffee-tea.pages.dev",
  },
  {
    nombre: "DV Asesoras Jurídicas",
    descripcion:
      "Sitio profesional para una abogada de derecho inmobiliario, mercantil y corporativo en Caracas.",
    tecnologia: "HTML, CSS y JavaScript · Cloudflare Pages",
    problema:
      "No existía un punto de contacto propio que transmitiera formalidad ni permitiera agendar consultas.",
    resultado:
      "Identidad y monograma propios, presentación de servicios y agenda de consultas directa por WhatsApp.",
    enlace: "https://vargas-juridicas.pages.dev",
  },
  {
    nombre: "Juan R. Rodríguez, Abogado",
    descripcion:
      "Sitio de un abogado independiente con perfil híbrido: redacción de instrumentos inmobiliarios y defensa penal y civil.",
    tecnologia: "HTML, CSS, JavaScript y SVG animado · Cloudflare Pages",
    problema:
      "Necesitaba presentar dos áreas de práctica distintas sin que una opacara a la otra, y firmar documentos digitalmente.",
    resultado:
      "Identidad propia con logo animado, separación clara de áreas y visado digital integrado en su plantilla de documentos.",
    enlace: "https://juan-rodriguez-abogado.pages.dev",
  },
  {
    nombre: "Clara Rivero Micropigmentación",
    descripcion:
      "Sitio de una especialista en micropigmentación con 32 años de trayectoria, en Valencia, estado Carabobo.",
    tecnologia: "HTML, CSS y JavaScript · Cloudflare Pages",
    problema:
      "Su trabajo solo se veía en Instagram: no había un sitio propio que contara su trayectoria ni mostrara los resultados reales de forma ordenada.",
    resultado:
      "Historia de marca con línea de tiempo de 7 hitos, catálogo de servicios y galería de trabajos reales, con cita directa por WhatsApp.",
    enlace: "https://clara-rivero.pages.dev",
  },
];

/** Seccion 7 — Red de colaboradores. */
export const COLABORADORES = [
  {
    n: "01",
    titulo: "Embajadores VenBraX",
    texto:
      "Personas que recomiendan servicios del ecosistema. La remuneración, cuando corresponda, está vinculada a resultados reales y a condiciones definidas por escrito antes de empezar.",
  },
  {
    n: "02",
    titulo: "Aliados profesionales",
    texto:
      "Abogados, contadores, desarrolladores, agentes inmobiliarios, ingenieros, especialistas audiovisuales, consultores y empresas que colaboran o derivan oportunidades.",
  },
  {
    n: "03",
    titulo: "Aliados de contenido",
    texto:
      "Creadores y profesionales que producen contenido sobre tecnología, IA, automatización, negocios, legal, inmobiliario, contabilidad o audiovisual.",
  },
];

/** Arquitectura de marca — seccion 8 del brief. */
export const ARQUITECTURA = [
  ["VenBraX", "Ecosistema empresarial"],
  ["VenBraTech", "División tecnológica"],
  ["Denise Vargas", "Servicios jurídicos"],
  ["Juan Rodríguez", "Documentación / servicios jurídicos"],
  ["Contabilidad", "Servicios contables"],
  ["Audiovisual", "Producción y tecnología audiovisual"],
  ["Ingeniería", "Sistemas / datos / desarrollo"],
  ["VenBraX Academy", "Formación"],
  ["Red de colaboradores", "Crecimiento y alianzas"],
  ["Capri — Morón", "Punto físico / operativo"],
];

export const CONTACTO = {
  correo: "hola@venbratech.com",
  whatsapp: "+55 92 98152-5326",
  whatsappUrl:
    "https://wa.me/5592981525326?text=Hola%20VenBraTech%2C%20quiero%20desarrollar%20un%20proyecto.",
};
