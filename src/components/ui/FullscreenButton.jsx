import React from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useFullscreen } from '../../hooks/useFullscreen'

export const FullscreenButton = ({ className = '' }) => {
  const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen()

  const handleClick = () => {
    console.log('[FullscreenButton] Clicked, supported:', isSupported)
    if (isSupported) {
      toggleFullscreen()
    }
  }

  if (!isSupported) {
    console.log('[FullscreenButton] Fullscreen not supported, hiding button')
    return null // Don't show button if fullscreen not supported
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`p-2 rounded-lg text-white/40 hover:text-white hover:bg-arc-500/10 transition-all duration-200 ${className}`}
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
