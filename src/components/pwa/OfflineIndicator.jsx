import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]"
        >
          <div 
            className={`
              flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-xl
              ${isOnline 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-yellow-500/20 border border-yellow-500/30'
              }
            `}
          >
            <div 
              className={`
                w-6 h-6 rounded-full flex items-center justify-center
                ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}
              `}
            >
              {isOnline ? (
                <Wifi size={14} className="text-white" />
              ) : (
                <WifiOff size={14} className="text-white" />
              )}
            </div>
            <span 
              className={`
                text-sm font-medium
                ${isOnline ? 'text-green-400' : 'text-yellow-400'}
              `}
            >
              {isOnline ? 'Back online!' : 'You are offline'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
