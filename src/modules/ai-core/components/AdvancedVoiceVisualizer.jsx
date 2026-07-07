import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const AdvancedVoiceVisualizer = ({ isActive, state = 'idle' }) => {
  const barsCount = 24;
  const [heights, setHeights] = useState(Array(barsCount).fill(10));

  // Determine colors based on state
  const getGradient = () => {
    switch (state) {
      case 'listening':
        return 'from-orange-500 to-yellow-500'; // Orange/Gold
      case 'processing':
        return 'from-cyan-400 to-blue-500'; // Cyan/Blue
      case 'idle':
      default:
        return 'from-arc-500/50 to-blue-500/50'; // Dull Blue
    }
  };

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        // Generate random heights to simulate audio waves
        const newHeights = Array.from({ length: barsCount }).map(() => {
          // If listening, very spiky. If processing, smooth waves
          const min = state === 'listening' ? 10 : 30;
          const max = state === 'listening' ? 100 : 70;
          return Math.floor(Math.random() * (max - min + 1)) + min;
        });
        setHeights(newHeights);
      }, 100);
    } else {
      setHeights(Array(barsCount).fill(15));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, state]);

  return (
    <div className="flex items-center justify-center gap-[2px] sm:gap-1 h-12 w-full max-w-[200px] mx-auto overflow-hidden">
      {heights.map((height, i) => {
        // Create a mirror effect (taller in middle, shorter on sides)
        const centerOffset = Math.abs(i - barsCount / 2) / (barsCount / 2);
        const adjustedHeight = isActive ? Math.max(10, height * (1 - centerOffset * 0.5)) : 10;
        
        return (
          <motion.div
            key={i}
            className={`w-1 sm:w-1.5 rounded-full bg-gradient-to-t ${getGradient()} shadow-[0_0_8px_currentColor]`}
            animate={{
              height: `${adjustedHeight}%`,
              opacity: isActive ? 1 : 0.4
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20
            }}
            style={{ 
              height: '10%',
              minHeight: '4px'
            }}
          />
        );
      })}
    </div>
  );
};

export default AdvancedVoiceVisualizer;
