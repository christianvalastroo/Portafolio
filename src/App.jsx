import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { ArrowDownRight, BriefcaseBusiness, Code2, Menu, X } from 'lucide-react'
import * as THREE from 'three'
import './App.css'

const navItems = [
  { label: 'Home', href: '#home', index: '01' },
  { label: 'Progetti', href: '#progetti', index: '02' },
  { label: 'Chi sono', href: '#chi-sono', index: '03' },
  { label: 'Contatti', href: '#contatti', index: '04' },
]

function KineticSculpture() {
  const knot = useRef()
  const ring = useRef()

  useFrame((state, delta) => {
    const pointer = state.pointer
    knot.current.rotation.x += delta * 0.16
    knot.current.rotation.y += delta * 0.22
    knot.current.rotation.z = THREE.MathUtils.lerp(knot.current.rotation.z, pointer.x * 0.3, 0.025)
    ring.current.rotation.x = THREE.MathUtils.lerp(ring.current.rotation.x, pointer.y * 0.35, 0.025)
    ring.current.rotation.z -= delta * 0.1
  })

  return (
    <Float speed={1.4} rotationIntensity={0.32} floatIntensity={0.55}>
      <group rotation={[0.25, -0.4, -0.12]}>
        <mesh ref={knot} castShadow>
          <torusKnotGeometry args={[1.2, 0.34, 220, 32, 2, 3]} />
          <meshPhysicalMaterial
            color="#d7d4cf"
            metalness={0.95}
            roughness={0.17}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>
        <mesh ref={ring} rotation={[1.1, 0.15, 0.5]}>
          <torusGeometry args={[1.9, 0.018, 12, 180]} />
          <meshBasicMaterial color="#ff4d1c" toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5.6], fov: 42 }} dpr={[1, 1.7]}>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 4, 4]} intensity={3.5} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={42} color="#ff3d12" distance={8} />
      <pointLight position={[3, 1, 2]} intensity={24} color="#8bf5dc" distance={7} />
      <Suspense fallback={null}>
        <KineticSculpture />
        <Sparkles count={54} scale={[7, 5, 3]} size={1.8} speed={0.25} color="#f5f1e8" opacity={0.45} />
      </Suspense>
    </Canvas>
  )
}

function Loader({ hidden }) {
  return (
    <div className={`loader ${hidden ? 'loader--hidden' : ''}`} aria-hidden={hidden}>
      <div className="loader__mark">CV<span>.</span></div>
      <div className="loader__track"><span /></div>
      <p>Costruendo l’esperienza</p>
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

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1700)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="app-shell">
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
            <Scene />
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

        <section className="project-tease" id="progetti">
          <p>02 / Selected work</p>
          <h2>I progetti non si guardano.<br /><em>Si attraversano.</em></h2>
          <span>EasyTrip · Strive Blog · MyBudget</span>
        </section>
      </main>
    </div>
  )
}

export default App
