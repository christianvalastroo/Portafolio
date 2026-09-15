import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function KineticSculpture() {
  const knot = useRef()
  const ring = useRef()

  useFrame((state, delta) => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
    const scrollProgress = window.scrollY / maxScroll
    knot.current.rotation.x += delta * 0.16
    knot.current.rotation.y += delta * 0.22
    knot.current.rotation.z = THREE.MathUtils.lerp(
      knot.current.rotation.z,
      state.pointer.x * 0.3 + scrollProgress * 1.8,
      0.025,
    )
    knot.current.scale.setScalar(THREE.MathUtils.lerp(knot.current.scale.x, 1 - scrollProgress * 0.32, 0.03))
    ring.current.rotation.x = THREE.MathUtils.lerp(ring.current.rotation.x, state.pointer.y * 0.35, 0.025)
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

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5.6], fov: 42 }} dpr={[1, 1.7]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
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
