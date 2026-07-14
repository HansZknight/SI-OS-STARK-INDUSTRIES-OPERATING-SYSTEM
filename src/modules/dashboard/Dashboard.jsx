// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// Command Dashboard - Central Control Interface
// ═══════════════════════════════════════════════════════════════════════════
// Classification: STARK INDUSTRIES PROPRIETARY
// Author: Tony Stark
// System: SI-OS v1.0.0 | Codename: J.A.R.V.I.S
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import GlobeVisualization from '../../components/visualization/GlobeVisualization';
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  Brain,
  Zap,
  Globe,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Database,
  Lock,
  Unlock,
  ChevronRight,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  GitBranch,
  Terminal,
  MessageSquare,
  FlaskConical,
  FileText,
  Users,
  Calendar,
  Power,
  Battery,
  Settings,
  Monitor,
  Code,
  Rocket,
  Target,
  Sparkles
} from 'lucide-react'

// Stores
import { useSystemStore, useAIStore, useProjectsStore, useSecurityStore } from '../../stores/systemStore'

// ⭐ ARC REACTOR WIDGET IMPORT ⭐
import ArcReactorWidget from '../../components/widgets/ArcReactorWidget'

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      duration: 0.6
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
}

const pulseVariants = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// METRIC CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const MetricCard = ({ icon: Icon, label, value, unit, trend, trendValue, color = 'arc', onClick, interactive = false }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const colorClasses = {
    arc: 'text-arc-400 bg-arc-500/10 border-arc-500/20 hover:border-arc-500/40',
    green: 'text-green-400 bg-green-400/10 border-green-400/20 hover:border-green-400/40',
    yellow: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20 hover:border-yellow-400/40',
    red: 'text-red-400 bg-red-400/10 border-red-400/20 hover:border-red-400/40',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20 hover:border-purple-400/40'
  }

  const iconBgClasses = {
    arc: 'bg-gradient-to-br from-arc-500/20 to-cyan-500/20 text-arc-400',
    green: 'bg-gradient-to-br from-green-400/20 to-emerald-400/20 text-green-400',
    yellow: 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20 text-yellow-400',
    red: 'bg-gradient-to-br from-red-400/20 to-pink-400/20 text-red-400',
    purple: 'bg-gradient-to-br from-purple-400/20 to-violet-400/20 text-purple-400'
  }

  return (
    <motion.div
      className={`hud-panel-angled p-5 transition-all duration-300 cursor-pointer group ${
        interactive ? 'hover:scale-[1.02] hover:shadow-2xl' : ''
      } ${colorClasses[color]}`}
      variants={itemVariants}
      whileHover={interactive ? { y: -2 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBgClasses[color]} transition-all duration-300 ${
          isHovered ? 'scale-110 shadow-lg' : ''
        }`}>
          <Icon size={20} />
        </div>
        {trend && (
          <motion.div 
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
              trend === 'up' ? 'bg-green-400/10 text-green-400 border border-green-400/30' : 'bg-red-400/10 text-red-400 border border-red-400/30'
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{trendValue}</span>
          </motion.div>
        )}
      </div>
      
      <div className="mb-4 relative z-10">
        <p className="text-xs text-white/60 uppercase tracking-widest mb-1 font-medium font-display truncate">{label}</p>
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-3xl sm:text-4xl font-display font-bold text-glow tracking-wider">{value}</span>
          {unit && <span className="text-xs sm:text-sm text-arc-500/70 font-medium font-mono tracking-widest">{unit}</span>}
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-stark-light rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              color === 'arc' ? 'bg-gradient-to-r from-arc-500 via-cyan-400 to-jarvis-500' :
              color === 'green' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
              color === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
              color === 'red' ? 'bg-gradient-to-r from-red-400 to-pink-400' :
              'bg-gradient-to-r from-purple-400 to-violet-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(value, 100)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              boxShadow: `0 0 20px ${color === 'arc' ? 'rgba(0, 212, 255, 0.5)' : 'currentColor'}`
            }}
          />
        </div>
        {/* Animated glow effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 h-2 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${
                color === 'arc' ? 'rgba(0, 212, 255, 0.3)' :
                color === 'green' ? 'rgba(74, 222, 128, 0.3)' :
                color === 'yellow' ? 'rgba(250, 204, 21, 0.3)' :
                color === 'red' ? 'rgba(239, 68, 68, 0.3)' :
                'rgba(168, 85, 247, 0.3)'
              }, transparent)`
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM STATUS CARD
// ═══════════════════════════════════════════════════════════════════════════

const SystemStatusCard = () => {
  const { systemStatus, getFormattedUptime, metrics } = useSystemStore()
  const uptime = getFormattedUptime()

  const statusConfig = {
    online: { color: 'green', label: 'ONLINE', icon: CheckCircle },
    offline: { color: 'red', label: 'OFFLINE', icon: AlertTriangle },
    maintenance: { color: 'yellow', label: 'MAINTENANCE', icon: Clock }
  }

  const status = statusConfig[systemStatus] || statusConfig.online

  return (
    <motion.div
      className="hud-panel-angled p-5"
      variants={itemVariants}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider">
          System Status
        </h3>
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full bg-${status.color}-400/10 border border-${status.color}-400/30`}>
          <div className={`w-2 h-2 rounded-full bg-${status.color}-400 animate-pulse`} />
          <span className={`text-xs font-mono text-${status.color}-400`}>{status.label}</span>
        </div>
      </div>

      {/* Uptime */}
      <div className="mb-6 relative z-10">
        <p className="text-xs text-white/50 font-display tracking-widest mb-1">SYSTEM UPTIME</p>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-arc-500/70" />
          <span className="text-2xl font-mono text-glow text-white tracking-widest">
            {uptime.formatted}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-stark-light/30 border border-arc-500/10">
          <div className="flex items-center gap-2 mb-1">
            <Server size={12} className="text-arc-500/70" />
            <span className="text-xs text-white/40">Processes</span>
          </div>
          <span className="text-lg font-mono text-white">{metrics.activeProcesses}</span>
        </div>
        <div className="p-3 rounded-lg bg-stark-light/30 border border-arc-500/10">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={12} className="text-arc-500/70" />
            <span className="text-xs text-white/40">Connections</span>
          </div>
          <span className="text-lg font-mono text-white">{metrics.activeConnections}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// AI STATUS CARD
// ═══════════════════════════════════════════════════════════════════════════

const AIStatusCard = () => {
  const { aiStatus, aiName, conversations } = useAIStore()
  const { metrics } = useSystemStore()
  const navigate = useNavigate()

  const statusLabels = {
    standby: 'Standing By',
    listening: 'Listening...',
    processing: 'Processing...',
    speaking: 'Speaking...',
    error: 'Error'
  }

  return (
    <motion.div
      className="hud-panel p-5 cursor-pointer group"
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      onClick={() => navigate('/ai-core')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-arc-500/30 to-jarvis-500/30 border border-arc-500/30 flex items-center justify-center">
              <Brain size={24} className="text-arc-400" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-arc-500/50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-white">{aiName}</h3>
            <p className="text-xs text-arc-500/70">{statusLabels[aiStatus]}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-white/30 group-hover:text-arc-500 transition-colors" />
      </div>

      {/* AI Metrics */}
      <div className="space-y-3">
        {/* Neural Load */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/40">Neural Load</span>
            <span className="text-xs font-mono text-arc-500">{metrics.aiLoad}%</span>
          </div>
          <div className="h-1.5 bg-stark-light rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-arc-500 to-jarvis-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${metrics.aiLoad}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-arc-500/10">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-arc-500/50" />
            <span className="text-xs text-white/40">{conversations.length} Conversations</span>
          </div>
          <span className="text-xs text-arc-500/50">Active</span>
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY STATUS CARD
// ═══════════════════════════════════════════════════════════════════════════

const SecurityStatusCard = () => {
  const { securityLevel, threatLevel, isLocked, threats } = useSecurityStore()
  const navigate = useNavigate()

  const levelConfig = {
    green: { color: 'green', label: 'SECURE', icon: Shield },
    yellow: { color: 'yellow', label: 'CAUTION', icon: AlertTriangle },
    orange: { color: 'orange', label: 'ELEVATED', icon: AlertTriangle },
    red: { color: 'red', label: 'CRITICAL', icon: AlertTriangle }
  }

  const level = levelConfig[securityLevel] || levelConfig.green
  const activeThreats = threats.filter(t => t.status === 'active').length

  return (
    <motion.div
      className="hud-panel p-5 cursor-pointer group"
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      onClick={() => navigate('/security')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider">
          Security Status
        </h3>
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full`}
          style={{
            backgroundColor: `rgba(${securityLevel === 'green' ? '74, 222, 128' : securityLevel === 'yellow' ? '250, 204, 21' : '239, 68, 68'}, 0.1)`,
            borderColor: `rgba(${securityLevel === 'green' ? '74, 222, 128' : securityLevel === 'yellow' ? '250, 204, 21' : '239, 68, 68'}, 0.3)`,
            borderWidth: 1
          }}
        >
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: securityLevel === 'green' ? '#4ade80' : securityLevel === 'yellow' ? '#facc15' : '#ef4444'
            }}
          />
          <span 
            className="text-xs font-mono"
            style={{
              color: securityLevel === 'green' ? '#4ade80' : securityLevel === 'yellow' ? '#facc15' : '#ef4444'
            }}
          >
            {level.label}
          </span>
        </div>
      </div>

      {/* Threat Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/40">Threat Level</span>
          <span className="text-xs font-mono text-white/60">{threatLevel}%</span>
        </div>
        <div className="h-2 bg-stark-light rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, #4ade80, ${threatLevel > 30 ? '#facc15' : '#4ade80'}, ${threatLevel > 60 ? '#ef4444' : threatLevel > 30 ? '#facc15' : '#4ade80'})`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${threatLevel}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Security Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-stark-light/30">
          {isLocked ? (
            <Lock size={14} className="text-green-400" />
          ) : (
            <Unlock size={14} className="text-yellow-400" />
          )}
          <span className="text-xs text-white/60">{isLocked ? 'Locked' : 'Unlocked'}</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-stark-light/30">
          <AlertTriangle size={14} className={activeThreats > 0 ? 'text-red-400' : 'text-green-400'} />
          <span className="text-xs text-white/60">{activeThreats} Threats</span>
        </div>
      </div>

      {/* View More */}
      <div className="flex items-center justify-end mt-3 pt-3 border-t border-arc-500/10">
        <span className="text-xs text-arc-500/50 group-hover:text-arc-500 transition-colors flex items-center gap-1">
          View Details
          <ChevronRight size={14} />
        </span>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECTS OVERVIEW CARD
// ═══════════════════════════════════════════════════════════════════════════

const ProjectsOverviewCard = () => {
  const { projects } = useProjectsStore()
  const navigate = useNavigate()

  const statusCounts = {
    'in-progress': projects.filter(p => p.status === 'in-progress').length,
    'planning': projects.filter(p => p.status === 'planning').length,
    'completed': projects.filter(p => p.status === 'completed').length
  }

  return (
    <motion.div
      className="hud-panel p-5 cursor-pointer group"
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      onClick={() => navigate('/rnd-lab')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider">
          R&D Projects
        </h3>
        <ChevronRight size={20} className="text-white/30 group-hover:text-arc-500 transition-colors" />
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 rounded-lg bg-arc-500/10 border border-arc-500/20">
          <span className="text-lg font-display font-bold text-arc-400">{statusCounts['in-progress']}</span>
          <p className="text-[10px] text-white/40 mt-0.5">Active</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
          <span className="text-lg font-display font-bold text-yellow-400">{statusCounts['planning']}</span>
          <p className="text-[10px] text-white/40 mt-0.5">Planning</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-green-400/10 border border-green-400/20">
          <span className="text-lg font-display font-bold text-green-400">{statusCounts['completed'] || 0}</span>
          <p className="text-[10px] text-white/40 mt-0.5">Complete</p>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="space-y-2">
        <p className="text-xs text-white/40 mb-2">Recent Projects</p>
        {projects.slice(0, 3).map((project, index) => (
          <div
            key={project.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-stark-light/20 hover:bg-stark-light/30 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-arc-500/10 flex items-center justify-center">
              <FlaskConical size={14} className="text-arc-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{project.name}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-stark-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-arc-500 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-xs text-white/40">{project.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// QUICK ACTIONS CARD
// ═══════════════════════════════════════════════════════════════════════════

const QuickActionsCard = () => {
  const { addNotification } = useSystemStore()
  const { openChat } = useAIStore()

  const actions = [
    { 
      id: 'ai-chat', 
      label: 'Talk to J.A.R.V.I.S', 
      icon: MessageSquare, 
      color: 'arc',
      onClick: () => openChat()
    },
    { 
      id: 'scan', 
      label: 'Run System Scan', 
      icon: Activity, 
      color: 'green',
      onClick: () => addNotification({ type: 'info', title: 'System Scan', message: 'Initiating full system scan...' })
    },
    { 
      id: 'report', 
      label: 'Generate Report', 
      icon: FileText, 
      color: 'purple',
      onClick: () => addNotification({ type: 'info', title: 'Report', message: 'Generating system report...' })
    },
    { 
      id: 'terminal', 
      label: 'Open Terminal', 
      icon: Terminal, 
      color: 'yellow',
      onClick: () => addNotification({ type: 'info', title: 'Terminal', message: 'Terminal feature coming soon...' })
    }
  ]

  const colorClasses = {
    arc: 'bg-arc-500/10 text-arc-400 hover:bg-arc-500/20 border-arc-500/20',
    green: 'bg-green-400/10 text-green-400 hover:bg-green-400/20 border-green-400/20',
    purple: 'bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 border-purple-400/20',
    yellow: 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 border-yellow-400/20'
  }

  return (
    <motion.div
      className="hud-panel p-5"
      variants={itemVariants}
    >
      <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.id}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${colorClasses[action.color]}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
            >
              <Icon size={16} />
              <span className="text-xs font-medium">{action.label}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVITY FEED CARD
// ═══════════════════════════════════════════════════════════════════════════

const ActivityFeedCard = () => {
  const { notifications } = useSystemStore()

  // Mock activity data if no notifications
  const activities = notifications.length > 0 ? notifications.slice(0, 5) : [
    { id: 1, type: 'info', title: 'System Boot', message: 'SI-OS initialized successfully', timestamp: new Date().toISOString() },
    { id: 2, type: 'ai', title: 'J.A.R.V.I.S', message: 'AI Core online and ready', timestamp: new Date().toISOString() },
    { id: 3, type: 'success', title: 'Security', message: 'All systems secure', timestamp: new Date().toISOString() }
  ]

  const typeIcons = {
    info: Activity,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertTriangle,
    ai: Brain
  }

  const typeColors = {
    info: 'text-arc-500',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    ai: 'text-purple-400'
  }

  return (
    <motion.div
      className="hud-panel p-5"
      variants={itemVariants}
    >
      <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
        Activity Feed
      </h3>

      <div className="space-y-3">
        {activities.map((activity, index) => {
          const Icon = typeIcons[activity.type] || Activity
          return (
            <motion.div
              key={activity.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-stark-light/20 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`mt-0.5 ${typeColors[activity.type]}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{activity.title}</p>
                <p className="text-xs text-white/40 truncate">{activity.message}</p>
              </div>
              <span className="text-[10px] text-white/30 whitespace-nowrap">
                {new Date(activity.timestamp).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Dashboard() {
  const { metrics } = useSystemStore()

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-2">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, Sir
        </h1>
        <p className="text-white/50">
          All systems operational. Here's your command dashboard overview.
        </p>
      </motion.div>

      {/* Enhanced System Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Cpu}
          label="CPU Usage"
          value={metrics.cpu}
          unit="%"
          trend="up"
          trendValue="+2.4%"
          color="arc"
          interactive={true}
          onClick={() => console.log('CPU details')}
        />
        <MetricCard
          icon={HardDrive}
          label="Memory"
          value={metrics.memory}
          unit="%"
          trend="down"
          trendValue="-1.2%"
          color="purple"
          interactive={true}
          onClick={() => console.log('Memory details')}
        />
        <MetricCard
          icon={Wifi}
          label="Network"
          value={metrics.network}
          unit="Mbps"
          trend="up"
          trendValue="+5.8%"
          color="green"
          interactive={true}
          onClick={() => console.log('Network details')}
        />
        <MetricCard
          icon={Database}
          label="Storage"
          value={metrics.storage}
          unit="%"
          color="yellow"
          interactive={true}
          onClick={() => console.log('Storage details')}
        />
      </div>

      {/* Enhanced Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Global Operations Globe */}
          <motion.div 
            variants={itemVariants}
            className="hud-panel p-4 h-96"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Global Operations</h2>
              <div className="flex items-center gap-2 text-xs text-arc-300">
                <Globe size={16} />
                <span>3D Interactive Globe</span>
              </div>
            </div>
            <div className="h-full w-full rounded-lg overflow-hidden">
              <GlobeVisualization />
            </div>
          </motion.div>
          {/* ⭐ ENHANCED ARC REACTOR SECTION ⭐ */}
          <motion.div 
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stark-dark/50 to-stark-light/30 border border-arc-500/20 p-1"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-arc-500/5 to-jarvis-500/5 opacity-50" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ArcReactorWidget />
              <AIStatusCard />
            </div>
          </motion.div>

          {/* Enhanced Security and Projects Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecurityStatusCard />
            <ProjectsOverviewCard />
          </div>

          {/* Additional Enhanced Section */}
          <motion.div
            className="hud-panel p-6"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Rocket size={20} className="text-arc-400" />
                System Performance
              </h3>
              <ChevronRight size={20} className="text-white/30" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-stark-light/30 border border-arc-500/10">
                <Target size={24} className="text-arc-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">98.5%</div>
                <div className="text-xs text-white/60">Efficiency</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-stark-light/30 border border-green-500/10">
                <Shield size={24} className="text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">A+</div>
                <div className="text-xs text-white/60">Security</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-stark-light/30 border border-purple-500/10">
                <Sparkles size={24} className="text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">v2.1</div>
                <div className="text-xs text-white/60">Version</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Right Column */}
        <div className="space-y-6">
          <SystemStatusCard />
          
          {/* Enhanced Quick Actions Card */}
          <motion.div
            className="hud-panel p-5"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider flex items-center gap-2">
                <Zap size={16} className="text-arc-400" />
                Quick Actions
              </h3>
              <Settings size={16} className="text-white/30" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'ai-chat', label: 'J.A.R.V.I.S', icon: MessageSquare, color: 'arc' },
                { id: 'scan', label: 'System Scan', icon: Activity, color: 'green' },
                { id: 'report', label: 'Generate Report', icon: FileText, color: 'purple' },
                { id: 'terminal', label: 'Terminal', icon: Terminal, color: 'yellow' },
                { id: 'monitor', label: 'Monitor', icon: Monitor, color: 'blue' },
                { id: 'code', label: 'Dev Mode', icon: Code, color: 'pink' }
              ].map((action) => {
                const Icon = action.icon
                return (
                  <motion.button
                    key={action.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                      action.color === 'arc' ? 'bg-arc-500/10 text-arc-400 border-arc-500/20 hover:bg-arc-500/20 hover:border-arc-500/40 hover:scale-105' :
                      action.color === 'green' ? 'bg-green-400/10 text-green-400 border-green-400/20 hover:bg-green-400/20 hover:border-green-400/40 hover:scale-105' :
                      action.color === 'purple' ? 'bg-purple-400/10 text-purple-400 border-purple-400/20 hover:bg-purple-400/20 hover:border-purple-400/40 hover:scale-105' :
                      action.color === 'yellow' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20 hover:border-yellow-400/40 hover:scale-105' :
                      action.color === 'blue' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20 hover:bg-blue-400/20 hover:border-blue-400/40 hover:scale-105' :
                      'bg-pink-400/10 text-pink-400 border-pink-400/20 hover:bg-pink-400/20 hover:border-pink-400/40 hover:scale-105'
                    }`}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => console.log(`Action: ${action.id}`)}
                  >
                    <Icon size={20} />
                    <span className="text-xs font-medium">{action.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          <ActivityFeedCard />
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard