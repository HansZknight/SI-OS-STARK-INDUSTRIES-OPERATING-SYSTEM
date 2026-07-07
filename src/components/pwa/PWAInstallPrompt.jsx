// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES - PWA INSTALL PROMPT
// Handles the PWA installation prompt for modern browsers
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor, Zap, Check, Wifi, Bell } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    // Check device type
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (dismissed && now - dismissedTime < oneDay) {
      return;
    }

    // Listen for beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // For non-mobile or non-iOS devices, show the install prompt
      if (!isMobile || !/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // Delay showing prompt for better UX
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      } else {
        // For iOS, we'll show a custom guide
        setShowInstallGuide(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Custom event to show install prompt (triggered from InstallGuide)
    const showInstallPrompt = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
          }
          setDeferredPrompt(null);
        });
      }
    };
    
    window.addEventListener('show-pwa-install', showInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('show-pwa-install', showInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  const features = [
    { icon: Wifi, label: 'Works Offline' },
    { icon: Zap, label: 'Lightning Fast' },
    { icon: Bell, label: 'Notifications' },
  ];

  // Don't render if already installed or on iOS (we show InstallGuide instead)
  if (isInstalled || (isMobile && /iPhone|iPad|iPod/i.test(navigator.userAgent))) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-[380px] z-[9999]"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stark-darker to-stark-dark border border-arc-500/30 shadow-2xl shadow-arc-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-arc-500/10 to-transparent pointer-events-none" />
              
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="relative p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-arc-500/30 to-jarvis-500/30 border border-arc-500/40 flex items-center justify-center">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-arc-500"
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(0, 212, 255, 0.6)',
                            '0 0 40px rgba(0, 212, 255, 0.8)',
                            '0 0 20px rgba(0, 212, 255, 0.6)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-arc-500/50"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-display font-bold text-white">
                      Install SI-OS
                    </h3>
                    <p className="text-sm text-white/50">
                      Stark Industries OS
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                      className="flex items-center gap-1.5 text-xs text-white/60"
                    >
                      <feature.icon size={14} className="text-arc-500" />
                      <span>{feature.label}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={handleInstall}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-arc-500 to-arc-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-arc-400 hover:to-arc-500 transition-all shadow-lg shadow-arc-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download size={18} />
                  Install App
                </motion.button>

                <p className="text-center text-xs text-white/30 mt-3">
                  <span className="inline-flex items-center gap-1">
                    {/Mobile|Android|iPhone/i.test(navigator.userAgent) ? (
                      <>
                        <Smartphone size={12} />
                        Add to Home Screen
                      </>
                    ) : (
                      <>
                        <Monitor size={12} />
                        Install on Desktop
                      </>
                    )}
                  </span>
                </p>
              </div>

              <div className="h-1 bg-gradient-to-r from-transparent via-arc-500 to-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]"
          >
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-xl">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
              <span className="text-sm font-medium text-green-400">
                SI-OS installed successfully!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
