// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - ARC REACTOR BACKGROUND
// Subtle 3D background effect
// ═══════════════════════════════════════════════════════════════════════════

import React, { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function BackgroundReactor() {
  const groupRef = useRef()
  const coreRef = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.1
    }
    
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1)
    }
  })

  return (
    <group position={[0, 0, -5]}>
      {/* Core glow */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} />
      </mesh>

      {/* Rings */}
      <group ref={groupRef}>
        {[1, 1.5, 2, 2.5, 3].map((radius, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.02, radius, 64]} />
            <meshBasicMaterial 
              color="#00d4ff" 
              transparent 
              opacity={0.05 - i * 0.008} 
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function ArcReactorBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={1}
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: 'low-power'
        }}
      >
        <Suspense fallback={null}>
          <BackgroundReactor />
        </Suspense>
      </Canvas>
    </div>
  )
}