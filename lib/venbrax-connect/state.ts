// Firma el parametro `state` del roundtrip OAuth para que nadie pueda
// falsificar a que client_id se le asigna una conexion interceptando la
// redireccion. HMAC, no cifrado -- el contenido no es secreto, solo debe
// ser imposible de alterar sin la clave del servidor.
import { createHmac, timingSafeEqual } from "crypto";

interface StatePayload {
  clientId: string;
  platform: string;
  onboardingToken: string;
  shop?: string;
  nonce: string;
}

function secret(): string {
  const s = process.env.VENBRAX_CONNECT_STATE_SECRET;
  if (!s) throw new Error("VENBRAX_CONNECT_STATE_SECRET no configurado");
  return s;
}

export function signState(payload: StatePayload): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString("base64url");
  const sig = createHmac("sha256", secret()).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

export function verifyState(state: string): StatePayload {
  const [b64, sig] = state.split(".");
  if (!b64 || !sig) throw new Error("state con formato invalido");
  const expected = createHmac("sha256", secret()).update(b64).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error("state con firma invalida -- posible manipulacion");
  }
  return JSON.parse(Buffer.from(b64, "base64url").toString("utf8")) as StatePayload;
}
