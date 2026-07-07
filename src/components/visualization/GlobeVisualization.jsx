import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

function HolographicGlobe() {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.z += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core Sphere (Solid but slightly transparent black) */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#050508"
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Wireframe Overlay */}
      <mesh scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#00d4ff"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Equatorial Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[2.5, 2.5, 2.5]}>
        <ringGeometry args={[0.98, 1, 64]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outer Targeting Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[2.8, 2.8, 2.8]}>
        <ringGeometry args={[0.99, 1, 64]} />
        <meshBasicMaterial
          color="#0066ff"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function GlobeVisualization() {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <HolographicGlobe />
        
        <Stars
          radius={50}
          depth={50}
          count={2000}
          factor={2}
          saturation={0}
          fade
          speed={1}
        />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          zoomSpeed={0.6}
          rotateSpeed={0.4}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
