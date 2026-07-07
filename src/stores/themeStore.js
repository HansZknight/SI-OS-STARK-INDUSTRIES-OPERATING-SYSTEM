// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - THEME STORE
// Theme management and persistence
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Available themes
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  ARC: 'arc'
}

// Theme configurations
export const themeConfig = {
  [THEMES.DARK]: {
    name: 'Dark Mode',
    description: 'Default Stark Industries theme',
    colors: {
      background: '#0a0a0f',
      foreground: '#ffffff',
      primary: '#00d4ff',
      secondary: '#0066ff',
      accent: '#00ff88',
      muted: '#252535'
    }
  },
  [THEMES.LIGHT]: {
    name: 'Light Mode',
    description: 'Clean professional theme',
    colors: {
      background: '#ffffff',
      foreground: '#0a0a0f',
      primary: '#0066ff',
      secondary: '#00d4ff',
      accent: '#00aa66',
      muted: '#f5f5f5'
    }
  },
  [THEMES.ARC]: {
    name: 'Arc Reactor',
    description: 'Maximum glow mode',
    colors: {
      background: '#000000',
      foreground: '#ffffff',
      primary: '#00d4ff',
      secondary: '#00ffff',
      accent: '#00ff88',
      muted: '#1a1a25'
    }
  }
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Current theme
      theme: THEMES.DARK,
      
      // Set theme
      setTheme: (newTheme) => {
        if (!Object.values(THEMES).includes(newTheme)) {
          console.warn('Invalid theme:', newTheme)
          return
        }
        
        set({ theme: newTheme })
        applyTheme(newTheme)
      },
      
      // Toggle between themes
      toggleTheme: () => {
        const current = get().theme
        const themes = Object.values(THEMES)
        const currentIndex = themes.indexOf(current)
        const nextIndex = (currentIndex + 1) % themes.length
        const nextTheme = themes[nextIndex]
        
        get().setTheme(nextTheme)
        return nextTheme
      },
      
      // Cycle to next theme
      nextTheme: () => {
        return get().toggleTheme()
      },
      
      // Get current theme config
      getThemeConfig: () => {
        return themeConfig[get().theme]
      }
    }),
    {
      name: 'stark-theme-storage',
      version: 1
    }
  )
)

// Apply theme to document
function applyTheme(theme) {
  const root = document.documentElement
  const config = themeConfig[theme]
  
  // Set data attribute for CSS
  root.setAttribute('data-theme', theme)
  
  // Apply CSS variables
  if (config && config.colors) {
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })
  }
  
  // Add transition class
  root.classList.add('theme-transitioning')
  setTimeout(() => {
    root.classList.remove('theme-transitioning')
  }, 300)
}

// Initialize theme on load
export function initializeTheme() {
  const stored = localStorage.getItem('stark-theme-storage')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      const theme = parsed.state?.theme || THEMES.DARK
      applyTheme(theme)
    } catch (e) {
      applyTheme(THEMES.DARK)
    }
  } else {
    applyTheme(THEMES.DARK)
  }
}