// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - COMMAND PALETTE
// Quick search and command execution interface
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Command,
  LayoutDashboard,
  Brain,
  FlaskConical,
  Database,
  Shield,
  Network,
  User,
  Settings,
  Bell,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Zap,
  Lock,
  Unlock,
  Scan,
  MessageSquare,
  FileText,
  Code,
  Activity,
  X,
  ArrowRight,
  Hash,
  Clock
} from 'lucide-react'

// Stores & Utils
import { useToastStore, toast } from './Toast'
import { useSystemStore, useSecurityStore, useAIStore } from '../../stores/systemStore'

// ═══════════════════════════════════════════════════════════════════════════
// COMMAND CATEGORIES & ITEMS
// ═══════════════════════════════════════════════════════════════════════════

const getCommands = (navigate, actions) => [
  // Navigation
  {
    id: 'nav-dashboard',
    category: 'Navigation',
    icon: LayoutDashboard,
    title: 'Go to Dashboard',
    description: 'Central command overview',
    shortcut: 'G D',
    action: () => navigate('/')
  },
  {
    id: 'nav-ai',
    category: 'Navigation',
    icon: Brain,
    title: 'Go to AI Core',
    description: 'J.A.R.V.I.S neural interface',
    shortcut: 'G A',
    action: () => navigate('/ai-core')
  },
  {
    id: 'nav-rnd',
    category: 'Navigation',
    icon: FlaskConical,
    title: 'Go to R&D Lab',
    description: 'Research and development',
    shortcut: 'G R',
    action: () => navigate('/rnd-lab')
  },
  {
    id: 'nav-suit',
    category: 'Navigation',
    icon: Shield,
    title: 'Go to Suit Diagnostics',
    description: 'Armor telemetry',
    shortcut: 'G S',
    action: () => navigate('/iron-man-suit')
  },
  {
    id: 'nav-data',
    category: 'Navigation',
    icon: Database,
    title: 'Go to Data Hub',
    description: 'Analytics and visualization',
    shortcut: 'G H',
    action: () => navigate('/data-hub')
  },
  {
    id: 'nav-security',
    category: 'Navigation',
    icon: Shield,
    title: 'Go to Security',
    description: 'Defense and monitoring',
    shortcut: 'G S',
    action: () => navigate('/security')
  },
  {
    id: 'nav-system',
    category: 'Navigation',
    icon: Network,
    title: 'Go to System Architecture',
    description: 'Infrastructure overview',
    shortcut: 'G Y',
    action: () => navigate('/system-architecture')
  },
  {
    id: 'nav-tony',
    category: 'Navigation',
    icon: User,
    title: 'Go to Tony Mode',
    description: 'Personal workspace',
    shortcut: 'G T',
    action: () => navigate('/tony-mode')
  },

  // Quick Actions
  {
    id: 'action-scan',
    category: 'Actions',
    icon: Scan,
    title: 'Run Security Scan',
    description: 'Initiate full system scan',
    action: () => {
      toast.system('Security Scan', 'Initiating full system security scan...')
      actions.runSecurityScan?.()
    }
  },
  {
    id: 'action-lock',
    category: 'Actions',
    icon: Lock,
    title: 'Lock System',
    description: 'Enable maximum security',
    action: () => {
      toast.security('System Locked', 'Maximum security protocols enabled.')
      actions.lockSystem?.()
    }
  },
  {
    id: 'action-unlock',
    category: 'Actions',
    icon: Unlock,
    title: 'Unlock System',
    description: 'Restore normal access',
    action: () => {
      toast.warning('System Unlocked', 'Normal access restored.')
      actions.unlockSystem?.()
    }
  },
  {
    id: 'action-refresh',
    category: 'Actions',
    icon: RefreshCw,
    title: 'Refresh Data',
    description: 'Reload all system data',
    action: () => {
      toast.info('Refreshing', 'Reloading system data...')
      window.location.reload()
    }
  },
  {
    id: 'action-clear-notifications',
    category: 'Actions',
    icon: Trash2,
    title: 'Clear Notifications',
    description: 'Remove all notifications',
    action: () => {
      actions.clearNotifications?.()
      toast.success('Cleared', 'All notifications removed.')
    }
  },

  // AI Commands
  {
    id: 'ai-chat',
    category: 'AI',
    icon: MessageSquare,
    title: 'Open AI Chat',
    description: 'Talk to J.A.R.V.I.S',
    shortcut: 'Ctrl+J',
    action: () => {
      navigate('/ai-core')
      toast.ai('J.A.R.V.I.S', 'How may I assist you, Sir?')
    }
  },
  {
    id: 'ai-status',
    category: 'AI',
    icon: Activity,
    title: 'AI Status Report',
    description: 'Check J.A.R.V.I.S health',
    action: () => {
      toast.ai('AI Status', 'All neural systems operational. Response time: 23ms')
    }
  },

  // Settings
  {
    id: 'settings-sound-toggle',
    category: 'Settings',
    icon: Volume2,
    title: 'Toggle Sound',
    description: 'Enable/disable notification sounds',
    shortcut: 'M',
    action: () => {
      const enabled = actions.toggleSound?.()
      toast.info('Sound', enabled ? 'Sound enabled' : 'Sound muted')
    }
  },
  {
    id: 'settings-notifications',
    category: 'Settings',
    icon: Bell,
    title: 'Open Notifications',
    description: 'View notification center',
    shortcut: 'Ctrl+N',
    action: () => {
      actions.openNotifications?.()
    }
  },

  // System
  {
    id: 'system-export',
    category: 'System',
    icon: Download,
    title: 'Export Data',
    description: 'Download system report',
    action: () => {
      toast.info('Export', 'Preparing data export...')
    }
  },
  {
    id: 'system-backup',
    category: 'System',
    icon: Upload,
    title: 'Backup System',
    description: 'Create system backup',
    action: () => {
      toast.system('Backup', 'System backup initiated...')
    }
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// COMMAND ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const CommandItem = ({ command, isSelected, onClick }) => {
  const Icon = command.icon

  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 text-left
        transition-colors
        ${isSelected
          ? 'bg-arc-500/20 border-l-2 border-arc-500'
          : 'hover:bg-white/5 border-l-2 border-transparent'
        }
      `}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 2 }}
    >
      {/* Icon */}
      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
        ${isSelected ? 'bg-arc-500/20 text-arc-400' : 'bg-white/5 text-white/50'}
      `}>
        <Icon size={18} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-white/80'}`}>
          {command.title}
        </p>
        <p className="text-xs text-white/40 truncate">
          {command.description}
        </p>
      </div>

      {/* Shortcut */}
      {command.shortcut && (
        <div className="flex items-center gap-1 flex-shrink-0">
          {command.shortcut.split('+').map((key, i) => (
            <kbd
              key={i}
              className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/50"
            >
              {key}
            </kbd>
          ))}
        </div>
      )}

      {/* Arrow */}
      {isSelected && (
        <ArrowRight size={14} className="text-arc-400 flex-shrink-0" />
      )}
    </motion.button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMMAND PALETTE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Stores
  const { toggleSound, clearHistory } = useToastStore()
  const { runSecurityScan, lockSystem, unlockSystem } = useSecurityStore()

  // Actions object
  const actions = {
    toggleSound,
    clearNotifications: clearHistory,
    runSecurityScan,
    lockSystem,
    unlockSystem,
    openNotifications: () => {
      onClose()
      window.dispatchEvent(new CustomEvent('open-notifications'))
    }
  }

  // Get commands
  const commands = useMemo(() => getCommands(navigate, actions), [navigate])

  // Filter commands
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands

    const query = search.toLowerCase()
    return commands.filter(cmd =>
      cmd.title.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query) ||
      cmd.category.toLowerCase().includes(query)
    )
  }, [commands, search])

  // Group by category
  const groupedCommands = useMemo(() => {
    const groups = {}
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = []
      }
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  // Flatten for navigation
  const flatCommands = useMemo(() => {
    return Object.values(groupedCommands).flat()
  }, [groupedCommands])

  // Reset selection when filtered results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setSearch('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev < flatCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : flatCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (flatCommands[selectedIndex]) {
            executeCommand(flatCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, flatCommands, onClose])

  // Scroll selected into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector('[data-selected="true"]')
      selectedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  // Execute command
  const executeCommand = (command) => {
    command.action()
    onClose()
  }

  // Recent commands (could be stored in localStorage)
  const recentCommands = flatCommands.slice(0, 3)

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="
              fixed top-[20%] left-1/2 -translate-x-1/2
              w-full max-w-2xl
              bg-stark-dark/95 backdrop-blur-xl
              border border-arc-500/30
              rounded-xl shadow-2xl
              overflow-hidden
              z-[9999]
            "
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-arc-500/20">
              <Search size={20} className="text-arc-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="
                  flex-1 bg-transparent
                  text-white text-lg
                  placeholder-white/30
                  outline-none
                "
              />
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 rounded bg-white/10 text-xs font-mono text-white/40">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-96 overflow-y-auto scrollbar-thin"
            >
              {flatCommands.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Search size={32} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">No commands found</p>
                  <p className="text-xs text-white/20 mt-1">Try a different search term</p>
                </div>
              ) : (
                <>
                  {Object.entries(groupedCommands).map(([category, cmds]) => (
                    <div key={category}>
                      {/* Category Header */}
                      <div className="px-4 py-2 bg-white/5 border-y border-white/5">
                        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                          {category}
                        </p>
                      </div>

                      {/* Commands */}
                      {cmds.map((cmd) => {
                        const globalIndex = flatCommands.indexOf(cmd)
                        return (
                          <div
                            key={cmd.id}
                            data-selected={selectedIndex === globalIndex}
                          >
                            <CommandItem
                              command={cmd}
                              isSelected={selectedIndex === globalIndex}
                              onClick={() => executeCommand(cmd)}
                            />
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-arc-500/20 bg-white/5">
              <div className="flex items-center gap-4 text-xs text-white/30">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">ESC</kbd>
                  Close
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Zap size={12} className="text-arc-500" />
                <span className="text-xs text-white/40">Stark Industries OS</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}