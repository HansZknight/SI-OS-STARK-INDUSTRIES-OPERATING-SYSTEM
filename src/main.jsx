// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// Main Entry Point - React Application Bootstrap
// ═══════════════════════════════════════════════════════════════════════════
// Classification: STARK INDUSTRIES PROPRIETARY
// Author: Tony Stark
// System: SI-OS v1.0.0 | Codename: J.A.R.V.I.S
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { initializeTheme } from './stores/themeStore'
import { initFullscreen } from './utils/fullscreen'
import App from './App'

// Global Styles
import './styles/index.css'
import './styles/fullscreen.css'

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM BOOT SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * STARK INDUSTRIES OS - Boot Protocol
 * 
 * Sequence:
 * 1. Initialize React Root
 * 2. Mount Application
 * 3. Signal boot completion
 * 4. Remove boot loader
 */

// Console Boot Message - Because style matters
console.log(`
%c╔═══════════════════════════════════════════════════════════════╗
%c║                                                               ║
%c║   ███████╗████████╗ █████╗ ██████╗ ██╗  ██╗                  ║
%c║   ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██║ ██╔╝                  ║
%c║   ███████╗   ██║   ███████║██████╔╝█████╔╝                   ║
%c║   ╚════██║   ██║   ██╔══██║██╔══██╗██╔═██╗                   ║
%c║   ███████║   ██║   ██║  ██║██║  ██║██║  ██╗                  ║
%c║   ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝                  ║
%c║                                                               ║
%c║   I N D U S T R I E S   O P E R A T I N G   S Y S T E M     ║
%c║                                                               ║
%c║   Version: 1.0.0                                              ║
%c║   Codename: J.A.R.V.I.S                                       ║
%c║   Status: ONLINE                                              ║
%c║                                                               ║
%c╚═══════════════════════════════════════════════════════════════╝
`,
  'color: #00d4ff; font-weight: bold;',
  'color: #00d4ff;',
  'color: #00d4ff; font-weight: bold;',
  'color: #00d4ff; font-weight: bold;',
  'color: #00d4ff; font-weight: bold;',
  'color: #00d4ff; font-weight: bold;',
  'color: #00d4ff; font-weight: bold;',
  'color: #00d4ff; font-weight: bold;',
  'color: #00d4ff;',
  'color: #00d4ff;',
  'color: #00d4ff;',
  'color: #00a8cc;',
  'color: #00a8cc;',
  'color: #00ff88;',
  'color: #00d4ff;',
  'color: #00d4ff; font-weight: bold;'
)

console.log(
  '%c[SI-OS] %cSystem initializing...',
  'color: #00d4ff; font-weight: bold;',
  'color: #ffffff;'
)

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITORING
// ═══════════════════════════════════════════════════════════════════════════

const bootStartTime = performance.now()

// ═══════════════════════════════════════════════════════════════════════════
// REACT ROOT INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error(
    '%c[SI-OS] %cCRITICAL ERROR: Root element not found!',
    'color: #ff3333; font-weight: bold;',
    'color: #ff3333;'
  )
  throw new Error('Root element not found. System boot failed.')
}

// Create React Root
const root = ReactDOM.createRoot(rootElement)

// ═══════════════════════════════════════════════════════════════════════════
// THEME INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

// Initialize theme immediately
document.documentElement.classList.add('theme-transitioning')

// Force dark theme on initial load to prevent flash of unstyled content
document.documentElement.setAttribute('data-theme', 'dark')

// Initialize theme store and apply theme
initializeTheme()

// Initialize fullscreen mode
const cleanupFullscreen = initFullscreen(true)

// Remove transition class after initial render
setTimeout(() => {
  document.documentElement.classList.remove('theme-transitioning')
}, 100)

// ═══════════════════════════════════════════════════════════════════════════
// APPLICATION MOUNT
// ═══════════════════════════════════════════════════════════════════════════

// Create app with system ready handler
function AppWithHandlers() {
  return (
    <React.StrictMode>
      <BrowserRouter future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}>
        <App onSystemReady={handleSystemReady} />
      </BrowserRouter>
    </React.StrictMode>
  )
}

// Render the app
root.render(<AppWithHandlers />)

// ═══════════════════════════════════════════════════════════════════════════
// BOOT COMPLETION HANDLER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Handle system ready state
 * - Dispatches event to remove boot loader
 * - Logs boot completion time
 */
function handleSystemReady() {
  const bootEndTime = performance.now()
  const bootDuration = (bootEndTime - bootStartTime).toFixed(2)
  
  console.log(
    '%c[SI-OS] %cSystem boot complete in %c' + bootDuration + 'ms',
    'color: #00d4ff; font-weight: bold;',
    'color: #ffffff;',
    'color: #00ff88; font-weight: bold;'
  )
  
  console.log(
    '%c[SI-OS] %cJ.A.R.V.I.S is now online. Good morning, Sir.',
    'color: #00d4ff; font-weight: bold;',
    'color: #00ff88;'
  )
  
  // Dispatch event to remove boot loader
  window.dispatchEvent(new CustomEvent('stark-os-ready'))
}

// Fallback: Call handleSystemReady after a delay if App doesn't call it
setTimeout(() => {
  handleSystemReady()
  
  // Try to enter fullscreen again after system is ready
  if (window.matchMedia('(display-mode: standalone)').matches) {
    setTimeout(() => {
      import('./utils/fullscreen').then(({ requestFullscreen }) => {
        requestFullscreen().catch(err => {
          console.log('Fullscreen retry failed:', err);
        });
      });
    }, 500);
  }
}, 2000);

// Cleanup on unmount
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (cleanupFullscreen) cleanupFullscreen();
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY - Global Error Handler
// ═══════════════════════════════════════════════════════════════════════════

window.addEventListener('error', (event) => {
  console.error(
    '%c[SI-OS] %cSystem Error Detected:',
    'color: #ff3333; font-weight: bold;',
    'color: #ff3333;',
    event.error
  )
})

window.addEventListener('unhandledrejection', (event) => {
  console.error(
    '%c[SI-OS] %cUnhandled Promise Rejection:',
    'color: #ff3333; font-weight: bold;',
    'color: #ff3333;',
    event.reason
  )
})

// ═══════════════════════════════════════════════════════════════════════════
// HOT MODULE REPLACEMENT (Development)
// ═══════════════════════════════════════════════════════════════════════════

if (import.meta.hot) {
  import.meta.hot.accept()
  
  console.log(
    '%c[SI-OS] %cHot Module Replacement: ACTIVE',
    'color: #00d4ff; font-weight: bold;',
    'color: #ffd700;'
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DEVELOPMENT MODE INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

if (import.meta.env.DEV) {
  console.log(
    '%c[SI-OS] %cDevelopment Mode: ACTIVE',
    'color: #00d4ff; font-weight: bold;',
    'color: #ffd700;'
  )
  console.log(
    '%c[SI-OS] %cDebug tools available. Type %cwindow.STARK_DEBUG%c for options.',
    'color: #00d4ff; font-weight: bold;',
    'color: #ffffff;',
    'color: #00ff88; font-weight: bold;',
    'color: #ffffff;'
  )
  
  // Debug utilities
  window.STARK_DEBUG = {
    version: '1.0.0',
    codename: 'J.A.R.V.I.S',
    environment: 'development',
    
    // System info
    getSystemInfo: () => ({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      memory: navigator.deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown',
      online: navigator.onLine,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelRatio: window.devicePixelRatio,
    }),
    
    // Performance metrics
    getPerformance: () => ({
      bootTime: `${(performance.now()).toFixed(2)}ms`,
      memory: performance.memory ? {
        usedJSHeapSize: `${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        totalJSHeapSize: `${(performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      } : 'Not available',
    }),
    
    // Clear console with style
    clear: () => {
      console.clear()
      console.log(
        '%c[SI-OS] %cConsole cleared. J.A.R.V.I.S standing by.',
        'color: #00d4ff; font-weight: bold;',
        'color: #ffffff;'
      )
    },
  }
}