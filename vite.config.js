import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import electron from 'vite-plugin-electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// STARK INDUSTRIES OS - Vite Configuration
// Build System optimized for high-performance rendering

export default defineConfig({
  base: './',
  plugins: [
    react(),
    electron({
      entry: 'electron/main.js',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'favicon.svg', 'robots.txt', 'sitemap.xml', '**/*.{js,css,woff2,woff,ttf,svg,png,jpg,jpeg,gif,webp,ico}'],
      strategies: 'generateSW',
      srcDir: 'src',
      filename: 'sw.js',
      manifestFilename: 'manifest.json',
      workbox: {
        maximumFileSizeToCacheInBytes: 10000000, // Increased to 10MB
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Stark Industries Operating System',
        short_name: 'SI-OS',
        description: 'J.A.R.V.I.S - Just A Rather Very Intelligent System',
        theme_color: '#00d4ff',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/desktop.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Desktop Dashboard'
          },
          {
            src: '/screenshots/mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Mobile Dashboard'
          }
        ],
        categories: ['productivity', 'utilities', 'business'],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'Open Command Dashboard',
            url: '/',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'AI Core',
            short_name: 'AI',
            description: 'Talk to J.A.R.V.I.S',
            url: '/ai-core',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'Arc Reactor',
            short_name: 'Reactor',
            description: 'Arc Reactor Control',
            url: '/arc-reactor',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      }
    })
  ],
  
  // Path aliases - karena saya tidak suka relative imports yang berantakan
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@ai': path.resolve(__dirname, './src/ai'),
      '@styles': path.resolve(__dirname, './src/styles')
    }
  },

  // Server configuration
  server: {
    port: 3000,
    host: true,
    open: true, // Auto-open browser
    cors: true,
    // Hot Module Replacement - real-time updates
    hmr: {
      overlay: true
    }
  },

  // Build optimization
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Chunk splitting untuk performa optimal
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'ai-vendor': ['@google/generative-ai'],
          'utils-vendor': ['zustand', 'date-fns', 'clsx', 'tailwind-merge']
        }
      }
    },
    // Minification settings
    minify: 'esbuild',
    // Target modern browsers
    target: 'esnext'
  },

  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@google/generative-ai',
      'zustand',
      'lucide-react'
    ]
  },

  // Environment variables prefix
  envPrefix: 'STARK_',

  // CSS configuration
  css: {
    devSourcemap: true
  }
})