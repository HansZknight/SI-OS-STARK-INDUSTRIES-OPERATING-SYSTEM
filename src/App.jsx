// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// Main Application Component - System Core
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

// Layout Components
import MainLayout from './components/layout/MainLayout'
import BootSequence from './components/boot/BootSequence'

// UI Components
import { ToastContainer, useToastStore, toast } from './components/ui/Toast'
import CommandPalette from './components/ui/CommandPalette'

// PWA Components
import PWAInstallPrompt from './components/pwa/PWAInstallPrompt'
import PWAUpdatePrompt from './components/pwa/PWAUpdatePrompt'
import OfflineIndicator from './components/pwa/OfflineIndicator'
import InstallGuide from './components/pwa/InstallGuide'

// Module Pages
import Dashboard from './modules/dashboard/Dashboard'
import AICore from './modules/ai-core/AICore'
import ArcReactor from './modules/arc-reactor/ArcReactor'
import RnDLab from './modules/rnd-lab/RnDLab'
import DataHub from './modules/data-hub/DataHub'
import Security from './modules/security/Security'
import SystemArchitecture from './modules/system-architecture/SystemArchitecture'
import TonyMode from './modules/tony-mode/TonyMode'
import IronManSuit from './modules/iron-man-suit/IronManSuit'

// Stores
import { useSystemStore } from './stores/systemStore'
import { useAuthStore } from './stores/authStore'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './pages/Login'

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SYSTEM_CONFIG = {
  name: 'SI-OS',
  version: '1.0.0',
  codename: 'J.A.R.V.I.S',
  bootDuration: 3000,
  author: 'Tony Stark',
  classification: 'STARK INDUSTRIES PROPRIETARY'
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE TRANSITION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════

const pageTransition = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(10px)'
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APPLICATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function App({ onSystemReady }) {
  const [isBooting, setIsBooting] = useState(true)
  const [bootProgress, setBootProgress] = useState(0)
  const [bootPhase, setBootPhase] = useState('initializing')
  const [systemReady, setSystemReady] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Toast notifications
  const { toasts, removeToast } = useToastStore()

  const location = useLocation()

  const { 
    setSystemStatus, 
    setCurrentTime,
    incrementUptime 
  } = useSystemStore()

  const { isAuthenticated } = useAuthStore()

  // Boot phases
  const bootPhases = [
    { phase: 'initializing', label: 'Initializing Core Systems...', progress: 0 },
    { phase: 'loading-modules', label: 'Loading System Modules...', progress: 15 },
    { phase: 'ai-core', label: 'Activating J.A.R.V.I.S AI Core...', progress: 30 },
    { phase: 'arc-reactor', label: 'Arc Reactor Online...', progress: 40 },
    { phase: 'neural-network', label: 'Establishing Neural Network...', progress: 50 },
    { phase: 'security', label: 'Security Protocols Online...', progress: 65 },
    { phase: 'data-sync', label: 'Synchronizing Data Streams...', progress: 80 },
    { phase: 'interface', label: 'Rendering HUD Interface...', progress: 90 },
    { phase: 'complete', label: 'System Boot Complete', progress: 100 }
  ]

  // Boot sequence
  const runBootSequence = useCallback(async () => {
    const phaseDelay = SYSTEM_CONFIG.bootDuration / bootPhases.length

    for (let i = 0; i < bootPhases.length; i++) {
      const currentPhase = bootPhases[i]
      setBootPhase(currentPhase.phase)
      setBootProgress(currentPhase.progress)
      await new Promise(resolve => setTimeout(resolve, phaseDelay))
    }

    // Boot complete
    setIsBooting(false)
    setSystemReady(true)
    setSystemStatus('online')

    // Welcome toasts
    setTimeout(() => {
      toast.system('System Online', 'All Stark Industries systems operational.')
      setTimeout(() => {
        toast.ai('J.A.R.V.I.S', 'Good day, Sir. How may I assist you?')
      }, 1000)
    }, 500)

    if (onSystemReady) {
      onSystemReady()
    }

    window.dispatchEvent(new CustomEvent('stark-os-ready'))
  }, [])

  // System clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const uptimeInterval = setInterval(() => {
      if (systemReady) {
        incrementUptime()
      }
    }, 1000)

    return () => {
      clearInterval(clockInterval)
      clearInterval(uptimeInterval)
    }
  }, [systemReady, setCurrentTime, incrementUptime])

  // Initialize boot
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      runBootSequence()
    }, 500)

    return () => clearTimeout(bootTimer)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isBooting) {
        setIsBooting(false)
        setSystemReady(true)
        setSystemStatus('online')
        if (onSystemReady) onSystemReady()
        window.dispatchEvent(new CustomEvent('stark-os-ready'))
      }

      // Command Palette (Ctrl+K)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }

      // Close Command Palette with Escape
      if (e.key === 'Escape' && commandPaletteOpen) {
        e.preventDefault()
        setCommandPaletteOpen(false)
      }

      // AI Chat (Ctrl+J)
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('open-ai-chat'))
      }

      // Toggle notification sound (M key)
      if (e.key === 'm' || e.key === 'M') {
        const { toggleSound } = useToastStore.getState()
        const enabled = toggleSound()
        toast.info(
          'Notification Sounds',
          enabled ? 'Sound enabled' : 'Sound muted',
          { sound: false, duration: 2000 }
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isBooting, onSystemReady, setSystemStatus, commandPaletteOpen])

  // Show boot sequence if booting
  if (isBooting) {
    return (
      <BootSequence 
        progress={bootProgress}
        phase={bootPhase}
        phases={bootPhases}
        config={SYSTEM_CONFIG}
      />
    )
  }

  // Main app
  return (
    <div className="app-container min-h-screen bg-stark-black">
      {/* Background Effects - Movie Accurate */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-stark-black" />
        <div className="absolute inset-0 opacity-40" 
             style={{
               backgroundImage: `radial-gradient(circle at center, transparent 0%, rgba(0, 212, 255, 0.05) 50%, #0a0a0f 100%),
                                 repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.02) 2px, rgba(0, 212, 255, 0.02) 4px)`
             }}
        />
        <div className="absolute inset-0 hud-grid opacity-50 mix-blend-screen" />
        <div className="scan-lines opacity-60 mix-blend-overlay" />
      </div>

      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route 
            path="*" 
            element={
              <ProtectedRoute>
                <MainLayout config={SYSTEM_CONFIG}>
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <motion.div
                          key={location.pathname}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={pageTransition}
                          className="page-container"
                        >
                          <Dashboard />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/ai-core" 
                      element={<AICore />} 
                    />
                    <Route 
                      path="/arc-reactor" 
                      element={<ArcReactor />} 
                    />
                    <Route 
                      path="/rnd-lab" 
                      element={<RnDLab />} 
                    />
                    <Route 
                      path="/iron-man-suit" 
                      element={<IronManSuit />} 
                    />
                    <Route 
                      path="/data-hub" 
                      element={<DataHub />} 
                    />
                    <Route 
                      path="/security" 
                      element={<Security />} 
                    />
                    <Route 
                      path="/system-architecture" 
                      element={<SystemArchitecture />} 
                    />
                    <Route 
                      path="/tony-mode" 
                      element={<TonyMode />} 
                    />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AnimatePresence>

      {/* System Ready Indicator */}
      {systemReady && isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stark-dark/80 border border-arc-500/20 backdrop-blur-sm">
            <div className="status-dot-online" />
            <span className="text-xs font-mono text-arc-500/70 uppercase tracking-wider">
              System Online
            </span>
          </div>
        </motion.div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* PWA Components */}
      {isAuthenticated && (
        <>
          <PWAInstallPrompt />
          <PWAUpdatePrompt />
          <OfflineIndicator />
          <InstallGuide />
        </>
      )}
    </div>
  )
}

export default App