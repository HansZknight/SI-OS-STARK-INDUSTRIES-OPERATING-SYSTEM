// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// Main Layout Component - Primary Application Shell
// ═══════════════════════════════════════════════════════════════════════════
// Classification: STARK INDUSTRIES PROPRIETARY
// Author: Tony Stark
// System: SI-OS v1.0.0 | Codename: J.A.R.V.I.S
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Brain,
  FlaskConical,
  Database,
  Shield,
  Network,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
  Settings,
  Search,
  Command,
  Clock,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Menu,
  X,
  Zap,
  MessageSquare,
  Download,
  LogOut,
  Loader2
} from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle.jsx'
import { FullscreenButton } from '../ui/FullscreenButton'

// Stores
import { useSystemStore, useLockdownState } from '../../stores/systemStore'
import { useAuthStore } from '../../stores/authStore'
import { useToastStore } from '../ui/Toast'

// Create a fallback AI store if the real one is not available
const createFallbackAIStore = () => ({
  openChat: () => console.log('AI Chat not available'),
  aiStatus: 'idle',
  messages: [],
  currentQuery: '',
  toggleChat: () => {},
  setAIStatus: () => {},
  addMessage: () => {},
  setCurrentQuery: () => {},
  reset: () => {}
})

// Try to import the real AI store, fallback to mock if not available
let useAIStore
try {
  useAIStore = (await import('../../stores/aiStore')).useAIStore
} catch (error) {
  console.warn('AI Store not found, using fallback')
  useAIStore = createFallbackAIStore
}

// Components
import NotificationCenter from '../ui/NotificationCenter'
import ExportModal from '../ui/ExportModal'

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION ITEMS
// ═══════════════════════════════════════════════════════════════════════════

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Command Dashboard',
    shortLabel: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    description: 'Central command and system overview'
  },
  {
    id: 'ai-core',
    label: 'AI Core',
    shortLabel: 'AI Core',
    icon: Brain,
    path: '/ai-core',
    description: 'J.A.R.V.I.S neural network interface'
  },
  {
    id: 'arc-reactor',
    label: 'Arc Reactor',
    shortLabel: 'Arc Reactor',
    icon: Zap,
    path: '/arc-reactor',
    description: 'Energy source monitoring'
  },
  {
    id: 'iron-man-suit',
    label: 'Suit Diagnostics',
    shortLabel: 'Mark 45',
    icon: Shield,
    path: '/iron-man-suit',
    description: 'Armor telemetry and systems'
  },
  {
    id: 'rnd-lab',
    label: 'R&D Laboratory',
    shortLabel: 'R&D Lab',
    icon: FlaskConical,
    path: '/rnd-lab',
    description: 'Research and development projects'
  },
  {
    id: 'data-hub',
    label: 'Data Intelligence Hub',
    shortLabel: 'Data Hub',
    icon: Database,
    path: '/data-hub',
    description: 'Analytics and data visualization'
  },
  {
    id: 'security',
    label: 'Security & Defense',
    shortLabel: 'Security',
    icon: Shield,
    path: '/security',
    description: 'Threat monitoring and access control'
  },
  {
    id: 'system-architecture',
    label: 'System Architecture',
    shortLabel: 'System',
    icon: Network,
    path: '/system-architecture',
    description: 'Infrastructure and system topology'
  },
  {
    id: 'tony-mode',
    label: 'Personal Interface',
    shortLabel: 'Tony Mode',
    icon: User,
    path: '/tony-mode',
    description: 'Personal workspace and quick commands'
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Sidebar = ({ collapsed, onToggle, currentPath }) => {
  const navigate = useNavigate()
  const { setCurrentModule } = useSystemStore()

  const handleNavigation = (item) => {
    navigate(item.path)
    setCurrentModule(item.id)
  }

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col"
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Sidebar Background */}
      <div className="absolute inset-0 bg-stark-darker/95 backdrop-blur-xl border-r border-arc-500/10" />

      {/* Sidebar Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center h-16 px-4 border-b border-arc-500/10">
          <motion.div
            className="flex items-center gap-3"
            animate={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            {/* Arc Reactor Icon */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-arc-500/20 to-arc-600/20 border border-arc-500/30 flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 rounded-full bg-arc-500"
                  style={{
                    boxShadow: '0 0 15px rgba(0, 212, 255, 0.6), 0 0 30px rgba(0, 212, 255, 0.3)'
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 15px rgba(0, 212, 255, 0.6), 0 0 30px rgba(0, 212, 255, 0.3)',
                      '0 0 20px rgba(0, 212, 255, 0.8), 0 0 40px rgba(0, 212, 255, 0.4)',
                      '0 0 15px rgba(0, 212, 255, 0.6), 0 0 30px rgba(0, 212, 255, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Logo Text */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-sm font-display font-bold text-arc-500 tracking-wider">
                    STARK
                  </h1>
                  <p className="text-[10px] text-arc-500/50 tracking-widest uppercase">
                    Industries OS
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.path
              const Icon = item.icon

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`
                    relative w-full flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-colors duration-200 group
                    ${isActive 
                      ? 'bg-arc-500/10 text-arc-400' 
                      : 'text-white/60 hover:bg-arc-500/5 hover:text-white/80'
                    }
                  `}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-arc-500 rounded-r-full"
                      layoutId="activeIndicator"
                      style={{
                        boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                    ${isActive 
                      ? 'bg-arc-500/20 text-arc-400' 
                      : 'bg-stark-light/50 text-white/50 group-hover:bg-arc-500/10 group-hover:text-arc-400'
                    }
                    transition-colors duration-200
                  `}>
                    <Icon size={18} />
                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        className="flex-1 text-left overflow-hidden"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-sm font-medium truncate block">
                          {item.shortLabel}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="
                      absolute left-full ml-2 px-3 py-2 
                      bg-stark-dark border border-arc-500/20 rounded-lg
                      text-sm text-white whitespace-nowrap
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible
                      transition-all duration-200 z-50
                      shadow-lg
                    ">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-stark-dark border-l border-b border-arc-500/20 rotate-45" />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-2 border-t border-arc-500/10">
          {/* Collapse Toggle */}
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white/50 hover:text-white/80 hover:bg-arc-500/5 transition-colors"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-arc-500/20 to-transparent" />
    </motion.aside>
  )
}
// TOP BAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const TopBar = ({ sidebarCollapsed, onMenuClick, onNotificationClick, onExportClick }) => {
  const { user, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { currentTime, 
    metrics, 
    notifications, 
    unreadNotificationCount,
    openCommandPalette 
  } = useSystemStore()
  const { lockdownMode, lockdownDuration, lockdownInitiated, updateLockdownDuration } = useLockdownState()
  const { openChat, aiStatus } = useAIStore()
  const { history } = useToastStore()

  // Lockdown duration timer
  useEffect(() => {
    if (lockdownMode === 'lockdown') {
      const timer = setInterval(() => {
        updateLockdownDuration()
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [lockdownMode, updateLockdownDuration])

  // Handle user logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      showNotification({
        type: 'success',
        title: 'Logged out',
        message: 'You have been successfully logged out.',
        duration: 3000
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      showNotification({
        type: 'error',
        title: 'Logout Failed',
        message: error.message || 'Failed to log out. Please try again.',
        duration: 4000
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Current page info
  const currentPage = navigationItems.find(item => item.path === location.pathname) || navigationItems[0]

  // Notification count from toast history
  const notificationCount = history.length

  // Format time
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 bg-stark-darker/80 backdrop-blur-xl border-b border-arc-500/10 transition-all duration-300 left-0 ${sidebarCollapsed ? 'lg:left-[72px]' : 'lg:left-[280px]'}`}
    >
      {/* Left Section */}
      <div className="flex items-center flex-1 min-w-0 mr-4 gap-2 sm:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-white/60 hover:text-white hover:bg-arc-500/10 transition-colors flex-shrink-0"
        >
          <Menu size={20} />
        </button>

        {/* Page Title */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <currentPage.icon size={18} className="text-arc-500 flex-shrink-0 hidden sm:block" />
            <h2 className="text-base sm:text-lg font-display font-semibold text-white tracking-wide truncate">
              <span className="hidden sm:inline">{currentPage.label}</span>
              <span className="sm:hidden">{currentPage.shortLabel}</span>
            </h2>
          </div>
          <p className="text-xs text-white/40 mt-0.5 truncate hidden sm:block">
            {currentPage.description}
          </p>
        </div>

        {/* Global Lockdown Indicator */}
        {lockdownMode === 'lockdown' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 backdrop-blur-sm"
          >
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
            </div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              LOCKDOWN
            </span>
            <span className="text-xs text-red-500/70 ml-2">
              {Math.floor(lockdownDuration / 60)}:{(lockdownDuration % 60).toString().padStart(2, '0')}
            </span>
          </motion.div>
        )}
      </div>

      {/* Center Section - Quick Search */}
      <div className="hidden md:flex items-center">
        <button
          onClick={openCommandPalette}
          className="flex items-center gap-3 px-4 py-2 rounded-lg bg-stark-light/30 border border-arc-500/10 text-white/40 hover:text-white/60 hover:border-arc-500/20 transition-all group"
        >
          <Search size={16} />
          <span className="text-sm">Quick search...</span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-stark-dark/50 text-xs text-white/30 group-hover:text-white/50">
            <Command size={10} />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* System Metrics Mini */}
        <div className="hidden lg:flex items-center gap-4 mr-4 px-4 py-1.5 rounded-lg bg-stark-light/20 border border-arc-500/10">
          {/* CPU */}
          <div className="flex items-center gap-1.5">
            <Cpu size={12} className="text-arc-500/70" />
            <span className="text-xs font-mono text-white/60">{metrics.cpu}%</span>
          </div>
          
          {/* Memory */}
          <div className="flex items-center gap-1.5">
            <HardDrive size={12} className="text-arc-500/70" />
            <span className="text-xs font-mono text-white/60">{metrics.memory}%</span>
          </div>
          
          {/* Network */}
          <div className="flex items-center gap-1.5">
            <Wifi size={12} className="text-arc-500/70" />
            <span className="text-xs font-mono text-white/60">{metrics.network}%</span>
          </div>
        </div>

        {/* Time Display */}
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-sm font-mono text-arc-500 tracking-wider">
            {formattedTime}
          </span>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">
            {formattedDate}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-arc-500/20 mx-2" />

        {/* Theme Toggle */}
        <div className="hidden sm:block">
          <ThemeToggle compact />
        </div>

        {/* Fullscreen Button */}
        <div className="hidden sm:block">
          <FullscreenButton />
        </div>

        {/* Export Button */}
        <button
          onClick={onExportClick}
          className="hidden sm:block p-2.5 rounded-lg text-white/60 hover:text-white hover:bg-arc-500/10 transition-colors group"
          title="Export & Reports"
        >
          <Download size={18} />
          
          {/* Tooltip */}
          <span className="
            absolute top-full right-0 mt-2
            px-2 py-1 rounded
            bg-stark-dark/90 border border-arc-500/20
            text-xs text-white/70 whitespace-nowrap
            opacity-0 group-hover:opacity-100
            transition-opacity pointer-events-none
            z-50
          ">
            Export & Reports
          </span>
        </button>

        {/* AI Chat Button */}
        <button
          onClick={openChat}
          className={`
            relative p-2.5 rounded-lg transition-all group
            ${aiStatus === 'processing' 
              ? 'bg-arc-500/20 text-arc-400' 
              : 'text-white/60 hover:text-white hover:bg-arc-500/10'
            }
          `}
          title="AI Chat (Ctrl+J)"
        >
          <MessageSquare size={18} />
          {aiStatus === 'processing' && (
            <motion.div
              className="absolute inset-0 rounded-lg border border-arc-500/50"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          
          {/* Tooltip */}
          <span className="
            absolute top-full right-0 mt-2
            px-2 py-1 rounded
            bg-stark-dark/90 border border-arc-500/20
            text-xs text-white/70 whitespace-nowrap
            opacity-0 group-hover:opacity-100
            transition-opacity pointer-events-none
            z-50
          ">
            AI Chat (Ctrl+J)
          </span>
        </button>

        {/* Notifications Button */}
        <button 
          onClick={onNotificationClick}
          className="relative p-2.5 rounded-lg text-white/60 hover:text-white hover:bg-arc-500/10 transition-colors group"
          title="Notifications (Ctrl+N)"
        >
          <Bell size={18} />
          
          {/* Unread Badge */}
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="
                absolute -top-0.5 -right-0.5 
                min-w-[18px] h-[18px]
                flex items-center justify-center
                px-1 rounded-full
                bg-arc-500 text-white
                text-[10px] font-bold
                shadow-lg shadow-arc-500/30
              "
            >
              {notificationCount > 99 ? '99+' : notificationCount}
            </motion.span>
          )}
          
          {/* Tooltip */}
          <span className="
            absolute top-full right-0 mt-2
            px-2 py-1 rounded
            bg-stark-dark/90 border border-arc-500/20
            text-xs text-white/70 whitespace-nowrap
            opacity-0 group-hover:opacity-100
            transition-opacity pointer-events-none
            z-50
          ">
            Notifications (Ctrl+N)
          </span>
        </button>

        {/* Settings */}
        <button className="hidden sm:block p-2.5 rounded-lg text-white/60 hover:text-white hover:bg-arc-500/10 transition-colors group">
          <Settings size={18} />
          
          {/* Tooltip */}
          <span className="
            absolute top-full right-0 mt-2
            px-2 py-1 rounded
            bg-stark-dark/90 border border-arc-500/20
            text-xs text-white/70 whitespace-nowrap
            opacity-0 group-hover:opacity-100
            transition-opacity pointer-events-none
            z-50
          ">
            Settings
          </span>
        </button>

        {/* User Dropdown */}
        <div className="ml-2 relative group">
          <button 
            className="flex items-center gap-2 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-arc-500/30 to-jarvis-500/30 border border-arc-500/30 flex items-center justify-center">
              <span className="text-sm font-bold text-arc-400">TS</span>
            </div>
            <ChevronDown size={16} className="text-white/40 group-hover:text-arc-400 transition-colors" />
          </button>
          
          {/* Dropdown Menu */}
          <div className="
            absolute right-0 mt-2 w-56 origin-top-right 
            bg-stark-darker/95 backdrop-blur-lg rounded-lg shadow-xl 
            border border-arc-500/20 overflow-hidden
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition-all duration-200 ease-out
            transform translate-y-1 group-hover:translate-y-0
            z-50
          ">
            <div className="p-4 border-b border-arc-500/10">
              <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-arc-400 truncate">{user?.email || 'user@example.com'}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-arc-500/70 capitalize">
                  {user?.role || 'User'}
                  {user?.clearanceLevel && ` • ${user.clearanceLevel}`}
                </span>
              </div>
            </div>
            
            <div className="p-1">
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-white/80 hover:bg-arc-500/10 rounded transition-colors"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE SIDEBAR OVERLAY
// ═══════════════════════════════════════════════════════════════════════════

const MobileSidebar = ({ isOpen, onClose, currentPath }) => {
  const navigate = useNavigate()
  const { setCurrentModule } = useSystemStore()

  const handleNavigation = (item) => {
    navigate(item.path)
    setCurrentModule(item.id)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed left-0 top-0 bottom-0 w-72 bg-stark-darker border-r border-arc-500/10 z-50 lg:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-arc-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-arc-500/20 border border-arc-500/30 flex items-center justify-center">
                  <Zap size={18} className="text-arc-500" />
                </div>
                <div>
                  <h1 className="text-sm font-display font-bold text-arc-500">STARK</h1>
                  <p className="text-[10px] text-arc-500/50 tracking-widest uppercase">Industries OS</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-arc-500/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navigationItems.map((item) => {
                const isActive = currentPath === item.path
                const Icon = item.icon

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg
                      transition-colors duration-200
                      ${isActive 
                        ? 'bg-arc-500/10 text-arc-400' 
                        : 'text-white/60 hover:bg-arc-500/5 hover:text-white/80'
                      }
                    `}
                  >
                    <div className={`
                      w-9 h-9 rounded-lg flex items-center justify-center
                      ${isActive ? 'bg-arc-500/20 text-arc-400' : 'bg-stark-light/50 text-white/50'}
                    `}>
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
// MAIN LAYOUT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function MainLayout({ children, config }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Get stores
  const { showNotification } = useToastStore()
  const { 
    systemReady, 
    systemStatus, 
    cpuLoad, 
    memoryUsage, 
    networkStatus,
    simulateMetrics 
  } = useSystemStore()
  
  const { aiStatus } = useAIStore()
  const { user, logout, isAuthenticated, isLoading } = useAuthStore()
  
  // Check authentication status on mount
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
    }
  }, [isAuthenticated, isLoading, navigate, location])
  
  // Simulate metrics update
  useEffect(() => {
    simulateMetrics()
    const interval = setInterval(simulateMetrics, 5000)
    return () => clearInterval(interval)
  }, [simulateMetrics])
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      showNotification({
        type: 'success',
        title: 'Logged out',
        message: 'You have been successfully logged out.',
        duration: 3000
      })
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      showNotification({
        type: 'error',
        title: 'Logout Failed',
        message: error.message || 'Failed to log out. Please try again.',
        duration: 4000
      })
    } finally {
      setIsLoggingOut(false)
    }
  }
  
  const confirmLogout = () => {
    showNotification({
      type: 'confirm',
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      duration: 0, // No auto-dismiss
      actions: [
        {
          text: 'Cancel',
          style: 'secondary',
          onClick: () => {}
        },
        {
          text: 'Log Out',
          style: 'danger',
          onClick: handleLogout
        }
      ]
    })
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev)
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Keyboard shortcut for notifications (Ctrl+N)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        setNotificationsOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative flex flex-col h-screen bg-stark-black overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          currentPath={location.pathname}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentPath={location.pathname}
      />

      {/* Top Bar */}
      <TopBar
        sidebarCollapsed={sidebarCollapsed}
        onMenuClick={() => setMobileMenuOpen(true)}
        onNotificationClick={() => setNotificationsOpen(true)}
        onExportClick={() => setShowExport(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <div 
          className={`absolute inset-0 overflow-y-auto no-scrollbar pt-16 pb-6 transition-all duration-300 ml-0 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}`}
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </div>
      </div>

      {/* System Status Bar (Bottom) */}
      <div
        className={`fixed bottom-0 right-0 h-6 flex items-center justify-end gap-2 lg:gap-4 px-2 lg:px-4 bg-stark-darker/80 backdrop-blur-sm border-t border-arc-500/10 text-xs transition-all duration-300 z-10 left-0 w-full ${sidebarCollapsed ? 'lg:left-[72px] lg:w-[calc(100%-72px)]' : 'lg:left-[280px] lg:w-[calc(100%-280px)]'}`}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/40 font-mono hidden sm:inline">SYSTEM ONLINE</span>
        </div>
        <div className="text-white/30">|</div>
        <span className="text-white/40 font-mono">SI-OS v{config.version}</span>
        <div className="text-white/30">|</div>
        <span className="text-white/40 font-mono">{config.codename}</span>
      </div>

      {/* Notification Center Panel */}
      <NotificationCenter 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      
      {/* Export Modal */}
      <ExportModal 
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        data={{
          metrics: { 
            cpu: useSystemStore.getState().metrics.cpu, 
            memory: useSystemStore.getState().metrics.memory, 
            network: useSystemStore.getState().metrics.network 
          },
          tableData: [
            { id: 1, name: 'System Check', status: 'Running' },
            { id: 2, name: 'Security Scan', status: 'Completed' },
            { id: 3, name: 'Data Backup', status: 'Pending' }
          ]
        }}
      />
    </div>
  )
}

export default MainLayout