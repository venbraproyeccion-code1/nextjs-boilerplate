import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
