/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ═══════════════════════════════════════════════════════════
      // STARK INDUSTRIES COLOR PALETTE
      // Movie-accurate colors from Iron Man & Avengers interfaces
      // ═══════════════════════════════════════════════════════════
      colors: {
        // Primary Stark Colors
        stark: {
          black: '#0a0a0f',
          darker: '#0d0d14',
          dark: '#12121a',
          medium: '#1a1a25',
          light: '#252535',
        },
        
        // Arc Reactor Cyan - Primary Accent
        arc: {
          50: '#e6ffff',
          100: '#b3ffff',
          200: '#80ffff',
          300: '#4dfbff',
          400: '#1af0ff',
          500: '#00d4ff', // Primary Arc Color
          600: '#00a8cc',
          700: '#007a99',
          800: '#004d66',
          900: '#002033',
        },
        
        // Jarvis Blue - Secondary Accent
        jarvis: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0066ff', // Jarvis Primary
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        
        // Warning & Status Colors
        reactor: {
          gold: '#ffd700',
          orange: '#ff8c00',
          red: '#ff3333',
          green: '#00ff88',
          purple: '#9945ff',
        },
        
        // HUD Interface Colors
        hud: {
          primary: '#00d4ff',
          secondary: '#0066ff',
          tertiary: '#00ff88',
          warning: '#ffd700',
          danger: '#ff3333',
          muted: 'rgba(0, 212, 255, 0.3)',
          glass: 'rgba(0, 212, 255, 0.05)',
        }
      },

      // ═══════════════════════════════════════════════════════════
      // TYPOGRAPHY - Futuristic & Clean
      // ═══════════════════════════════════════════════════════════
      fontFamily: {
        stark: ['Rajdhani', 'Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'hud-xs': ['0.65rem', { lineHeight: '1', letterSpacing: '0.1em' }],
        'hud-sm': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.08em' }],
        'hud-base': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
        'hud-lg': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0.03em' }],
        'hud-xl': ['1.5rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'hud-2xl': ['2rem', { lineHeight: '1.1', letterSpacing: '0.02em' }],
        'hud-3xl': ['3rem', { lineHeight: '1', letterSpacing: '0.01em' }],
      },

      // ═══════════════════════════════════════════════════════════
      // SPACING - Precision Grid System
      // ═══════════════════════════════════════════════════════════
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
        '140': '35rem',
        '160': '40rem',
      },

      // ═══════════════════════════════════════════════════════════
      // BOX SHADOWS - Glow Effects (Movie-Accurate)
      // ═══════════════════════════════════════════════════════════
      boxShadow: {
        // Arc Reactor Glow
        'arc': '0 0 20px rgba(0, 212, 255, 0.3)',
        'arc-md': '0 0 30px rgba(0, 212, 255, 0.4)',
        'arc-lg': '0 0 50px rgba(0, 212, 255, 0.5)',
        'arc-xl': '0 0 80px rgba(0, 212, 255, 0.6)',
        'arc-intense': '0 0 100px rgba(0, 212, 255, 0.8), 0 0 200px rgba(0, 212, 255, 0.4)',
        
        // Jarvis Blue Glow
        'jarvis': '0 0 20px rgba(0, 102, 255, 0.3)',
        'jarvis-md': '0 0 30px rgba(0, 102, 255, 0.4)',
        'jarvis-lg': '0 0 50px rgba(0, 102, 255, 0.5)',
        
        // Status Glows
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.4)',
        'glow-red': '0 0 20px rgba(255, 51, 51, 0.4)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.4)',
        
        // Panel Shadows
        'panel': '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(0, 212, 255, 0.1)',
        'panel-hover': '0 12px 48px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(0, 212, 255, 0.2)',
        
        // Inner Glow
        'inner-arc': 'inset 0 0 30px rgba(0, 212, 255, 0.1)',
        'inner-jarvis': 'inset 0 0 30px rgba(0, 102, 255, 0.1)',
      },

      // ═══════════════════════════════════════════════════════════
      // ANIMATIONS - Cinematic & Smooth
      // ═══════════════════════════════════════════════════════════
      animation: {
        // Pulse Effects
        'pulse-arc': 'pulseArc 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // Glow Effects
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        
        // Scan Lines
        'scan': 'scan 3s linear infinite',
        'scan-fast': 'scan 1.5s linear infinite',
        
        // HUD Elements
        'hud-flicker': 'hudFlicker 0.15s ease-in-out infinite',
        'hud-boot': 'hudBoot 0.5s ease-out forwards',
        'hud-line': 'hudLine 1s ease-out forwards',
        
        // Float & Hover
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        
        // Rotate
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spinReverse 10s linear infinite',
        
        // Data Stream
        'data-stream': 'dataStream 2s linear infinite',
        
        // Fade & Slide
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        
        // Scale
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'pop': 'pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        
        // Typing Effect
        'typing': 'typing 2s steps(20) forwards',
        'blink': 'blink 1s step-end infinite',
        
        // Ring/Circle
        'ring-spin': 'ringSpin 4s linear infinite',
        'ring-pulse': 'ringPulse 2s ease-in-out infinite',
        
        // Radar
        'radar': 'radar 2s linear infinite',
      },

      keyframes: {
        pulseArc: {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
          },
          '50%': { 
            opacity: '0.7',
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)'
          },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
            borderColor: 'rgba(0, 212, 255, 0.3)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)',
            borderColor: 'rgba(0, 212, 255, 0.6)'
          },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        hudFlicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        hudBoot: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)',
            filter: 'blur(4px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)',
            filter: 'blur(0)'
          },
        },
        hudLine: {
          '0%': { width: '0%', opacity: '0' },
          '100%': { width: '100%', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        dataStream: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 50%': { borderColor: 'transparent' },
          '51%, 100%': { borderColor: 'currentColor' },
        },
        ringSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ringPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

      // ═══════════════════════════════════════════════════════════
      // BACKDROP BLUR - Glassmorphism
      // ═══════════════════════════════════════════════════════════
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // ═══════════════════════════════════════════════════════════
      // BORDER RADIUS - HUD Panels
      // ═══════════════════════════════════════════════════════════
      borderRadius: {
        'hud': '4px',
        'hud-md': '8px',
        'hud-lg': '12px',
        'panel': '16px',
      },

      // ═══════════════════════════════════════════════════════════
      // BACKGROUND IMAGE - Grid Patterns
      // ═══════════════════════════════════════════════════════════
      backgroundImage: {
        'grid-stark': `
          linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
        `,
        'grid-dense': `
          linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px)
        `,
        'radial-arc': 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
        'radial-dark': 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)',
        'gradient-stark': 'linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
        'scan-line': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.03) 2px, rgba(0, 212, 255, 0.03) 4px)',
      },

      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-md': '40px 40px',
        'grid-lg': '80px 80px',
      },

      // ═══════════════════════════════════════════════════════════
      // Z-INDEX - Layer System
      // ═══════════════════════════════════════════════════════════
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'overlay': '1000',
        'modal': '1100',
        'notification': '1200',
        'tooltip': '1300',
        'max': '9999',
      },

      // ═══════════════════════════════════════════════════════════
      // TRANSITION - Smooth Animations
      // ═══════════════════════════════════════════════════════════
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },

      transitionTimingFunction: {
        'stark': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}