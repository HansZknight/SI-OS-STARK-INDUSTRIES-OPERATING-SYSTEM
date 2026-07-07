// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// Security & Defense Control - Threat Monitoring
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Eye,
  EyeOff,
  Key,
  UserCheck,
  Globe,
  Server,
  Fingerprint,
  Scan,
  ShieldAlert,
  ShieldCheck,
  Clock,
  MapPin,
  Zap,
  Cpu,
  HardDrive,
  Wifi,
  TrendingUp,
  AlertCircle,
  Brain
} from 'lucide-react'

import { useSecurityStore, useLockdownState } from '../../stores/systemStore'

// Charts
import { SecurityThreatChart } from '../../components/charts'

// Three.js for 3D effects
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

// Toast Notifications
import { toast } from '../../components/ui/Toast'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// 3D Shield Component
const Shield3D = ({ active, intensity = 1 }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current && active) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1 * intensity)
    }
  })
  
  if (!active) return null
  
  return (
    <group>
      {/* Outer Shield Ring */}
      <Torus
        ref={meshRef}
        args={[3, 1, 16, 100]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5 * intensity}
          opacity={0.8}
          transparent
        />
      </Torus>
      
      {/* Inner Shield Core */}
      <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ff0040"
          emissive="#ff0040"
          emissiveIntensity={0.3 * intensity}
          opacity={0.6}
          transparent
        />
      </Sphere>
      
      {/* Energy Particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.1, 8, 8]}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 4,
            Math.sin((i / 8) * Math.PI * 2) * 4,
            0
          ]}
        >
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1}
          />
        </Sphere>
      ))}
    </group>
  )
}

// Real-time Threat Analysis Component
const ThreatAnalysis = ({ threats, lockdownMode }) => {
  const [threatData, setThreatData] = useState([])
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (lockdownMode === 'lockdown') {
        setThreatData([
          { time: new Date().toLocaleTimeString(), level: Math.random() * 100, type: 'Network' },
          { time: new Date().toLocaleTimeString(), level: Math.random() * 100, type: 'Malware' },
          { time: new Date().toLocaleTimeString(), level: Math.random() * 100, type: 'Firewall' },
          { time: new Date().toLocaleTimeString(), level: Math.random() * 100, type: 'Access' }
        ])
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [lockdownMode])
  
  if (lockdownMode !== 'lockdown') return null
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-display font-semibold text-red-500 uppercase tracking-wider">
        Real-time Threat Analysis
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {threatData.map((threat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hud-panel p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-red-400 font-mono">{threat.type}</span>
              <AlertCircle size={16} className="text-red-500" />
            </div>
            <div className="text-lg font-bold text-white">
              {threat.level.toFixed(1)}%
            </div>
            <div className="w-full bg-stark-dark rounded-full h-2 mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${threat.level}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// System Resource Monitor
const ResourceMonitor = ({ lockdownMode }) => {
  const [resources, setResources] = useState({
    cpu: 45,
    memory: 60,
    network: 30,
    storage: 55
  })
  
  useEffect(() => {
    if (lockdownMode === 'lockdown') {
      const interval = setInterval(() => {
        setResources(prev => ({
          cpu: Math.min(95, prev.cpu + Math.random() * 10),
          memory: Math.min(95, prev.memory + Math.random() * 8),
          network: Math.min(95, prev.network + Math.random() * 15),
          storage: Math.min(95, prev.storage + Math.random() * 5)
        }))
      }, 2000)
      
      return () => clearInterval(interval)
    }
  }, [lockdownMode])
  
  if (lockdownMode !== 'lockdown') return null
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-display font-semibold text-orange-500 uppercase tracking-wider">
        System Resource Monitor
      </h3>
      
      <div className="space-y-3">
        {Object.entries(resources).map(([resource, value]) => {
          const icons = {
            cpu: Cpu,
            memory: HardDrive,
            network: Wifi,
            storage: Server
          }
          
          const Icon = icons[resource]
          const status = value > 80 ? 'critical' : value > 60 ? 'warning' : 'normal'
          
          return (
            <motion.div
              key={resource}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-stark-light/50 flex items-center justify-center">
                <Icon size={16} className="text-arc-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60 uppercase">{resource}</span>
                  <span className="text-sm font-bold text-white">{value.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-stark-dark rounded-full h-2">
                  <motion.div
                    className={`h-full rounded-full ${
                      status === 'critical' ? 'bg-red-500' :
                      status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Cinematic Sequence Component
const CinematicLockdown = ({ active }) => {
  const [sequence, setSequence] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)

  const sequences = [
    { delay: 0, duration: 2000, content: 'INITIATING LOCKDOWN PROTOCOL' },
    { delay: 2000, duration: 1500, content: 'ISOLATING NETWORK SYSTEMS' },
    { delay: 3500, duration: 1500, content: 'ACTIVATING DEFENSE SHIELDS' },
    { delay: 5000, duration: 2000, content: 'ENGAGING EMERGENCY PROTOCOLS' },
    { delay: 7000, duration: 2000, content: 'LOCKDOWN COMPLETE' }
  ]
  
  useEffect(() => {
    if (active) {
      setShowOverlay(true)
      setSequence(0)
      
      sequences.forEach((seq, index) => {
        setTimeout(() => {
          setSequence(index)
        }, seq.delay)
      })
      
      setTimeout(() => {
        setShowOverlay(false)
      }, 9000)
    }
  }, [active])
  
  if (!showOverlay) return null
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center pointer-events-none">
      <div className="text-center space-y-8">
        {/* Stark Industries Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1000 }}
          className="w-32 h-32 mx-auto"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-arc-500 to-red-500 flex items-center justify-center">
            <div className="text-4xl font-bold text-white">SI</div>
          </div>
        </motion.div>
        
        {/* Sequence Text */}
        <motion.div
          key={sequence}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          <div className="text-2xl font-mono text-arc-400 uppercase tracking-wider">
            {sequences[sequence]?.content || ''}
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 h-1 bg-stark-dark rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-arc-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: sequences[sequence]?.duration || 1000 }}
            />
          </div>
        </motion.div>
        
        {/* Loading Dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-3 h-3 rounded-full bg-arc-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1000,
                repeat: Infinity,
                delay: dot * 200
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// AI Threat Analysis Component
const AIThreatAnalysis = ({ lockdownMode }) => {
  const [aiAnalysis, setAiAnalysis] = useState({
    threatLevel: 0,
    riskScore: 0,
    recommendations: [],
    analyzing: false
  })
  
  useEffect(() => {
    if (lockdownMode === 'lockdown') {
      setAiAnalysis(prev => ({ ...prev, analyzing: true }))
      
      // Simulate AI analysis
      const analysisInterval = setInterval(() => {
        setAiAnalysis(prev => ({
          ...prev,
          threatLevel: Math.min(100, prev.threatLevel + Math.random() * 15),
          riskScore: Math.min(100, prev.riskScore + Math.random() * 10),
          recommendations: [
            'Isolate affected network segments',
            'Deploy countermeasures',
            'Activate backup systems',
            'Notify security team',
            'Initiate forensic analysis'
          ].slice(0, Math.floor(Math.random() * 3) + 2)
        }))
      }, 2000)
      
      setTimeout(() => {
        clearInterval(analysisInterval)
        setAiAnalysis(prev => ({ ...prev, analyzing: false }))
      }, 10000)
      
      return () => clearInterval(analysisInterval)
    }
  }, [lockdownMode])
  
  if (lockdownMode !== 'lockdown') return null
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-display font-semibold text-purple-500 uppercase tracking-wider">
        AI Threat Analysis
      </h3>
      
      {/* AI Status */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
        <Brain className="w-8 h-8 text-purple-400" />
        <div className="flex-1">
          <div className="text-sm font-medium text-white">
            J.A.R.V.I.S Neural Analysis
          </div>
          <div className="text-xs text-white/60">
            {aiAnalysis.analyzing ? 'Analyzing threat patterns...' : 'Analysis complete'}
          </div>
        </div>
        {aiAnalysis.analyzing && (
          <motion.div
            className="w-2 h-2 rounded-full bg-purple-400"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      
      {/* Threat Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="hud-panel p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-purple-400">Threat Level</span>
            <AlertTriangle className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-white">
            {aiAnalysis.threatLevel.toFixed(1)}%
          </div>
          <div className="w-full bg-stark-dark rounded-full h-2">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-red-500 rounded-full"
              style={{ width: `${aiAnalysis.threatLevel}%` }}
            />
          </div>
        </div>
        
        <div className="hud-panel p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-orange-400">Risk Score</span>
            <Zap className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-white">
            {aiAnalysis.riskScore.toFixed(1)}%
          </div>
          <div className="w-full bg-stark-dark rounded-full h-2">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              style={{ width: `${aiAnalysis.riskScore}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* AI Recommendations */}
      <div className="hud-panel p-4">
        <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
          AI Recommendations
        </h4>
        <div className="space-y-2">
          {aiAnalysis.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 100 }}
              className="flex items-center gap-3 p-2 rounded bg-stark-light/20 border border-purple-500/20"
            >
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-sm text-white/80">{rec}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Holographic Interface Component
const HolographicInterface = ({ lockdownMode }) => {
  const [interfaceActive, setInterfaceActive] = useState(false)
  
  useEffect(() => {
    if (lockdownMode === 'lockdown') {
      setTimeout(() => setInterfaceActive(true), 1000)
    } else {
      setInterfaceActive(false)
    }
  }, [lockdownMode])
  
  if (!interfaceActive) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 48%, rgba(0, 212, 255, 0.1) 49%, transparent 51%),
            linear-gradient(90deg, transparent 48%, rgba(0, 212, 255, 0.1) 49%, transparent 51%),
            linear-gradient(45deg, transparent 48%, rgba(255, 0, 64, 0.05) 49%, transparent 51%),
            linear-gradient(-45deg, transparent 48%, rgba(255, 0, 64, 0.05) 49%, transparent 51%)
          `,
          backgroundSize: '100px 100px, 100px 100px, 200px 200px, 200px 200px',
          animation: 'holographic-scan 4s linear infinite'
        }} />
      </div>
      
      {/* Floating Holographic Elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 border-2 border-arc-500/50 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 2) * 40}%`,
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.5), inset 0 0 20px rgba(0, 212, 255, 0.2)'
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-xs font-mono text-arc-400">
                {['SYS', 'NET', 'SEC', 'AI', 'DEF', 'SHD'][i]}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// System Control Panel
const SystemControlPanel = ({ lockdownMode }) => {
  const [systems, setSystems] = useState({
    network: false,
    ai: false,
    defense: false,
    emergency: false
  })
  
  useEffect(() => {
    if (lockdownMode === 'lockdown') {
      // Sequential system activation
      const systemOrder = ['network', 'ai', 'defense', 'emergency']
      systemOrder.forEach((system, index) => {
        setTimeout(() => {
          setSystems(prev => ({ ...prev, [system]: true }))
        }, index * 500)
      })
    } else {
      setSystems({
        network: false,
        ai: false,
        defense: false,
        emergency: false
      })
    }
  }, [lockdownMode])
  
  if (lockdownMode !== 'lockdown') return null
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-display font-semibold text-cyan-500 uppercase tracking-wider">
        System Control Panel
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(systems).map(([system, active]) => {
          const icons = {
            network: Wifi,
            ai: Brain,
            defense: Shield,
            emergency: AlertTriangle
          }
          const Icon = icons[system]
          
          return (
            <motion.div
              key={system}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`hud-panel p-4 text-center ${
                active ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-stark-light/30'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 ${
                active ? 'text-cyan-400' : 'text-white/40'
              }`} />
              <div className="text-xs font-medium text-white/80 uppercase">
                {system}
              </div>
              <div className={`text-xs mt-1 ${
                active ? 'text-cyan-400' : 'text-white/40'
              }`}>
                {active ? 'ACTIVE' : 'STANDBY'}
              </div>
              {active && (
                <motion.div
                  className="w-2 h-2 bg-cyan-400 rounded-full mx-auto mt-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
const EmergencyProtocols = ({ lockdownMode }) => {
  const [protocols, setProtocols] = useState([
    { id: 1, name: 'Network Isolation', status: 'pending', icon: Wifi },
    { id: 2, name: 'Data Encryption', status: 'pending', icon: Lock },
    { id: 3, name: 'AI Core Lockdown', status: 'pending', icon: Brain },
    { id: 4, name: 'External Access Block', status: 'pending', icon: Shield },
    { id: 5, name: 'System Backup', status: 'pending', icon: Server }
  ])
  
  useEffect(() => {
    if (lockdownMode === 'lockdown') {
      protocols.forEach((protocol, index) => {
        setTimeout(() => {
          setProtocols(prev => prev.map(p => 
            p.id === protocol.id ? { ...p, status: 'active' } : p
          ))
        }, index * 500)
      })
    }
  }, [lockdownMode])
  
  if (lockdownMode !== 'lockdown') return null
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-display font-semibold text-yellow-500 uppercase tracking-wider">
        Emergency Protocols
      </h3>
      
      <div className="space-y-2">
        {protocols.map((protocol) => {
          const Icon = protocol.icon
          return (
            <motion.div
              key={protocol.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                protocol.status === 'active' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-stark-light/20 border-arc-500/20'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                protocol.status === 'active' ? 'bg-green-500/20' : 'bg-stark-light/50'
              }`}>
                <Icon size={16} className={protocol.status === 'active' ? 'text-green-400' : 'text-arc-400'} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{protocol.name}</div>
                <div className="text-xs text-white/60">
                  {protocol.status === 'active' ? '✅ Engaged' : '⏳ Pending'}
                </div>
              </div>
              {protocol.status === 'active' && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

const SecurityMetric = ({ icon: Icon, label, value, status = 'normal', trend = 'neutral', onClick }) => {
  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };
  
  const trendColors = {
    up: 'text-red-400',
    down: 'text-green-400',
    neutral: 'text-arc-400'
  };
  const statusColors = {
    normal: 'text-green-400 bg-green-400/10 border-green-400/20',
    warning: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    critical: 'text-red-400 bg-red-400/10 border-red-400/20'
  }

  return (
    <motion.div
      className={`hud-panel p-5 cursor-pointer ${onClick ? 'hover:border-arc-500/30' : ''}`}
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-lg mb-3 flex items-center justify-center ${statusColors[status]}`}>
        <Icon size={24} />
      </div>
      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-2xl font-display font-bold text-white">{value}</p>
        {trend !== 'neutral' && (
          <span className={`text-sm ${trendColors[trend]} flex items-center`}>
            {trendIcons[trend]} {trend !== 'neutral' ? '5%' : ''}
          </span>
        )}
      </div>
    </motion.div>
  )
}

function Security() {
  const { 
    securityLevel, 
    threatLevel, 
    isLocked, 
    lockSystem, 
    unlockSystem, 
    runSecurityScan, 
    threats, 
    addThreat, 
    resolveThreat,
    accessLogs,
    logAccess
  } = useSecurityStore()
  
  const { 
    lockdownMode,
    initiateLockdown,
    endLockdown,
    updateLockdownDuration,
    setLockdownMode
  } = useLockdownState()
  
  const [scanning, setScanning] = useState(false)
  const [defenseMode, setDefenseMode] = useState('standard')
  const [activeTab, setActiveTab] = useState('overview')
  const [simulateThreats, setSimulateThreats] = useState(false)
  
  // Lockdown duration timer
  useEffect(() => {
    if (lockdownMode === 'lockdown') {
      const timer = setInterval(() => {
        updateLockdownDuration()
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [lockdownMode, updateLockdownDuration])
  
  // Simulate real-time threats
  useEffect(() => {
    if (!simulateThreats) return
    
    const threatTypes = [
      { type: 'network', severity: 'high', message: 'Suspicious network activity detected' },
      { type: 'login', severity: 'medium', message: 'Multiple failed login attempts' },
      { type: 'malware', severity: 'critical', message: 'Potential malware signature detected' },
      { type: 'firewall', severity: 'low', message: 'Firewall rule triggered' },
    ]
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)]
        addThreat({
          ...threat,
          source: `192.168.1.${Math.floor(Math.random() * 255)}`,
          location: `Building ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(100 + Math.random() * 900)}`
        })
      }
    }, 10000)
    
    return () => clearInterval(interval)
  }, [simulateThreats, addThreat])

  const handleScan = async () => {
    setScanning(true)
    toast.system('Security Scan', 'Initiating full system security scan...')
    await runSecurityScan()
    setTimeout(() => {
      setScanning(false)
      toast.success('Scan Complete', 'No threats detected. All systems secure.')
    }, 2000)
  }

  const handleLockToggle = () => {
    if (isLocked) {
      unlockSystem()
      toast.warning('System Unlocked', 'Full network access restored. Stay vigilant.')
    } else {
      lockSystem()
      toast.security('System Locked', 'Network access restricted. Maximum security enabled.')
    }
  }

  const handleDefenseChange = (mode) => {
    console.log('🔥 Defense mode changed to:', mode)
    setDefenseMode(mode)
    
    if (mode === 'lockdown') {
      console.log('🚨 Initiating global lockdown...')
      
      // Test basic functionality first
      try {
        initiateLockdown()
        console.log('✅ Lockdown initiated successfully')
      } catch (error) {
        console.error('❌ Lockdown failed:', error)
      }
      
      // Simple test effect
      document.body.style.backgroundColor = 'red'
      setTimeout(() => {
        document.body.style.backgroundColor = ''
      }, 1000)
      
      // Play lockdown sound effect using Web Audio API
      playLockdownSound()
      
      // Add EXTREME screen shake animation
      document.body.style.animation = 'lockdown-shake-extreme 1.2s ease-in-out'
      setTimeout(() => {
        document.body.style.animation = ''
      }, 1200)
      
      // Create massive visual assault
      const createMassiveFlashEffect = () => {
        console.log('💥 Creating massive flash effect...')
        // Multiple layered flash effects
        const flashLayers = [
          { delay: 0, color: 'bg-red-600/40', duration: 0.4, blur: 'blur-sm' },
          { delay: 100, color: 'bg-orange-500/30', duration: 0.3, blur: 'blur-md' },
          { delay: 200, color: 'bg-red-700/35', duration: 0.35, blur: 'blur-sm' },
          { delay: 350, color: 'bg-yellow-500/25', duration: 0.25, blur: 'blur-lg' },
          { delay: 500, color: 'bg-red-800/30', duration: 0.3, blur: 'blur-xl' }
        ]
        
        flashLayers.forEach(layer => {
          setTimeout(() => {
            const flashOverlay = document.createElement('div')
            flashOverlay.className = `fixed inset-0 ${layer.color} ${layer.blur} z-50 pointer-events-none`
            flashOverlay.style.animation = `flash-fade ${layer.duration}s ease-out`
            document.body.appendChild(flashOverlay)
            setTimeout(() => {
              if (document.body.contains(flashOverlay)) {
                document.body.removeChild(flashOverlay)
              }
            }, layer.duration * 1000)
          }, layer.delay)
        })
      }
      
      createMassiveFlashEffect()
      
      // Create particle explosion system
      const createParticleExplosion = () => {
        console.log('🎆 Creating particle explosion...')
        const explosionContainer = document.createElement('div')
        explosionContainer.className = 'fixed inset-0 pointer-events-none z-40'
        explosionContainer.style.animation = 'fade-out 3s ease-out forwards'
        
        // Create multiple explosion waves
        for (let wave = 0; wave < 3; wave++) {
          setTimeout(() => {
            for (let i = 0; i < 20; i++) {
              const particle = document.createElement('div')
              const size = Math.random() * 6 + 2
              const hue = Math.random() * 60 // Red to orange range
              
              particle.className = `absolute rounded-full bg-gradient-to-r from-red-500 to-orange-500`
              particle.style.width = `${size}px`
              particle.style.height = `${size}px`
              particle.style.left = `${50 + (Math.random() - 0.5) * 30}%`
              particle.style.top = `${50 + (Math.random() - 0.5) * 30}%`
              particle.style.filter = `hue-rotate(${hue}deg) blur(0.5px)`
              particle.style.boxShadow = `0 0 ${size}px rgba(239, 68, 68, 0.8)`
              
              // Explosive movement
              const tx = (Math.random() - 0.5) * 500
              const ty = (Math.random() - 0.5) * 500
              const rotation = Math.random() * 720
              
              particle.style.setProperty('--tx', `${tx}px`)
              particle.style.setProperty('--ty', `${ty}px`)
              particle.style.setProperty('--rotation', `${rotation}deg`)
              particle.style.animation = `particle-explosion ${1.5 + Math.random()}s ease-out forwards`
              particle.style.animationDelay = `${Math.random() * 0.3}s`
              
              explosionContainer.appendChild(particle)
            }
          }, wave * 200)
        }
        
        document.body.appendChild(explosionContainer)
        setTimeout(() => {
          if (document.body.contains(explosionContainer)) {
            document.body.removeChild(explosionContainer)
          }
        }, 3000)
      }
      
      createParticleExplosion()
      
      // Create scanning grid effect
      const createScanningGrid = () => {
        console.log('🔍 Creating scanning grid...')
        const gridContainer = document.createElement('div')
        gridContainer.className = 'fixed inset-0 pointer-events-none z-30'
        gridContainer.style.background = `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 10px,
            rgba(239, 68, 68, 0.1) 10px,
            rgba(239, 68, 68, 0.1) 11px,
            transparent 11px,
            transparent 20px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 10px,
            rgba(239, 68, 68, 0.1) 10px,
            rgba(239, 68, 68, 0.1) 11px,
            transparent 11px,
            transparent 20px
          )
        `
        gridContainer.style.animation = 'scanning-grid-pulse 2s ease-in-out'
        document.body.appendChild(gridContainer)
        
        setTimeout(() => {
          if (document.body.contains(gridContainer)) {
            document.body.removeChild(gridContainer)
          }
        }, 2000)
      }
      
      createScanningGrid()
      
      // Add border alert effect to all panels with wave
      const panels = document.querySelectorAll('.hud-panel')
      console.log('🔴 Found panels for alert:', panels.length)
      panels.forEach((panel, index) => {
        setTimeout(() => {
          panel.style.transition = 'all 0.3s ease'
          panel.style.borderColor = 'rgba(239, 68, 68, 1)'
          panel.style.boxShadow = `
            0 0 50px rgba(239, 68, 68, 0.8),
            0 0 100px rgba(239, 68, 68, 0.4),
            inset 0 0 30px rgba(239, 68, 68, 0.2),
            inset 0 0 60px rgba(239, 68, 68, 0.1)
          `
          panel.style.transform = 'scale(1.02)'
          
          setTimeout(() => {
            panel.style.borderColor = 'rgba(239, 68, 68, 0.6)'
            panel.style.transform = 'scale(1.01)'
          }, 300)
          
          setTimeout(() => {
            panel.style.borderColor = ''
            panel.style.boxShadow = ''
            panel.style.transform = ''
          }, 2000)
        }, index * 50)
      })
      
      // Create warning text overlay
      const createWarningOverlay = () => {
        console.log('⚠️ Creating warning overlay...')
        const warningOverlay = document.createElement('div')
        warningOverlay.className = 'fixed inset-0 flex items-center justify-center z-45 pointer-events-none'
        warningOverlay.innerHTML = `
          <div class="text-center" style="animation: warning-zoom 1.5s ease-out forwards">
            <div class="text-8xl font-bold text-red-500 mb-4" style="text-shadow: 0 0 50px rgba(239, 68, 68, 0.8), 0 0 100px rgba(239, 68, 68, 0.4); animation: warning-pulse 0.5s ease-in-out infinite;">
              ⚠️ LOCKDOWN ⚠️
            </div>
            <div class="text-2xl text-red-400 font-semibold" style="animation: warning-fade 1.5s ease-out forwards;">
              SECURITY PROTOCOL ENGAGED
            </div>
          </div>
        `
        document.body.appendChild(warningOverlay)
        setTimeout(() => {
          if (document.body.contains(warningOverlay)) {
            document.body.removeChild(warningOverlay)
          }
        }, 1500)
      }
      
      createWarningOverlay()
      
      // Phase 2: Advanced Defense Visualization
      const createAdvancedDefenseEffects = () => {
        console.log('🛡️ Creating advanced defense effects...')
        
        // Create Energy Field Effect
        const createEnergyField = () => {
          const energyField = document.createElement('div')
          energyField.className = 'fixed inset-0 pointer-events-none z-20'
          energyField.style.background = `
            radial-gradient(circle at center, 
              rgba(0, 212, 255, 0.1) 0%, 
              rgba(0, 212, 255, 0.05) 30%, 
              transparent 70%
            ),
            conic-gradient(from 0deg at center,
              rgba(0, 212, 255, 0.1) 0deg,
              rgba(255, 0, 64, 0.1) 90deg,
              rgba(0, 212, 255, 0.1) 180deg,
              rgba(255, 0, 64, 0.1) 270deg,
              rgba(0, 212, 255, 0.1) 360deg
            )
          `
          energyField.style.animation = 'energy-field 4s ease-in-out infinite'
          energyField.style.mixBlendMode = 'screen'
          document.body.appendChild(energyField)
          
          setTimeout(() => {
            if (document.body.contains(energyField)) {
              document.body.removeChild(energyField)
            }
          }, 5000)
        }
        
        // Create Holographic Defense Grid
        const createHolographicGrid = () => {
          const gridContainer = document.createElement('div')
          gridContainer.className = 'fixed inset-0 pointer-events-none z-25'
          
          // Create multiple grid layers
          for (let layer = 0; layer < 3; layer++) {
            const grid = document.createElement('div')
            grid.className = 'absolute inset-0'
            grid.style.background = `
              repeating-linear-gradient(
                ${layer * 30}deg,
                transparent,
                transparent ${20 + layer * 10}px,
                rgba(0, 212, 255, ${0.05 - layer * 0.01}) ${20 + layer * 10}px,
                rgba(0, 212, 255, ${0.05 - layer * 0.01}) ${21 + layer * 10}px,
                transparent ${21 + layer * 10}px,
                transparent ${40 + layer * 20}px
              )
            `
            grid.style.animation = `shield-rotate ${3 + layer}s linear infinite`
            grid.style.opacity = 1 - layer * 0.2
            gridContainer.appendChild(grid)
          }
          
          document.body.appendChild(gridContainer)
          
          setTimeout(() => {
            if (document.body.contains(gridContainer)) {
              document.body.removeChild(gridContainer)
            }
          }, 4000)
        }
        
        // Create Defense Orbs
        const createDefenseOrbs = () => {
          const orbsContainer = document.createElement('div')
          orbsContainer.className = 'fixed inset-0 pointer-events-none z-15'
          
          // Create floating defense orbs
          for (let i = 0; i < 12; i++) {
            const orb = document.createElement('div')
            const size = Math.random() * 30 + 20
            const x = Math.random() * 100
            const y = Math.random() * 100
            
            orb.className = 'absolute rounded-full'
            orb.style.width = `${size}px`
            orb.style.height = `${size}px`
            orb.style.left = `${x}%`
            orb.style.top = `${y}%`
            orb.style.background = `radial-gradient(circle, rgba(0, 212, 255, 0.8), rgba(0, 212, 255, 0.2), transparent)`
            orb.style.boxShadow = `0 0 ${size}px rgba(0, 212, 255, 0.6), 0 0 ${size * 2}px rgba(0, 212, 255, 0.3)`
            orb.style.animation = `shield-pulse ${2 + Math.random() * 2}s ease-in-out infinite`
            
            // Floating motion
            const floatX = (Math.random() - 0.5) * 100
            const floatY = (Math.random() - 0.5) * 100
            orb.style.transform = `translate(${floatX}px, ${floatY}px)`
            
            orbsContainer.appendChild(orb)
          }
          
          document.body.appendChild(orbsContainer)
          
          setTimeout(() => {
            if (document.body.contains(orbsContainer)) {
              document.body.removeChild(orbsContainer)
            }
          }, 6000)
        }
        
        // Create Laser Defense Lines
        const createLaserDefense = () => {
          const laserContainer = document.createElement('div')
          laserContainer.className = 'fixed inset-0 pointer-events-none z-18'
          
          // Create laser grid lines
          for (let i = 0; i < 8; i++) {
            const laser = document.createElement('div')
            laser.className = 'absolute bg-gradient-to-r from-transparent via-cyan-500 to-transparent'
            laser.style.height = '1px'
            laser.style.width = '100%'
            laser.style.top = `${12.5 + i * 12.5}%`
            laser.style.opacity = '0'
            laser.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.8)'
            laser.style.animation = `laser-sweep ${2 + i * 0.2}s ease-in-out infinite`
            laser.style.animationDelay = `${i * 0.1}s`
            
            laserContainer.appendChild(laser)
          }
          
          document.body.appendChild(laserContainer)
          
          setTimeout(() => {
            if (document.body.contains(laserContainer)) {
              document.body.removeChild(laserContainer)
            }
          }, 4500)
        }
        
        createEnergyField()
        createHolographicGrid()
        createDefenseOrbs()
        createLaserDefense()
      }
      
      createAdvancedDefenseEffects()
      
      // Show global lockdown notification
      toast.error('🚨🔥 GLOBAL LOCKDOWN INITIATED 🔥🚨', '⚡ ALL SYSTEMS ISOLATED ⚡ MAXIMUM SECURITY PROTOCOLS ENGAGED ⚡', {
        duration: 15000,
        priority: 'critical'
      })
      
    } else if (mode === 'stealth') {
      try {
        setLockdownMode('stealth')
        console.log('✅ Stealth mode activated')
      } catch (error) {
        console.error('❌ Stealth mode failed:', error)
      }
      toast.security('STEALTH MODE', 'System signature minimized. External visibility reduced.')
    } else {
      try {
        setLockdownMode('standard')
        console.log('✅ Standard mode activated')
      } catch (error) {
        console.error('❌ Standard mode failed:', error)
      }
      toast.system('Standard Mode', 'Normal security protocols restored.')
    }
  }

  const playLockdownSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Create a more dramatic alarm sound with multiple layers
      const oscillator1 = audioContext.createOscillator()
      const oscillator2 = audioContext.createOscillator()
      const oscillator3 = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()
      
      // Connect nodes for richer sound
      oscillator1.connect(filter)
      oscillator2.connect(filter)
      oscillator3.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Set filter for more dramatic effect
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(2000, audioContext.currentTime)
      filter.Q.setValueAtTime(10, audioContext.currentTime)
      
      // Set oscillator frequencies for complex alarm
      oscillator1.type = 'sawtooth'
      oscillator1.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator1.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5)
      
      oscillator2.type = 'square'
      oscillator2.frequency.setValueAtTime(200, audioContext.currentTime)
      
      oscillator3.type = 'sine'
      oscillator3.frequency.setValueAtTime(1200, audioContext.currentTime)
      oscillator3.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3)
      
      // Create dramatic gain envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 0.5)
      
      // Start and stop oscillators
      oscillator1.start(audioContext.currentTime)
      oscillator2.start(audioContext.currentTime)
      oscillator3.start(audioContext.currentTime)
      oscillator1.stop(audioContext.currentTime + 0.5)
      oscillator2.stop(audioContext.currentTime + 0.5)
      oscillator3.stop(audioContext.currentTime + 0.3)
      
      // Add second alarm sequence after delay
      setTimeout(() => {
        try {
          const osc1 = audioContext.createOscillator()
          const osc2 = audioContext.createOscillator()
          const gain = audioContext.createGain()
          const filter2 = audioContext.createBiquadFilter()
          
          osc1.connect(filter2)
          osc2.connect(filter2)
          filter2.connect(gain)
          gain.connect(audioContext.destination)
          
          filter2.type = 'bandpass'
          filter2.frequency.setValueAtTime(1000, audioContext.currentTime)
          filter2.Q.setValueAtTime(5, audioContext.currentTime)
          
          osc1.type = 'triangle'
          osc1.frequency.setValueAtTime(600, audioContext.currentTime)
          osc2.frequency.setValueAtTime(300, audioContext.currentTime)
          
          gain.gain.setValueAtTime(0, audioContext.currentTime)
          gain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.03)
          gain.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.3)
          
          osc1.start(audioContext.currentTime)
          osc2.start(audioContext.currentTime)
          osc1.stop(audioContext.currentTime + 0.3)
          osc2.stop(audioContext.currentTime + 0.3)
        } catch (e) {
          console.log('Second alarm sequence failed:', e)
        }
      }, 700)
      
      // Add third warning beep
      setTimeout(() => {
        try {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          osc.connect(gain)
          gain.connect(audioContext.destination)
          
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(1500, audioContext.currentTime)
          gain.gain.setValueAtTime(0, audioContext.currentTime)
          gain.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.02)
          gain.gain.exponentialRampToValueAtTime(0, audioContext.currentTime + 0.15)
          
          osc.start(audioContext.currentTime)
          osc.stop(audioContext.currentTime + 0.15)
        } catch (e) {
          console.log('Third beep failed:', e)
        }
      }, 1100)
      
    } catch (error) {
      console.log('Audio context not available:', error)
      // Fallback: try to play a simple audio file
      const audio = new Audio('/assets/sounds/lockdown.mp3')
      audio.volume = 0.7
      audio.play().catch(() => {
        console.log('Lockdown sound effect not available')
      })
    }
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Phase 3: Cinematic Lockdown Overlay */}
      <CinematicLockdown active={lockdownMode === 'lockdown'} />
      
      {/* Phase 3: Holographic Interface */}
      <HolographicInterface lockdownMode={lockdownMode} />
      
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-2">
            Security & Defense Control
          </h1>
          <p className="text-white/50">
            Real-time threat monitoring and access control systems.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="hud-button flex items-center gap-2"
          >
            <Scan size={16} className={scanning ? 'animate-spin' : ''} />
            {scanning ? 'Scanning...' : 'Run Scan'}
          </button>
          
          <button
            onClick={handleLockToggle}
            className={`hud-button ${isLocked ? 'hud-button-danger' : 'hud-button-success'}`}
          >
            {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
            {isLocked ? 'Unlock' : 'Lock'} System
          </button>
        </div>
      </motion.div>

      {/* Defense Mode Selector */}
      <motion.div 
        className="hud-panel p-6"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider">
            Defense Mode
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-white/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-arc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-arc-400"></span>
              </span>
              Active
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              id: 'standard', 
              label: 'Standard', 
              desc: 'Balanced protection for normal operations', 
              icon: Shield, 
              color: 'arc',
              features: [
                'Standard protection levels',
                'Normal network visibility',
                'Balanced performance',
                'Standard monitoring'
              ]
            },
            { 
              id: 'stealth', 
              label: 'Stealth', 
              desc: 'Reduced visibility and enhanced privacy', 
              icon: EyeOff, 
              color: 'purple',
              features: [
                'Reduced digital footprint',
                'Encrypted communications',
                'Limited external access',
                'Enhanced privacy measures'
              ]
            },
            { 
              id: 'lockdown', 
              label: 'Lockdown', 
              desc: 'Maximum security protocols', 
              icon: Lock, 
              color: 'red',
              features: [
                'All non-essential services disabled',
                'Critical operations only',
                'Maximum encryption',
                'Full system isolation'
              ]
            }
          ].map((mode) => (
            <motion.div
              key={mode.id}
              className={`
                rounded-xl border-2 overflow-hidden transition-all
                ${defenseMode === mode.id
                  ? mode.color === 'arc' 
                    ? 'border-arc-500 shadow-lg shadow-arc-500/10' 
                    : mode.color === 'purple'
                      ? 'border-purple-500 shadow-lg shadow-purple-500/10'
                      : 'border-red-500 shadow-lg shadow-red-500/10 animate-lockdown-pulse'
                  : 'border-white/10 hover:border-arc-500/30 bg-gradient-to-b from-white/5 to-white/0'
                }
              `}
              whileHover={{ y: -3 }}
              animate={defenseMode === 'lockdown' && mode.id === 'lockdown' ? {
                boxShadow: [
                  '0 0 0 0 rgba(239, 68, 68, 0.7)',
                  '0 0 0 10px rgba(239, 68, 68, 0)',
                  '0 0 0 0 rgba(239, 68, 68, 0.7)',
                  '0 0 0 10px rgba(239, 68, 68, 0)'
                ],
                scale: [1, 1.02, 1, 1.02, 1]
              } : {}}
              transition={defenseMode === 'lockdown' && mode.id === 'lockdown' ? {
                repeat: Infinity,
                duration: 2
              } : {}}
            >
              <button
                onClick={() => handleDefenseChange(mode.id)}
                className={`w-full h-full p-5 text-left`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-2.5 rounded-lg ${
                    defenseMode === mode.id
                      ? mode.color === 'arc' ? 'bg-arc-500/20' 
                        : mode.color === 'purple' ? 'bg-purple-500/20'
                        : 'bg-red-500/20'
                      : 'bg-white/5'
                  }`}>
                    <mode.icon className={`w-5 h-5 ${
                      defenseMode === mode.id
                        ? mode.color === 'arc' ? 'text-arc-400' 
                          : mode.color === 'purple' ? 'text-purple-400' 
                          : 'text-red-400'
                        : 'text-white/60'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-lg font-semibold ${
                        defenseMode === mode.id ? 'text-white' : 'text-white/90'
                      }`}>
                        {mode.label}
                      </h4>
                    </div>
                    <p className="text-sm text-white/60 mt-1">{mode.desc}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  {mode.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className={`mt-0.5 flex-shrink-0 ${
                        defenseMode === mode.id
                          ? mode.color === 'arc' ? 'text-arc-400' 
                            : mode.color === 'purple' ? 'text-purple-400' 
                            : 'text-red-400'
                          : 'text-white/30'
                      }`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className={`inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    defenseMode === mode.id
                      ? mode.color === 'arc' 
                        ? 'bg-arc-500/10 text-arc-400' 
                        : mode.color === 'purple' 
                          ? 'bg-purple-500/10 text-purple-400'
                          : 'bg-red-500/10 text-red-400'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}>
                    {defenseMode === mode.id ? 'Active' : 'Activate'}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Security Status Banner */}
      <motion.div
        className={`hud-panel p-6 border-2 ${
          securityLevel === 'green' ? 'border-green-400/30 bg-green-400/5' :
          securityLevel === 'yellow' ? 'border-yellow-400/30 bg-yellow-400/5' :
          securityLevel === 'orange' ? 'border-orange-400/30 bg-orange-400/5' :
          'border-red-400/30 bg-red-400/5'
        }`}
        variants={itemVariants}
        animate={{
          boxShadow: securityLevel === 'red' 
            ? ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 10px rgba(239, 68, 68, 0)'] 
            : 'none'
        }}
        transition={securityLevel === 'red' ? {
          repeat: Infinity,
          duration: 2
        } : {}}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              securityLevel === 'green' ? 'bg-green-400/20' :
              securityLevel === 'yellow' ? 'bg-yellow-400/20' :
              securityLevel === 'orange' ? 'bg-orange-400/20' :
              'bg-red-400/20'
            }`}>
              {securityLevel === 'green' ? (
                <ShieldCheck size={32} className="text-green-400" />
              ) : (
                <ShieldAlert size={32} className={`${
                  securityLevel === 'yellow' ? 'text-yellow-400' :
                  securityLevel === 'orange' ? 'text-orange-400' :
                  'text-red-400'
                }`} />
              )}
            </div>
            
            <div>
              <h2 className={`text-2xl font-display font-bold ${
                securityLevel === 'green' ? 'text-green-400' :
                securityLevel === 'yellow' ? 'text-yellow-400' :
                securityLevel === 'orange' ? 'text-orange-400' :
                'text-red-400'
              }`}>
                {securityLevel === 'green' ? 'SECURE' :
                 securityLevel === 'yellow' ? 'CAUTION' :
                 securityLevel === 'orange' ? 'ELEVATED' :
                 'CRITICAL'}
              </h2>
              <p className="text-white/50">All systems protected and monitored</p>
            </div>
          </div>

          {/* Threat Level Indicator */}
          <div className="text-right">
            <p className="text-xs text-white/40 mb-1">Threat Level</p>
            <p className="text-3xl font-display font-bold text-white">{threatLevel}%</p>
            <div className="w-32 h-2 bg-stark-dark rounded-full overflow-hidden mt-2">
              <motion.div
                className={`h-full ${
                  threatLevel < 30 ? 'bg-green-400' :
                  threatLevel < 60 ? 'bg-yellow-400' :
                  'bg-red-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${threatLevel}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SecurityMetric
          icon={Shield}
          label="Firewall Status"
          value={isLocked ? "Locked Down" : "Active"}
          status={isLocked ? "warning" : "normal"}
          trend={isLocked ? "up" : "neutral"}
          onClick={() => toast.success('Firewall', isLocked ? 'Firewall is in lockdown mode' : 'All ports secured. No breaches detected.')}
        />
        <SecurityMetric
          icon={Lock}
          label="Encryption"
          value="AES-256"
          status="normal"
          trend="neutral"
          onClick={() => toast.success('Encryption', 'Military-grade AES-256 encryption active.')}
        />
        <SecurityMetric
          icon={Activity}
          label="Active Threats"
          value={threats.filter(t => t.status === 'active').length}
          status={threats.length > 0 ? "warning" : "normal"}
          trend={threats.length > 0 ? "up" : "neutral"}
          onClick={() => toast.info('Threats', threats.length > 0 ? 
            `${threats.length} active threat${threats.length !== 1 ? 's' : ''} detected` : 
            'No active threats detected in the system.')}
        />
        <SecurityMetric
          icon={CheckCircle}
          label="Last Scan"
          value={new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          status="normal"
          trend="down"
          onClick={() => toast.info('Last Scan', `Last scan completed at ${new Date().toLocaleTimeString()}`)}
        />
      </div>

      {/* Threat Monitoring Section */}
      <motion.div
        className="hud-panel p-6"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider">
            Threat Monitoring
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSimulateThreats(!simulateThreats)}
              className={`text-xs px-3 py-1 rounded-full ${simulateThreats ? 'bg-red-500/20 text-red-400' : 'bg-arc-500/20 text-arc-400'}`}
            >
              {simulateThreats ? 'Stop Simulation' : 'Simulate Threats'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Threat Chart */}
          <div className="lg:col-span-2">
            <SecurityThreatChart />
          </div>
          
          {/* Active Threats */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Active Threats</h4>
            {threats.filter(t => t.status === 'active').length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {threats.filter(t => t.status === 'active').map((threat, i) => (
                  <motion.div 
                    key={threat.id}
                    className="p-3 rounded-lg bg-stark-light/10 border border-red-500/20 hover:border-red-500/40 transition-colors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white">{threat.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                            {threat.severity}
                          </span>
                          <span className="text-xs text-white/40">{threat.source}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          resolveThreat(threat.id)
                          toast.success('Threat Resolved', `Mitigated ${threat.type} threat`)
                        }}
                        className="text-xs px-2 py-1 bg-stark-light/20 hover:bg-stark-light/30 rounded transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-white/40">
                      <MapPin size={12} className="mr-1" />
                      {threat.location} • {new Date(threat.timestamp).toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6 text-center text-white/40">
                <div>
                  <ShieldCheck size={32} className="mx-auto mb-2 text-arc-400/50" />
                  <p>No active threats detected</p>
                  <p className="text-xs mt-1">System is secure</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Security Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Access Control */}
        <motion.div
          className="hud-panel p-6"
          variants={itemVariants}
        >
          <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
            Access Control
          </h3>
          
          <div className="space-y-3">
            {[
              { icon: UserCheck, label: 'Authorized Users', value: '3', status: 'active' },
              { icon: Key, label: 'Active Sessions', value: '1', status: 'active' },
              { icon: Fingerprint, label: 'Biometric Auth', value: 'Enabled', status: 'active' },
              { icon: Globe, label: 'Network Access', value: isLocked ? 'Restricted' : 'Open', status: isLocked ? 'locked' : 'active' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-stark-light/20 border border-arc-500/10 hover:border-arc-500/30 transition-colors cursor-pointer"
                whileHover={{ scale: 1.01 }}
                onClick={() => toast.info(item.label, `Current status: ${item.value}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-arc-500/10 flex items-center justify-center">
                    <item.icon size={16} className="text-arc-500" />
                  </div>
                  <span className="text-sm text-white">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">{item.value}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === 'active' ? 'bg-green-400 animate-pulse' :
                    item.status === 'locked' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="hud-panel p-6"
          variants={itemVariants}
        >
          <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
            Recent Security Events
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
            {[
              { type: 'info', message: 'System boot completed', time: '2m ago' },
              { type: 'success', message: 'Security scan passed', time: '5m ago' },
              { type: 'warning', message: 'Unusual login attempt detected', time: '12m ago' },
              { type: 'info', message: 'Firewall rules updated', time: '1h ago' },
              { type: 'success', message: 'Encryption key rotated', time: '2h ago' },
              { type: 'success', message: 'Backup completed', time: '3h ago' },
              { type: 'info', message: 'System health check passed', time: '4h ago' }
            ].map((event, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-stark-light/20 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`mt-0.5 ${
                  event.type === 'success' ? 'text-green-400' :
                  event.type === 'warning' ? 'text-yellow-400' :
                  event.type === 'error' ? 'text-red-400' :
                  'text-arc-500'
                }`}>
                  {event.type === 'success' ? <CheckCircle size={14} /> :
                   event.type === 'warning' ? <AlertTriangle size={14} /> :
                   <Activity size={14} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/70">{event.message}</p>
                </div>
                <span className="text-xs text-white/30 whitespace-nowrap">{event.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="hud-panel p-6"
        variants={itemVariants}
      >
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
          Quick Security Actions
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              icon: Scan, 
              label: scanning ? 'Scanning...' : 'Deep Scan',
              color: 'arc',
              action: () => {
                setScanning(true)
                setTimeout(() => {
                  handleScan()
                  setScanning(false)
                }, 2000)
              }
            },
            { 
              icon: isLocked ? Unlock : Lock, 
              label: isLocked ? 'Unlock System' : 'Lock System',
              color: isLocked ? 'green' : 'red',
              action: handleLockToggle 
            },
            { 
              icon: Key, 
              label: 'Rotate Keys', 
              color: 'purple',
              action: () => {
                toast.success('Security', 'Encryption keys rotated successfully')
                logAccess({
                  action: 'rotate_keys',
                  user: 'admin',
                  status: 'success',
                  details: 'Rotated all encryption keys'
                })
              } 
            },
            { 
              icon: Server, 
              label: 'Backup Now', 
              color: 'blue',
              action: () => {
                toast.info('Backup', 'Starting system backup...')
                logAccess({
                  action: 'backup_initiated',
                  user: 'admin',
                  status: 'in_progress',
                  details: 'Full system backup started'
                })
              } 
            },
            { 
              icon: Eye, 
              label: 'View Logs', 
              color: 'gray',
              action: () => {
                toast.info('Security Logs', 'Opening detailed logs...')
                setActiveTab('logs')
              } 
            },
            { 
              icon: simulateThreats ? ShieldAlert : ShieldCheck, 
              label: simulateThreats ? 'Stop Simulation' : 'Test Alerts',
              color: simulateThreats ? 'red' : 'yellow',
              action: () => setSimulateThreats(!simulateThreats) 
            }
          ].map((item, index) => (
            <motion.button
              key={index}
              onClick={item.action}
              disabled={scanning && item.label.includes('Scan')}
              className={`p-3 rounded-lg border ${
                item.color === 'arc' ? 'border-arc-500/20 hover:border-arc-500/40' :
                item.color === 'red' ? 'border-red-500/20 hover:border-red-500/40' :
                item.color === 'green' ? 'border-green-500/20 hover:border-green-500/40' :
                item.color === 'purple' ? 'border-purple-500/20 hover:border-purple-500/40' :
                item.color === 'blue' ? 'border-blue-500/20 hover:border-blue-500/40' :
                'border-white/10 hover:border-white/20'
              } bg-stark-light/5 hover:bg-stark-light/10 transition-all group flex flex-col items-center`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon 
                className={`w-5 h-5 mb-1 ${
                  item.color === 'arc' ? 'text-arc-400' :
                  item.color === 'red' ? 'text-red-400' :
                  item.color === 'green' ? 'text-green-400' :
                  item.color === 'purple' ? 'text-purple-400' :
                  item.color === 'blue' ? 'text-blue-400' :
                  'text-white/60'
                } group-hover:scale-110 transition-transform`} 
              />
              <p className="text-xs text-white/70 text-center">{item.label}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="hud-panel p-6 lg:col-span-2"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider">
            Recent Security Events
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('events')}
              className={`text-xs px-2 py-1 rounded ${activeTab === 'events' ? 'bg-arc-500/20 text-arc-400' : 'text-white/40'}`}
            >
              Events
            </button>
            <button 
              onClick={() => setActiveTab('access')}
              className={`text-xs px-2 py-1 rounded ${activeTab === 'access' ? 'bg-arc-500/20 text-arc-400' : 'text-white/40'}`}
            >
              Access Logs
            </button>
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {activeTab === 'events' ? (
            // Security Events
            [
              { type: 'info', message: 'System boot completed', time: '2m ago', source: 'system' },
              { type: 'success', message: 'Security scan passed', time: '5m ago', source: 'scanner' },
              { type: 'warning', message: 'Unusual login attempt detected', time: '12m ago', source: 'auth' },
              { type: 'info', message: 'Firewall rules updated', time: '1h ago', source: 'firewall' },
              { type: 'success', message: 'Encryption key rotated', time: '2h ago', source: 'security' },
              { type: 'success', message: 'Backup completed', time: '3h ago', source: 'backup' },
              { type: 'info', message: 'System health check passed', time: '4h ago', source: 'system' }
            ].map((event, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-stark-light/10 transition-colors group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (event.action) event.action()
                }}
              >
                <div className={`mt-0.5 ${
                  event.type === 'success' ? 'text-green-400' :
                  event.type === 'warning' ? 'text-yellow-400' :
                  event.type === 'error' ? 'text-red-400' :
                  'text-arc-500'
                }`}>
                  {event.type === 'success' ? <CheckCircle size={14} /> :
                   event.type === 'warning' ? <AlertTriangle size={14} /> :
                   <Activity size={14} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/80 group-hover:text-white transition-colors">{event.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 bg-stark-light/20 text-white/40 rounded">
                      {event.source}
                    </span>
                    <span className="text-xs text-white/30">{event.time}</span>
                  </div>
                </div>
                {event.action && (
                  <button className="opacity-0 group-hover:opacity-100 text-xs text-arc-400 hover:text-arc-300 transition-opacity">
                    View
                  </button>
                )}
              </motion.div>
            ))
          ) : activeTab === 'access' ? (
            // Access Logs
            [...accessLogs].reverse().slice(0, 10).map((log, index) => (
              <motion.div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-stark-light/10 transition-colors group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`mt-0.5 ${
                  log.status === 'success' ? 'text-green-400' :
                  log.status === 'failed' ? 'text-red-400' :
                  'text-arc-400'
                }`}>
                  {log.status === 'success' ? <CheckCircle size={14} /> :
                   log.status === 'failed' ? <AlertTriangle size={14} /> :
                   <Activity size={14} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/80">
                    <span className="font-medium text-white">{log.user}</span> {log.action.replace('_', ' ')}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 bg-stark-light/20 text-white/40 rounded">
                      {log.status}
                    </span>
                    <span className="text-xs text-white/30">
                      {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : activeTab === 'ai' ? (
            <AIThreatAnalysis lockdownMode={lockdownMode} />
          ) : activeTab === 'cinematic' ? (
            <div className="space-y-6">
              <SystemControlPanel lockdownMode={lockdownMode} />
              
              {/* Cinematic Controls */}
              <motion.div variants={itemVariants} className="hud-panel p-6">
                <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
                  Cinematic Controls
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      // Trigger cinematic sequence
                      toast.info('Cinematic', 'Initiating cinematic lockdown sequence...')
                    }}
                    className="hud-button bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                  >
                    <Activity className="mr-2" size={16} />
                    Trigger Cinematic Sequence
                  </button>
                  
                  <button
                    onClick={() => {
                      // Toggle holographic interface
                      toast.info('Holographic', 'Activating holographic interface...')
                    }}
                    className="hud-button bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
                  >
                    <Zap className="mr-2" size={16} />
                    Toggle Holographic Interface
                  </button>
                </div>
              </motion.div>
            </div>
          ) : (
            // Security Protocols
            <div className="space-y-6">
              <SystemControlPanel lockdownMode={lockdownMode} />
              
              {/* Security Protocols */}
              <motion.div variants={itemVariants} className="hud-panel p-6">
                <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
                  Security Protocols
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      // Trigger security protocol
                      toast.info('Security', 'Initiating security protocol...')
                    }}
                    className="hud-button bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                  >
                    <Activity className="mr-2" size={16} />
                    Trigger Security Protocol
                  </button>
                  
                  <button
                    onClick={() => {
                      // Toggle security mode
                      toast.info('Security', 'Toggling security mode...')
                    }}
                    className="hud-button bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
                  >
                    <Zap className="mr-2" size={16} />
                    Toggle Security Mode
                  </button>
                </div>
              </motion.div>
            </div>
          )}
          
          {activeTab === 'access' && accessLogs.length === 0 && (
            <div className="h-40 flex items-center justify-center text-white/40">
              <div className="text-center">
                <Clock size={24} className="mx-auto mb-2" />
                <p>No access logs available</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Security