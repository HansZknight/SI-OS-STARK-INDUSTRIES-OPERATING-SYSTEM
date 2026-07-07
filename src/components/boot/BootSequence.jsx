// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// Boot Sequence Component - System Initialization Animation
// ═══════════════════════════════════════════════════════════════════════════
// Classification: STARK INDUSTRIES PROPRIETARY
// Author: Tony Stark
// System: SI-OS v1.0.0 | Codename: J.A.R.V.I.S
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════
// ARC REACTOR COMPONENT
// The iconic Stark Industries power core animation
// ═══════════════════════════════════════════════════════════════════════════

const ArcReactor = ({ size = 200, pulseIntensity = 1 }) => {
  const rings = [
    { radius: 100, duration: 8, direction: 1, opacity: 0.3, width: 2 },
    { radius: 80, duration: 6, direction: -1, opacity: 0.5, width: 2 },
    { radius: 60, duration: 4, direction: 1, opacity: 0.7, width: 2 },
    { radius: 40, duration: 3, direction: -1, opacity: 0.8, width: 1 },
  ]

  const scale = size / 200

  return (
    <div 
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Outer Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Rotating Rings */}
      {rings.map((ring, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border-arc-500"
          style={{
            width: ring.radius * scale,
            height: ring.radius * scale,
            top: '50%',
            left: '50%',
            marginLeft: -(ring.radius * scale) / 2,
            marginTop: -(ring.radius * scale) / 2,
            borderWidth: ring.width,
            borderStyle: 'solid',
            borderColor: `rgba(0, 212, 255, ${ring.opacity})`,
            boxShadow: `0 0 ${10 * pulseIntensity}px rgba(0, 212, 255, ${ring.opacity * 0.5})`,
          }}
          animate={{
            rotate: ring.direction * 360,
            scale: [1, 1.02, 1],
          }}
          transition={{
            rotate: {
              duration: ring.duration,
              repeat: Infinity,
              ease: 'linear',
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {/* Ring Segments */}
          {[0, 90, 180, 270].map((angle) => (
            <div
              key={angle}
              className="absolute w-2 h-2 bg-arc-500 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translateY(-${(ring.radius * scale) / 2}px)`,
                boxShadow: '0 0 10px rgba(0, 212, 255, 0.8)',
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* Inner Core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 30 * scale,
          height: 30 * scale,
          top: '50%',
          left: '50%',
          marginLeft: -(30 * scale) / 2,
          marginTop: -(30 * scale) / 2,
          background: 'radial-gradient(circle, #00d4ff 0%, #0066ff 50%, rgba(0, 102, 255, 0.5) 100%)',
          boxShadow: `
            0 0 20px rgba(0, 212, 255, 0.8),
            0 0 40px rgba(0, 212, 255, 0.6),
            0 0 60px rgba(0, 212, 255, 0.4),
            inset 0 0 20px rgba(255, 255, 255, 0.3)
          `,
        }}
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            `0 0 20px rgba(0, 212, 255, 0.8), 0 0 40px rgba(0, 212, 255, 0.6), 0 0 60px rgba(0, 212, 255, 0.4)`,
            `0 0 30px rgba(0, 212, 255, 1), 0 0 60px rgba(0, 212, 255, 0.8), 0 0 90px rgba(0, 212, 255, 0.5)`,
            `0 0 20px rgba(0, 212, 255, 0.8), 0 0 40px rgba(0, 212, 255, 0.6), 0 0 60px rgba(0, 212, 255, 0.4)`,
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Center Dot */}
      <div
        className="absolute rounded-full bg-white"
        style={{
          width: 8 * scale,
          height: 8 * scale,
          top: '50%',
          left: '50%',
          marginLeft: -(8 * scale) / 2,
          marginTop: -(8 * scale) / 2,
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
        }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HEXAGON GRID BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════

const HexagonGrid = () => {
  const hexagons = useMemo(() => {
    const items = []
    for (let i = 0; i < 30; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 30 + 20,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2,
      })
    }
    return items
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {hexagons.map((hex) => (
        <motion.div
          key={hex.id}
          className="absolute border border-arc-500/30"
          style={{
            left: `${hex.x}%`,
            top: `${hex.y}%`,
            width: hex.size,
            height: hex.size * 0.866,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.5, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: hex.duration,
            repeat: Infinity,
            delay: hex.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA STREAM ANIMATION
// ═══════════════════════════════════════════════════════════════════════════

const DataStream = ({ side = 'left' }) => {
  const streams = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: i * 0.2,
      duration: Math.random() * 1 + 1,
    }))
  }, [])

  return (
    <div 
      className={`absolute top-0 bottom-0 w-1 ${side === 'left' ? 'left-20' : 'right-20'}`}
    >
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          className="absolute w-full h-8 rounded-full"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(0, 212, 255, 0.6), transparent)',
          }}
          initial={{ top: '-10%', opacity: 0 }}
          animate={{ top: '110%', opacity: [0, 1, 1, 0] }}
          transition={{
            duration: stream.duration,
            repeat: Infinity,
            delay: stream.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// BOOT LOG TERMINAL
// ═══════════════════════════════════════════════════════════════════════════

const BootLog = ({ phases, currentPhase }) => {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const currentIndex = phases.findIndex((p) => p.phase === currentPhase)
    const newLogs = phases.slice(0, currentIndex + 1).map((p) => ({
      ...p,
      status: p.phase === currentPhase ? 'running' : 'complete',
    }))
    setLogs(newLogs)
  }, [currentPhase, phases])

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="hud-panel p-4">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-arc-500/20">
          <div className="w-2 h-2 rounded-full bg-arc-500 animate-pulse" />
          <span className="text-xs font-mono text-arc-500/70 uppercase tracking-wider">
            System Boot Log
          </span>
        </div>

        {/* Log Entries */}
        <div className="space-y-1 font-mono text-xs">
          <AnimatePresence mode="popLayout">
            {logs.map((log, index) => (
              <motion.div
                key={log.phase}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-2"
              >
                {/* Status Indicator */}
                {log.status === 'complete' ? (
                  <span className="text-green-400">✓</span>
                ) : (
                  <motion.span
                    className="text-arc-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    ▸
                  </motion.span>
                )}

                {/* Log Text */}
                <span 
                  className={
                    log.status === 'complete' 
                      ? 'text-white/50' 
                      : 'text-arc-400'
                  }
                >
                  {log.label}
                </span>

                {/* Progress Indicator for Running */}
                {log.status === 'running' && (
                  <motion.span
                    className="text-arc-500"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════════════

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Progress Track */}
      <div className="relative h-1 bg-stark-dark rounded-full overflow-hidden">
        {/* Progress Fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #00d4ff, #0066ff)',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Shimmer Effect */}
        <motion.div
          className="absolute top-0 h-full w-20"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
          animate={{ left: ['-20%', '120%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Progress Text */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs font-mono text-arc-500/50 uppercase tracking-wider">
          Loading
        </span>
        <span className="text-xs font-mono text-arc-500">
          {progress}%
        </span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CORNER DECORATIONS
// ═══════════════════════════════════════════════════════════════════════════

const CornerDecoration = ({ position }) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4 rotate-90',
    'bottom-left': 'bottom-4 left-4 -rotate-90',
    'bottom-right': 'bottom-4 right-4 rotate-180',
  }

  return (
    <motion.div
      className={`absolute ${positionClasses[position]}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path
          d="M0 0 L30 0 L30 4 L4 4 L4 30 L0 30 Z"
          fill="none"
          stroke="rgba(0, 212, 255, 0.3)"
          strokeWidth="1"
        />
        <circle cx="4" cy="4" r="2" fill="rgba(0, 212, 255, 0.5)" />
      </svg>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN BOOT SEQUENCE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function BootSequence({ progress, phase, phases, config }) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at center, rgba(0, 212, 255, 0.05) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Elements */}
      <HexagonGrid />
      <DataStream side="left" />
      <DataStream side="right" />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scan Lines */}
      <div className="scan-lines absolute inset-0 opacity-30" />

      {/* Corner Decorations */}
      <CornerDecoration position="top-left" />
      <CornerDecoration position="top-right" />
      <CornerDecoration position="bottom-left" />
      <CornerDecoration position="bottom-right" />

      {/* Main Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="relative z-10 flex flex-col items-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Arc Reactor */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <ArcReactor size={180} />
            </motion.div>

            {/* Title */}
            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 
                className="text-3xl md:text-4xl font-display font-bold tracking-[0.3em] text-arc-500"
                style={{ textShadow: '0 0 30px rgba(0, 212, 255, 0.5)' }}
              >
                STARK INDUSTRIES
              </h1>
              <p className="mt-2 text-sm font-stark text-arc-500/50 tracking-[0.2em] uppercase">
                Operating System v{config.version}
              </p>
            </motion.div>

            {/* Status Text */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.p
                key={phase}
                className="text-sm font-mono text-arc-400"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {phases.find((p) => p.phase === phase)?.label || 'Initializing...'}
              </motion.p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="mt-8 w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <ProgressBar progress={progress} />
            </motion.div>

            {/* Boot Log */}
            <motion.div
              className="mt-8 w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <BootLog phases={phases} currentPhase={phase} />
            </motion.div>

            {/* Skip Hint */}
            <motion.p
              className="mt-8 text-xs text-arc-500/30 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              Press ESC to skip
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />

      {/* Bottom Info Bar */}
      <motion.div
        className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-arc-500 animate-pulse" />
          <span className="text-xs font-mono text-arc-500/40 uppercase tracking-wider">
            {config.codename} Core
          </span>
        </div>

        <div className="text-xs font-mono text-arc-500/40 uppercase tracking-wider">
          Classification: Stark Industries Proprietary
        </div>

        <div className="text-xs font-mono text-arc-500/40">
          {new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BootSequence