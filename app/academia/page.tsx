"use client";
import { useEffect, useState } from "react";

export default function Academia() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, background: "#0a0a0a", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {!loaded && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: "100vh", background: "#0a0a0a", color: "#c5a455",
          fontFamily: "DM Sans, sans-serif", fontSize: 18
        }}>
          Cargando Academia VenBraX...
        </div>
      )}
      <iframe
        src="/academia.html"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          display: loaded ? "block" : "none",
          background: "#0a0a0a"
        }}
        title="VenBraX Academia Digital"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
