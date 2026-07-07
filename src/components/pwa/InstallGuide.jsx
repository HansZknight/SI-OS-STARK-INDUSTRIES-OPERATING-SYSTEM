import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Download, ChevronDown, ChevronUp, Apple, Chrome } from 'lucide-react';

// Use Smartphone as Android icon for consistency
const Android = Smartphone;

export default function InstallGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafariBrowser = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsSafari(isSafariBrowser);

    // Check if PWA is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsPWAInstalled(true);
    }

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      setIsPWAInstalled(true);
    });
  }, []);

  // Don't show the install guide if PWA is already installed
  if (isPWAInstalled) return null;

  // Only show install prompt on mobile or if specifically on iOS/Safari
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!isMobile && !isIOS) return null;

  const handleInstallClick = () => {
    if (isIOS && isSafari) {
      // On iOS Safari, we need to show instructions
      setShowDetails(!showDetails);
    } else {
      // For other browsers that support the beforeinstallprompt event
      window.dispatchEvent(new Event('show-pwa-install'));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 z-50"
      >
        <div className="bg-stark-darker/90 backdrop-blur-lg rounded-2xl border border-arc-500/30 shadow-2xl shadow-arc-500/10 overflow-hidden">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-arc-500/10">
                <Download className="text-arc-400" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-white">Install SI-OS</h3>
                <p className="text-xs text-white/60">Get the best experience with our app</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleInstallClick}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-arc-500/20 text-arc-300 hover:bg-arc-500/30 transition-colors flex items-center gap-1"
              >
                {showDetails ? 'Hide' : 'Install'}
                {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Installation Instructions */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-0 border-t border-white/5">
                  {isIOS ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-stark-dark/50 rounded-lg">
                        <Apple className="text-white/70 mt-0.5 flex-shrink-0" size={18} />
                        <div>
                          <h4 className="font-medium text-white/90">iOS / Safari</h4>
                          <ol className="mt-1.5 space-y-2 text-sm text-white/60">
                            <li className="flex items-start gap-2">
                              <span className="flex-shrink-0">1.</span>
                              <span>Tap the <span className="text-arc-300">Share</span> button <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="18" cy="5" r="3"></circle>
                                  <circle cx="6" cy="12" r="3"></circle>
                                  <circle cx="18" cy="19" r="3"></circle>
                                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                              </span> at the bottom of the screen</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="flex-shrink-0">2.</span>
                              <span>Scroll down and tap <span className="text-arc-300">"Add to Home Screen"</span></span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="flex-shrink-0">3.</span>
                              <span>Tap <span className="text-arc-300">"Add"</span> in the top-right corner</span>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-stark-dark/50 rounded-lg">
                        <Android className="text-white/70 mt-0.5 flex-shrink-0" size={18} />
                        <div>
                          <h4 className="font-medium text-white/90">Android / Chrome</h4>
                          <p className="mt-1 text-sm text-white/60">
                            Tap <span className="text-arc-300">Install</span> when prompted to add SI-OS to your home screen.
                            If you don't see the prompt, look for the <span className="text-arc-300">Add to Home screen</span> option in the browser menu.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
