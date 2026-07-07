// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// System Store - Global State Management
// ═══════════════════════════════════════════════════════════════════════════
// Classification: STARK INDUSTRIES PROPRIETARY
// Author: Tony Stark
// System: SI-OS v1.0.0 | Codename: J.A.R.V.I.S
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM STORE
// Core system state - status, time, settings, notifications
// ═══════════════════════════════════════════════════════════════════════════

export const useSystemStore = create(
  persist(
    (set, get) => ({
      // ─────────────────────────────────────────────────────────────────────
      // SYSTEM STATUS
      // ─────────────────────────────────────────────────────────────────────
      
      systemStatus: 'initializing', // 'initializing' | 'booting' | 'online' | 'offline' | 'maintenance'
      systemVersion: '1.0.0',
      systemCodename: 'J.A.R.V.I.S',
      
      setSystemStatus: (status) => set({ systemStatus: status }),
      
      // ─────────────────────────────────────────────────────────────────────
      // TIME & UPTIME
      // ─────────────────────────────────────────────────────────────────────
      
      currentTime: new Date(),
      uptime: 0, // in seconds
      bootTime: null,
      
      setCurrentTime: (time) => set({ currentTime: time }),
      
      incrementUptime: () => set((state) => ({ uptime: state.uptime + 1 })),
      
      setBootTime: () => set({ bootTime: new Date(), uptime: 0 }),
      
      getFormattedUptime: () => {
        const { uptime } = get()
        const hours = Math.floor(uptime / 3600)
        const minutes = Math.floor((uptime % 3600) / 60)
        const seconds = uptime % 60
        
        return {
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0'),
          formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
      },
      
      // ─────────────────────────────────────────────────────────────────────
      // USER & SESSION
      // ─────────────────────────────────────────────────────────────────────
      
      user: {
        id: 'stark-001',
        name: 'Tony Stark',
        role: 'Administrator',
        avatar: null,
        clearanceLevel: 'OMEGA',
        preferences: {
          theme: 'dark',
          soundEnabled: true,
          animationsEnabled: true,
          hudDensity: 'comfortable' // 'compact' | 'comfortable' | 'spacious'
        }
      },
      
      updateUserPreferences: (preferences) => set((state) => ({
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...preferences }
        }
      })),
      
      // ─────────────────────────────────────────────────────────────────────
      // NAVIGATION STATE
      // ─────────────────────────────────────────────────────────────────────
      
      currentModule: 'dashboard',
      sidebarCollapsed: false,
      sidebarWidth: 280,
      
      setCurrentModule: (module) => set({ currentModule: module }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      // ─────────────────────────────────────────────────────────────────────
      // COMMAND PALETTE
      // ─────────────────────────────────────────────────────────────────────
      
      commandPaletteOpen: false,
      commandHistory: [],
      
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
      toggleCommandPalette: () => set((state) => ({ 
        commandPaletteOpen: !state.commandPaletteOpen 
      })),
      
      addToCommandHistory: (command) => set((state) => ({
        commandHistory: [
          { command, timestamp: new Date().toISOString() },
          ...state.commandHistory.slice(0, 49) // Keep last 50 commands
        ]
      })),
      
      clearCommandHistory: () => set({ commandHistory: [] }),
      
      // ─────────────────────────────────────────────────────────────────────
      // NOTIFICATIONS
      // ─────────────────────────────────────────────────────────────────────
      
      notifications: [],
      unreadNotificationCount: 0,
      
      addNotification: (notification) => set((state) => {
        const newNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          read: false,
          type: 'info', // 'info' | 'success' | 'warning' | 'error' | 'ai'
          ...notification
        }
        
        return {
          notifications: [newNotification, ...state.notifications.slice(0, 99)],
          unreadNotificationCount: state.unreadNotificationCount + 1
        }
      }),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1)
      })),
      
      markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadNotificationCount: 0
      })),
      
      clearNotifications: () => set({ 
        notifications: [], 
        unreadNotificationCount: 0 
      }),
      
      removeNotification: (id) => set((state) => {
        const notification = state.notifications.find((n) => n.id === id)
        return {
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadNotificationCount: notification && !notification.read 
            ? Math.max(0, state.unreadNotificationCount - 1)
            : state.unreadNotificationCount
        }
      }),
      
      // ─────────────────────────────────────────────────────────────────────
      // SYSTEM METRICS
      // ─────────────────────────────────────────────────────────────────────
      
      metrics: {
        cpu: 0,
        memory: 0,
        network: 0,
        storage: 0,
        aiLoad: 0,
        activeProcesses: 0,
        activeConnections: 0
      },
      
      updateMetrics: (newMetrics) => set((state) => ({
        metrics: { ...state.metrics, ...newMetrics }
      })),
      
      // Simulate metrics for demo
      simulateMetrics: () => {
        const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
        
        set((state) => ({
          metrics: {
            cpu: randomInRange(15, 45),
            memory: randomInRange(30, 60),
            network: randomInRange(10, 80),
            storage: randomInRange(40, 55),
            aiLoad: randomInRange(20, 70),
            activeProcesses: randomInRange(120, 180),
            activeConnections: randomInRange(5, 25)
          }
        }))
      },
      
      // ─────────────────────────────────────────────────────────────────────
      // ACTIVE MODULES
      // ─────────────────────────────────────────────────────────────────────
      
      activeModules: [
        { id: 'dashboard', name: 'Command Dashboard', status: 'active' },
        { id: 'ai-core', name: 'AI Core', status: 'active' },
        { id: 'security', name: 'Security', status: 'active' }
      ],
      
      setModuleStatus: (moduleId, status) => set((state) => ({
        activeModules: state.activeModules.map((m) =>
          m.id === moduleId ? { ...m, status } : m
        )
      })),
      
      // ─────────────────────────────────────────────────────────────────────
      // QUICK ACTIONS
      // ─────────────────────────────────────────────────────────────────────
      
      quickActions: [
        { id: 'scan', label: 'Run System Scan', icon: 'scan', shortcut: 'Ctrl+Shift+S' },
        { id: 'backup', label: 'Create Backup', icon: 'save', shortcut: 'Ctrl+Shift+B' },
        { id: 'report', label: 'Generate Report', icon: 'file-text', shortcut: 'Ctrl+Shift+R' },
        { id: 'lock', label: 'Lock System', icon: 'lock', shortcut: 'Ctrl+Shift+L' }
      ],
      
      // ─────────────────────────────────────────────────────────────────────
      // LOCKDOWN STATE
      // ─────────────────────────────────────────────────────────────────────
      
      lockdownMode: false, // false | 'standard' | 'stealth' | 'lockdown'
      lockdownInitiated: null, // timestamp when lockdown was initiated
      lockdownDuration: 0, // duration in seconds
      
      setLockdownMode: (mode) => set({ lockdownMode: mode }),
      
      initiateLockdown: () => set({ 
        lockdownMode: 'lockdown',
        lockdownInitiated: new Date().toISOString(),
        lockdownDuration: 0
      }),
      
      updateLockdownDuration: () => set((state) => ({ 
        lockdownDuration: state.lockdownDuration + 1 
      })),
      
      endLockdown: () => set({ 
        lockdownMode: false,
        lockdownInitiated: null,
        lockdownDuration: 0
      }),
      
      // ─────────────────────────────────────────────────────────────────────
      // RESET STATE
      // ─────────────────────────────────────────────────────────────────────
      
      resetSystem: () => set({
        systemStatus: 'initializing',
        uptime: 0,
        bootTime: null,
        notifications: [],
        unreadNotificationCount: 0,
        commandHistory: [],
        commandPaletteOpen: false
      })
    }),
    {
      name: 'stark-system-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        sidebarCollapsed: state.sidebarCollapsed,
        commandHistory: state.commandHistory
      })
    }
  )
)

// ═══════════════════════════════════════════════════════════════════════════
// AI STORE
// AI-specific state - conversations, memory, settings
// ═══════════════════════════════════════════════════════════════════════════

export const useAIStore = create(
  persist(
    (set, get) => ({
      // ─────────────────────────────────────────────────────────────────────
      // AI STATUS
      // ─────────────────────────────────────────────────────────────────────
      
      aiStatus: 'standby', // 'standby' | 'listening' | 'processing' | 'speaking' | 'error'
      aiName: 'J.A.R.V.I.S',
      aiVersion: '4.0.0',
      aiPersonality: 'professional', // 'professional' | 'casual' | 'sarcastic'
      
      setAIStatus: (status) => set({ aiStatus: status }),
      setAIPersonality: (personality) => set({ aiPersonality: personality }),
      
      // ─────────────────────────────────────────────────────────────────────
      // CHAT STATE
      // ─────────────────────────────────────────────────────────────────────
      
      chatOpen: false,
      chatMinimized: false,
      chatPosition: { x: 0, y: 0 },
      
      openChat: () => set({ chatOpen: true, chatMinimized: false }),
      closeChat: () => set({ chatOpen: false }),
      toggleChat: () => set((state) => ({ 
        chatOpen: !state.chatOpen,
        chatMinimized: false 
      })),
      minimizeChat: () => set({ chatMinimized: true }),
      maximizeChat: () => set({ chatMinimized: false }),
      setChatPosition: (position) => set({ chatPosition: position }),
      
      // ─────────────────────────────────────────────────────────────────────
      // CONVERSATIONS
      // ─────────────────────────────────────────────────────────────────────
      
      conversations: [],
      currentConversationId: null,
      
      createConversation: (title = 'New Conversation') => {
        const newConversation = {
          id: `conv-${Date.now()}`,
          title,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: newConversation.id
        }))
        
        return newConversation.id
      },
      
      setCurrentConversation: (id) => set({ currentConversationId: id }),
      
      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get()
        return conversations.find((c) => c.id === currentConversationId) || null
      },
      
      addMessage: (conversationId, message) => set((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  timestamp: new Date().toISOString(),
                  ...message
                }
              ],
              updatedAt: new Date().toISOString()
            }
          }
          return conv
        })
      })),
      
      deleteConversation: (id) => set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== id),
        currentConversationId: state.currentConversationId === id 
          ? null 
          : state.currentConversationId
      })),
      
      clearAllConversations: () => set({ 
        conversations: [], 
        currentConversationId: null 
      }),
      
      // ─────────────────────────────────────────────────────────────────────
      // AI MEMORY (Context)
      // ─────────────────────────────────────────────────────────────────────
      
      memory: {
        shortTerm: [], // Recent context (last few messages)
        longTerm: [],  // Important facts to remember
        preferences: {} // User preferences learned over time
      },
      
      addToShortTermMemory: (item) => set((state) => ({
        memory: {
          ...state.memory,
          shortTerm: [...state.memory.shortTerm.slice(-9), item] // Keep last 10
        }
      })),
      
      addToLongTermMemory: (item) => set((state) => ({
        memory: {
          ...state.memory,
          longTerm: [
            {
              id: `mem-${Date.now()}`,
              timestamp: new Date().toISOString(),
              ...item
            },
            ...state.memory.longTerm.slice(0, 99) // Keep last 100
          ]
        }
      })),
      
      updatePreference: (key, value) => set((state) => ({
        memory: {
          ...state.memory,
          preferences: { ...state.memory.preferences, [key]: value }
        }
      })),
      
      clearMemory: () => set({
        memory: { shortTerm: [], longTerm: [], preferences: {} }
      }),
      
      // ─────────────────────────────────────────────────────────────────────
      // AI SETTINGS
      // ─────────────────────────────────────────────────────────────────────
      
      settings: {
        voiceEnabled: false,
        voiceId: 'default',
        responseSpeed: 'normal', // 'fast' | 'normal' | 'detailed'
        creativityLevel: 0.7, // 0-1
        autoSuggestions: true,
        contextWindow: 10, // Number of messages to include as context
        streamResponses: true
      },
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      
      // ─────────────────────────────────────────────────────────────────────
      // PENDING ACTIONS (AI suggestions)
      // ─────────────────────────────────────────────────────────────────────
      
      pendingActions: [],
      
      addPendingAction: (action) => set((state) => ({
        pendingActions: [
          {
            id: `action-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'pending',
            ...action
          },
          ...state.pendingActions
        ]
      })),
      
      executePendingAction: (id) => set((state) => ({
        pendingActions: state.pendingActions.map((a) =>
          a.id === id ? { ...a, status: 'executed' } : a
        )
      })),
      
      dismissPendingAction: (id) => set((state) => ({
        pendingActions: state.pendingActions.filter((a) => a.id !== id)
      })),
      
      clearPendingActions: () => set({ pendingActions: [] })
    }),
    {
      name: 'stark-ai-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        conversations: state.conversations.slice(0, 20), // Keep last 20 conversations
        memory: state.memory,
        settings: state.settings,
        aiPersonality: state.aiPersonality
      })
    }
  )
)

// ═══════════════════════════════════════════════════════════════════════════
// PROJECTS STORE
// R&D Lab projects and experiments
// ═══════════════════════════════════════════════════════════════════════════

export const useProjectsStore = create(
  persist(
    (set, get) => ({
      // ─────────────────────────────────────────────────────────────────────
      // PROJECTS
      // ─────────────────────────────────────────────────────────────────────
      
      projects: [
        {
          id: 'proj-001',
          name: 'Arc Reactor Mark VII',
          status: 'in-progress',
          priority: 'high',
          progress: 67,
          description: 'Next-generation arc reactor with improved efficiency',
          category: 'energy',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T15:30:00Z',
          tags: ['energy', 'reactor', 'critical']
        },
        {
          id: 'proj-002',
          name: 'Neural Interface v2.0',
          status: 'planning',
          priority: 'medium',
          progress: 23,
          description: 'Direct neural link for suit control',
          category: 'interface',
          createdAt: '2024-01-18T09:00:00Z',
          updatedAt: '2024-01-19T11:00:00Z',
          tags: ['neural', 'interface', 'experimental']
        },
        {
          id: 'proj-003',
          name: 'Quantum Encryption Protocol',
          status: 'in-progress',
          priority: 'high',
          progress: 45,
          description: 'Unbreakable quantum-level security encryption',
          category: 'security',
          createdAt: '2024-01-10T14:00:00Z',
          updatedAt: '2024-01-21T08:45:00Z',
          tags: ['quantum', 'security', 'encryption']
        }
      ],
      
      currentProjectId: null,
      
      // Actions
      addProject: (project) => set((state) => ({
        projects: [
          {
            id: `proj-${Date.now()}`,
            status: 'planning',
            priority: 'medium',
            progress: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: [],
            ...project
          },
          ...state.projects
        ]
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id 
            ? { ...p, ...updates, updatedAt: new Date().toISOString() } 
            : p
        )
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProjectId: state.currentProjectId === id ? null : state.currentProjectId
      })),
      
      setCurrentProject: (id) => set({ currentProjectId: id }),
      
      getCurrentProject: () => {
        const { projects, currentProjectId } = get()
        return projects.find((p) => p.id === currentProjectId) || null
      },
      
      getProjectsByStatus: (status) => {
        const { projects } = get()
        return projects.filter((p) => p.status === status)
      },
      
      getProjectsByCategory: (category) => {
        const { projects } = get()
        return projects.filter((p) => p.category === category)
      },
      
      // ─────────────────────────────────────────────────────────────────────
      // EXPERIMENTS
      // ─────────────────────────────────────────────────────────────────────
      
      experiments: [],
      
      addExperiment: (experiment) => set((state) => ({
        experiments: [
          {
            id: `exp-${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            results: null,
            ...experiment
          },
          ...state.experiments
        ]
      })),
      
      updateExperiment: (id, updates) => set((state) => ({
        experiments: state.experiments.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        )
      }))
    }),
    {
      name: 'stark-projects-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY STORE
// Security status and threat monitoring
// ═══════════════════════════════════════════════════════════════════════════

export const useSecurityStore = create((set, get) => ({
  // ─────────────────────────────────────────────────────────────────────────
  // SECURITY STATUS
  // ─────────────────────────────────────────────────────────────────────────
  
  securityLevel: 'green', // 'green' | 'yellow' | 'orange' | 'red'
  threatLevel: 0, // 0-100
  isLocked: false,
  lastScan: null,
  
  setSecurityLevel: (level) => set({ securityLevel: level }),
  setThreatLevel: (level) => set({ threatLevel: level }),
  
  lockSystem: () => set({ isLocked: true }),
  unlockSystem: () => set({ isLocked: false }),
  
  runSecurityScan: () => {
    set({ lastScan: new Date().toISOString() })
    // Simulate scan results
    const threatLevel = Math.floor(Math.random() * 20)
    const securityLevel = threatLevel < 10 ? 'green' : threatLevel < 30 ? 'yellow' : 'orange'
    set({ threatLevel, securityLevel })
  },
  
  // ─────────────────────────────────────────────────────────────────────────
  // THREATS & ALERTS
  // ─────────────────────────────────────────────────────────────────────────
  
  threats: [],
  alerts: [],
  
  addThreat: (threat) => set((state) => ({
    threats: [
      {
        id: `threat-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'active',
        severity: 'medium',
        ...threat
      },
      ...state.threats
    ]
  })),
  
  resolveThreat: (id) => set((state) => ({
    threats: state.threats.map((t) =>
      t.id === id ? { ...t, status: 'resolved' } : t
    )
  })),
  
  addAlert: (alert) => set((state) => ({
    alerts: [
      {
        id: `alert-${Date.now()}`,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        ...alert
      },
      ...state.alerts
    ]
  })),
  
  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.map((a) =>
      a.id === id ? { ...a, acknowledged: true } : a
    )
  })),
  
  // ─────────────────────────────────────────────────────────────────────────
  // ACCESS CONTROL
  // ─────────────────────────────────────────────────────────────────────────
  
  accessLogs: [],
  
  logAccess: (entry) => set((state) => ({
    accessLogs: [
      {
        id: `access-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...entry
      },
      ...state.accessLogs.slice(0, 199) // Keep last 200 entries
    ]
  })),
  
  clearAccessLogs: () => set({ accessLogs: [] })
}))

// ═══════════════════════════════════════════════════════════════════════════
// HELPER HOOKS
// Convenience hooks for common patterns
// ═══════════════════════════════════════════════════════════════════════════

// Hook to get system status with derived data
export const useSystemStatus = () => {
  const status = useSystemStore((state) => state.systemStatus)
  const uptime = useSystemStore((state) => state.uptime)
  const metrics = useSystemStore((state) => state.metrics)
  const getFormattedUptime = useSystemStore((state) => state.getFormattedUptime)
  
  return {
    status,
    uptime,
    formattedUptime: getFormattedUptime(),
    metrics,
    isOnline: status === 'online',
    isHealthy: metrics.cpu < 80 && metrics.memory < 80
  }
}

// Hook to get lockdown state with derived data
export const useLockdownState = () => {
  const { lockdownMode, lockdownInitiated, lockdownDuration } = useSystemStore((state) => ({
    lockdownMode: state.lockdownMode,
    lockdownInitiated: state.lockdownInitiated,
    lockdownDuration: state.lockdownDuration
  }))
  
  return {
    lockdownMode,
    lockdownInitiated,
    lockdownDuration,
    isLockedDown: lockdownMode === 'lockdown',
    lockdownTimeRemaining: lockdownMode === 'lockdown' ? Math.max(0, 300 - lockdownDuration) : 0, // 5 minutes max
    getLockdownStats: () => ({
      initiated: lockdownInitiated,
      duration: lockdownDuration,
      mode: lockdownMode,
      timeRemaining: lockdownMode === 'lockdown' ? Math.max(0, 300 - lockdownDuration) : 0
    })
  }
}

// Hook to get AI state
export const useAIStatus = () => {
  const status = useAIStore((state) => state.aiStatus)
  const chatOpen = useAIStore((state) => state.chatOpen)
  const currentConversation = useAIStore((state) => state.getCurrentConversation())
  
  return {
    status,
    chatOpen,
    currentConversation,
    isProcessing: status === 'processing',
    isListening: status === 'listening'
  }
}

// Export all stores
export default {
  useSystemStore,
  useAIStore,
  useProjectsStore,
  useSecurityStore,
  useSystemStatus,
  useAIStatus,
  useLockdownState
}