// Gate minimo para /admin/connect: un solo operador (Alfonso) por ahora, no
// una tabla de usuarios completa. Cookie firmada con expiracion, nunca la
// contraseña en texto plano en el navegador.
//
// Usa Web Crypto (`crypto.subtle`, global en Node y en Edge) en vez del
// modulo `crypto` de Node -- el middleware de Next.js corre en Edge Runtime,
// que NO soporta el modulo `crypto` de Node (confirmado con `next build`:
// "A Node.js module is loaded ('crypto') which is not supported in the
// Edge Runtime"). Web Crypto es la unica API que funciona igual en los dos.

const COOKIE_NAME = "vc_admin";
const SESSION_HOURS = 12;

function secret(): string {
  const s = process.env.VENBRAX_ADMIN_SECRET;
  if (!s) throw new Error("VENBRAX_ADMIN_SECRET no configurado");
  return s;
}

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toBase64Url(sig);
}

async function digestHex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkAdminPassword(password: string): Promise<boolean> {
  const expected = process.env.VENBRAX_ADMIN_SECRET;
  if (!expected) return false;
  // Comparar hashes SHA-256 en vez del valor crudo: mismo efecto que una
  // comparacion en tiempo constante, sin depender de `timingSafeEqual`
  // (modulo `crypto` de Node, no disponible en Edge Runtime).
  const [a, b] = await Promise.all([digestHex(password), digestHex(expected)]);
  return a === b;
}

export async function issueSessionCookieValue(): Promise<string> {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `${expires}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function isValidSessionCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return false;
  const expected = await hmac(payload);
  if (sig !== expected) return false;
  return Number(payload) > Date.now();
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
