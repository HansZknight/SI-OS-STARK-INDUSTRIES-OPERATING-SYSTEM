import React from 'react';
import { motion } from 'framer-motion';

export const SciFiDataPanel = ({ title, value, percentage, data = [], invert = false, children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: invert ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative mb-6 flex flex-col gap-2 ${invert ? 'items-end text-right' : 'items-start text-left'}`}
    >
      {/* Title Bar */}
      <div className={`flex items-center gap-2 ${invert ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-2 h-5 bg-cyan-500/80 skew-x-[20deg]" />
          ))}
        </div>
        <div className="relative border border-cyan-500/50 bg-cyan-900/20 px-4 py-1 flex-1 min-w-[150px]">
          <h3 className="font-mono text-cyan-400 font-bold tracking-widest uppercase text-sm">
            {title}
          </h3>
          {/* Angled corner cut */}
          <div className={`absolute top-0 w-3 h-3 border-t border-cyan-400 ${invert ? 'right-0 border-r' : 'left-0 border-l'}`} />
          <div className={`absolute bottom-0 w-3 h-3 border-b border-cyan-400 ${invert ? 'left-0 border-l' : 'right-0 border-r'}`} />
        </div>
      </div>

      {/* Content Area */}
      <div className={`w-full max-w-[280px] flex ${invert ? 'flex-row-reverse' : 'flex-row'} gap-4 items-center`}>
        {/* Left/Right Matrix Data */}
        <div className="flex flex-col gap-1 text-[8px] font-mono text-cyan-500/50 leading-tight">
          <p>0x32A45B 0101011</p>
          <p>SYS_OP: NORMAL</p>
          <p>MEM_ALLOC: 4096MB</p>
          <p>T_CORE: 45.2°C</p>
          <div className="h-px w-full bg-cyan-500/30 my-1" />
          <p>NET_TRX: 120kb/s</p>
        </div>

        {/* Circular Percentage or Content */}
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-cyan-900/30"
              strokeDasharray="100, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke="currentColor" strokeWidth="2" fill="none"
            />
            <path
              className="text-cyan-400"
              strokeDasharray={`${percentage || 0}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke="currentColor" strokeWidth="2.5" fill="none"
            />
          </svg>
          <span className="font-mono text-xs font-bold text-cyan-300 shadow-cyan-500 drop-shadow-md">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Dashed Bar Visualizer */}
      <div className={`w-full max-w-[280px] flex gap-1 mt-1 ${invert ? 'justify-end' : 'justify-start'}`}>
        {[...Array(20)].map((_, i) => {
          const isActive = i < (percentage / 5);
          return (
            <div 
              key={i} 
              className={`h-2 w-3 skew-x-[15deg] transition-all duration-300 ${isActive ? 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'bg-cyan-900/40'}`} 
            />
          );
        })}
      </div>
      
      {/* Dynamic Values */}
      <div className={`w-full max-w-[280px] flex ${invert ? 'flex-row' : 'flex-row-reverse'} justify-between mt-1 border-t border-cyan-500/30 pt-1`}>
         <span className="text-xs font-mono text-cyan-200">{value}</span>
         <div className="flex gap-1">
            <div className="w-1 h-3 bg-cyan-400/50" />
            <div className="w-1 h-3 bg-cyan-400/70" />
            <div className="w-1 h-3 bg-cyan-400" />
         </div>
      </div>
    </motion.div>
  );
};

export default SciFiDataPanel;
