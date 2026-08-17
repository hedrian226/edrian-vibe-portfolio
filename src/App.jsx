import { useEffect, useMemo, useRef, useState } from 'react';
import Lanyard from './components/Lanyard';
import './styles.css';

const roles = ['VIBE CODER', 'AI BUILDER', 'AUTOMATION MAKER', 'PROBLEM SOLVER'];
const skills = ['React','Vite','JavaScript','HTML/CSS','Supabase','GitHub','Vercel','AI Tools','Automation','Rapid Prototyping'];
const sectionIds = ['top','about','process','work','contact'];
const processSteps = [
  { number:'01', title:'IDEA', copy:'Find the useful core and remove the noise.' },
  { number:'02', title:'PROMPT', copy:'Turn direction into a focused build plan.' },
  { number:'03', title:'PROTOTYPE', copy:'Make the real interaction, then test it fast.' },
  { number:'04', title:'SHIP', copy:'Polish the details and put it in people’s hands.' },
];
const projects = [
  { number:'01', type:'WEB APP · LIVE', title:'Roll Call', description:'A practical attendance platform for teams — employee sign-in, HR controls, daily attendance, PIN protection and reporting.', tags:['React / HTML','Supabase','Vercel'], url:'https://roll-call-app-tau.vercel.app/', preview:'rollcall' },
  { number:'02', type:'COMMERCE · LIVE', title:'MaxCare Shop', description:'A shoppable beauty-supply catalogue for the UAE — product search, category filters, multi-item enquiry building and direct WhatsApp ordering.', tags:['Product Catalog','Enquiry Flow','Vercel'], url:'https://maxcare-shop.vercel.app/', preview:'maxcare' },
  { number:'03', type:'GAME · LIVE', title:'Brew DXB', description:'A pixel-powered coffee-quest game for Dubai — check in at real cafés, earn XP, unlock collectible trading cards and level up your coffee passport.', tags:['Gamification','React / Vite','Vercel'], url:'https://brew-dxb.vercel.app/', preview:'brew' },
];

function useReveal(){
  useEffect(()=>{
    const nodes=document.querySelectorAll('[data-reveal]');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{threshold:.12,rootMargin:'0px 0px -60px 0px'});
    nodes.forEach(n=>observer.observe(n)); return ()=>observer.disconnect();
  },[]);
}
function TiltCard({children,className=''}){
  const ref=useRef(null);
  const move=e=>{const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;el.style.setProperty('--rx',`${(.5-y)*8}deg`);el.style.setProperty('--ry',`${(x-.5)*8}deg`);el.style.setProperty('--mx',`${x*100}%`);el.style.setProperty('--my',`${y*100}%`);};
  const leave=()=>{const el=ref.current;if(!el)return;el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');};
  return <div ref={ref} className={`tilt-card ${className}`} onPointerMove={move} onPointerLeave={leave}>{children}</div>;
}
function RotatingRole(){
  const [index,setIndex]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setIndex(i=>(i+1)%roles.length),2400);return()=>clearInterval(t)},[]);
  return <span className="role-slot" aria-live="polite"><span key={roles[index]} className="role-word">{roles[index]}</span></span>;
}
function MagneticLink({children,className='',strength=.16,...props}){
  const ref=useRef(null);
  const move=e=>{
    const el=ref.current;
    if(!el||window.matchMedia('(hover: none)').matches)return;
    const r=el.getBoundingClientRect();
    el.style.setProperty('--magnetic-x',`${(e.clientX-r.left-r.width/2)*strength}px`);
    el.style.setProperty('--magnetic-y',`${(e.clientY-r.top-r.height/2)*strength}px`);
  };
  const leave=()=>{const el=ref.current;if(!el)return;el.style.setProperty('--magnetic-x','0px');el.style.setProperty('--magnetic-y','0px');};
  return <a ref={ref} className={`magnetic ${className}`} onPointerMove={move} onPointerLeave={leave} {...props}>{children}</a>;
}
function AnimatedNumber({value}){
  const ref=useRef(null);
  const [display,setDisplay]=useState(0);
  useEffect(()=>{
    const node=ref.current;
    if(!node)return undefined;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setDisplay(value);return undefined;}
    let frame;
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting)return;
      const start=performance.now();
      const tick=now=>{const progress=Math.min((now-start)/900,1);setDisplay(Math.round(value*(1-Math.pow(1-progress,3))));if(progress<1)frame=requestAnimationFrame(tick);};
      frame=requestAnimationFrame(tick);observer.disconnect();
    },{threshold:.5});
    observer.observe(node);
    return()=>{observer.disconnect();if(frame)cancelAnimationFrame(frame);};
  },[value]);
  return <b ref={ref}>{display}</b>;
}
function StrokeText({children}){return <span className="stroke-text" aria-label={children}><span className="stroke-text-outline">{children}</span><span className="stroke-text-fill">{children}</span></span>}

export default function App(){
  useReveal();
  const [sectionIndex,setSectionIndex]=useState(0);
  const [cursorMode,setCursorMode]=useState('');
  const [showIntro,setShowIntro]=useState(()=>{
    if(typeof window==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
    try{return sessionStorage.getItem('edrian-intro-seen')!=='1';}catch{return true;}
  });
  const marquee=useMemo(()=>[...skills,...skills],[]);
  useEffect(()=>{
    if(!showIntro)return undefined;
    const timer=setTimeout(()=>{setShowIntro(false);try{sessionStorage.setItem('edrian-intro-seen','1');}catch{/* session storage can be unavailable */}},2450);
    return()=>clearTimeout(timer);
  },[showIntro]);
  useEffect(()=>{
    const onMove=e=>{
      document.documentElement.style.setProperty('--cursor-x',`${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y',`${e.clientY}px`);
      const target=e.target instanceof Element?e.target.closest('[data-cursor]'):null;
      const mode=target?.getAttribute('data-cursor')||'';
      setCursorMode(current=>current===mode?current:mode);
    };
    window.addEventListener('pointermove',onMove,{passive:true});
    return()=>window.removeEventListener('pointermove',onMove);
  },[]);
  useEffect(()=>{
    let frame;
    const update=()=>{
      const max=Math.max(document.documentElement.scrollHeight-window.innerHeight,1);
      let index=0;
      sectionIds.forEach((id,i)=>{const node=document.getElementById(id);if(node&&node.getBoundingClientRect().top<=window.innerHeight*.46)index=i;});
      document.documentElement.style.setProperty('--scroll-progress',String(Math.min(window.scrollY/max,1)));
      setSectionIndex(current=>current===index?current:index);
      frame=undefined;
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll,{passive:true});
    return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);if(frame)cancelAnimationFrame(frame);};
  },[]);
  const year=new Date().getFullYear();
  return <div className={`site-shell ${showIntro?'intro-active':'intro-ready'}`}>
    {showIntro&&<div className="boot-screen" role="status" aria-label="Loading Edrian's portfolio"><div className="boot-scan"/><div className="boot-content"><span className="boot-status"><i/> SYSTEM ONLINE</span><strong>EDRIAN<span>.DEV</span></strong><div className="boot-progress"><i/></div><span className="boot-copy">INITIALIZING CREATIVE SYSTEMS</span></div></div>}
    <div className="cursor-glow" aria-hidden="true"/><div className={`smart-cursor ${cursorMode?'is-active':''}`} aria-hidden="true"><span>{cursorMode}</span></div><div className="grain" aria-hidden="true"/>
    <aside className="scroll-rail" aria-label={`Section ${sectionIndex+1} of ${sectionIds.length}`}><span>{String(sectionIndex+1).padStart(2,'0')}</span><div className="scroll-rail-track"><i/></div><span>{String(sectionIds.length).padStart(2,'0')}</span></aside>
    <header className="site-nav">
      <MagneticLink className="brand" href="#top"><span className="brand-dot"/><span>EDRIAN<span className="brand-dim">.DEV</span></span></MagneticLink>
      <nav><MagneticLink href="#about">about</MagneticLink><MagneticLink href="#work">work</MagneticLink><MagneticLink href="#contact">contact</MagneticLink></nav>
      <MagneticLink className="nav-email" href="mailto:hedrian226@gmail.com">let's talk ↗</MagneticLink>
    </header>
    <main id="top">
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line"/>PORTFOLIO · 2026</div>
            <p className="hero-kicker">I BUILD THINGS WITH <RotatingRole/></p>
            <h1 className="hero-title"><span className="title-line">IDEAS INTO</span><StrokeText>REAL THINGS.</StrokeText></h1>
            <p className="hero-description">I turn rough ideas into useful digital products — from attendance systems and internal tools to interactive web experiences.</p>
            <div className="hero-actions"><MagneticLink href="#work" className="button button-primary" data-cursor="SCROLL">Explore my work <span>↓</span></MagneticLink><MagneticLink href="mailto:hedrian226@gmail.com" className="button button-ghost" data-cursor="MAIL"><span className="status-dot"/> Available for ideas</MagneticLink></div>
            <div className="hero-meta"><span>Based in UAE</span><span className="meta-separator">/</span><span>Building with AI + code</span></div>
          </div>
          <div className="hero-card" data-cursor="DRAG"><div className="lanyard-frame"><Lanyard position={[0,0,24]} gravity={[0,-40,0]} frontImage="/id-card.svg" imageFit="cover" lanyardWidth={1}/></div><div className="lanyard-label"><span>DRAG THE ID</span><span className="label-arrow">↗</span></div></div>
        </div>
        <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><span className="scroll-line"/><span className="hero-index">{String(sectionIndex+1).padStart(2,'0')} / {String(sectionIds.length).padStart(2,'0')}</span></div>
      </section>
      <div className="skill-marquee"><div className="marquee-track">{marquee.map((skill,i)=><span key={`${skill}-${i}`}>{skill}<b>✦</b></span>)}</div></div>
      <section id="about" className="section about-section">
        <div className="section-label" data-reveal><span>01</span><span>ABOUT / APPROACH</span></div>
        <div className="about-layout">
          <div className="about-heading" data-reveal><h2><span>I like the</span><StrokeText>BUILDING</StrokeText><span>part.</span></h2></div>
          <div className="about-copy" data-reveal><p className="lead">I’m a <strong>vibe coder</strong> — I use AI as a creative partner, then turn the idea into something people can actually use.</p><p>My process is simple: understand the problem, prototype quickly, test the real thing, and keep improving until it feels right. I care about clean interfaces, useful automation and shipping.</p><div className="about-stats"><div><strong>03</strong><span>Live products shipped</span></div><div><strong>∞</strong><span>Ideas still loading</span></div><div><strong>24/7</strong><span>Curiosity mode</span></div></div></div>
        </div>
      </section>
      <section id="process" className="section process-section">
        <div className="section-label" data-reveal><span>02</span><span>BUILDING PROCESS</span></div>
        <div className="process-intro" data-reveal><div><span className="process-kicker">FROM VIBE TO VALUE</span><h2>HOW I TURN <StrokeText>ENERGY</StrokeText><br/>INTO OUTPUT.</h2></div><p>Fast doesn’t mean careless. Every build moves through a simple system that keeps the idea useful, focused and ready to ship.</p></div>
        <div className="process-track" data-reveal><div className="process-line"><i/></div>{processSteps.map(step=><article className="process-step" key={step.number}><span className="process-node">{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div>
      </section>
      <section id="work" className="section work-section">
        <div className="section-label" data-reveal><span>03</span><span>SELECTED WORK</span></div>
        <div className="work-intro" data-reveal><h2>Things I've <StrokeText>SHIPPED.</StrokeText></h2><p>Small products, real problems, actual users.</p></div>
        <div className="project-list">{projects.map(project=><TiltCard key={project.number} className="project-card"><a href={project.url} target="_blank" rel="noopener noreferrer" className="project-inner" data-reveal data-cursor="VIEW ↗">
          <div className="project-top"><span className="project-number">{project.number}</span><span className="project-type">{project.type}</span><span className="project-arrow">↗</span></div>
          <div className="project-body"><div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div>
            <div className={`project-preview ${project.preview==='rollcall'?'roll-call-preview':project.preview==='maxcare'?'maxcare-preview':'brew-preview'}`}>
              <div className="preview-top"><i/><i/><i/><span>{project.preview==='rollcall'?'roll-call-app':project.preview==='maxcare'?'maxcare-shop':'brew-dxb'}</span></div>
              <div className="preview-content">
                {project.preview==='rollcall' && <><div className="preview-title">TODAY'S ROLL CALL</div><div className="preview-stat"><AnimatedNumber value={24}/><span>employees</span></div><div className="preview-checkins"><span><i/>E. SANTOS <b>IN</b></span><span><i/>M. CRUZ <b>IN</b></span><span><i/>A. REYES <b>IN</b></span></div><div className="preview-bars"><i style={{'--bar':'72%'}}/><i style={{'--bar':'48%'}}/><i style={{'--bar':'86%'}}/><i style={{'--bar':'58%'}}/></div><div className="preview-toast"><i>✓</i><span>ATTENDANCE SYNCED</span></div></>}
                {project.preview==='maxcare' && <div className="maxcare-screen"><div className="maxcare-nav"><b>max<span>Care</span></b><small>SHOP · WHY · CONTACT</small><i>WHATSAPP</i></div><div className="maxcare-hero"><div><small>DIRECT SALON SUPPLIER · UAE</small><strong>Beauty stock,<br/><em>ready to order.</em></strong><span className="maxcare-button">BROWSE PRODUCTS</span></div><div className="maxcare-products"><span><i/><b>LIGUI</b><small>HAIR COLOUR</small></span><span><i/><b>AIRETTE</b><small>TREATMENT</small></span><span><i/><b>GZQM</b><small>HAIR CARE</small></span></div></div><div className="maxcare-enquiry"><b>02</b><span>PRODUCTS SAVED</span><i>VIEW ENQUIRY ↗</i></div></div>}
                {project.preview==='brew' && <div className="brew-screen"><div className="brew-hud"><span className="brew-logo">BREW <b>DXB</b></span><span className="brew-xp">LVL 1 · 0/150 XP</span></div><div className="brew-cards"><span><i/><b>ROASTERS</b><small>VIBE 98</small></span><span><i/><b>NIGHTJAR</b><small>VIBE 92</small></span><span><i/><b>% ARABICA</b><small>VIBE 94</small></span></div><div className="brew-quest"><b>☕</b><span>TRY 3 NEW CAFÉS</span><i>+100 XP</i></div></div>}
              </div>
            </div>
          </div>
        </a></TiltCard>)}</div>
        <div className="coming-soon" data-reveal><span className="coming-symbol">+</span><div><span className="project-type">NEXT UP</span><h3>More experiments are cooking.</h3></div><span className="coming-copy">This portfolio grows with every thing I ship.</span></div>
      </section>
      <section className="statement-section"><div className="statement-grid"><span className="statement-mark">✦</span><h2 data-reveal><span>DON'T JUST</span><span className="statement-outline">HAVE AN IDEA.</span><span>BUILD IT.</span></h2></div></section>
      <section id="contact" className="section contact-section">
        <div className="section-label" data-reveal><span>04</span><span>CONTACT</span></div>
        <div className="contact-box" data-reveal><div className="contact-copy"><span className="contact-eyebrow">HAVE A PROJECT IN MIND?</span><h2>Let's make<br/><StrokeText>something real.</StrokeText></h2></div><div className="contact-action"><p>For collaborations, ideas, or just saying hello:</p><MagneticLink href="mailto:hedrian226@gmail.com" className="email-link" data-cursor="MAIL">hedrian226@gmail.com <span>↗</span></MagneticLink></div></div>
      </section>
    </main>
    <footer><span>© {year} EDRIAN HERNANDEZ</span><span>BUILT WITH REACT · THREE.JS · AI</span><a href="https://github.com/hedrian226/edrian-vibe-portfolio" target="_blank" rel="noopener noreferrer">GITHUB ↗</a></footer>
  </div>;
}
