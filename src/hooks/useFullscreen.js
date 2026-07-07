import { useState, useEffect, useCallback, useRef } from 'react'

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const toggleFullscreenRef = useRef(null)

  useEffect(() => {
    // Check if fullscreen API is supported
    const supported = !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    )
    setIsSupported(supported)
    console.log('[Fullscreen] API supported:', supported)

    // Add event listeners for fullscreen changes
    const handleFullscreenChange = () => {
      const fullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      )
      setIsFullscreen(fullscreen)
      console.log('[Fullscreen] State changed:', fullscreen)
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

  const toggleFullscreen = useCallback(async () => {
    console.log('[Fullscreen] Toggle called, current state:', isFullscreen)
    
    if (!isSupported) {
      console.warn('[Fullscreen] Fullscreen API not supported')
      return false
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
        console.log('[Fullscreen] Entering fullscreen mode')
        return true
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
        console.log('[Fullscreen] Exiting fullscreen mode')
        return true
      }
    } catch (error) {
      console.error('[Fullscreen] Error toggling fullscreen:', error)
      return false
    }
  }, [isFullscreen, isSupported])

  // Store ref for keyboard handler
  toggleFullscreenRef.current = toggleFullscreen

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event) => {
      // F key for fullscreen (without modifiers)
      if (event.key === 'f' || event.key === 'F') {
        // Only trigger if no modifier keys are pressed (except Shift)
        if (!event.ctrlKey && !event.altKey && !event.metaKey) {
          event.preventDefault()
          console.log('[Fullscreen] F key pressed')
          if (toggleFullscreenRef.current) {
            toggleFullscreenRef.current()
          }
        }
      }
      
      // ESC key already handled by browser for fullscreen exit
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  return {
    isFullscreen,
    isSupported,
    toggleFullscreen
  }
}
