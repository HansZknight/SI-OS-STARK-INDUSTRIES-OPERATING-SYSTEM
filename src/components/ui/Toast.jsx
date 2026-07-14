// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - TOAST NOTIFICATION SYSTEM V2
// Enhanced notification system with sounds and actions
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Zap, 
  Shield, 
  Brain,
  X,
  Volume2,
  VolumeX
} from 'lucide-react'
import { create } from 'zustand'
import { soundManager } from '../../utils/soundManager'

// ═══════════════════════════════════════════════════════════════════════════
// TOAST STORE - GLOBAL STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

export const useToastStore = create((set, get) => ({
  toasts: [],
  history: [],
  soundEnabled: true,
  
  addToast: (toast) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      duration: 5000,
      priority: 'normal',
      timestamp: new Date(),
      ...toast
    }
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
      history: [newToast, ...state.history].slice(0, 50) // Keep last 50
    }))
    
    // Play sound
    if (get().soundEnabled && newToast.sound !== false) {
      soundManager.play(newToast.type || 'info')
    }
    
    // Auto dismiss
    if (newToast.duration > 0 && !newToast.persistent) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter(t => t.id !== id)
        }))
      }, newToast.duration)
    }
    
    return id
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }))
  },
  
  clearAll: () => {
    set({ toasts: [] })
  },
  
  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }))
    return get().soundEnabled
  },
  
  clearHistory: () => {
    set({ history: [] })
  }
}))

// ═══════════════════════════════════════════════════════════════════════════
// TOAST HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export const toast = {
  success: (title, message, options = {}) => {
    return useToastStore.getState().addToast({
      type: 'success',
      title,
      message,
      ...options
    })
  },
  
  error: (title, message, options = {}) => {
    return useToastStore.getState().addToast({
      type: 'error',
      title,
      message,
      priority: 'high',
      ...options
    })
  },
  
  warning: (title, message, options = {}) => {
    return useToastStore.getState().addToast({
      type: 'warning',
      title,
      message,
      priority: 'high',
      ...options
    })
  },
  
  info: (title, message, options = {}) => {
    return useToastStore.getState().addToast({
      type: 'info',
      title,
      message,
      ...options
    })
  },
  
  system: (title, message, options = {}) => {
    return useToastStore.getState().addToast({
      type: 'system',
      title,
      message,
      priority: 'high',
      ...options
    })
  },
  
  security: (title, message, options = {}) => {
    return useToastStore.getState().addToast({
      type: 'security',
      title,
      message,
      priority: 'high',
      duration: 5000,
      ...options
    })
  },
  
  ai: (title, message, options = {}) => {
    return useToastStore.getState().addToast({
      type: 'ai',
      title,
      message,
      ...options
    })
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST VARIANTS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const toastVariants = {
  success: {
    icon: CheckCircle,
    className: 'border-green-500/30 bg-green-500/10',
    iconColor: 'text-green-400',
    progressColor: 'bg-green-500'
  },
  error: {
    icon: XCircle,
    className: 'border-red-500/30 bg-red-500/10',
    iconColor: 'text-red-400',
    progressColor: 'bg-red-500'
  },
  warning: {
    icon: AlertCircle,
    className: 'border-yellow-500/30 bg-yellow-500/10',
    iconColor: 'text-yellow-400',
    progressColor: 'bg-yellow-500'
  },
  info: {
    icon: Info,
    className: 'border-blue-500/30 bg-blue-500/10',
    iconColor: 'text-blue-400',
    progressColor: 'bg-blue-500'
  },
  system: {
    icon: Zap,
    className: 'border-arc-500/30 bg-arc-500/10',
    iconColor: 'text-arc-400',
    progressColor: 'bg-arc-500'
  },
  security: {
    icon: Shield,
    className: 'border-purple-500/30 bg-purple-500/10',
    iconColor: 'text-purple-400',
    progressColor: 'bg-purple-500'
  },
  ai: {
    icon: Brain,
    className: 'border-cyan-500/30 bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    progressColor: 'bg-cyan-500'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function ToastItem({ toast, onDismiss }) {
  const [progress, setProgress] = React.useState(100)
  const variant = toastVariants[toast.type] || toastVariants.info
  const Icon = variant.icon
  
  useEffect(() => {
    if (toast.duration <= 0 || toast.persistent) return
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (toast.duration / 50))
        return newProgress <= 0 ? 0 : newProgress
      })
    }, 50)
    
    return () => clearInterval(interval)
  }, [toast.duration, toast.persistent])
  
  // Priority badge
  const priorityBadge = {
    critical: '🔴',
    high: '🟡',
    normal: null,
    low: '🔵'
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ 
        type: 'spring', 
        stiffness: 500, 
        damping: 30 
      }}
      className={`
        relative overflow-hidden
        w-[calc(100vw-2rem)] sm:w-96 p-3 sm:p-4
        border rounded-lg
        backdrop-blur-xl
        shadow-2xl
        ${variant.className}
        ${toast.priority === 'critical' ? 'ring-2 ring-red-500/50' : ''}
      `}
    >
      {/* Progress Bar */}
      {toast.duration > 0 && !toast.persistent && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <motion.div
            className={`h-full ${variant.progressColor}`}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${variant.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-white">
              {toast.title}
            </h4>
            {priorityBadge[toast.priority] && (
              <span className="text-xs">{priorityBadge[toast.priority]}</span>
            )}
          </div>
          {toast.message && (
            <p className="text-xs text-white/60 leading-relaxed mb-2">
              {toast.message}
            </p>
          )}
          
          {/* Action Buttons */}
          {toast.actions && toast.actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {toast.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick?.()
                    if (action.dismissAfter !== false) {
                      onDismiss(toast.id)
                    }
                  }}
                  className={`
                    px-3 py-1 rounded text-xs font-medium
                    transition-all
                    ${action.variant === 'primary' 
                      ? 'bg-arc-500 text-white hover:bg-arc-400' 
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Close Button */}
        {!toast.persistent && (
          <button
            onClick={() => onDismiss(toast.id)}
            className="
              flex-shrink-0
              p-1
              text-white/40 hover:text-white/80
              transition-colors
              rounded
              hover:bg-white/5
            "
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top left, currentColor, transparent 60%)`
        }}
      />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST CONTAINER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function ToastContainer({ toasts, onDismiss }) {
  const { soundEnabled, toggleSound } = useToastStore()
  
  return (
    <>
      {/* Toast Stack - Top Right */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto z-[9999] pointer-events-none">
        <div className="flex flex-col gap-2 sm:gap-3 items-end pointer-events-auto">
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <ToastItem 
                key={toast.id} 
                toast={toast} 
                onDismiss={onDismiss}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Sound Toggle - Bottom Left (Minimal) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={toggleSound}
        className="
          fixed bottom-4 right-4 z-[9998]
          p-2 rounded-full
          bg-stark-dark/60 border border-arc-500/10
          text-white/40 hover:text-white/80
          backdrop-blur-sm
          transition-all duration-300
          hover:border-arc-500/30
          hover:bg-stark-dark/80
          group
        "
        title={soundEnabled ? 'Mute notification sounds (M)' : 'Unmute notification sounds (M)'}
      >
        {soundEnabled ? (
          <Volume2 className="w-3.5 h-3.5" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}
        
        {/* Tooltip */}
        <span className="
          absolute bottom-full right-0 mb-2
          px-2 py-1 rounded
          bg-stark-dark/90 border border-arc-500/20
          text-xs text-white/70 whitespace-nowrap
          opacity-0 group-hover:opacity-100
          transition-opacity pointer-events-none
        ">
          {soundEnabled ? 'Mute (M)' : 'Unmute (M)'}
        </span>
      </motion.button>
    </>
  )
}

export default ToastContainer