import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

const CoreSphere = ({ state }) => {
  const innerRef = useRef();
  const middleRef = useRef();
  const outerRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();

  // Define colors based on state
  // state: 'idle' (blue), 'processing' (cyan), 'listening' (orange/red)
  const colors = useMemo(() => {
    switch (state) {
      case 'processing':
        return { main: '#22d3ee', glow: '#06b6d4', secondary: '#67e8f9' }; // Cyan
      case 'listening':
        return { main: '#f97316', glow: '#ea580c', secondary: '#fdba74' }; // Orange
      case 'idle':
      default:
        return { main: '#3b82f6', glow: '#2563eb', secondary: '#93c5fd' }; // Blue
    }
  }, [state]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Adjust speed based on state
    const speedMultiplier = state === 'processing' ? 3 : (state === 'listening' ? 1.5 : 1);
    
    if (innerRef.current) {
      innerRef.current.rotation.y = time * 0.5 * speedMultiplier;
      innerRef.current.rotation.x = time * 0.2 * speedMultiplier;
      
      // Pulse scale
      const scale = 1 + Math.sin(time * 2 * speedMultiplier) * 0.05;
      innerRef.current.scale.set(scale, scale, scale);
    }
    
    if (middleRef.current) {
      middleRef.current.rotation.y = -time * 0.3 * speedMultiplier;
      middleRef.current.rotation.z = time * 0.1 * speedMultiplier;
    }
    
    if (outerRef.current) {
      outerRef.current.rotation.x = time * 0.1 * speedMultiplier;
      outerRef.current.rotation.y = time * 0.2 * speedMultiplier;
    }
    
    if (ringRef1.current) {
      ringRef1.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.2;
      ringRef1.current.rotation.z = time * 1 * speedMultiplier;
    }
    
    if (ringRef2.current) {
      ringRef2.current.rotation.y = Math.PI / 2 + Math.cos(time * 0.4) * 0.2;
      ringRef2.current.rotation.x = -time * 1.5 * speedMultiplier;
    }
  });

  return (
    <group>
      {/* Inner Solid Core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial 
          color={colors.main} 
          emissive={colors.glow} 
          emissiveIntensity={state === 'processing' ? 1.5 : 0.8} 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Middle Wireframe Sphere */}
      <mesh ref={middleRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial 
          color={colors.secondary} 
          wireframe={true} 
          transparent 
          opacity={0.4} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Point Cloud / Wireframe */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2, 2]} />
        <meshBasicMaterial 
          color={colors.main} 
          wireframe={true} 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbital Ring 1 */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color={colors.secondary} transparent opacity={0.6} />
      </mesh>

      {/* Orbital Ring 2 */}
      <mesh ref={ringRef2}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshBasicMaterial color={colors.main} transparent opacity={0.4} />
      </mesh>
      
      {/* Glow Halo */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial 
          color={colors.glow} 
          transparent 
          opacity={state === 'processing' ? 0.15 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export const JarvisCore3D = ({ state = 'idle', className = '' }) => {
  return (
    <div className={`relative w-full h-full min-h-[400px] sm:min-h-[500px] flex items-center justify-center ${className}`}>
      {/* Outer SVG HUD Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <svg viewBox="0 0 500 500" className="w-full h-full max-w-[600px] max-h-[600px] animate-[spin_40s_linear_infinite]">
           <circle cx="250" cy="250" r="230" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 8" />
           <circle cx="250" cy="250" r="215" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="50 20 10 20" />
           {/* Tick marks */}
           {[...Array(36)].map((_, i) => (
             <line 
               key={i}
               x1="250" y1="30" x2="250" y2="40" 
               stroke="#22d3ee" strokeWidth="2"
               transform={`rotate(${i * 10} 250 250)`}
             />
           ))}
        </svg>
      </div>
      
      {/* Reverse Spinning Inner HUD Ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
        <svg viewBox="0 0 500 500" className="w-full h-full max-w-[450px] max-h-[450px] animate-[spin_30s_linear_infinite_reverse]">
           <circle cx="250" cy="250" r="180" fill="none" stroke="#67e8f9" strokeWidth="4" strokeDasharray="100 40 20 40" />
           <circle cx="250" cy="250" r="190" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2 6" />
        </svg>
      </div>

      <div className="absolute inset-0 z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <React.Suspense fallback={null}>
          <CoreSphere state={state} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={state === 'processing' ? 2 : 0.5} 
          />
        </React.Suspense>
      </Canvas>
      </div>
      
      {/* Decorative Overlays */}
      <div className="absolute top-4 left-4 z-20 text-[10px] font-mono text-cyan-500/80 tracking-widest bg-cyan-950/40 px-2 py-1 border border-cyan-500/30">
        J.A.R.V.I.S // NEURAL CORE // {state.toUpperCase()}
      </div>
      
      {/* Center Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 opacity-30">
        <div className="w-8 h-8 border border-cyan-400 rounded-full flex items-center justify-center">
           <div className="w-1 h-1 bg-cyan-300 rounded-full" />
        </div>
        <div className="absolute w-[400px] h-px bg-cyan-500/20" />
        <div className="absolute h-[400px] w-px bg-cyan-500/20" />
      </div>
    </div>
  );
};

export default JarvisCore3D;
