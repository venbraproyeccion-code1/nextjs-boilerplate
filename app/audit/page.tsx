"use client";
import { useState } from "react";

const C = {
  black:"#080808",dark:"#0d0d0d",gold:"#c5a455",goldL:"#d4b76a",
  white:"#f5f5f0",gray:"#888",lgray:"#bbb",border:"rgba(197,164,85,0.15)",
  red:"#ff4444",green:"#44ff88"
};

type Lang = "es" | "en" | "pt";
const NEXT_LANG: Record<Lang, Lang> = { es: "en", en: "pt", pt: "es" };
const LANG_LABEL: Record<Lang, string> = { es: "ES", en: "EN", pt: "PT" };

const T = {
  es: {
    slots: "AUDITORÍAS ABIERTAS · Quedan 3 cupos",
    badge: "Auditoría de Seguridad IA · Entrega en 48h",
    h1a: "Tu pipeline de IA tiene",
    h1b: "vulnerabilidades críticas.",
    h1c: "Solo que todavía no lo sabés.",
    lead: "Auditamos tu pipeline de IA en 48 horas. Informe forense completo con hallazgos verificados por SHA256, puntajes de severidad y hoja de ruta de remediación. ",
    leadStrong: "Garantía de devolución si no encontramos nada crítico.",
    ctaMain: "Auditame — $497 →",
    ctaSub: "Pago único · Entrega en 48h · Informe PDF completo · Garantía de devolución",
    stats: [
      { n:"94%", l:"de los pipelines de IA pierden contexto crítico" },
      { n:"48h", l:"de entrega del informe forense" },
      { n:"$0", l:"si no encontramos nada crítico" },
      { n:"SHA256", l:"verificación criptográfica" },
      { n:"Corte UE", l:"estándar de evidencia admisible" },
      { n:"V5", l:"suite empresarial eco-lab" },
    ],
    findLabel: "Qué Encontramos",
    findTitle1: "3 vulnerabilidades críticas en",
    findTitle2: "9 de cada 10 pipelines de IA.",
    findings: [
      { icon:"⚠", title:"Pérdida de Contexto Entre Agentes", pct:"94%", desc:"Los agentes de IA pierden el contexto de decisión entre etapas asíncronas del pipeline — sin trazabilidad, sin registro de auditoría." },
      { icon:"🔓", title:"Cadenas de Decisión Sin Proteger", pct:"87%", desc:"Decisiones críticas de IA tomadas sin verificación SHA256 ni registro de cadena de custodia." },
      { icon:"🚨", title:"Cero Forense de Incidentes", pct:"91%", desc:"Cuando algo falla, los equipos reconstruyen eventos manualmente desde logs sin estructurar. Horas perdidas." },
    ],
    howTitle: "Cómo funciona",
    steps: [
      { n:"01", t:"Pagá y Enviá", d:"Pago seguro vía PayPal. Enviá tu repo de GitHub o la URL de tu endpoint de API." },
      { n:"02", t:"Auditoría Profunda 48h", d:"El agente Vigía escanea tu pipeline de IA. Cada evento de decisión capturado, verificado con hash y analizado." },
      { n:"03", t:"Informe Forense", d:"Informe PDF completo con hallazgos, puntajes de severidad y hoja de ruta de remediación. Admisible en cortes de la UE." },
    ],
    formLabel: "Iniciá tu Auditoría",
    formTitleA: "Recibí tu informe en",
    formTitleB: "48 horas.",
    formSub: "3 cupos disponibles esta semana",
    fCompany: "Nombre de la empresa",
    fCompanyPh: "Acme AI Labs",
    fEmail: "Correo laboral",
    fEmailPh: "cto@empresa.com",
    fRepo: "Repo de GitHub o endpoint de API",
    fRepoPh: "https://github.com/org/repo",
    fNotes: "Contexto adicional (opcional)",
    fNotesPh: "Stack, dudas específicas, plazo...",
    processing: "Procesando...",
    payBtn: "Pagar $497 e Iniciar Auditoría →",
    formFoot: "Pago seguro vía PayPal · Garantía de devolución · Entrega en 48h",
    doneTitle: "Solicitud de Auditoría Recibida",
    donePre: "Completá tu pago de PayPal en la nueva pestaña. Una vez confirmado, comenzamos tu auditoría forense de 48 horas. Informe entregado a ",
  },
  en: {
    slots: "AUDITS OPEN · 3 slots left",
    badge: "AI Security Audit · 48h Delivery",
    h1a: "Your AI pipeline has",
    h1b: "critical vulnerabilities.",
    h1c: "You just don't know it yet.",
    lead: "We audit your AI pipeline in 48 hours. Full forensic report with SHA256-verified findings, severity scores, and remediation roadmap. ",
    leadStrong: "Money-back guarantee if we find nothing critical.",
    ctaMain: "Get Audited — $497 →",
    ctaSub: "One-time payment · 48h delivery · Full PDF report · Money-back guarantee",
    stats: [
      { n:"94%", l:"of AI pipelines have critical context loss" },
      { n:"48h", l:"forensic report delivery" },
      { n:"$0", l:"if we find nothing critical" },
      { n:"SHA256", l:"cryptographic verification" },
      { n:"EU Court", l:"admissible evidence standard" },
      { n:"V5", l:"eco-lab enterprise suite" },
    ],
    findLabel: "What We Find",
    findTitle1: "3 critical vulnerabilities in",
    findTitle2: "9 out of 10 AI pipelines.",
    findings: [
      { icon:"⚠", title:"Context Loss Between Agents", pct:"94%", desc:"AI agents lose decision context across async pipeline stages — no traceability, no audit trail." },
      { icon:"🔓", title:"Unprotected Decision Chains", pct:"87%", desc:"Critical AI decisions made without SHA256 verification or chain-of-custody logging." },
      { icon:"🚨", title:"Zero Incident Forensics", pct:"91%", desc:"When something goes wrong, teams reconstruct events manually from unstructured logs. Hours wasted." },
    ],
    howTitle: "How it works",
    steps: [
      { n:"01", t:"Pay & Submit", d:"Secure payment via PayPal. Submit your GitHub repo or API endpoint URL." },
      { n:"02", t:"48h Deep Audit", d:"Vigía agent scans your AI pipeline. Every decision event captured, hashed, analyzed." },
      { n:"03", t:"Forensic Report", d:"Full PDF report with findings, severity scores, and remediation roadmap. Admissible in EU courts." },
    ],
    formLabel: "Start Your Audit",
    formTitleA: "Get your report in",
    formTitleB: "48 hours.",
    formSub: "3 slots available this week",
    fCompany: "Company name",
    fCompanyPh: "Acme AI Labs",
    fEmail: "Work email",
    fEmailPh: "cto@company.com",
    fRepo: "GitHub repo or API endpoint",
    fRepoPh: "https://github.com/org/repo",
    fNotes: "Additional context (optional)",
    fNotesPh: "Stack, specific concerns, deadline...",
    processing: "Processing...",
    payBtn: "Pay $497 & Start Audit →",
    formFoot: "Secure payment via PayPal · Money-back guarantee · 48h delivery",
    doneTitle: "Audit Request Received",
    donePre: "Complete your PayPal payment in the new tab. Once confirmed, we'll begin your 48-hour forensic audit. Report delivered to ",
  },
  pt: {
    slots: "AUDITORIAS ABERTAS · Restam 3 vagas",
    badge: "Auditoria de Segurança IA · Entrega em 48h",
    h1a: "Seu pipeline de IA tem",
    h1b: "vulnerabilidades críticas.",
    h1c: "Você só não sabe ainda.",
    lead: "Auditamos seu pipeline de IA em 48 horas. Relatório forense completo com achados verificados por SHA256, pontuações de severidade e plano de remediação. ",
    leadStrong: "Garantia de reembolso se não encontrarmos nada crítico.",
    ctaMain: "Audite-me — $497 →",
    ctaSub: "Pagamento único · Entrega em 48h · Relatório PDF completo · Garantia de reembolso",
    stats: [
      { n:"94%", l:"dos pipelines de IA têm perda crítica de contexto" },
      { n:"48h", l:"de entrega do relatório forense" },
      { n:"$0", l:"se não encontrarmos nada crítico" },
      { n:"SHA256", l:"verificação criptográfica" },
      { n:"Corte UE", l:"padrão de evidência admissível" },
      { n:"V5", l:"suíte empresarial eco-lab" },
    ],
    findLabel: "O Que Encontramos",
    findTitle1: "3 vulnerabilidades críticas em",
    findTitle2: "9 de cada 10 pipelines de IA.",
    findings: [
      { icon:"⚠", title:"Perda de Contexto Entre Agentes", pct:"94%", desc:"Agentes de IA perdem o contexto de decisão entre estágios assíncronos do pipeline — sem rastreabilidade, sem trilha de auditoria." },
      { icon:"🔓", title:"Cadeias de Decisão Desprotegidas", pct:"87%", desc:"Decisões críticas de IA tomadas sem verificação SHA256 ou registro de cadeia de custódia." },
      { icon:"🚨", title:"Zero Forense de Incidentes", pct:"91%", desc:"Quando algo dá errado, as equipes reconstroem eventos manualmente a partir de logs não estruturados. Horas perdidas." },
    ],
    howTitle: "Como funciona",
    steps: [
      { n:"01", t:"Pague e Envie", d:"Pagamento seguro via PayPal. Envie seu repositório GitHub ou URL do endpoint de API." },
      { n:"02", t:"Auditoria Profunda 48h", d:"O agente Vigía escaneia seu pipeline de IA. Cada evento de decisão capturado, com hash e analisado." },
      { n:"03", t:"Relatório Forense", d:"Relatório PDF completo com achados, pontuações de severidade e plano de remediação. Admissível em tribunais da UE." },
    ],
    formLabel: "Inicie sua Auditoria",
    formTitleA: "Receba seu relatório em",
    formTitleB: "48 horas.",
    formSub: "3 vagas disponíveis esta semana",
    fCompany: "Nome da empresa",
    fCompanyPh: "Acme AI Labs",
    fEmail: "E-mail corporativo",
    fEmailPh: "cto@empresa.com",
    fRepo: "Repositório GitHub ou endpoint de API",
    fRepoPh: "https://github.com/org/repo",
    fNotes: "Contexto adicional (opcional)",
    fNotesPh: "Stack, dúvidas específicas, prazo...",
    processing: "Processando...",
    payBtn: "Pagar $497 e Iniciar Auditoria →",
    formFoot: "Pagamento seguro via PayPal · Garantia de reembolso · Entrega em 48h",
    doneTitle: "Solicitação de Auditoria Recebida",
    donePre: "Complete seu pagamento no PayPal na nova aba. Após a confirmação, iniciamos sua auditoria forense de 48 horas. Relatório entregue para ",
  },
} as const;

export default function Audit(){
  const[lang,setLang]=useState<Lang>("es");
  const[loading,setLoading]=useState(false);
  const[step,setStep]=useState(0);
  const[form,setForm]=useState({company:"",email:"",repo:"",notes:""});
  const t = T[lang];

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    setLoading(true);
    // Guardar lead en Supabase
    try{
      await fetch("https://xshannxyjzrhgnsqmhun.supabase.co/rest/v1/financial_leads",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaGFubnhZanpyaGduc3FtaHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NzcxMTIsImV4cCI6MjAzMTU1MzExMn0.Ym8gDxUPz-eF3cQ1GQ5Q_HLVHRnfVHqnDPVOYXp6ARk",
          "Prefer":"return=minimal"
        },
        body:JSON.stringify({
          nombre:form.company,
          correo_electronico:form.email,
          fuente:"audit_landing",
          estado:"nuevo",
          amount:497,
          notas:`Repo:${form.repo} | Notes:${form.notes} | Pago PayPal: PENDIENTE de confirmar manualmente`
        })
      });
    }catch(_){}
    // Redirect to PayPal
    window.open(`https://www.paypal.com/paypalme/venbraproyeccion/497USD`,"_blank");
    setStep(1);
    setLoading(false);
  };

  return(
    <div style={{background:C.black,minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
        input,textarea{outline:none}::selection{background:rgba(197,164,85,0.25)}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .inp:focus{border-color:rgba(197,164,85,0.5)!important}
        .btn-gold:hover{background:#d4b76a!important;transform:scale(1.01)}
        .lang-btn:hover{color:${C.gold}!important;border-color:rgba(197,164,85,0.4)!important}
        @media(max-width:768px){.grid3{grid-template-columns:1fr!important}.hero-h{font-size:2.2rem!important}}
      `}</style>

      {/* NAV */}
      <nav style={{padding:"0 6%",borderBottom:`1px solid ${C.border}`,background:"rgba(8,8,8,0.97)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>
          <a href="/" style={{textDecoration:"none",fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:C.gold,letterSpacing:2}}>VENBRATECH</a>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite"}}/>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.lgray,letterSpacing:2}}>{t.slots}</span>
            </div>
            <button
              onClick={()=>setLang(NEXT_LANG[lang])}
              className="lang-btn"
              aria-label="Switch language / Cambiar idioma / Mudar idioma"
              style={{background:"transparent",border:`1px solid ${C.border}`,color:C.lgray,padding:"6px 14px",fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:1.5,cursor:"pointer",transition:"all 0.2s"}}>
              {LANG_LABEL[NEXT_LANG[lang]]}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:"80px 6% 60px",textAlign:"center",maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,border:`1px solid rgba(255,68,68,0.3)`,padding:"6px 18px",marginBottom:32,fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:3,color:C.red,textTransform:"uppercase"}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:C.red,animation:"pulse 1.5s infinite"}}/>
          {t.badge}
        </div>
        <h1 className="hero-h" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.4rem,5vw,4rem)",fontWeight:300,color:C.white,lineHeight:1.1,marginBottom:20,letterSpacing:-1}}>
          {t.h1a}<br/><span style={{color:C.red,fontWeight:600,fontStyle:"italic"}}>{t.h1b}</span><br/>
          <span style={{color:C.lgray,fontSize:"0.75em"}}>{t.h1c}</span>
        </h1>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:C.lgray,maxWidth:640,margin:"0 auto 48px",lineHeight:1.85}}>
          {t.lead}<strong style={{color:C.white}}>{t.leadStrong}</strong>
        </p>
        <a href="#audit-form" style={{display:"inline-block",padding:"16px 52px",background:C.gold,color:C.black,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:12,letterSpacing:3,textTransform:"uppercase",fontWeight:700,transition:"all 0.2s"}}>
          {t.ctaMain}
        </a>
        <div style={{marginTop:16,fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray}}>
          {t.ctaSub}
        </div>
      </section>

      {/* STATS */}
      <section style={{padding:"40px 6%",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1}}>
          {t.stats.map((s,i)=>(
            <div key={i} style={{padding:"28px 20px",textAlign:"center",borderRight:i%3<2?`1px solid ${C.border}`:"none"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:600,color:i<3?C.gold:C.lgray,marginBottom:6}}>{s.n}</div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:C.gray,letterSpacing:2,textTransform:"uppercase"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINDINGS */}
      <section style={{padding:"80px 6%"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:4,color:C.red,textTransform:"uppercase",marginBottom:12}}>{t.findLabel}</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,3vw,2.8rem)",fontWeight:300,color:C.white}}>
              {t.findTitle1}<br/><span style={{color:C.gold,fontStyle:"italic"}}>{t.findTitle2}</span>
            </h2>
          </div>
          <div className="grid3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {t.findings.map((f,i)=>(
              <div key={i} style={{padding:"36px 28px",border:`1px solid rgba(255,68,68,0.2)`,background:"rgba(255,68,68,0.03)"}}>
                <div style={{fontSize:28,marginBottom:16}}>{f.icon}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:44,fontWeight:600,color:C.red,marginBottom:8}}>{f.pct}</div>
                <h3 style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:C.white,letterSpacing:1,marginBottom:12,textTransform:"uppercase"}}>{f.title}</h3>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.lgray,lineHeight:1.75}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"60px 6%",background:"rgba(197,164,85,0.025)",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:52}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.6rem,3vw,2.4rem)",fontWeight:300,color:C.white}}>
              {t.howTitle}
            </h2>
          </div>
          <div className="grid3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:32}}>
            {t.steps.map((s,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:300,color:C.gold,opacity:0.4,marginBottom:16}}>{s.n}</div>
                <h3 style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:C.white,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>{s.t}</h3>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.lgray,lineHeight:1.75}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="audit-form" style={{padding:"80px 6%"}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:4,color:C.gold,textTransform:"uppercase",marginBottom:12}}>{t.formLabel}</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,3vw,2.6rem)",fontWeight:300,color:C.white,marginBottom:12}}>
              {t.formTitleA} <span style={{color:C.gold,fontStyle:"italic"}}>{t.formTitleB}</span>
            </h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.lgray}}>{t.formSub}</p>
          </div>

          {step===0?(
            <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:16}}>
              {[
                {id:"company",label:t.fCompany,placeholder:t.fCompanyPh,type:"text"},
                {id:"email",label:t.fEmail,placeholder:t.fEmailPh,type:"email"},
                {id:"repo",label:t.fRepo,placeholder:t.fRepoPh,type:"text"},
              ].map(f=>(
                <div key={f.id}>
                  <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:2,color:C.gray,textTransform:"uppercase",display:"block",marginBottom:8}}>{f.label}</label>
                  <input className="inp" type={f.type} required placeholder={f.placeholder}
                    value={(form as any)[f.id]}
                    onChange={e=>setForm({...form,[f.id]:e.target.value})}
                    style={{width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,color:C.white,fontFamily:"'DM Sans',sans-serif",fontSize:14,transition:"border 0.2s"}}/>
                </div>
              ))}
              <div>
                <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:2,color:C.gray,textTransform:"uppercase",display:"block",marginBottom:8}}>{t.fNotes}</label>
                <textarea placeholder={t.fNotesPh}
                  value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}
                  rows={3}
                  style={{width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,color:C.white,fontFamily:"'DM Sans',sans-serif",fontSize:14,resize:"none"}}/>
              </div>
              <button type="submit" className="btn-gold"
                style={{padding:"18px",background:C.gold,border:"none",color:C.black,fontFamily:"'DM Sans',sans-serif",fontSize:13,letterSpacing:3,textTransform:"uppercase",fontWeight:700,cursor:"pointer",transition:"all 0.2s",marginTop:8}}>
                {loading?t.processing:t.payBtn}
              </button>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray,textAlign:"center"}}>
                {t.formFoot}
              </p>
            </form>
          ):(
            <div style={{textAlign:"center",padding:"48px",border:`1px solid rgba(68,255,136,0.3)`,background:"rgba(68,255,136,0.03)"}}>
              <div style={{fontSize:48,marginBottom:20}}>✓</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:C.green,marginBottom:12}}>{t.doneTitle}</h3>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.lgray,lineHeight:1.75}}>
                {t.donePre}<strong style={{color:C.white}}>{form.email}</strong>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"32px 6%",borderTop:`1px solid ${C.border}`,textAlign:"center"}}>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray}}>
          © 2026 VenBraTech · <a href="mailto:hola@venbratech.com" style={{color:C.gray}}>hola@venbratech.com</a> · <a href="/" style={{color:C.gray}}>venbratech.com</a>
        </div>
      </footer>
    </div>
  );
}
