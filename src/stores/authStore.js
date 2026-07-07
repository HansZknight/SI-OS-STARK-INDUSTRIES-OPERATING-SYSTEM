// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES - AUTHENTICATION STORE
// Secure authentication state management
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Simulated user database
const USERS_DB = {
  'tony@stark.com': {
    id: 'stark-001',
    email: 'tony@stark.com',
    password: 'ironman3000', // In real app, this would be hashed
    name: 'Tony Stark',
    role: 'admin',
    avatar: null,
    clearanceLevel: 'OMEGA',
    voicePrint: true,
    biometricEnabled: true,
    lastLogin: null,
    loginAttempts: 0
  },
  'pepper@stark.com': {
    id: 'stark-002',
    email: 'pepper@stark.com',
    password: 'pepper123',
    name: 'Pepper Potts',
    role: 'executive',
    avatar: null,
    clearanceLevel: 'ALPHA',
    voicePrint: false,
    biometricEnabled: true,
    lastLogin: null,
    loginAttempts: 0
  },
  'rhodey@stark.com': {
    id: 'stark-003',
    email: 'rhodey@stark.com',
    password: 'warmachine',
    name: 'James Rhodes',
    role: 'military',
    avatar: null,
    clearanceLevel: 'BETA',
    voicePrint: true,
    biometricEnabled: false,
    lastLogin: null,
    loginAttempts: 0
  }
}

// Security protocols
const SECURITY_PROTOCOLS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 300000, // 5 minutes
  SESSION_DURATION: 86400000, // 24 hours
  REQUIRE_2FA: false
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginAttempts: 0,
      isLocked: false,
      lockoutUntil: null,
      sessionToken: null,
      lastActivity: null,
      authMethod: null, // 'password', 'biometric', 'voice'
      securityLevel: 'standard', // 'standard', 'enhanced', 'maximum'

      // Auth methods
      login: async (email, password, method = 'password') => {
        set({ isLoading: true, error: null })

        // Check if account is locked
        const { isLocked, lockoutUntil } = get()
        if (isLocked && lockoutUntil > Date.now()) {
          const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000)
          set({ 
            isLoading: false, 
            error: `Account locked. Try again in ${remainingTime} seconds.` 
          })
          return { success: false, error: 'Account locked' }
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Find user
        const user = USERS_DB[email.toLowerCase()]

        if (!user) {
          const attempts = get().loginAttempts + 1
          const shouldLock = attempts >= SECURITY_PROTOCOLS.MAX_LOGIN_ATTEMPTS

          set({ 
            isLoading: false, 
            error: 'User not found in Stark Industries database',
            loginAttempts: attempts,
            isLocked: shouldLock,
            lockoutUntil: shouldLock ? Date.now() + SECURITY_PROTOCOLS.LOCKOUT_DURATION : null
          })
          return { success: false, error: 'User not found' }
        }

        if (user.password !== password) {
          const attempts = get().loginAttempts + 1
          const shouldLock = attempts >= SECURITY_PROTOCOLS.MAX_LOGIN_ATTEMPTS

          set({ 
            isLoading: false, 
            error: `Invalid credentials. ${SECURITY_PROTOCOLS.MAX_LOGIN_ATTEMPTS - attempts} attempts remaining.`,
            loginAttempts: attempts,
            isLocked: shouldLock,
            lockoutUntil: shouldLock ? Date.now() + SECURITY_PROTOCOLS.LOCKOUT_DURATION : null
          })
          return { success: false, error: 'Invalid password' }
        }

        // Success
        const sessionToken = `STARK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 
        
        set({
          user: {
            ...user,
            password: undefined, // Don't store password
            lastLogin: new Date().toISOString()
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
          loginAttempts: 0,
          isLocked: false,
          lockoutUntil: null,
          sessionToken,
          lastActivity: Date.now(),
          authMethod: method
        })

        return { success: true, user }
      },

      loginWithBiometric: async (email) => {
        set({ isLoading: true, error: null })
        
        // Simulate biometric scan
        await new Promise(resolve => setTimeout(resolve, 2500))

        const targetEmail = email || 'tony@stark.com'
        const user = USERS_DB[targetEmail.toLowerCase()]
        
        if (!user) {
          set({ isLoading: false, error: 'User not found' })
          return { success: false }
        }

        if (!user.biometricEnabled) {
          set({ isLoading: false, error: 'Biometric not enabled for this user' })
          return { success: false }
        }

        // Simulate 95% success rate
        const success = Math.random() > 0.05

        if (!success) {
          set({ isLoading: false, error: 'Biometric verification failed. Please try again.' })
          return { success: false }
        }

        const sessionToken = `STARK-BIO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 

        set({
          user: { ...user, password: undefined, lastLogin: new Date().toISOString() },
          isAuthenticated: true,
          isLoading: false,
          error: null,
          sessionToken,
          lastActivity: Date.now(),
          authMethod: 'biometric'
        })

        return { success: true, user }
      },

      loginWithVoice: async (email) => {
        set({ isLoading: true, error: null })
        
        // Simulate voice recognition parsing overhead
        await new Promise(resolve => setTimeout(resolve, 1000))

        const targetEmail = email || 'tony@stark.com'
        const user = USERS_DB[targetEmail.toLowerCase()]
        
        if (!user) {
          set({ isLoading: false, error: 'User not found' })
          return { success: false }
        }

        if (!user.voicePrint) {
          set({ isLoading: false, error: 'Voice print not registered for this user' })
          return { success: false }
        }

        // Simulate 90% success rate
        const success = Math.random() > 0.1

        if (!success) {
          set({ isLoading: false, error: 'Voice recognition failed. Please try again.' })
          return { success: false }
        }

        const sessionToken = `STARK-VOICE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 

        set({
          user: { ...user, password: undefined, lastLogin: new Date().toISOString() },
          isAuthenticated: true,
          isLoading: false,
          error: null,
          sessionToken,
          lastActivity: Date.now(),
          authMethod: 'voice'
        })

        return { success: true, user }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          sessionToken: null,
          lastActivity: null,
          authMethod: null,
          error: null
        })
      },

      updateActivity: () => {
        set({ lastActivity: Date.now() })
      },

      checkSession: () => {
        const { sessionToken, lastActivity, isAuthenticated } = get()
        
        if (!isAuthenticated || !sessionToken) return false

        const now = Date.now()
        const sessionAge = now - lastActivity

        if (sessionAge > SECURITY_PROTOCOLS.SESSION_DURATION) {
          get().logout()
          return false
        }

        set({ lastActivity: now })
        return true
      },

      clearError: () => set({ error: null }),

      setSecurityLevel: (level) => set({ securityLevel: level })
    }),
    {
      name: 'stark-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionToken: state.sessionToken,
        lastActivity: state.lastActivity
      })
    }
  )
)
