import React, { useState, useEffect } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { motion } from 'framer-motion'

export const SimpleFullscreenButton = ({ className = '' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if fullscreen API is supported
    const supported = !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    )
    setIsSupported(supported)
    console.log('[SimpleFullscreen] API supported:', supported)

    // Add event listener for fullscreen changes
    const handleFullscreenChange = () => {
      const fullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      )
      setIsFullscreen(fullscreen)
      console.log('[SimpleFullscreen] State changed:', fullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    console.log('[SimpleFullscreen] Toggle called, current state:', isFullscreen)
    
    if (!isSupported) {
      console.warn('[SimpleFullscreen] Fullscreen API not supported')
      return
    }

    const element = document.documentElement

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        if (element.requestFullscreen) {
          await element.requestFullscreen()
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen()
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen()
        }
        console.log('[SimpleFullscreen] Entering fullscreen mode')
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen()
        }
        console.log('[SimpleFullscreen] Exiting fullscreen mode')
      }
    } catch (error) {
      console.error('[SimpleFullscreen] Error toggling fullscreen:', error)
    }
  }

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'f' || event.key === 'F') {
        if (!event.ctrlKey && !event.altKey && !event.metaKey) {
          event.preventDefault()
          console.log('[SimpleFullscreen] F key pressed')
          toggleFullscreen()
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isFullscreen, isSupported])

  if (!isSupported) {
    console.log('[SimpleFullscreen] Fullscreen not supported, hiding button')
    return null
  }

  return (
    <motion.button
      onClick={toggleFullscreen}
      className={`fullscreen-button p-2 rounded-lg text-white/40 hover:text-white hover:bg-arc-500/10 transition-all duration-200 ${className}`}
      title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {isFullscreen ? (
        <Minimize2 size={16} className="text-arc-400" />
      ) : (
        <Maximize2 size={16} />
      )}
    </motion.button>
  )
}
