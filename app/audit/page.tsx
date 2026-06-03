"use client";
import { useState } from "react";

const C = {
  black:"#080808",dark:"#0d0d0d",gold:"#c5a455",goldL:"#d4b76a",
  white:"#f5f5f0",gray:"#888",lgray:"#bbb",border:"rgba(197,164,85,0.15)",
  red:"#ff4444",green:"#44ff88"
};

const FINDINGS = [
  {icon:"⚠",title:"Context Loss Between Agents",pct:"94%",desc:"AI agents lose decision context across async pipeline stages — no traceability, no audit trail."},
  {icon:"🔓",title:"Unprotected Decision Chains",pct:"87%",desc:"Critical AI decisions made without SHA256 verification or chain-of-custody logging."},
  {icon:"🚨",title:"Zero Incident Forensics",pct:"91%",desc:"When something goes wrong, teams reconstruct events manually from unstructured logs. Hours wasted."},
];

const STEPS = [
  {n:"01",t:"Pay & Submit",d:"Secure payment via PayPal. Submit your GitHub repo or API endpoint URL."},
  {n:"02",t:"48h Deep Audit",d:"Vigía agent scans your AI pipeline. Every decision event captured, hashed, analyzed."},
  {n:"03",t:"Forensic Report",d:"Full PDF report with findings, severity scores, and remediation roadmap. Admissible in EU courts."},
];

export default function Audit(){
  const[loading,setLoading]=useState(false);
  const[step,setStep]=useState(0);
  const[form,setForm]=useState({company:"",email:"",repo:"",notes:""});

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
          email:form.email,
          source:"audit_landing",
          status:"audit_paid",
          notas:`Company:${form.company} | Repo:${form.repo} | Notes:${form.notes}`
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
        @media(max-width:768px){.grid3{grid-template-columns:1fr!important}.hero-h{font-size:2.2rem!important}}
      `}</style>

      {/* NAV */}
      <nav style={{padding:"0 6%",borderBottom:`1px solid ${C.border}`,background:"rgba(8,8,8,0.97)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>
          <a href="/" style={{textDecoration:"none",fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:C.gold,letterSpacing:2}}>VENBRATECH</a>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite"}}/>
            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.lgray,letterSpacing:2}}>AUDITS OPEN · 3 slots left</span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:"80px 6% 60px",textAlign:"center",maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,border:`1px solid rgba(255,68,68,0.3)`,padding:"6px 18px",marginBottom:32,fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:3,color:C.red,textTransform:"uppercase"}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:C.red,animation:"pulse 1.5s infinite"}}/>
          AI Security Audit · 48h Delivery
        </div>
        <h1 className="hero-h" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.4rem,5vw,4rem)",fontWeight:300,color:C.white,lineHeight:1.1,marginBottom:20,letterSpacing:-1}}>
          Your AI pipeline has<br/><span style={{color:C.red,fontWeight:600,fontStyle:"italic"}}>critical vulnerabilities.</span><br/>
          <span style={{color:C.lgray,fontSize:"0.75em"}}>You just don't know it yet.</span>
        </h1>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:C.lgray,maxWidth:640,margin:"0 auto 48px",lineHeight:1.85}}>
          We audit your AI pipeline in 48 hours. Full forensic report with SHA256-verified findings, severity scores, and remediation roadmap. <strong style={{color:C.white}}>Money-back guarantee if we find nothing critical.</strong>
        </p>
        <a href="#audit-form" style={{display:"inline-block",padding:"16px 52px",background:C.gold,color:C.black,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontSize:12,letterSpacing:3,textTransform:"uppercase",fontWeight:700,transition:"all 0.2s"}}>
          Get Audited — $497 →
        </a>
        <div style={{marginTop:16,fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray}}>
          One-time payment · 48h delivery · Full PDF report · Money-back guarantee
        </div>
      </section>

      {/* STATS */}
      <section style={{padding:"40px 6%",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1}}>
          {[{n:"94%",l:"of AI pipelines have critical context loss"},{n:"48h",l:"forensic report delivery"},{n:"$0",l:"if we find nothing critical"},{n:"SHA256",l:"cryptographic verification"},{n:"EU Court",l:"admissible evidence standard"},{n:"V5",l:"eco-lab enterprise suite"}].map((s,i)=>(
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
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:4,color:C.red,textTransform:"uppercase",marginBottom:12}}>What We Find</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,3vw,2.8rem)",fontWeight:300,color:C.white}}>
              3 critical vulnerabilities in<br/><span style={{color:C.gold,fontStyle:"italic"}}>9 out of 10 AI pipelines.</span>
            </h2>
          </div>
          <div className="grid3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {FINDINGS.map((f,i)=>(
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
              How it works
            </h2>
          </div>
          <div className="grid3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:32}}>
            {STEPS.map((s,i)=>(
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
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:4,color:C.gold,textTransform:"uppercase",marginBottom:12}}>Start Your Audit</div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,3vw,2.6rem)",fontWeight:300,color:C.white,marginBottom:12}}>
              Get your report in <span style={{color:C.gold,fontStyle:"italic"}}>48 hours.</span>
            </h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.lgray}}>3 slots available this week</p>
          </div>

          {step===0?(
            <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:16}}>
              {[
                {id:"company",label:"Company name",placeholder:"Acme AI Labs",type:"text"},
                {id:"email",label:"Work email",placeholder:"cto@company.com",type:"email"},
                {id:"repo",label:"GitHub repo or API endpoint",placeholder:"https://github.com/org/repo",type:"text"},
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
                <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:2,color:C.gray,textTransform:"uppercase",display:"block",marginBottom:8}}>Additional context (optional)</label>
                <textarea placeholder="Stack, specific concerns, deadline..."
                  value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}
                  rows={3}
                  style={{width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,color:C.white,fontFamily:"'DM Sans',sans-serif",fontSize:14,resize:"none"}}/>
              </div>
              <button type="submit" className="btn-gold"
                style={{padding:"18px",background:C.gold,border:"none",color:C.black,fontFamily:"'DM Sans',sans-serif",fontSize:13,letterSpacing:3,textTransform:"uppercase",fontWeight:700,cursor:"pointer",transition:"all 0.2s",marginTop:8}}>
                {loading?"Processing...":"Pay $497 & Start Audit →"}
              </button>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.gray,textAlign:"center"}}>
                Secure payment via PayPal · Money-back guarantee · 48h delivery
              </p>
            </form>
          ):(
            <div style={{textAlign:"center",padding:"48px",border:`1px solid rgba(68,255,136,0.3)`,background:"rgba(68,255,136,0.03)"}}>
              <div style={{fontSize:48,marginBottom:20}}>✓</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:C.green,marginBottom:12}}>Audit Request Received</h3>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.lgray,lineHeight:1.75}}>
                Complete your PayPal payment in the new tab. Once confirmed, we'll begin your 48-hour forensic audit. Report delivered to <strong style={{color:C.white}}>{form.email}</strong>
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
