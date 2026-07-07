// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - NOTIFICATION CENTER
// Central hub for all system notifications and alerts
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  X, 
  Trash2, 
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Brain,
  Clock,
  Archive
} from 'lucide-react'
import { useToastStore } from './Toast'

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATION TYPES CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const notificationTypes = {
  success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  warning: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  system: { icon: Zap, color: 'text-arc-400', bg: 'bg-arc-500/10' },
  security: { icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ai: { icon: Brain, color: 'text-cyan-400', bg: 'bg-cyan-500/10' }
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATION ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function NotificationItem({ notification, onRemove }) {
  const config = notificationTypes[notification.type] || notificationTypes.info
  const Icon = config.icon
  
  const formatTime = (date) => {
    const now = new Date()
    const diff = Math.floor((now - new Date(date)) / 1000) // seconds
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`
        p-3 rounded-lg border border-white/5
        ${config.bg}
        hover:border-white/10
        transition-all
        group
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${config.color} mt-0.5`}>
          <Icon className="w-4 h-4" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-medium text-white/90">
              {notification.title}
            </h4>
            <span className="flex-shrink-0 text-xs text-white/40 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(notification.timestamp)}
            </span>
          </div>
          
          {notification.message && (
            <p className="text-xs text-white/50 leading-relaxed">
              {notification.message}
            </p>
          )}
          
          {/* Priority Badge */}
          {notification.priority && notification.priority !== 'normal' && (
            <span className={`
              inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium
              ${notification.priority === 'critical' ? 'bg-red-500/20 text-red-300' : ''}
              ${notification.priority === 'high' ? 'bg-yellow-500/20 text-yellow-300' : ''}
              ${notification.priority === 'low' ? 'bg-blue-500/20 text-blue-300' : ''}
            `}>
              {notification.priority.toUpperCase()}
            </span>
          )}
        </div>
        
        {/* Remove Button */}
        <button
          onClick={() => onRemove(notification.id)}
          className="
            flex-shrink-0 p-1 rounded
            text-white/30 hover:text-white/70
            hover:bg-white/5
            opacity-0 group-hover:opacity-100
            transition-all
          "
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATION CENTER PANEL
// ═══════════════════════════════════════════════════════════════════════════

export function NotificationCenter({ isOpen, onClose }) {
  const { history, clearHistory } = useToastStore()
  const [filter, setFilter] = useState('all')
  
  // Filter notifications
  const filteredNotifications = filter === 'all' 
    ? history 
    : history.filter(n => n.type === filter)
  
  // Count by type
  const counts = history.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1
    return acc
  }, {})
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990]"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="
              fixed top-0 right-0 bottom-0 w-full max-w-md
              bg-stark-dark/95 backdrop-blur-xl
              border-l border-arc-500/20
              shadow-2xl
              z-[9991]
              overflow-hidden
              flex flex-col
            "
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-arc-400" />
                  <h2 className="text-lg font-bold text-white">
                    Notification Center
                  </h2>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Clear All */}
                  {history.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Clear all notifications?')) {
                          clearHistory()
                        }
                      }}
                      className="
                        p-2 rounded-lg
                        text-white/50 hover:text-white/80
                        hover:bg-white/5
                        transition-all
                      "
                      title="Clear all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* Close */}
                  <button
                    onClick={onClose}
                    className="
                      p-2 rounded-lg
                      text-white/50 hover:text-white/80
                      hover:bg-white/5
                      transition-all
                    "
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setFilter('all')}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium
                    transition-all whitespace-nowrap
                    ${filter === 'all'
                      ? 'bg-arc-500/20 text-arc-300 border border-arc-500/30'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
                    }
                  `}
                >
                  All ({history.length})
                </button>
                
                {Object.entries(counts).map(([type, count]) => {
                  const config = notificationTypes[type]
                  const Icon = config.icon
                  
                  return (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-medium
                        transition-all whitespace-nowrap
                        flex items-center gap-1.5
                        ${filter === type
                          ? `${config.bg} ${config.color} border border-current/30`
                          : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
                        }
                      `}
                    >
                      <Icon className="w-3 h-3" />
                      {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Archive className="w-12 h-12 text-white/20 mb-3" />
                  <p className="text-white/40 text-sm">
                    {filter === 'all' 
                      ? 'No notifications yet' 
                      : `No ${filter} notifications`
                    }
                  </p>
                  <p className="text-white/20 text-xs mt-1">
                    System alerts will appear here
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRemove={(id) => {
                        // Remove from history
                        const newHistory = history.filter(n => n.id !== id)
                        useToastStore.setState({ history: newHistory })
                      }}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
            
            {/* Footer Stats */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-white/40">
                <span>
                  Total: {history.length} notification{history.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last 50 shown
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationCenter