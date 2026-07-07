import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, Zap } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWAUpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) {
      console.log('[PWA] Service Worker registered');
    },
    onRegisterError(error) {
      console.log('[PWA] Service Worker registration error', error);
    }
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdate(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]"
        >
          <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-stark-darker/95 border border-arc-500/30 backdrop-blur-xl shadow-xl shadow-arc-500/10">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-arc-500/20 flex items-center justify-center">
                <Zap size={20} className="text-arc-500" />
              </div>
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                New version available!
              </p>
              <p className="text-xs text-white/50">
                SI-OS has been updated
              </p>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <motion.button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-arc-500 text-white text-sm font-medium hover:bg-arc-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={14} />
                Update
              </motion.button>

              <button
                onClick={handleDismiss}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
