// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - THEME TOGGLE
// Theme switcher component
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Zap, ChevronDown, Check } from 'lucide-react'
import { useThemeStore, THEMES, themeConfig } from '../../stores/themeStore'
import { toast } from './Toast'

export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)

  const themeIcons = {
    [THEMES.DARK]: Moon,
    [THEMES.LIGHT]: Sun,
    [THEMES.ARC]: Zap
  }

  const currentIcon = themeIcons[theme]
  const CurrentIcon = currentIcon || Moon

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setIsOpen(false)
    
    const config = themeConfig[newTheme]
    toast.system('Theme Changed', `Switched to ${config.name}`)
  }

  if (compact) {
    // Compact mode - just icon button
    return (
      <button
        onClick={() => {
          const themes = Object.values(THEMES)
          const currentIndex = themes.indexOf(theme)
          const nextTheme = themes[(currentIndex + 1) % themes.length]
          handleThemeChange(nextTheme)
        }}
        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all group"
        title="Toggle theme"
      >
        <CurrentIcon size={18} className="group-hover:rotate-12 transition-transform" />
      </button>
    )
  }

  // Full dropdown mode
  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-3 py-2 rounded-lg
          text-white/60 hover:text-white
          hover:bg-white/5
          transition-all
          group
        "
      >
        <CurrentIcon size={16} className="group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-medium">Theme</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="
                absolute top-full right-0 mt-2
                w-64 p-2 rounded-lg
                bg-stark-dark/95 backdrop-blur-xl
                border border-arc-500/20
                shadow-2xl
                z-50
              "
            >
              {Object.entries(THEMES).map(([key, value]) => {
                const Icon = themeIcons[value]
                const config = themeConfig[value]
                const isActive = theme === value

                return (
                  <motion.button
                    key={value}
                    onClick={() => handleThemeChange(value)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all
                      ${isActive
                        ? 'bg-arc-500/20 text-arc-400 border border-arc-500/30'
                        : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
                      }
                    `}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Icon */}
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${isActive ? 'bg-arc-500/20' : 'bg-white/5'}
                    `}>
                      <Icon size={16} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{config.name}</p>
                      <p className="text-xs text-white/40">{config.description}</p>
                    </div>

                    {/* Check */}
                    {isActive && (
                      <Check size={16} className="text-arc-400" />
                    )}
                  </motion.button>
                )
              })}

              {/* Footer */}
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="px-3 py-1 text-xs text-white/30 text-center">
                  Theme saved automatically
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}