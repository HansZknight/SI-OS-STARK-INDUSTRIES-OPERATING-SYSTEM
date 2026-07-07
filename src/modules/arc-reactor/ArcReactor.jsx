// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES - ARC REACTOR CONTROL CENTER
// Primary Power Source Management Interface
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float, Ring, Torus, Cylinder, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Activity, TrendingUp, AlertTriangle, 
  Settings, Power, Battery, Cpu, X,
  ArrowUp, ArrowDown, RefreshCw, Shield,
  Gauge, Thermometer, RadioIcon, Waves
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// ARC REACTOR CORE VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

function ArcReactor3DModel({ powerLevel, isActive }) {
  const coreRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  
  // Power intensity factor (0.5 to 1.5)
  const intensity = (powerLevel / 100) + 0.5
  const baseColor = new THREE.Color(isActive ? "#00d4ff" : "#005577")
  const coreColor = new THREE.Color(isActive ? "#e0ffff" : "#003344")

  useFrame((state, delta) => {
    if (isActive) {
      const speed = intensity * 2
      if (ring1Ref.current) ring1Ref.current.rotation.z -= delta * 0.5 * speed
      if (ring2Ref.current) {
        ring2Ref.current.rotation.x += delta * 0.2 * speed
        ring2Ref.current.rotation.y += delta * 0.3 * speed
      }
      if (ring3Ref.current) {
        ring3Ref.current.rotation.x -= delta * 0.3 * speed
        ring3Ref.current.rotation.z += delta * 0.4 * speed
      }
      if (coreRef.current) {
        // Pulsing scale
        const pulse = 1 + Math.sin(state.clock.elapsedTime * speed * 2) * 0.05
        coreRef.current.scale.set(pulse, pulse, pulse)
      }
    }
  })

  return (
    <group rotation={[Math.PI / 6, Math.PI / 4, 0]}>
      <Float speed={isActive ? 2 : 0} rotationIntensity={isActive ? 0.2 : 0} floatIntensity={isActive ? 0.5 : 0}>
        {/* Central Core */}
        <Sphere ref={coreRef} args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color={coreColor}
            emissive={baseColor}
            emissiveIntensity={isActive ? intensity * 2 : 0.2}
            distort={isActive ? 0.2 : 0}
            speed={isActive ? 4 : 0}
            roughness={0.2}
            metalness={0.8}
            wireframe={!isActive}
          />
        </Sphere>

        {/* Electromagnetic Rings */}
        <group ref={ring1Ref}>
          <Torus args={[2, 0.1, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial 
              color="#111" 
              metalness={0.9} 
              roughness={0.1}
              emissive={baseColor}
              emissiveIntensity={isActive ? intensity * 0.5 : 0}
            />
          </Torus>
          {/* Inner glowing ring */}
          <Torus args={[1.8, 0.05, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color={baseColor} transparent opacity={isActive ? 0.8 : 0.2} />
          </Torus>
        </group>

        {/* Rotating containment rings */}
        <group ref={ring2Ref}>
          <Torus args={[2.5, 0.08, 16, 64]} rotation={[0, Math.PI / 2, 0]}>
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
          </Torus>
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={i} rotation={[0, 0, (Math.PI / 2) * i]}>
              <cylinderGeometry args={[0.05, 0.05, 5, 8]} />
              <meshBasicMaterial color={baseColor} transparent opacity={isActive ? 0.5 : 0.1} />
            </mesh>
          ))}
        </group>

        <group ref={ring3Ref}>
          <Torus args={[3, 0.15, 16, 64]}>
            <meshStandardMaterial color="#111" metalness={1} roughness={0.1} />
          </Torus>
        </group>

        {/* Casing / Housing Base */}
        <Cylinder args={[3.2, 3.5, 0.5, 64]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.3} />
        </Cylinder>
      </Float>
    </group>
  )
}

function ArcReactorCore({ powerLevel, isActive }) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/40 border border-arc-500/20 shadow-[inset_0_0_50px_rgba(0,212,255,0.1)]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />
        <pointLight position={[0, 0, 0]} intensity={isActive ? 2 * (powerLevel/100) : 0.2} color="#00ffff" distance={10} />
        
        <ArcReactor3DModel powerLevel={powerLevel} isActive={isActive} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          maxDistance={12} 
          minDistance={4}
          autoRotate={true}
          autoRotateSpeed={isActive ? 1 : 0.2}
        />
      </Canvas>
      
      {/* Overlay Stats */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
        <div className="hud-panel-angled px-6 py-2 bg-black/60 backdrop-blur-md border border-arc-500/30">
          <div className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-arc-400 to-jarvis-400">
            {powerLevel}%
          </div>
          <div className="text-[10px] text-arc-500 uppercase tracking-[0.2em] text-center">
            {isActive ? 'Core Active' : 'Standby Mode'}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// POWER OUTPUT VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════

function PowerOutputChart() {
  const [powerReadings, setPowerReadings] = useState([])

  useEffect(() => {
    // Generate initial data
    const initialData = Array.from({ length: 30 }, () => 
      2800 + Math.random() * 400
    )
    setPowerReadings(initialData)

    const interval = setInterval(() => {
      setPowerReadings(prev => {
        const newData = [...prev.slice(1)]
        newData.push(2800 + Math.random() * 400)
        return newData
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const maxPower = Math.max(...powerReadings, 3200)
  const minPower = Math.min(...powerReadings, 2800)

  return (
    <div className="h-64 flex items-end justify-between gap-1 p-4">
      {powerReadings.map((reading, index) => {
        const height = ((reading - minPower) / (maxPower - minPower)) * 100
        const intensity = reading / 3200
        
        return (
          <motion.div
            key={index}
            className="flex-1 bg-gradient-to-t from-arc-500/60 to-arc-400 rounded-t"
            style={{ height: `${height}%` }}
            animate={{ 
              height: [`${height}%`, `${height * 0.9}%`, `${height}%`],
              opacity: [0.6 + intensity * 0.4, 0.8, 0.6 + intensity * 0.4]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: index * 0.02
            }}
          />
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ARC REACTOR MODULE
// ═══════════════════════════════════════════════════════════════════════════

// Sound effect for overclocking - High tech power up sound
const playOverclockSound = () => {
  // Create audio context
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  
  // Create oscillator for the main power-up sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Configure oscillator
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.8);
  
  // Configure gain (volume) envelope
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Start and stop the oscillator
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 1);
  
  // Add a secondary higher frequency oscillator for more richness
  const oscillator2 = audioContext.createOscillator();
  const gainNode2 = audioContext.createGain();
  
  oscillator2.type = 'sine';
  oscillator2.frequency.setValueAtTime(500, audioContext.currentTime);
  oscillator2.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.5);
  
  gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode2.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
  gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
  
  oscillator2.connect(gainNode2);
  gainNode2.connect(audioContext.destination);
  
  oscillator2.start();
  oscillator2.stop(audioContext.currentTime + 1);
  
  // Add a click sound at the beginning
  const clickOsc = audioContext.createOscillator();
  const clickGain = audioContext.createGain();
  
  clickOsc.frequency.setValueAtTime(1000, audioContext.currentTime);
  clickGain.gain.setValueAtTime(0.3, audioContext.currentTime);
  clickGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  clickOsc.connect(clickGain);
  clickGain.connect(audioContext.destination);
  
  clickOsc.start();
  clickOsc.stop(audioContext.currentTime + 0.1);
};

export default function ArcReactor() {
  const [powerLevel, setPowerLevel] = useState(98);
  const [isActive, setIsActive] = useState(true);
  const [coreTemp, setCoreTemp] = useState(2847);
  const [outputPower, setOutputPower] = useState(3.2);
  const [efficiency, setEfficiency] = useState(99.7);
  const [plasmaStability, setPlasmaStability] = useState(98.5);
  const [clickCount, setClickCount] = useState(0);
  const [isOverclocking, setIsOverclocking] = useState(false);
  
  // Handle reactor core click
  const handleReactorClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5 && !isOverclocking) {
      // Activate overclocking
      setIsOverclocking(true);
      playOverclockSound();
      
      // Visual effects for overclocking
      setPowerLevel(150);
      setCoreTemp(3500);
      setOutputPower(5.0);
      
      // Add critical warning class to body for global effects
      document.body.classList.add('reactor-critical');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsOverclocking(false);
        setPowerLevel(98);
        setCoreTemp(2847);
        setOutputPower(3.2);
        setClickCount(0);
        document.body.classList.remove('reactor-critical');
      }, 5000);
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerLevel(prev => Math.min(100, Math.max(90, prev + (Math.random() - 0.5) * 2)))
      setCoreTemp(prev => Math.round(2800 + Math.random() * 100))
      setOutputPower(prev => +(3 + Math.random() * 0.4).toFixed(2))
      setEfficiency(prev => +(99 + Math.random()).toFixed(1))
      setPlasmaStability(prev => +(98 + Math.random() * 2).toFixed(1))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const stats = [
    { 
      label: 'Power Level', 
      value: `${powerLevel}%`, 
      icon: Battery, 
      color: 'text-arc-500',
      bg: 'bg-arc-500/10'
    },
    { 
      label: 'Core Temperature', 
      value: `${coreTemp}K`, 
      icon: Thermometer, 
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
    },
    { 
      label: 'Output Power', 
      value: `${outputPower} GW`, 
      icon: Zap, 
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10'
    },
    { 
      label: 'Efficiency', 
      value: `${efficiency}%`, 
      icon: Gauge, 
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    }
  ]

  return (
    <div className="relative min-h-screen">
      {/* Full-screen overclocking warning */}
      {isOverclocking && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Pulsing red background */}
          <motion.div 
            className="absolute inset-0 bg-red-900/90"
            animate={{
              opacity: [0.8, 0.9, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          >
            {/* Emergency grid pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }} />
          </motion.div>

          {/* Warning content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.9, 1.05, 1],
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="mb-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              >
                <AlertTriangle className="mx-auto text-red-400" size={120} strokeWidth={1.5} />
              </motion.div>
              
              <motion.h1 
                className="mt-8 text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-red-600 mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                CRITICAL ALERT
              </motion.h1>
              
              <motion.p 
                className="text-2xl md:text-3xl text-red-200 mb-12"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                REACTOR CORE OVERCLOCKED
              </motion.p>
              
              <motion.div 
                className="text-xl text-red-300/80 font-mono tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="mb-2">
                  <span className="text-red-400">TEMPERATURE:</span> {coreTemp}K
                </div>
                <div className="mb-2">
                  <span className="text-red-400">POWER LEVEL:</span> {powerLevel}%
                </div>
                <div className="text-lg text-red-400/80 mt-6">
                  Emergency shutdown in {5 - Math.floor((Date.now() % 5000) / 1000)} seconds
                </div>
              </motion.div>
            </motion.div>
            
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-red-500/30 m-8"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.5, 0.2, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeOut'
              }}
            />
          </div>
          
          {/* Screen shake effect */}
          <motion.div
            className="absolute inset-0"
            animate={{
              x: [0, -3, 3, -3, 3, -1, 1, -1, 0],
              y: [0, -2, 2, -2, 2, -1, 1, -1, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      )}
      
      {/* Main content */}
      <div className={`space-y-6 relative ${isOverclocking ? 'opacity-20' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Arc Reactor Control Center
            </h1>
            <p className="text-white/60">
              Palladium Core MK IV - Primary Power Source Management
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsActive(!isActive)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              isActive 
                ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20'
            }`}
          >
            <Power size={20} />
            {isActive ? 'SHUTDOWN' : 'ACTIVATE'}
          </motion.button>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Arc Reactor Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1"
          >
            <div className="hud-panel p-6 h-full">
              <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
                Reactor Core
              </h3>
              <div 
                className="aspect-square cursor-pointer relative"
                onClick={handleReactorClick}
              >
                <ArcReactorCore 
                  powerLevel={isOverclocking ? 150 : powerLevel} 
                  isActive={isActive} 
                />
                {isOverclocking && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="text-red-500 font-bold text-lg"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      OVERCLOCKED!
                    </motion.div>
                  </div>
                )}
              </div>
              
              {/* Control Buttons */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                <button className="p-2 rounded-lg bg-stark-light/50 text-white/60 hover:text-white hover:bg-stark-light transition-all">
                  <RefreshCw size={18} />
                </button>
                <button className="p-2 rounded-lg bg-stark-light/50 text-white/60 hover:text-white hover:bg-stark-light transition-all">
                  <Settings size={18} />
                </button>
                <button className="p-2 rounded-lg bg-stark-light/50 text-white/60 hover:text-white hover:bg-stark-light transition-all">
                  <Shield size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Middle Column - Stats & Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hud-panel p-4"
                  >
                    <div className={`inline-flex p-2 rounded-lg ${stat.bg} ${stat.color} mb-3`}>
                      <Icon size={20} />
                    </div>
                    <div className="text-2xl font-bold font-mono text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Power Output Chart */}
            <div className="hud-panel p-6">
              <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
                Power Output History
              </h3>
              <div className="h-64">
                <PowerOutputChart />
              </div>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plasma Containment */}
              <div className="hud-panel p-6">
                <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
                  Plasma Containment
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Stability</span>
                      <span className="text-green-400">{plasmaStability}%</span>
                    </div>
                    <div className="h-2 bg-stark-light rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${plasmaStability}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Magnetic Field</span>
                      <span className="text-arc-400">Nominal</span>
                    </div>
                    <div className="h-2 bg-stark-light rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-arc-500 to-arc-400"
                        initial={{ width: 0 }}
                        animate={{ width: '95%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Cooling System</span>
                      <span className="text-blue-400">Optimal</span>
                    </div>
                    <div className="h-2 bg-stark-light rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Events */}
              <div className="hud-panel p-6">
                <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
                  Recent Events
                </h3>
                <div className="space-y-3">
                  {[
                    { type: 'success', message: 'Reactor started successfully', time: '2 min ago' },
                    { type: 'info', message: 'Power output stabilized', time: '5 min ago' },
                    { type: 'warning', message: 'Temperature spike detected', time: '12 min ago' },
                    { type: 'success', message: 'Maintenance cycle completed', time: '1 hour ago' }
                  ].map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full ${
                        event.type === 'success' ? 'bg-green-400' :
                        event.type === 'warning' ? 'bg-yellow-400' :
                        'bg-arc-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-white/80">{event.message}</p>
                        <p className="text-xs text-white/40">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hud-panel p-6"
        >
          <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
            Quick Controls
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-3 rounded-lg bg-arc-500/10 text-arc-400 border border-arc-500/30 hover:bg-arc-500/20 transition-all">
              <ArrowUp size={20} className="mx-auto mb-1" />
              <div className="text-xs">Increase Output</div>
            </button>
            <button className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20 transition-all">
              <ArrowDown size={20} className="mx-auto mb-1" />
              <div className="text-xs">Decrease Output</div>
            </button>
            <button className="p-3 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-all">
              <Waves size={20} className="mx-auto mb-1" />
              <div className="text-xs">Pulse Mode</div>
            </button>
            <button className="p-3 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all">
              <Shield size={20} className="mx-auto mb-1" />
              <div className="text-xs">Emergency Shield</div>
            </button>
          </div>
        </motion.div>

        {/* Close fullscreen warning button */}
        {isOverclocking && (
          <motion.button
            onClick={() => {
              setIsOverclocking(false);
              setPowerLevel(98);
              setCoreTemp(2847);
              setOutputPower(3.2);
              setClickCount(0);
              document.body.classList.remove('reactor-critical');
            }}
            className="fixed bottom-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <X size={20} />
            Emergency Override
          </motion.button>
        )}
      </div>
    </div>
  )
}