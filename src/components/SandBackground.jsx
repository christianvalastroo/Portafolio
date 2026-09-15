import { useEffect, useRef } from 'react'

function SandBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: 0, y: 0 }
    let particles = []
    let animationFrame
    let width = 0
    let height = 0
    let dpr = 1

    const createParticle = (randomY = true) => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + Math.random() * 30,
      radius: 0.35 + Math.random() * 1.25,
      drift: 0.08 + Math.random() * 0.32,
      lift: 0.12 + Math.random() * 0.42,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.12 + Math.random() * 0.42,
      warm: Math.random() > 0.9,
    })

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.7)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const particleCount = Math.min(360, Math.max(150, Math.round((width * height) / 4300)))
      particles = Array.from({ length: particleCount }, () => createParticle())
    }

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height)

      particles.forEach((particle) => {
        if (!reducedMotion) {
          const wave = Math.sin(time * 0.00045 + particle.phase + particle.y * 0.006)
          particle.x += particle.drift + wave * 0.22 + pointer.x * particle.radius * 0.09
          particle.y -= particle.lift - pointer.y * 0.035

          if (particle.y < -20 || particle.x > width + 30 || particle.x < -30) {
            Object.assign(particle, createParticle(false), { x: Math.random() * width })
          }
        }

        context.beginPath()
        context.fillStyle = particle.warm
          ? `rgba(255, 77, 28, ${particle.alpha * 0.72})`
          : `rgba(245, 241, 232, ${particle.alpha})`
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      })

      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw)
    }

    const handlePointerMove = (event) => {
      pointer.x += ((event.clientX / width) * 2 - 1 - pointer.x) * 0.12
      pointer.y += ((event.clientY / height) * 2 - 1 - pointer.y) * 0.12
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  return <canvas className="sand-background" ref={canvasRef} aria-hidden="true" />
}

export default SandBackground
