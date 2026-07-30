"use client";
import { useState } from "react";

const C = {
  black:"#080808",dark:"#0d0d0d",gold:"#c5a455",goldL:"#d4b76a",
  white:"#f5f5f0",gray:"#888",lgray:"#bbb",border:"rgba(197,164,85,0.15)",
  red:"#ff4444",green:"#44ff88"
};

type Tier = "enterprise_audit" | "enterprise_full";

const TIERS: Record<Tier, { name:string; price:string; sub:string; features:string[]; cta:string }> = {
  enterprise_audit: {
    name:"Audit",
    price:"R$ 10.000",
    sub:"Reporte forense completo · entrega async en 72h",
    features:[
      "Auditoría completa de tu pipeline/ecosistema de IA",
      "Informe escrito con hallazgos verificados y severidad",
      "Sin llamadas en vivo — todo por escrito, a tu ritmo",
      "Entrega en 72 horas hábiles",
    ],
    cta:"Solicitar Audit — R$ 10.000",
  },
  enterprise_full: {
    name:"Enterprise",
    price:"R$ 25.000",
    sub:"Audit + plan de acción ampliado + 30 días de acompañamiento",
    features:[
      "Todo lo del tier Audit",
      "Plan de acción ampliado, por escrito",
      "30 días de acompañamiento asíncrono vía Telegram",
      "Prioridad de respuesta sobre hallazgos nuevos",
    ],
    cta:"Solicitar Enterprise — R$ 25.000",
  },
};

export default function EnterpriseAudit(){
  const[loading,setLoading]=useState(false);
  const[step,setStep]=useState(0);
  const[tier,setTier]=useState<Tier>("enterprise_audit");
  const[form,setForm]=useState({company:"",email:"",context:""});
  const[error,setError]=useState<string|null>(null);

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    setLoading(true);
    setError(null);
    try{
      const leadId = crypto.randomUUID();
      await fetch("https://xshannxyjzrhgnsqmhun.supabase.co/rest/v1/financial_leads",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaGFubnh5anpyaGduc3FtaHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMDcwODUsImV4cCI6MjA5MTU4MzA4NX0.l6wJsUAYSVE6RAZn-unPPMsGprrzXmBHy7y7wHrWfBw",
          "Prefer":"return=minimal"
        },
        body:JSON.stringify({
          id:leadId,
          nombre:form.company,
          correo_electronico:form.email,
          fuente:"enterprise_audit_landing",
          estado:"nuevo",
          amount: tier==="enterprise_audit" ? 10000 : 25000,
          notas:`Tier:${TIERS[tier].name} | Contexto:${form.context}`
        })
      });

      fetch("/api/leads/score",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({leadId, text:`${form.company}\n${TIERS[tier].name}\n${form.context}`})
      }).catch(()=>{});

      const prefRes = await fetch("/api/mercadopago/create-preference",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({leadId, email:form.email, company:form.company, product:tier})
      });
      const prefData = await prefRes.json().catch(()=>null);
      if(prefData?.init_point){
        window.location.href = prefData.init_point;
        return;
      }
      // Mercado Pago rechazó la preferencia (ej. moneda USD no habilitada en la cuenta) -
      // no fingimos que funcionó. Mostramos el error real, regla #22.
      setError(prefData?.error ? `Mercado Pago rechazó el pago: ${JSON.stringify(prefData.detail || prefData.error)}` : "No se pudo iniciar el pago. Escribinos a hola@venbratech.com.");
    }catch(_){
      setError("Error de conexión. Escribinos a hola@venbratech.com y lo resolvemos manual.");
    }
    setStep(1);
    setLoading(false);
  };

  return(
    <div style={{background:C.black,minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
        input,textarea{outline:none}::selection{background:rgba(197,164,85,0.25)}
        .inp:focus{border-color:rgba(197,164,85,0.5)!important}
        .btn-gold:hover{background:#d4b76a!important;transform:scale(1.01)}
        .tier-card{cursor:pointer;transition:all 0.2s}
        .tier-card:hover{border-color:rgba(197,164,85,0.4)!important}
        @media(max-width:768px){.grid2{grid-template-columns:1fr!important}.hero-h{font-size:2rem!important}}
      `}</style>

      <nav style={{padding:"0 6%",borderBottom:`1px solid ${C.border}`,background:"rgba(8,8,8,0.97)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>
          <a href="/" style={{textDecoration:"none",fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:C.gold,letterSpacing:2}}>VENBRATECH</a>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.lgray,letterSpacing:2}}>ENTERPRISE AUDIT</span>
        </div>
      </nav>

      <section style={{padding:"80px 6% 50px",textAlign:"center",maxWidth:800,margin:"0 auto"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,border:`1px solid ${C.border}`,padding:"6px 18px",marginBottom:32,fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:3,color:C.gold,textTransform:"uppercase"}}>
          Cohorte Fundador · Primeros 3–5 clientes
        </div>
        <h1 className="hero-h" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4.5vw,3.4rem)",fontWeight:300,color:C.white,lineHeight:1.15,marginBottom:20,letterSpacing:-1}}>
          Auditoría enterprise de tu <span style={{color:C.gold,fontWeight:600,fontStyle:"italic"}}>ecosistema de IA</span>.
        </h1>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:C.lgray,maxWidth:600,margin:"0 auto 20px",lineHeight:1.85}}>
          Trabajo 100% asíncrono — sin llamadas en vivo, sin cámara. Todo el hallazgo y el acompañamiento pasan por escrito. Somos la cohorte fundadora: el primer trabajo real entregado se convierte en el primer caso de estudio verdadero, no en una referencia inventada.
        </p>
      </section>

      <section style={{padding:"20px 6% 80px"}}>
        <div className="grid2" style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:24}}>
          {(Object.keys(TIERS) as Tier[]).map((k)=>{
            const tr = TIERS[k];
            const selected = tier===k;
            return (
              <div key={k} className="tier-card" onClick={()=>setTier(k)}
                style={{padding:"36px 28px",border:`1px solid ${selected?C.gold:C.border}`,background:selected?"rgba(197,164,85,0.05)":"transparent"}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:C.white,marginBottom:6}}>{tr.name}</h3>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:600,color:C.gold,marginBottom:8}}>{tr.price}</div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.lgray,marginBottom:20,lineHeight:1.6}}>{tr.sub}</p>
                <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
                  {tr.features.map((f,i)=>(
                    <li key={i} style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.lgray,display:"flex",gap:8}}>
                      <span style={{color:C.gold}}>—</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section id="form" style={{padding:"20px 6% 100px",maxWidth:560,margin:"0 auto"}}>
        {step===0 ? (
          <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{textAlign:"center",marginBottom:8}}>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:C.white}}>
                Seleccionaste: <span style={{color:C.gold,fontStyle:"italic"}}>{TIERS[tier].name} — {TIERS[tier].price}</span>
              </h2>
            </div>
            <input required value={form.company} onChange={e=>setForm({...form,company:e.target.value})}
              placeholder="Nombre de la empresa" className="inp"
              style={{background:C.dark,border:`1px solid ${C.border}`,color:C.white,padding:"14px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:14}}/>
            <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
              placeholder="Correo laboral" className="inp"
              style={{background:C.dark,border:`1px solid ${C.border}`,color:C.white,padding:"14px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:14}}/>
            <textarea value={form.context} onChange={e=>setForm({...form,context:e.target.value})}
              placeholder="Contexto: qué querés que auditemos, stack, plazo (opcional)" rows={4} className="inp"
              style={{background:C.dark,border:`1px solid ${C.border}`,color:C.white,padding:"14px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:14,resize:"vertical"}}/>
            <button type="submit" disabled={loading} className="btn-gold"
              style={{padding:"16px",background:C.gold,color:C.black,border:"none",fontFamily:"'DM Sans',sans-serif",fontSize:12,letterSpacing:2,textTransform:"uppercase",fontWeight:700,cursor:loading?"default":"pointer",opacity:loading?0.6:1}}>
              {loading?"Procesando...":TIERS[tier].cta}
            </button>
            <div style={{textAlign:"center",fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray}}>
              Pago seguro vía Mercado Pago · Trabajo 100% asíncrono
            </div>
          </form>
        ):(
          <div style={{textAlign:"center",padding:"40px 20px",border:`1px solid ${error?"rgba(255,68,68,0.3)":C.border}`}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:error?C.red:C.white,marginBottom:12}}>
              {error?"No pudimos iniciar el pago":"Solicitud recibida"}
            </h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.lgray,lineHeight:1.7}}>
              {error || "Guardamos tu solicitud. Si no fuiste redirigido automáticamente a Mercado Pago, escribinos a hola@venbratech.com para completar el pago."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
