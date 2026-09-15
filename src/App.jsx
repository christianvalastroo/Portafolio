import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, Code2, Mail, Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const Scene3D = lazy(() => import('./components/Scene3D'))

const navItems = [
  { label: 'Home', href: '#home', index: '01' },
  { label: 'Progetti', href: '#progetti', index: '02' },
  { label: 'Chi sono', href: '#chi-sono', index: '03' },
  { label: 'Contatti', href: '#contatti', index: '04' },
]

const projects = [
  {
    number: '01',
    name: 'EasyTrip',
    type: 'Full-stack · Travel planner',
    description: 'Uno spazio personale per progettare viaggi, gestire attività, budget, note e checklist senza perdere il filo.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB'],
    href: 'https://github.com/christianvalastroo/Easytrip',
    accent: '#ff4d1c',
  },
  {
    number: '02',
    name: 'Strive Blog',
    type: 'Full-stack · Publishing platform',
    description: 'Una piattaforma completa con autenticazione, profili, pubblicazione di articoli e conversazioni attraverso i commenti.',
    tech: ['React', 'REST API', 'Authentication', 'MongoDB'],
    href: 'https://github.com/christianvalastroo/M6-Strive-Blog',
    accent: '#8bf5dc',
  },
  {
    number: '03',
    name: 'Invito 18',
    type: 'Frontend · Interactive experience',
    description: 'Un invito digitale pensato per smartphone: una busta argentata si apre e trasforma un gesto semplice in un momento speciale.',
    tech: ['React', 'Vite', 'CSS', 'Motion'],
    href: 'https://github.com/christianvalastroo/invito-18',
    accent: '#f5f1e8',
  },
]

function Loader({ hidden }) {
  return (
    <div className={`loader ${hidden ? 'loader--hidden' : ''}`} aria-hidden={hidden}>
      <div className="loader__panel loader__panel--left" />
      <div className="loader__panel loader__panel--right" />
      <div className="loader__content">
        <div className="loader__mark">CV<span>.</span></div>
        <div className="loader__track"><span /></div>
        <p>Costruendo l’esperienza</p>
      </div>
    </div>
  )
}

function Sidebar({ open, onToggle }) {
  return (
    <>
      <button className="menu-toggle" onClick={onToggle} aria-label={open ? 'Chiudi menu' : 'Apri menu'}>
        {open ? <X /> : <Menu />}
      </button>
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <a className="brand" href="#home" onClick={onToggle}>CV<span>.</span></a>
        <nav aria-label="Navigazione principale">
          {navItems.map((item) => (
            <a href={item.href} key={item.href} onClick={onToggle}>
              <span>{item.index}</span>{item.label}
            </a>
          ))}
        </nav>
        <div className="sidebar__footer">
          <div className="socials">
            <a href="https://github.com/christianvalastroo" target="_blank" rel="noreferrer" aria-label="GitHub"><Code2 /></a>
            <a href="https://www.linkedin.com/in/christian-valastro/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><BriefcaseBusiness /></a>
          </div>
          <p>Catania, IT<br /><span>37.5079° N</span></p>
        </div>
      </aside>
    </>
  )
}

function App() {
  const [loaded, setLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const appRef = useRef()

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1700)
    return () => window.clearTimeout(timer)
  }, [])

  useLayoutEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return undefined

    const context = gsap.context(() => {
      gsap.from('.hero__copy > *', {
        y: 44,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        delay: 1.55,
        ease: 'power3.out',
      })

      gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 82%', end: 'top 42%', scrub: 0.7 },
          y: 120,
          rotateX: index % 2 ? -8 : 8,
          scale: 0.92,
          opacity: 0.25,
          transformPerspective: 1000,
        })
      })

      gsap.from('.skills__orb', {
        scrollTrigger: { trigger: '.skills', start: 'top 78%', end: 'center center', scrub: 1 },
        rotate: -130,
        scale: 0.55,
      })
    }, appRef)

    return () => context.revert()
  }, [])

  return (
    <div className="app-shell" ref={appRef}>
      <Loader hidden={loaded} />
      <Sidebar open={menuOpen} onToggle={() => setMenuOpen((value) => !value)} />

      <main>
        <section className="hero" id="home">
          <div className="hero__grid" aria-hidden="true" />
          <div className="hero__copy">
            <div className="eyebrow"><span />Web developer · Catania</div>
            <h1>
              Build.<br />
              Break.<br />
              <em>Make it better.</em>
            </h1>
            <p>
              Sono Christian Valastro. Trasformo idee in esperienze web veloci,
              curate e semplici da usare.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#progetti">Scopri i progetti <ArrowDownRight /></a>
              <a className="button button--ghost" href="mailto:valastro.dev@outlook.it">Parliamone</a>
            </div>
          </div>

          <div className="hero__visual" aria-label="Scultura tridimensionale interattiva">
            <Suspense fallback={<div className="scene-fallback">Caricamento scena 3D</div>}>
              <Scene3D />
            </Suspense>
            <div className="visual-label visual-label--top">Ideas into<br />real interfaces.</div>
            <div className="visual-label visual-label--bottom">Move your cursor<br />to shape the scene.</div>
          </div>

          <div className="hero__meta">
            <span>React / Node.js / MongoDB</span>
            <span className="availability"><i /> Disponibile per collaborazioni</span>
          </div>

          <a className="scroll-cue" href="#progetti">
            <span>Scroll to explore</span><i />
          </a>
        </section>

        <section className="projects" id="progetti">
          <header className="section-heading">
            <span>02 / Selected work</span>
            <h2>Progetti che risolvono.<br /><em>Interfacce che restano.</em></h2>
            <p>Dal problema al prodotto: ogni progetto racconta una scelta, una sfida e qualcosa che ho imparato.</p>
          </header>

          <div className="projects__list">
            {projects.map((project) => (
              <article className="project-card" key={project.name} style={{ '--project-accent': project.accent }}>
                <div className="project-card__number">{project.number}</div>
                <div className="project-card__stage">
                  <div className="project-card__window">
                    <span /><span /><span />
                    <div className="project-card__code" aria-hidden="true">
                      <i>const idea =</i><b>{`{ ${project.name} }`}</b><i>build → test → improve</i>
                    </div>
                  </div>
                </div>
                <div className="project-card__content">
                  <p>{project.type}</p>
                  <h3>{project.name}</h3>
                  <p className="project-card__description">{project.description}</p>
                  <ul>{project.tech.map((item) => <li key={item}>{item}</li>)}</ul>
                  <a href={project.href} target="_blank" rel="noreferrer">Esplora il codice <ArrowUpRight /></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about" id="chi-sono">
          <div className="about__intro">
            <span>03 / Chi sono</span>
            <h2>Curiosità,<br />codice e <em>costanza.</em></h2>
          </div>
          <div className="about__copy">
            <p className="about__lead">Sono Christian Valastro, web developer di Catania.</p>
            <p>Creo applicazioni moderne e intuitive, curando sia l’esperienza visiva sia la struttura tecnica. Sto costruendo il mio percorso full-stack attraverso progetti concreti, sperimentazione continua e attenzione ai dettagli.</p>
            <a href="mailto:valastro.dev@outlook.it">Scrivimi una mail <ArrowUpRight /></a>
          </div>
        </section>

        <section className="skills">
          <div className="skills__orb" aria-hidden="true"><span>{`{ }`}</span></div>
          <div className="skills__content">
            <span>04 / Stack</span>
            <h2>Gli strumenti cambiano.<br /><em>Il modo di pensare resta.</em></h2>
            <div className="skills__grid">
              <div><small>Frontend</small><p>HTML · CSS · JavaScript<br />React · Tailwind</p></div>
              <div><small>Backend</small><p>Node.js · Express<br />MongoDB · REST API</p></div>
              <div><small>Workflow</small><p>Git · GitHub<br />Vite · Vercel · Render</p></div>
            </div>
          </div>
        </section>

        <footer className="contact" id="contatti">
          <span>05 / Iniziamo</span>
          <h2>Hai un’idea?<br /><em>Facciamola funzionare.</em></h2>
          <a className="contact__mail" href="mailto:valastro.dev@outlook.it">
            <Mail /> valastro.dev@outlook.it <ArrowUpRight />
          </a>
          <div className="contact__bottom">
            <p>Christian Valastro · Web developer · Catania</p>
            <div><a href="https://github.com/christianvalastroo">GitHub</a><a href="https://www.linkedin.com/in/christian-valastro/">LinkedIn</a></div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
