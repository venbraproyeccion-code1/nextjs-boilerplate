import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Imagenes: AVIF primero y WebP de respaldo, con tamanos responsivos.
  // (next/image sirve el formato que el navegador acepta y el ancho justo.)
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [96, 160, 256, 384, 512],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    // three y drei exportan cientos de simbolos: importa solo los usados.
    optimizePackageImports: ["@react-three/drei", "three"],
  },
  async redirects() {
    return [
      {
        // /productos.html era de la etapa de educacion financiera: sin enlaces
        // entrantes y con un posicionamiento que ya no corresponde. Se retira
        // del sitio, pero se redirige en vez de dejarlo en 404 para que
        // cualquier enlace viejo o resultado de Google caiga en la portada.
        source: "/productos.html",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
