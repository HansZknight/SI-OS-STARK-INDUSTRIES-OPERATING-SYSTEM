import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Crosshair, Zap, Activity, Navigation, Wind, Triangle } from 'lucide-react';
import { SciFiDataPanel } from '../ai-core/components/SciFiDataPanel';
import suitVideo from './24271711.mp4';

const SystemWidget = ({ title, status, value, icon: Icon, color = "cyan" }) => (
  <div className={`p-4 border border-${color}-500/30 bg-stark-dark/60 backdrop-blur-md group hover:border-${color}-400 transition-all duration-300 relative overflow-hidden cursor-crosshair`}>
    {/* Corner Brackets */}
    <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-${color}-500/50 group-hover:border-${color}-300 transition-all duration-300 group-hover:w-4 group-hover:h-4`} />
    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-${color}-500/50 group-hover:border-${color}-300 transition-all duration-300 group-hover:w-4 group-hover:h-4`} />
    
    <div className={`absolute top-0 left-0 w-1 h-full bg-${color}-500/50 group-hover:bg-${color}-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]`} />
    
    <div className="flex items-start justify-between relative z-10">
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-${color}-500/10 rounded border border-${color}-500/20 text-${color}-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] group-hover:scale-110 transition-all`}>
          <Icon size={18} />
        </div>
        <div>
          <h4 className={`text-xs font-mono font-bold text-${color}-300 tracking-wider group-hover:animate-pulse`}>{title}</h4>
          <p className="text-[10px] font-mono text-stark-light uppercase tracking-widest">{status}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
         <div className={`text-xl font-mono font-bold text-${color}-100 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]`}>
           {value}
         </div>
         {/* Hidden data stream on hover */}
         <div className={`text-[8px] font-mono text-${color}-400/0 group-hover:text-${color}-400/80 transition-colors duration-300 mt-1`}>
            0x{Math.floor(Math.random()*16777215).toString(16).toUpperCase()}
         </div>
      </div>
    </div>
  </div>
);

const ArmorIntegrityMap = () => (
  <div className="relative w-full aspect-[3/4] border border-cyan-500/30 bg-cyan-950/20 backdrop-blur p-4 flex flex-col items-center justify-center overflow-hidden group cursor-crosshair">
     {/* Grid Background */}
     <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
     
     {/* Hexagonal Overlay (Sci-fi pattern) */}
     <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 10v20l-20 10L0 30V10z' fill='none' stroke='%2300D4FF' stroke-width='1'/%3E%3C/svg%3E\")", backgroundSize: '20px 20px' }} />

     <h3 className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 font-bold z-10 flex items-center gap-1">
        <Shield size={10} /> ARMOR INTEGRITY
     </h3>
     
     {/* Spinning Target Reticle in Background */}
     <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
        <svg viewBox="0 0 200 200" className="w-[120%] h-[120%] animate-[spin_10s_linear_infinite]">
           <circle cx="100" cy="100" r="90" fill="none" stroke="#00D4FF" strokeWidth="1" strokeDasharray="10 20" />
           <circle cx="100" cy="100" r="70" fill="none" stroke="#00D4FF" strokeWidth="2" strokeDasharray="50 10" />
           <path d="M 100 0 L 100 20 M 100 180 L 100 200 M 0 100 L 20 100 M 180 100 L 200 100" stroke="#00D4FF" strokeWidth="2" />
        </svg>
     </div>

     {/* Abstract Body Map (More Detailed) */}
     <div className="relative w-3/4 h-3/4 flex items-center justify-center z-10">
        <svg viewBox="0 0 100 200" className="w-full h-full text-cyan-500/40 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] group-hover:text-cyan-400 transition-colors">
           {/* Head & Neck */}
           <circle cx="50" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
           <circle cx="50" cy="20" r="10" fill="currentColor" opacity="0.5" className="animate-pulse" />
           <rect x="46" y="34" width="8" height="6" fill="currentColor" />
           
           {/* Torso */}
           <path d="M 35,42 L 65,42 L 75,55 L 70,110 L 30,110 L 25,55 Z" fill="none" stroke="currentColor" strokeWidth="2" />
           <path d="M 40,47 L 60,47 L 65,105 L 35,105 Z" fill="currentColor" opacity="0.3" />
           
           {/* Arc Reactor Center */}
           <circle cx="50" cy="65" r="8" fill="none" stroke="#fff" strokeWidth="1" className="animate-[ping_3s_infinite]" />
           <circle cx="50" cy="65" r="4" fill="#0ff" />
           
           {/* Arms */}
           <path d="M 22,45 L 12,50 L 15,100 L 25,100 Z" fill="currentColor" opacity="0.5" />
           <path d="M 78,45 L 88,50 L 85,100 L 75,100 Z" fill="currentColor" opacity="0.5" />
           
           {/* Legs */}
           <path d="M 32,112 L 48,112 L 45,185 L 30,185 Z" fill="currentColor" opacity="0.5" />
           <path d="M 52,112 L 68,112 L 70,185 L 55,185 Z" fill="currentColor" opacity="0.5" />
           
           {/* Damage Overlays */}
           <g className="animate-[blink_2s_infinite]">
              <circle cx="20" cy="70" r="6" fill="#ff3333" opacity="0.7" />
              <line x1="20" y1="70" x2="35" y2="60" stroke="#ff3333" strokeWidth="1" />
              <text x="38" y="58" fill="#ff3333" fontSize="6" fontFamily="monospace">ARM_L_DMG</text>
           </g>
           
           <g className="animate-[blink_3s_infinite]">
              <circle cx="60" cy="140" r="5" fill="#facc15" opacity="0.7" />
              <line x1="60" y1="140" x2="75" y2="130" stroke="#facc15" strokeWidth="1" />
              <text x="78" y="128" fill="#facc15" fontSize="6" fontFamily="monospace">LEG_R_WARN</text>
           </g>
        </svg>
     </div>
     
     <div className="absolute bottom-2 right-2 flex gap-1">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '200ms'}} />
        <div className="w-2 h-2 bg-cyan-500 rounded-full" />
     </div>
  </div>
);

const LiveSensorFeed = () => {
  const [logs, setLogs] = useState([
    "0x77A12: SCANNING SECTOR 4",
    "0x88B34: THERMAL SIGNATURE DETECTED",
    "0x99C56: ROUTING POWER TO THRUSTERS",
    "0xAA45B: NANOTECH REGENERATION ACTIVE",
    "0xBB789: WARNING: UNKNOWN PROJECTILE",
    "0xCC112: DEPLOYING FLARES"
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const prefixes = ["SYS", "WPN", "NAV", "DEF", "POW", "AI"];
      const messages = [
        "CALIBRATING SENSORS...",
        "ADJUSTING FLIGHT PATH",
        "INCOMING COMM LINK",
        "POWER REROUTED TO SHIELDS",
        "TARGET ACQUIRED",
        "ENVIRONMENTAL SCAN COMPLETE"
      ];
      const newLog = `0x${Math.floor(Math.random()*100000).toString(16).toUpperCase()}: [${prefixes[Math.floor(Math.random()*prefixes.length)]}] ${messages[Math.floor(Math.random()*messages.length)]}`;
      
      setLogs(prev => {
        const newLogs = [newLog, ...prev];
        if (newLogs.length > 8) newLogs.pop();
        return newLogs;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 p-4 border border-cyan-500/30 bg-cyan-950/40 rounded backdrop-blur relative overflow-hidden group">
      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/40" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/40" />
      
      <h4 className="text-[10px] font-mono text-cyan-400 font-bold mb-2 flex items-center gap-2 relative z-10">
         <Activity size={12} className="animate-pulse" />
         LIVE SENSOR FEED
      </h4>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[200%] w-full animate-[scan_2s_linear_infinite] pointer-events-none" />
      
      <div className="flex flex-col gap-1 text-[8px] font-mono text-cyan-200/60 overflow-hidden h-32 relative z-10">
         <AnimatePresence>
           {logs.map((log, i) => (
             <motion.p 
               key={log + i}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0 }}
               className={log.includes("WARNING") ? "text-red-400 font-bold drop-shadow-[0_0_2px_rgba(248,113,113,0.8)]" : ""}
             >
               {log}
             </motion.p>
           ))}
         </AnimatePresence>
      </div>
    </div>
  );
};

const IronManSuit = () => {
  const [power, setPower] = useState(98);

  useEffect(() => {
    const interval = setInterval(() => {
      setPower(p => (p > 15 ? p - Math.random() * 0.1 : 100));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col p-4 md:p-6 lg:p-8 relative overflow-hidden bg-stark-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-stark opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_60%)] blur-3xl opacity-50" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-8 border-b border-cyan-500/30 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-400 flex items-center justify-center animate-[spin_5s_linear_infinite]">
             <Triangle size={24} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              IRON MAN SUIT
            </h1>
            <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] animate-pulse">
              DIAGNOSTICS & TELEMETRY
            </p>
          </div>
        </div>
        
        <div className="text-left md:text-right mt-4 md:mt-0 flex items-center gap-4">
           <div className="relative w-16 h-16 flex items-center justify-center">
             <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full -rotate-90">
               <path className="text-cyan-900/40" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" strokeWidth="2" fill="none" />
               <path className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" strokeDasharray={`${power}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" strokeWidth="2.5" fill="none" />
             </svg>
             <Zap size={14} className="text-cyan-300 animate-pulse" />
           </div>
           <div>
             <div className="text-[10px] font-mono text-cyan-500/70">ARC REACTOR CORE</div>
             <div className="text-3xl font-mono font-bold text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
               {power.toFixed(1)}%
             </div>
           </div>
        </div>
      </div>

      {/* Main Interface Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[600px] relative z-10">
        
        {/* Left Side: Diagnostics */}
        <div className="flex flex-col gap-4">
          <SystemWidget title="REPULSORS" status="CHARGED" value="100%" icon={Zap} />
          <SystemWidget title="FLIGHT SYS" status="STABLE" value="MACH 2" icon={Wind} />
          <SystemWidget title="HULL INT" status="MINOR DMG" value="88%" icon={Shield} color="red" />
          <ArmorIntegrityMap />
        </div>

        {/* Center: Holographic Video */}
        <div className="lg:col-span-2 relative flex flex-col items-center justify-center min-h-[400px] group">
          
          {/* Complex Target Lock Frame */}
          <div className="absolute inset-4 border border-cyan-500/10 pointer-events-none transition-all duration-500 group-hover:border-cyan-500/30">
             <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400" />
             <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400" />
             <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-400" />
             <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-400" />
             
             {/* Crosshairs */}
             <div className="absolute top-1/2 -left-2 w-4 h-[1px] bg-cyan-400" />
             <div className="absolute top-1/2 -right-2 w-4 h-[1px] bg-cyan-400" />
             <div className="absolute -top-2 left-1/2 w-[1px] h-4 bg-cyan-400" />
             <div className="absolute -bottom-2 left-1/2 w-[1px] h-4 bg-cyan-400" />
          </div>

          {/* Hologram Scanner Ring & Inner Reticles */}
          <div className="absolute top-1/2 -translate-y-1/2 w-[85%] aspect-square border border-dashed border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite] opacity-40 pointer-events-none" />
          <div className="absolute top-1/2 -translate-y-1/2 w-[70%] aspect-square border border-cyan-500/10 rounded-full animate-[ping_4s_linear_infinite] opacity-30 pointer-events-none" />
          
          <div className="absolute top-0 w-full h-[2px] bg-cyan-400/50 animate-[scan_3s_linear_infinite] shadow-[0_0_20px_rgba(34,211,238,0.8)] z-30 pointer-events-none" />
          
          <video 
            src={suitVideo} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full max-h-[600px] object-contain z-20 pointer-events-none transition-all duration-700 group-hover:scale-105"
            style={{ 
              mixBlendMode: 'screen', // This removes the black background!
              filter: 'contrast(1.2) brightness(1.1) drop-shadow(0 0 25px rgba(6,182,212,0.5))'
            }}
          />
          
          {/* Floor Projection Grid */}
          <div className="absolute bottom-10 w-[60%] h-[120px] rounded-[100%] border-2 border-cyan-500/30 bg-cyan-500/10 [transform:rotateX(75deg)] shadow-[0_0_40px_rgba(6,182,212,0.4)] z-10 animate-pulse pointer-events-none flex items-center justify-center">
             <div className="w-[80%] h-[80%] rounded-[100%] border border-cyan-400/40" />
             <div className="absolute w-[10px] h-[10px] bg-cyan-300 rounded-full blur-[2px]" />
          </div>
        </div>

        {/* Right Side: Telemetry Data */}
        <div className="flex flex-col justify-between hidden lg:flex">
           <SciFiDataPanel title="TARGETING" value="LOCKED" percentage={100} invert={true} />
           <SciFiDataPanel title="WEAPONS" value="HOT" percentage={85} invert={true} />
           <SciFiDataPanel title="LIFE SUPPORT" value="OPTIMAL" percentage={99} invert={true} />
           
           <LiveSensorFeed />
        </div>

      </div>
    </div>
  );
};

export default IronManSuit;
