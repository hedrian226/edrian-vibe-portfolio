import { useEffect } from 'react';
import Lanyard from './components/Lanyard';
import './styles.css';

export default function App() {
  useEffect(() => {
    const glow = document.getElementById('glow');

    const move = (e) => {
      glow?.style.setProperty('--mx', `${e.clientX}px`);
      glow?.style.setProperty('--my', `${e.clientY}px`);
    };

    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className="glow" id="glow" />
      <div className="noise" />

      <header>
        <div className="logo"><span className="dot" />vibe.dev</div>
        <nav>
          <ul>
            <li><a href="#about">about</a></li>
            <li><a href="#work">work</a></li>
            <li><a href="#contact">contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow mono">Portfolio — vibe coder</div>
          <h1 className="headline">
            I build in <span className="accent">flow state,</span> not flowcharts.
          </h1>
          <p className="sub">
            No specs, no roadmaps — just an idea, an AI pair, and a keyboard.
            I ship fast, iterate faster, and let the vibe decide what gets built next.
          </p>
          <div className="cta-row">
            <a href="#work" className="btn primary">See the work ↓</a>
            <a href="#contact" className="btn ghost">Say hi</a>
          </div>
        </div>

        <div className="hero-lanyard">
          <Lanyard
            position={[0, 0, 24]}
            gravity={[0, -40, 0]}
            frontImage="/profile.png"
            imageFit="cover"
            lanyardWidth={1}
          />
        </div>

        <div className="waveform" aria-hidden="true">
          {[34,62,44,80,30,58,70,40,54].map((h, i) => (
            <span key={i} style={{ '--h': `${h}px`, animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>

        <div className="scroll-cue"><div className="line" />scroll</div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee">
          {[
            'Vibe coding','AI pair programming','Rapid prototyping',
            'Shipping over planning','Frontend','Full stack',
            'Vibe coding','AI pair programming','Rapid prototyping',
            'Shipping over planning','Frontend','Full stack'
          ].map((item, i) => <span key={i}><b>{item}</b></span>)}
        </div>
      </div>

      <section id="about">
        <div className="section-head reveal">
          <span className="num mono">01</span><h2>About</h2>
        </div>
        <div className="about-grid">
          <div className="reveal">
            <p>I'm a <strong>vibe coder</strong> — I work fast, trust momentum over meetings, and treat every project like a jam session with an AI co-pilot. Ideas turn into working products in hours, not sprints.</p>
            <p>This site is a running log of what I ship. Right now it's one live project — <strong>more are already in the oven</strong> and will land here as soon as they're ready.</p>
          </div>
          <div className="reveal">
            <div className="stat-card"><div className="n">1</div><div className="l">Live project shipped</div></div>
            <div className="stat-card"><div className="n">∞</div><div className="l">Ideas in the pipeline</div></div>
          </div>
        </div>
      </section>

      <section id="work">
        <div className="section-head reveal">
          <span className="num mono">02</span><h2>Work</h2>
        </div>
        <div className="projects">
          <div className="project-card reveal">
            <div className="project-info">
              <span className="tag mono">Web App · Live</span>
              <h3>Roll Call</h3>
              <p>A clean, fast attendance app — check people in, track who's here, and keep roll call painless. Built and shipped end to end.</p>
              <a className="project-link" href="https://roll-call-app-tau.vercel.app/" target="_blank" rel="noopener noreferrer">
                Visit the live app
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
            <a href="https://roll-call-app-tau.vercel.app/" target="_blank" rel="noopener noreferrer" className="browser-frame">
              <div className="browser-bar">
                <span className="dot" /><span className="dot" /><span className="dot" />
                <span className="url">roll-call-app-tau.vercel.app</span>
              </div>
              <div className="browser-body">
                <div className="mock-ui">
                  {[1,2,3].map((x) => (
                    <div className="mock-row" key={x}>
                      <div className="mock-avatar" /><div className="mock-bar" /><div className="mock-check" />
                    </div>
                  ))}
                </div>
              </div>
            </a>
          </div>

          <div className="project-card soon reveal">
            <div className="plus">+</div>
            <span className="tag mono">In progress</span>
            <h3>Next one's cooking</h3>
            <p>More projects are on the way — this space fills up as soon as they ship.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact reveal">
        <div className="section-head contact-head">
          <span className="num mono">03</span>
          <h2>Contact</h2>
        </div>
        <h2>Got an idea? Let's <span className="accent">vibe it into existence.</span></h2>
        <a href="mailto:hedrian226@gmail.com" className="btn primary">hedrian226@gmail.com</a>
      </section>

      <footer>
        <span>© 2026 vibe.dev — built by feel</span>
        <div className="socials">
          <a href="#" onClick={(e) => e.preventDefault()}>GitHub</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Twitter</a>
          <a href="#" onClick={(e) => e.preventDefault()}>LinkedIn</a>
        </div>
      </footer>
    </>
  );
}
