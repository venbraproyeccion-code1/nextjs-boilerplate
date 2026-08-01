export default function Terminos() {
  const C = {black:"#0a0a0a",dark:"#0d1117",accent:"#c5a455",white:"#f8f8f8",gray:"#8b8b8b",lgray:"#c4c4c4",border:"rgba(197,164,85,0.15)"};
  const s = [
    {t:"1. Aceptación de los Términos",c:"Al acceder y utilizar venbratech.com, usted acepta quedar vinculado por estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio. El uso continuado de la plataforma constituye su aceptación de cualquier modificación."},
    {t:"2. Descripción del Servicio",c:"VenBra Tech opera exclusivamente como plataforma de referidos y educación financiera. Referimos usuarios a plataformas de inversión y activos digitales reguladas de terceros (eToro, Arrived Homes, Fundrise, Nexo). No somos asesores de inversión registrados, corredores de bolsa, ni planificadores financieros. No gestionamos fondos ni ejecutamos transacciones en nombre de los usuarios."},
    {t:"3. Integración con la API de TikTok",c:"Nuestros servicios incluyen la publicación automatizada de contenido educativo en TikTok a través de la API oficial de TikTok for Developers. Al autorizar nuestra aplicación, nos otorga permiso para publicar videos usando únicamente los scopes: user.info.basic, video.publish y video.upload. Puede revocar este acceso en cualquier momento desde Configuración > Privacidad de su cuenta TikTok."},
    {t:"4. Sin Asesoramiento de Inversión",c:"Todo el contenido publicado es únicamente con fines informativos y educativos. No constituye asesoramiento financiero, de inversión, legal o fiscal. Todas las inversiones conllevan riesgo, incluyendo la pérdida potencial del capital invertido. Los rendimientos pasados no garantizan resultados futuros. Consulte siempre a un asesor financiero registrado antes de tomar decisiones de inversión."},
    {t:"5. Responsabilidades del Usuario",c:"Usted es responsable de mantener la confidencialidad de sus credenciales de acceso. Acepta no utilizar la plataforma para actividades ilegales, fraudulentas o que violen derechos de terceros. VenBra Tech se reserva el derecho de suspender cuentas que violen estos términos sin previo aviso."},
    {t:"6. Propiedad Intelectual",c:"Todo el contenido de venbratech.com, incluyendo textos, gráficos, logotipos e imágenes, es propiedad de VenBra Tech o sus licenciantes y está protegido por leyes de propiedad intelectual. Queda prohibida su reproducción o distribución sin autorización expresa por escrito."},
    {t:"7. Limitación de Responsabilidad",c:"VenBra Tech no será responsable de daños directos, indirectos o consecuentes derivados del uso de la plataforma, incluyendo pérdidas financieras por decisiones de inversión basadas en nuestro contenido educativo."},
    {t:"8. Modificaciones",c:"VenBra Tech puede actualizar estos términos periódicamente. Los cambios significativos serán notificados publicando los nuevos términos en esta página con una fecha de actualización revisada."},
    {t:"9. Elegibilidad y Restricciones Geográficas",c:"Los servicios de inversión y activos digitales referidos por VenBra Tech (eToro, Arrived Homes, Fundrise, Nexo) pueden estar restringidos o prohibidos en su país de residencia. Es responsabilidad exclusiva del usuario verificar que el uso de estas plataformas es legal en su jurisdicción antes de registrarse. VenBra Tech no solicita activamente usuarios en jurisdicciones donde estos servicios estén prohibidos y se reserva el derecho de restringir el acceso a residentes de dichas jurisdicciones."},
    {t:"10. Resolución de Disputas y Arbitraje",c:"Cualquier disputa derivada del uso de esta plataforma será resuelta, en la mayor medida permitida por la ley aplicable, mediante arbitraje vinculante e individual, renunciando ambas partes a participar en demandas colectivas o de clase. Esta cláusula no limita los derechos de protección al consumidor que sean irrenunciables conforme a la ley de su jurisdicción."},
    {t:"11. Ley Aplicable",c:"Estos términos se rigen por las leyes de la República Federativa de Brasil. Cualquier disputa no sujeta a arbitraje estará sujeta a la jurisdicción de los tribunales de Santa Catarina, Brasil."},
    {t:"12. Contacto",c:"Para consultas sobre estos Términos de Servicio: alfonso@venbratech.com | venbratech.com"}
  ];
  return (
    <div style={{background:C.black,minHeight:"100vh"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}`}</style>
      <nav style={{padding:"0 5%",borderBottom:`1px solid ${C.border}`,background:"rgba(10,10,10,0.97)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",height:72}}>
          <a href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
            <div style={{width:36,height:36,border:`2px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:C.accent}}>V</div>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:C.white,letterSpacing:2}}>VENBRA TECH</span>
          </a>
        </div>
      </nav>
      <main style={{maxWidth:860,margin:"0 auto",padding:"80px 5% 120px"}}>
        <div style={{marginBottom:64}}>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:5,color:C.accent,textTransform:"uppercase",marginBottom:20}}>Legal</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(40px,6vw,72px)",fontWeight:300,color:C.white,lineHeight:1.05,marginBottom:24}}>Términos de <span style={{fontWeight:600,color:C.accent}}>Servicio</span></h1>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.gray}}>Última actualización: 24 de mayo de 2026 · VenBra Tech</p>
        </div>
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:48}}>
          {s.map((x,i)=>(<div key={i} style={{marginBottom:48,paddingBottom:48,borderBottom:i<s.length-1?`1px solid rgba(197,164,85,0.08)`:"none"}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:C.accent,marginBottom:16}}>{x.t}</h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:C.lgray,lineHeight:1.85}}>{x.c}</p>
          </div>))}
        </div>
        <div style={{marginTop:64,padding:"32px 40px",background:"rgba(197,164,85,0.05)",border:`1px solid ${C.border}`}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.gray,lineHeight:1.8}}><span style={{color:C.accent,fontWeight:600}}>Aviso Legal: </span>VenBra Tech opera como plataforma de referidos y educación. No somos asesores de inversión registrados. Consulte siempre a un asesor financiero registrado.</p>
        </div>
        <div style={{marginTop:40,display:"flex",gap:24}}>
          <a href="/privacidad" style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,letterSpacing:2,color:C.accent,textTransform:"uppercase",textDecoration:"none"}}>Política de Privacidad →</a>
          <a href="/" style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,letterSpacing:2,color:C.gray,textTransform:"uppercase",textDecoration:"none"}}>← Inicio</a>
        </div>
      </main>
      <footer style={{padding:"40px 5%",background:C.dark,borderTop:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray}}>© 2026 VenBra Tech</span>
          <div style={{display:"flex",gap:32}}>
            <a href="/terminos" style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.accent,textDecoration:"none"}}>Términos</a>
            <a href="/privacidad" style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray,textDecoration:"none"}}>Privacidad</a>
            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray}}>alfonso@venbratech.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
