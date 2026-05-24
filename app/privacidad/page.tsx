export default function Privacidad() {
  const C = {black:"#0a0a0a",dark:"#0d1117",accent:"#c5a455",white:"#f8f8f8",gray:"#8b8b8b",lgray:"#c4c4c4",border:"rgba(197,164,85,0.15)"};
  const s = [
    {t:"1. Información que Recopilamos",c:"Cuando autoriza nuestra aplicación TikTok, recopilamos: su identificador de usuario TikTok (open_id), tokens de acceso OAuth para publicar contenido en su nombre, e información básica de perfil (nombre de usuario). No recopilamos contraseñas ni información de pago."},
    {t:"2. Uso de la Información",c:"Utilizamos los datos de su cuenta TikTok exclusivamente para: publicar contenido educativo de video en su cuenta según lo autorizado, mantener activa la sesión de publicación automática, y verificar que los videos se publicaron correctamente. No vendemos ni compartimos sus datos con terceros."},
    {t:"3. Datos de Contacto",c:"Cuando se suscribe a nuestro newsletter, recopilamos su dirección de correo electrónico para enviarle contenido educativo sobre finanzas e inversiones. Puede darse de baja en cualquier momento haciendo clic en el enlace de cancelación en cualquier correo."},
    {t:"4. Cookies y Tecnologías de Seguimiento",c:"Utilizamos cookies esenciales para el funcionamiento del sitio y cookies de análisis anónimas para mejorar la experiencia del usuario. No utilizamos cookies de publicidad comportamental de terceros."},
    {t:"5. Retención y Eliminación de Datos",c:"Los tokens de acceso TikTok se almacenan de forma segura y se eliminan cuando revoca el acceso desde su cuenta TikTok (Configuración > Aplicaciones conectadas). Los datos de correo electrónico se eliminan dentro de los 30 días siguientes a la solicitud de baja."},
    {t:"6. Seguridad",c:"Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal, incluyendo cifrado en tránsito (HTTPS) y acceso restringido a los datos del servidor."},
    {t:"7. Sus Derechos",c:"Tiene derecho a: acceder a sus datos personales, solicitar su corrección o eliminación, revocar el acceso de nuestra aplicación a su cuenta TikTok en cualquier momento, y oponerse al procesamiento de sus datos. Para ejercer estos derechos: alfonso@venbratech.com."},
    {t:"8. Servicios de Terceros",c:"Nuestro sitio incluye enlaces a plataformas de terceros (eToro, Arrived Homes, Fundrise, TikTok). Estas plataformas tienen sus propias políticas de privacidad independientes. No somos responsables de sus prácticas de datos."},
    {t:"9. Cambios a esta Política",c:"Podemos actualizar esta política periódicamente. Los cambios se publicarán en esta página con la fecha de revisión. El uso continuado del servicio tras los cambios constituye su aceptación."},
    {t:"10. Contacto",c:"Para consultas sobre privacidad o para ejercer sus derechos: alfonso@venbratech.com | venbratech.com | Responsable: VenBra Tech, Santa Catarina, Brasil."}
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
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(40px,6vw,72px)",fontWeight:300,color:C.white,lineHeight:1.05,marginBottom:24}}>Política de <span style={{fontWeight:600,color:C.accent}}>Privacidad</span></h1>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.gray}}>Última actualización: 24 de mayo de 2026 · VenBra Tech</p>
        </div>
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:48}}>
          {s.map((x,i)=>(<div key={i} style={{marginBottom:48,paddingBottom:48,borderBottom:i<s.length-1?`1px solid rgba(197,164,85,0.08)`:"none"}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:C.accent,marginBottom:16}}>{x.t}</h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:C.lgray,lineHeight:1.85}}>{x.c}</p>
          </div>))}
        </div>
        <div style={{marginTop:40,display:"flex",gap:24}}>
          <a href="/terminos" style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,letterSpacing:2,color:C.accent,textTransform:"uppercase",textDecoration:"none"}}>Términos de Servicio →</a>
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
