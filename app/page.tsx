"use client";
import { useState, useEffect, useRef } from "react";

const C = {
  black: "#080808", dark: "#0d0d0d", card: "rgba(18,18,22,0.85)",
  gold: "#c5a455", goldL: "#d4b76a", white: "#f5f5f0",
  gray: "#888", lgray: "#bbb", border: "rgba(197,164,85,0.15)",
};

const CHARS = [
  { name:"Veyra", role:"Vigía del Horizonte", tag:"Predicción & Datos", color:"#7B68EE",
    desc:"Lee las señales del mercado antes que nadie. Tu oráculo de análisis predictivo.", icon:"◈" },
  { name:"Kael", role:"Alcaide de Hierro", tag:"Seguridad & Protección", color:"#4ECDC4",
    desc:"Guardián Zero-Trust del ecosistema. Protege cada activo con precisión quirúrgica.", icon:"⬡" },
  { name:"Lyra", role:"Productora de Ecos", tag:"Contenido & Conversión", color:"#FF6B9D",
    desc:"Convierte datos en narrativa que vende. Directora creativa del ecosistema a 128 BPM.", icon:"◉" },
  { name:"Draxen", role:"Arquitecto Inmutable", tag:"Gobernanza & Estructura", color:"#FFD93D",
    desc:"Registra todo. Gobierna cada proceso con contratos inmutables y arquitectura de élite.", icon:"⬢" },
];

const STATS = [
  { n:"$10T+", l:"en plataformas referidas" }, { n:"4", l:"verticales activas" },
  { n:"100%", l:"stack gratuito legítimo" }, { n:"14", l:"ejes de la academia" },
];

function useInView(th=0.12){
  const r=useRef<HTMLDivElement>(null);
  const[v,s]=useState(false);
  useEffect(()=>{
    const el=r.current;if(!el)return;
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:th});
    o.observe(el);return()=>o.disconnect();
  },[th]);
  return[r,v] as const;
}

function FI({children,delay=0}:{children:React.ReactNode;delay?:number}){
  const[r,v]=useInView();
  return(
    <div ref={r} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(28px)",
      transition:`opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s,transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`}}>
      {children}
    </div>
  );
}

export default function Home(){
  const[sc,setSc]=useState(false);
  const[email,setEmail]=useState("");
  const[done,setDone]=useState(false);
  const[loading,setLoading]=useState(false);

  useEffect(()=>{
    const h=()=>setSc(window.scrollY>60);
    window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);
  },[]);

  const handleSub=async(e:React.FormEvent)=>{
    e.preventDefault();if(!email||done)return;
    setLoading(true);
    try{
      await fetch("https://xshannxyjzrhgnsqmhun.supabase.co/functions/v1/register-member",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,utm_source:"venbratech_home_v2"})
      });
    }catch(_){}
    setLoading(false);setDone(true);setEmail("");
  };

  return(
    <div style={{background:C.black,minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
        ::selection{background:rgba(197,164,85,0.25)}input::placeholder{color:#555}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d0d0d}::-webkit-scrollbar-thumb{background:#c5a455;border-radius:2px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .char-card{transition:all 0.3s;cursor:default}.char-card:hover{transform:translateY(-4px)!important;border-color:rgba(197,164,85,0.4)!important}
        .cta-gold:hover{background:#d4b76a!important;transform:scale(1.02)}
        .cta-outline:hover{border-color:#c5a455!important;color:#c5a455!important}
        .nav-a:hover{color:#c5a455!important}
        @media(max-width:768px){
          .hide-m{display:none!important}.hero-h{font-size:2.4rem!important}
          .stats-g{grid-template-columns:repeat(2,1fr)!important}
          .chars-g{grid-template-columns:1fr!important}
          .b2b-g{grid-template-columns:1fr!important}
          .price-g{grid-template-columns:repeat(2,1fr)!important}
          .foot-g{flex-direction:column!important}
        }
      `}</style>

      {/* Grain */}
      <div style={{position:"fixed",inset:0,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,pointerEvents:"none",zIndex:9999,opacity:0.6}}/>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,
        background:sc?"rgba(8,8,8,0.96)":"transparent",backdropFilter:sc?"blur(24px)":"none",
        borderBottom:sc?`1px solid ${C.border}`:"none",transition:"all 0.4s",padding:"0 6%"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:72}}>
          <a href="/" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:C.gold,letterSpacing:2}}>VENBRATECH</span>
            <span style={{fontSize:9,color:C.gray,letterSpacing:3,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",marginTop:3}}>LAT</span>
          </a>
          <div className="hide-m" style={{display:"flex",gap:36,alignItems:"center"}}>
            {["Sistema","Academia","B2B","Comunidad"].map((n,i)=>(
              <a key={i} href={["#sistema","/academia","#b2b","/academia"][i]} className="nav-a"
                style={{color:C.lgray,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:2.5,textTransform:"uppercase",transition:"color 0.2s"}}>
                {n}
              </a>
            ))}
            <a href="/academia" className="cta-outline"
              style={{padding:"9px 24px",border:`1px solid rgba(197,164,85,0.4)`,color:C.gold,
                textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:2.5,textTransform:"uppercase",transition:"all 0.2s"}}>
              Entrar
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:"120px 6% 80px",position:"relative"}}>
        <div style={{position:"absolute",top:"35%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:700,background:"radial-gradient(circle,rgba(197,164,85,0.055) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:860,position:"relative",zIndex:1}}>
          <FI delay={0}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,border:`1px solid ${C.border}`,padding:"6px 18px",marginBottom:36,fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:3,color:C.gold,textTransform:"uppercase"}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:C.gold,animation:"pulse 2s infinite"}}/>
              Ecosistema Digital Latino · est. 2026
            </div>
          </FI>
          <FI delay={0.1}>
            <h1 className="hero-h" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.6rem,6vw,5rem)",fontWeight:300,color:C.white,lineHeight:1.08,marginBottom:16,letterSpacing:-1.5}}>
              Invierte como una<br/><span style={{color:C.gold,fontWeight:600,fontStyle:"italic"}}>institución.</span>
            </h1>
          </FI>
          <FI delay={0.2}>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.1rem,2.2vw,1.5rem)",fontWeight:300,color:C.lgray,marginBottom:52,letterSpacing:0.5}}>
              Desde $100. Sin jerga. Sin excusas.
            </p>
          </FI>
          <FI delay={0.3}>
            {!done?(
              <form onSubmit={handleSub} style={{display:"flex",maxWidth:480,margin:"0 auto 20px",border:`1px solid ${C.border}`,overflow:"hidden"}}>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com"
                  style={{flex:1,padding:"15px 20px",background:"rgba(255,255,255,0.03)",border:"none",color:C.white,fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:"none"}}/>
                <button type="submit" className="cta-gold"
                  style={{padding:"15px 28px",background:C.gold,border:"none",color:C.black,fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:700,cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap"}}>
                  {loading?"...":"Acceder →"}
                </button>
              </form>
            ):(
              <div style={{maxWidth:480,margin:"0 auto 20px",padding:"16px",border:`1px solid rgba(197,164,85,0.3)`,fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.gold,textAlign:"center"}}>
                ✓ Bienvenido — revisa tu email
              </div>
            )}
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray,letterSpacing:1}}>Sin spam · Sin tarjeta · Acceso inmediato</p>
          </FI>
          <FI delay={0.4}>
            <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:44,flexWrap:"wrap"}}>
              <a href="/academia" className="cta-gold" style={{padding:"14px 40px",background:C.gold,color:C.black,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:2.5,textTransform:"uppercase",fontWeight:700,transition:"all 0.2s"}}>
                Ver Academia
              </a>
              <a href="#sistema" className="cta-outline" style={{padding:"14px 40px",border:`1px solid rgba(197,164,85,0.3)`,color:C.lgray,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:2.5,textTransform:"uppercase",transition:"all 0.2s"}}>
                Cómo funciona ↓
              </a>
            </div>
          </FI>
        </div>
        <div style={{position:"absolute",bottom:40,left:"50%",transform:"translateX(-50%)",animation:"float 3s ease-in-out infinite",opacity:0.35}}>
          <div style={{width:1,height:50,background:`linear-gradient(to bottom,${C.gold},transparent)`,margin:"0 auto"}}/>
        </div>
      </section>

      {/* STATS */}
      <section style={{padding:"56px 6%",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div className="stats-g" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1}}>
            {STATS.map((s,i)=>(
              <FI key={i} delay={i*0.07}>
                <div style={{padding:"32px 20px",textAlign:"center",borderRight:i<3?`1px solid ${C.border}`:"none",transition:"background 0.2s"}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:44,fontWeight:600,color:C.gold,marginBottom:8}}>{s.n}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:C.gray,letterSpacing:2.5,textTransform:"uppercase"}}>{s.l}</div>
                </div>
              </FI>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONAJES */}
      <section id="sistema" style={{padding:"100px 6%"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <FI>
            <div style={{textAlign:"center",marginBottom:72}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:4,color:C.gold,textTransform:"uppercase",marginBottom:16}}>El Sistema</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:300,color:C.white,letterSpacing:-0.5}}>
                Cuatro guardianes.<br/><span style={{color:C.gold,fontStyle:"italic"}}>Un ecosistema.</span>
              </h2>
            </div>
          </FI>
          <div className="chars-g" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20}}>
            {CHARS.map((ch,i)=>(
              <FI key={i} delay={i*0.1}>
                <div className="char-card" style={{padding:"40px",border:`1px solid ${C.border}`,background:C.card,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,right:0,width:180,height:180,background:`radial-gradient(circle at top right,${ch.color}09,transparent 70%)`,pointerEvents:"none"}}/>
                  <div style={{fontSize:28,color:ch.color,marginBottom:18}}>{ch.icon}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,letterSpacing:3.5,color:ch.color,textTransform:"uppercase",marginBottom:8}}>{ch.tag}</div>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:500,color:C.white,marginBottom:4}}>{ch.name}</h3>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.gray,marginBottom:16,fontStyle:"italic"}}>{ch.role}</div>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.lgray,lineHeight:1.75}}>{ch.desc}</p>
                </div>
              </FI>
            ))}
          </div>
        </div>
      </section>

      {/* ACADEMIA */}
      <section style={{padding:"80px 6%",background:"rgba(197,164,85,0.025)",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:860,margin:"0 auto",textAlign:"center"}}>
          <FI>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:4,color:C.gold,textTransform:"uppercase",marginBottom:20}}>Academia Digital Latina</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,3.5vw,2.9rem)",fontWeight:300,color:C.white,marginBottom:20,letterSpacing:-0.3}}>
              14 verticales. Una plataforma.<br/><span style={{color:C.gold,fontStyle:"italic"}}>Tu acceso, gratuito.</span>
            </h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:C.lgray,maxWidth:560,margin:"0 auto 40px",lineHeight:1.85}}>
              Finanzas · Datos · IA · Automatización · Marketing · Negocios · Real Estate · Crypto y 6 ejes más. Sistema de matching por perfil.
            </p>
            <a href="/academia" className="cta-gold" style={{display:"inline-block",padding:"16px 52px",background:C.gold,color:C.black,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:3,textTransform:"uppercase",fontWeight:700,transition:"all 0.2s"}}>
              Acceder Gratis →
            </a>
          </FI>
        </div>
      </section>

      {/* B2B */}
      <section id="b2b" style={{padding:"100px 6%"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div className="b2b-g" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
            <FI>
              <div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:4,color:C.gold,textTransform:"uppercase",marginBottom:20}}>Para Empresas</div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,3vw,2.7rem)",fontWeight:300,color:C.white,marginBottom:24,letterSpacing:-0.3}}>
                  Gobernanza AI.<br/><span style={{color:C.gold,fontStyle:"italic"}}>Nivel institucional.</span>
                </h2>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.lgray,lineHeight:1.85,marginBottom:32}}>
                  eco-lab_venbrax V5 — Suite empresarial: módulo forense SHA256, seguridad Zero-Trust, contratos inmutables. Construida sobre la misma tecnología que ya opera en el sector industrial brasileño.
                </p>
                {["Módulo Forense — trazabilidad SHA256","Seguridad Zero-Trust autónoma","Contratos JSON Schema 2020-12"].map((f,i)=>(
                  <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
                    <span style={{color:C.gold,marginTop:2,fontSize:10}}>◆</span>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.lgray}}>{f}</span>
                  </div>
                ))}
                <a href="mailto:hola@venbratech.com?subject=B2B VenBraTech eco-lab V5"
                  className="cta-outline" style={{display:"inline-block",marginTop:32,padding:"14px 36px",border:`1px solid rgba(197,164,85,0.4)`,color:C.gold,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:2.5,textTransform:"uppercase",transition:"all 0.2s"}}>
                  Agendar 25 min →
                </a>
              </div>
            </FI>
            <FI delay={0.15}>
              <div className="price-g" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
                {[{n:"$499",l:"Starter",s:"/mes"},{n:"$999",l:"Pro",s:"/mes",hot:true},{n:"$1,999",l:"Enterprise",s:"/mes"},{n:"Custom",l:"A medida",s:""}].map((p,i)=>(
                  <div key={i} style={{padding:"28px 18px",border:`1px solid ${i===1?"rgba(197,164,85,0.5)":C.border}`,background:i===1?"rgba(197,164,85,0.07)":C.card,textAlign:"center",position:"relative"}}>
                    {i===1&&<div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:C.gold,padding:"3px 14px",fontSize:8,letterSpacing:2.5,color:C.black,fontWeight:700,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>POPULAR</div>}
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,color:C.gold,fontWeight:600}}>{p.n}<span style={{fontSize:12,color:C.gray,fontWeight:300}}>{p.s}</span></div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray,letterSpacing:1,marginTop:6}}>{p.l}</div>
                  </div>
                ))}
              </div>
            </FI>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"60px 6% 36px",borderTop:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div className="foot-g" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:40,marginBottom:48}}>
            <div style={{maxWidth:300}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:C.gold,letterSpacing:2,marginBottom:12}}>VENBRATECH</div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.gray,lineHeight:1.75}}>Ecosistema digital latino. Educación institucional, automatización AI y gobernanza empresarial.</p>
            </div>
            <div style={{display:"flex",gap:56,flexWrap:"wrap"}}>
              {[
                {t:"Plataforma",ls:[{l:"Academia",h:"/academia"},{l:"Sistema",h:"#sistema"},{l:"B2B",h:"#b2b"}]},
                {t:"Legal",ls:[{l:"Privacidad",h:"/privacidad"},{l:"Términos",h:"/terminos"}]},
                {t:"Contacto",ls:[{l:"hola@venbratech.com",h:"mailto:hola@venbratech.com"}]},
              ].map((col,i)=>(
                <div key={i}>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,letterSpacing:3.5,color:C.gold,textTransform:"uppercase",marginBottom:16}}>{col.t}</div>
                  {col.ls.map((lk,j)=>(
                    <a key={j} href={lk.h} style={{display:"block",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.gray,textDecoration:"none",marginBottom:10}}
                      onMouseOver={e=>(e.currentTarget.style.color=C.gold)}
                      onMouseOut={e=>(e.currentTarget.style.color=C.gray)}>{lk.l}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:24,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray}}>© 2026 VenBraTech · Santa Catarina, Brasil</div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray,maxWidth:580,lineHeight:1.6}}>
              VenBra Tech opera exclusivamente como plataforma de referidos y educación. No somos asesores de inversión registrados. Todas las inversiones conllevan riesgo.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
