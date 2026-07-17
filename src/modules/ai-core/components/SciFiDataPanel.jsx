import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SciFiDataPanel = ({ title, value, percentage, data = [], invert = false, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [randomHex, setRandomHex] = useState('0x000000');

  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setRandomHex('0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0'));
    }, 100);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: invert ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative mb-6 flex flex-col gap-2 group cursor-crosshair ${invert ? 'items-end text-right' : 'items-start text-left'}`}
    >
      {/* Target Brackets SVG Overlay */}
      <div className={`absolute -inset-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${invert ? 'scale-x-[-1]' : ''}`}>
        <svg className="w-full h-full absolute inset-0 text-cyan-500/50" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0,10 L 0,0 L 10,0" fill="none" stroke="currentColor" strokeWidth="1" className="animate-[blink_1s_infinite]" />
          <path d="M 0,90 L 0,100 L 10,100" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 90,0 L 100,0 L 100,10" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 100,90 L 100,100 L 90,100" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Title Bar */}
      <div className={`flex items-center gap-2 ${invert ? 'flex-row-reverse' : 'flex-row'} relative z-10`}>
        <div className="flex gap-1 group-hover:animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-2 h-5 skew-x-[20deg] transition-colors duration-300 ${isHovered ? 'bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-cyan-500/80'}`} />
          ))}
        </div>
        <div className="relative border border-cyan-500/50 bg-cyan-950/80 backdrop-blur-md px-4 py-1 flex-1 min-w-[150px] overflow-hidden group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300">
          {/* Scanning Line Effect */}
          <div className="absolute inset-0 -translate-y-full group-hover:animate-[scan_1.5s_linear_infinite] bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent h-[200%] w-full" />
          
          <h3 className="font-mono text-cyan-300 font-bold tracking-widest uppercase text-sm drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse flex items-center justify-between">
            <span>{title}</span>
            {isHovered && <span className="text-[8px] text-cyan-200/70 hidden sm:inline-block ml-2">{randomHex}</span>}
          </h3>
          
          {/* Angled corner cut */}
          <div className={`absolute top-0 w-3 h-3 border-t border-cyan-300 ${invert ? 'right-0 border-r' : 'left-0 border-l'} transition-all duration-300 group-hover:border-cyan-100 group-hover:w-4 group-hover:h-4`} />
          <div className={`absolute bottom-0 w-3 h-3 border-b border-cyan-300 ${invert ? 'left-0 border-l' : 'right-0 border-r'} transition-all duration-300 group-hover:border-cyan-100 group-hover:w-4 group-hover:h-4`} />
        </div>
      </div>

      {/* Content Area */}
      <div className={`w-full max-w-[280px] flex ${invert ? 'flex-row-reverse' : 'flex-row'} gap-4 items-center relative z-10`}>
        {/* Left/Right Matrix Data */}
        <div className="flex flex-col gap-1 text-[8px] font-mono text-cyan-500/50 leading-tight group-hover:text-cyan-400/80 transition-colors duration-300">
          <p className="group-hover:text-cyan-300">{isHovered ? randomHex : '0x32A45B'} {isHovered ? '1100110' : '0101011'}</p>
          <p>SYS_OP: NORMAL</p>
          <p>MEM_ALLOC: {isHovered ? Math.floor(Math.random()*8000) : 4096}MB</p>
          <p>T_CORE: {isHovered ? (40 + Math.random()*10).toFixed(1) : 45.2}°C</p>
          <div className="h-px w-full bg-cyan-500/30 my-1 group-hover:bg-cyan-400/80" />
          <p>NET_TRX: {isHovered ? Math.floor(100 + Math.random()*50) : 120}kb/s</p>
        </div>

        {/* Circular Percentage or Content */}
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-[spin_10s_linear_infinite] group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]" />
          {/* Inner rotating dash */}
          <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/30 animate-[spin_5s_linear_infinite_reverse]" />
          
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-cyan-900/40 group-hover:text-cyan-900/60 transition-colors"
              strokeDasharray="100, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke="currentColor" strokeWidth="2" fill="none"
            />
            <path
              className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all duration-700 ease-out"
              strokeDasharray={`${percentage || 0}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke="currentColor" strokeWidth="2.5" fill="none"
            />
          </svg>
          <span className="font-mono text-xs font-bold text-cyan-100 shadow-cyan-500 drop-shadow-[0_0_8px_rgba(34,211,238,1)]">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Dashed Bar Visualizer */}
      <div className={`w-full max-w-[280px] flex gap-1 mt-1 ${invert ? 'justify-end' : 'justify-start'} relative z-10`}>
        {[...Array(20)].map((_, i) => {
          const isActive = i < (percentage / 5);
          // Add a ripple effect on hover by staggering animation delay based on index
          return (
            <div 
              key={i} 
              style={isHovered ? { animationDelay: `${i * 30}ms` } : {}}
              className={`h-2 w-3 skew-x-[15deg] transition-all duration-300 ${isActive ? 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'bg-cyan-900/40'} ${isHovered && isActive ? 'animate-pulse' : ''}`} 
            />
          );
        })}
      </div>
      
      {/* Dynamic Values */}
      <div className={`w-full max-w-[280px] flex ${invert ? 'flex-row' : 'flex-row-reverse'} justify-between mt-1 border-t border-cyan-500/30 pt-1 relative z-10`}>
         <span className="text-xs font-mono text-cyan-200 group-hover:text-cyan-100 transition-colors duration-300">{value}</span>
         <div className="flex gap-1 items-center">
            <div className="w-1 h-2 bg-cyan-400/30 group-hover:bg-cyan-400/80 transition-all duration-300 group-hover:h-3" />
            <div className="w-1 h-3 bg-cyan-400/50 group-hover:bg-cyan-400/90 transition-all duration-300 group-hover:h-4" />
            <div className="w-1 h-4 bg-cyan-400 group-hover:bg-cyan-200 group-hover:shadow-[0_0_5px_rgba(34,211,238,1)] transition-all duration-300 group-hover:h-5" />
         </div>
      </div>
    </motion.div>
  );
};

export default SciFiDataPanel;
