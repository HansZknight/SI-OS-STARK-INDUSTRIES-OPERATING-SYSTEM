// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - ARC REACTOR WIDGET
// Real-time arc reactor status monitoring widget
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Activity, Shield, Cpu, AlertTriangle, Power, Battery } from 'lucide-react'

const ArcReactorWidget = () => {
  const [energyLevel, setEnergyLevel] = useState(85)
  const [coreTemp, setCoreTemp] = useState(72)
  const [efficiency, setEfficiency] = useState(94)
  const [isStable, setIsStable] = useState(true)
  const [powerOutput, setPowerOutput] = useState(3.2)
  const [plasmaLevel, setPlasmaLevel] = useState(67)
  const [magneticField, setMagneticField] = useState(92)
  const [warnings, setWarnings] = useState([])
  const [isOnline, setIsOnline] = useState(true)
  const [pulseIntensity, setPulseIntensity] = useState(1)
  const [isOverclocked, setIsOverclocked] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState(null)
  const [reactorMode, setReactorMode] = useState('normal') // normal, boost, eco
  const [showDetails, setShowDetails] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)
  const canvasRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOnline) return
      
      const baseMultiplier = reactorMode === 'boost' ? 1.5 : reactorMode === 'eco' ? 0.7 : 1
      const tempMultiplier = isOverclocked ? 1.3 : 1
      
      setEnergyLevel(prev => {
        const change = (Math.random() - 0.5) * 2 * baseMultiplier
        const target = reactorMode === 'boost' ? 95 : reactorMode === 'eco' ? 75 : 85
        return Math.max(70, Math.min(98, prev + change * 0.3 + (target - prev) * 0.1))
      })
      setCoreTemp(prev => {
        const change = (Math.random() - 0.5) * 1 * tempMultiplier
        const baseTemp = reactorMode === 'boost' ? 78 : reactorMode === 'eco' ? 68 : 72
        return Math.max(65, Math.min(82, prev + change * 0.3 + (baseTemp - prev) * 0.1))
      })
      setEfficiency(prev => {
        const change = (Math.random() - 0.5) * 1
        const target = reactorMode === 'eco' ? 96 : reactorMode === 'boost' ? 88 : 94
        return Math.max(85, Math.min(99, prev + change * 0.3 + (target - prev) * 0.1))
      })
      setPowerOutput(prev => {
        const change = (Math.random() - 0.5) * 0.2 * baseMultiplier
        const target = reactorMode === 'boost' ? 3.8 : reactorMode === 'eco' ? 2.5 : 3.2
        return Math.max(2.2, Math.min(4.0, prev + change * 0.3 + (target - prev) * 0.1))
      })
      setPlasmaLevel(prev => {
        const change = (Math.random() - 0.5) * 3 * baseMultiplier
        const target = reactorMode === 'boost' ? 75 : reactorMode === 'eco' ? 60 : 67
        return Math.max(55, Math.min(80, prev + change * 0.3 + (target - prev) * 0.1))
      })
      setMagneticField(prev => {
        const change = (Math.random() - 0.5) * 2
        return Math.max(85, Math.min(98, prev + change * 0.2))
      })
      setIsStable(Math.random() > (reactorMode === 'boost' ? 0.25 : 0.1))
      setPulseIntensity(0.8 + Math.random() * 0.4 * (isOverclocked ? 1.5 : 1))
      
      // Enhanced warnings based on mode
      if (Math.random() > (reactorMode === 'boost' ? 0.85 : 0.95)) {
        const modeWarnings = {
          boost: [
            'Core temperature critical!',
            'Plasma instability detected',
            'Magnetic field fluctuation',
            'Overclock stress warning'
          ],
          normal: [
            'Plasma fluctuation detected',
            'Magnetic field adjustment',
            'Core temperature optimization',
            'Energy grid synchronization'
          ],
          eco: [
            'Low power mode active',
            'Efficiency optimized',
            'Energy conservation mode'
          ]
        }
        const newWarnings = modeWarnings[reactorMode]
        setWarnings([newWarnings[Math.floor(Math.random() * newWarnings.length)]])
        setTimeout(() => setWarnings([]), 3000)
      }
    }, reactorMode === 'boost' ? 1000 : 1500)

    return () => clearInterval(interval)
  }, [isOnline, reactorMode, isOverclocked])

  const handleReactorClick = () => {
    setInteractionCount(prev => prev + 1)
    if (interactionCount >= 4) {
      setIsOverclocked(!isOverclocked)
      setInteractionCount(0)
      setWarnings([isOverclocked ? 'Overclock disabled' : 'OVERCLOCK ACTIVATED!'])
      setTimeout(() => setWarnings([]), 2000)
    }
  }

  const handleModeChange = (mode) => {
    setReactorMode(mode)
    setWarnings([`Reactor mode: ${mode.toUpperCase()}`])
    setTimeout(() => setWarnings([]), 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div
      className="hud-panel p-5 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-arc-500/10 via-jarvis-500/5 to-stark-dark/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-arc-500/5 to-transparent pointer-events-none" />
      
      {/* Animated Grid Background */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00d4ff" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Enhanced Header with Mode Controls */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
              reactorMode === 'boost' ? 'from-red-500 via-orange-400 to-yellow-500' :
              reactorMode === 'eco' ? 'from-green-500 via-emerald-400 to-lime-500' :
              'from-arc-500 via-cyan-400 to-jarvis-500'
            } flex items-center justify-center shadow-lg shadow-arc-500/50`}>
              <Power size={24} className="text-white" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-arc-500/50"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 0, 0.6],
                borderColor: reactorMode === 'boost' ? 
                  ['#ff4444', '#ff8888', '#ff4444'] : 
                  reactorMode === 'eco' ? 
                  ['#44ff44', '#88ff88', '#44ff44'] : 
                  ['#00d4ff', '#00ff88', '#00d4ff']
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute -inset-1 rounded-full border border-cyan-400/30"
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white tracking-wide">Arc Reactor</h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
              <p className={`text-xs font-medium ${
                !isOnline ? 'text-red-400' :
                isStable ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {!isOnline ? 'OFFLINE' : 
                 isStable ? 'OPTIMAL' : 'FLUCTUATING'}
              </p>
              {isOverclocked && (
                <span className="text-xs text-red-400 font-bold animate-pulse">OC</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider border shadow-lg ${
            !isOnline ? 'bg-red-400/10 text-red-400 border-red-400/30 shadow-red-400/20' :
            isStable 
              ? 'bg-green-400/10 text-green-400 border-green-400/30 shadow-green-400/20' 
              : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 shadow-yellow-400/20'
          }`}>
            {!isOnline ? 'OFFLINE' : isStable ? 'NOMINAL' : 'CAUTION'}
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className="p-2 rounded-lg bg-stark-light/30 border border-arc-500/20 hover:border-arc-500/40 transition-all"
          >
            <Power size={14} className={isOnline ? 'text-arc-400' : 'text-red-400'} />
          </button>
        </div>
      </motion.div>

      {/* Reactor Mode Controls */}
      <motion.div variants={itemVariants} className="flex gap-2 mb-4">
        {['normal', 'eco', 'boost'].map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`flex-1 py-2 px-3 rounded-lg border font-medium text-xs transition-all ${
              reactorMode === mode
                ? mode === 'boost' 
                  ? 'bg-red-500/20 border-red-500/50 text-red-400 shadow-red-500/30'
                  : mode === 'eco'
                  ? 'bg-green-500/20 border-green-500/50 text-green-400 shadow-green-500/30'
                  : 'bg-arc-500/20 border-arc-500/50 text-arc-400 shadow-arc-500/30'
                : 'bg-stark-light/20 border-stark-light/40 text-white/60 hover:border-arc-500/30'
            }`}
          >
            {mode === 'boost' ? '⚡ BOOST' : mode === 'eco' ? '🌿 ECO' : '⚙️ NORMAL'}
          </button>
        ))}
      </motion.div>

      {/* Interactive Enhanced Core Visualization */}
      <motion.div variants={itemVariants} className="flex justify-center mb-6">
        <div className="relative w-44 h-44">
          {/* Enhanced Pulsing Glow Background */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-arc-500/30 via-cyan-400/20 to-jarvis-500/30 blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: reactorMode === 'boost' ? 1 : 2, repeat: Infinity }}
          />
          
          {/* Clickable Core Container */}
          <motion.div
            className="absolute inset-0 cursor-pointer"
            onClick={handleReactorClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Outer Ring */}
            <motion.div
              className={`absolute inset-0 rounded-full border-3 ${
                reactorMode === 'boost' ? 'border-red-500/60 shadow-red-500/50' : 
                reactorMode === 'eco' ? 'border-green-500/60 shadow-green-500/50' : 
                'border-arc-500/60 shadow-arc-500/50'
              } shadow-lg`}
              animate={{
                rotate: 360,
                borderColor: reactorMode === 'boost' ? 
                  ['#ff4444', '#ff8888', '#ff4444'] : 
                  reactorMode === 'eco' ? 
                  ['#44ff44', '#88ff88', '#44ff44'] : 
                  ['#00d4ff', '#00ff88', '#00d4ff']
              }}
              transition={{ duration: reactorMode === 'boost' ? 6 : 12, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Middle Ring */}
            <motion.div
              className={`absolute inset-2 rounded-full border-2 ${
                reactorMode === 'boost' ? 'border-orange-400/70' : 
                reactorMode === 'eco' ? 'border-emerald-400/70' : 
                'border-cyan-400/70'
              } shadow-lg`}
              animate={{
                rotate: -360,
              }}
              transition={{ duration: reactorMode === 'boost' ? 4 : 9, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner Ring */}
            <motion.div
              className={`absolute inset-5 rounded-full border ${
                reactorMode === 'boost' ? 'border-yellow-400/80' : 
                reactorMode === 'eco' ? 'border-lime-400/80' : 
                'border-jarvis-500/80'
              }`}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: reactorMode === 'boost' ? 3 : 6, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Core Container */}
            <div className={`absolute inset-8 rounded-full bg-gradient-to-br ${
              reactorMode === 'boost' ? 'from-red-500 via-orange-400 to-yellow-500' : 
              reactorMode === 'eco' ? 'from-green-500 via-emerald-400 to-lime-500' : 
              'from-arc-500 via-cyan-400 to-jarvis-500'
            } shadow-2xl flex items-center justify-center`}>
              {/* Inner Core */}
              <motion.div
                className="w-20 h-20 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center border border-white/30"
                animate={{
                  scale: [1, 1.2 * pulseIntensity * (isOverclocked ? 1.3 : 1), 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: reactorMode === 'boost' ? 1.5 : 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: reactorMode === 'boost' ? 0.8 : 1.5, repeat: Infinity }}
                >
                  <Zap size={32} className="text-white drop-shadow-lg" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Energy Particles */}
          {[...Array(16)].map((_, i) => {
            const angle = (i * 22.5) * Math.PI / 180
            const radius = 50 + Math.random() * 20
            return (
              <motion.div
                key={`particle-${i}`}
                className={`absolute w-2 h-2 rounded-full shadow-lg ${
                  reactorMode === 'boost' ? 'bg-gradient-to-r from-red-400 to-orange-300 shadow-red-400/50' :
                  reactorMode === 'eco' ? 'bg-gradient-to-r from-green-400 to-emerald-300 shadow-green-400/50' :
                  'bg-gradient-to-r from-arc-400 to-cyan-300 shadow-arc-400/50'
                }`}
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  rotate: 360,
                  x: [0, radius * Math.cos(angle)],
                  y: [0, radius * Math.sin(angle)],
                  opacity: [0, 1, 0],
                  scale: [0.5, 2, 0.5]
                }}
                transition={{
                  duration: reactorMode === 'boost' ? 1.5 : 2.5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            )
          })}
          
          {/* Plasma Streams */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * Math.PI / 180
            return (
              <motion.div
                key={`stream-${i}`}
                className={`absolute w-1 h-12 bg-gradient-to-b from-transparent ${
                  reactorMode === 'boost' ? 'via-red-400' :
                  reactorMode === 'eco' ? 'via-green-400' :
                  'via-arc-400'
                } to-transparent`}
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: 'center'
                }}
                animate={{
                  rotate: angle,
                  opacity: [0.3, 1, 0.3],
                  height: ['25px', '45px', '25px']
                }}
                transition={{
                  duration: reactorMode === 'boost' ? 2 : 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
              />
            )
          })}
          
          {/* Overclock Indicator */}
          {isOverclocked && (
            <motion.div
              className="absolute -top-2 -right-2 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="text-xs text-red-400 font-bold">OC</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Warnings Display */}
      <AnimatePresence>
        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-2 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center gap-2"
          >
            <AlertTriangle size={14} className="text-yellow-400" />
            <span className="text-xs text-yellow-400">{warnings[0]}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Enhanced Metrics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-4">
        <div 
          className={`p-3 rounded-lg bg-stark-light/30 border transition-all cursor-pointer ${
            selectedMetric === 'energy' 
              ? 'border-arc-500/60 shadow-lg shadow-arc-500/30' 
              : 'border-arc-500/20 hover:border-arc-500/40'
          }`}
          onClick={() => setSelectedMetric(selectedMetric === 'energy' ? null : 'energy')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-arc-400" />
              <span className="text-xs text-white/60 font-medium">Energy</span>
            </div>
            <Battery size={12} className="text-arc-500/50" />
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl font-bold text-white">{energyLevel.toFixed(1)}</span>
            <span className="text-xs text-arc-400">%</span>
          </div>
          <div className="h-2 bg-stark-dark rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full shadow-lg ${
                reactorMode === 'boost' ? 'bg-gradient-to-r from-red-500 to-orange-400 shadow-red-500/30' :
                reactorMode === 'eco' ? 'bg-gradient-to-r from-green-500 to-emerald-400 shadow-green-500/30' :
                'bg-gradient-to-r from-arc-500 via-cyan-400 to-jarvis-500 shadow-arc-500/30'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${energyLevel}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          {selectedMetric === 'energy' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 pt-2 border-t border-arc-500/20 text-xs text-white/60"
            >
              <div className="flex justify-between">
                <span>Stability:</span>
                <span className={isStable ? 'text-green-400' : 'text-yellow-400'}>
                  {isStable ? 'Stable' : 'Unstable'}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        <div 
          className={`p-3 rounded-lg bg-stark-light/30 border transition-all cursor-pointer ${
            selectedMetric === 'temp' 
              ? 'border-arc-500/60 shadow-lg shadow-arc-500/30' 
              : 'border-arc-500/20 hover:border-arc-500/40'
          }`}
          onClick={() => setSelectedMetric(selectedMetric === 'temp' ? null : 'temp')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-arc-400" />
              <span className="text-xs text-white/60 font-medium">Core Temp</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              coreTemp < 70 ? 'bg-green-400' : coreTemp < 75 ? 'bg-yellow-400' : 'bg-red-400'
            } animate-pulse`} />
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl font-bold text-white">{coreTemp.toFixed(0)}</span>
            <span className="text-xs text-arc-400">°C</span>
          </div>
          <div className="h-2 bg-stark-dark rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full shadow-lg ${
                coreTemp < 70 ? 'bg-green-400 shadow-green-400/30' : 
                coreTemp < 75 ? 'bg-yellow-400 shadow-yellow-400/30' : 
                'bg-red-400 shadow-red-400/30'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${(coreTemp - 60) * 2}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          {selectedMetric === 'temp' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 pt-2 border-t border-arc-500/20 text-xs text-white/60"
            >
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={
                  coreTemp < 70 ? 'text-green-400' : 
                  coreTemp < 75 ? 'text-yellow-400' : 
                  'text-red-400'
                }>
                  {coreTemp < 70 ? 'Cool' : coreTemp < 75 ? 'Warm' : 'Hot'}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        <div 
          className={`p-3 rounded-lg bg-stark-light/30 border transition-all cursor-pointer ${
            selectedMetric === 'efficiency' 
              ? 'border-arc-500/60 shadow-lg shadow-arc-500/30' 
              : 'border-arc-500/20 hover:border-arc-500/40'
          }`}
          onClick={() => setSelectedMetric(selectedMetric === 'efficiency' ? null : 'efficiency')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-arc-400" />
              <span className="text-xs text-white/60 font-medium">Efficiency</span>
            </div>
            <span className="text-xs text-green-400">+{efficiency.toFixed(1)}%</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl font-bold text-white">{efficiency.toFixed(1)}</span>
            <span className="text-xs text-arc-400">%</span>
          </div>
          <div className="h-2 bg-stark-dark rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full shadow-lg ${
                reactorMode === 'eco' 
                  ? 'bg-gradient-to-r from-lime-400 to-green-500 shadow-green-400/30'
                  : 'bg-gradient-to-r from-green-400 via-arc-500 to-cyan-400 shadow-green-400/30'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${efficiency}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          {selectedMetric === 'efficiency' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 pt-2 border-t border-arc-500/20 text-xs text-white/60"
            >
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="text-arc-400">{reactorMode.toUpperCase()}</span>
              </div>
            </motion.div>
          )}
        </div>

        <div 
          className={`p-3 rounded-lg bg-stark-light/30 border transition-all cursor-pointer ${
            selectedMetric === 'power' 
              ? 'border-arc-500/60 shadow-lg shadow-arc-500/30' 
              : 'border-arc-500/20 hover:border-arc-500/40'
          }`}
          onClick={() => setSelectedMetric(selectedMetric === 'power' ? null : 'power')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-arc-400" />
              <span className="text-xs text-white/60 font-medium">Power Out</span>
            </div>
            <span className="text-xs text-cyan-400">GW</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl font-bold text-white">{powerOutput.toFixed(2)}</span>
            <span className="text-xs text-arc-400">GW</span>
          </div>
          <div className="h-2 bg-stark-dark rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full shadow-lg ${
                reactorMode === 'boost' 
                  ? 'bg-gradient-to-r from-red-400 to-orange-500 shadow-red-400/30'
                  : 'bg-gradient-to-r from-cyan-400 to-arc-500 shadow-cyan-400/30'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${(powerOutput / 4) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          {selectedMetric === 'power' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 pt-2 border-t border-arc-500/20 text-xs text-white/60"
            >
              <div className="flex justify-between">
                <span>Output:</span>
                <span className="text-cyan-400">
                  {(powerOutput * 1000).toFixed(0)} MW
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Enhanced Status Line with Interactions */}
      <motion.div variants={itemVariants} className="mt-4 pt-3 border-t border-arc-500/20">
        <div className="grid grid-cols-3 gap-4 text-xs mb-3">
          <div className="flex items-center justify-between">
            <span className="text-white/40">Plasma</span>
            <span className="text-cyan-400 font-mono font-bold">{plasmaLevel.toFixed(0)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/40">Mag Field</span>
            <span className="text-arc-400 font-mono font-bold">{magneticField.toFixed(0)} T</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/40">Output</span>
            <span className="text-green-400 font-mono font-bold">{powerOutput.toFixed(2)} GW</span>
          </div>
        </div>
        
        {/* Interactive Tips */}
        <div className="text-center text-xs text-white/30">
          {interactionCount < 2 && "💡 Click reactor core 5 times to overclock"}
          {interactionCount >= 2 && interactionCount < 5 && `🔥 Overclock in ${5 - interactionCount} clicks`}
          {isOverclocked && "⚠️ Overclock active - Click reactor to disable"}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ArcReactorWidget
