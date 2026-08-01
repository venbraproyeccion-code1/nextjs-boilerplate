"use client";

import { useEffect, useState } from "react";

const C = {
  black: "#0a0a0a",
  accent: "#c5a455",
  white: "#f8f8f8",
  gray: "#8b8b8b",
  border: "rgba(197,164,85,0.25)",
};

const STORAGE_KEY = "venbratech_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const decide = (value: "accepted" | "rejected") => {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.localStorage.setItem(`${STORAGE_KEY}_date`, new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentimiento de cookies"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(10,10,10,0.98)",
        borderTop: `1px solid ${C.border}`,
        padding: "20px 5%",
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: C.gray,
          maxWidth: 640,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Usamos cookies esenciales para el funcionamiento del sitio y cookies de análisis anónimas para mejorar tu experiencia.
        No usamos cookies de publicidad comportamental de terceros. Puedes aceptar o rechazar las cookies no esenciales.
        Más información en nuestra{" "}
        <a href="/privacidad" style={{ color: C.accent, textDecoration: "underline" }}>
          Política de Privacidad
        </a>
        .
      </p>
      <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
        <button
          onClick={() => decide("rejected")}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: C.white,
            background: "transparent",
            border: `1px solid ${C.border}`,
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Rechazar
        </button>
        <button
          onClick={() => decide("accepted")}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontWeight: 600,
            color: C.black,
            background: C.accent,
            border: "none",
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
