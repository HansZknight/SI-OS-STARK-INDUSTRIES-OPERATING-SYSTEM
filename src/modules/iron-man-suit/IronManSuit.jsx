import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Crosshair, Zap, Activity, Navigation, Wind } from 'lucide-react';
import { SciFiDataPanel } from '../ai-core/components/SciFiDataPanel';
import suitVideo from './24271711.mp4';

const SystemWidget = ({ title, status, value, icon: Icon, color = "cyan" }) => (
  <div className={`p-4 border border-${color}-500/30 bg-stark-dark/60 backdrop-blur-md rounded-lg group hover:border-${color}-400 transition-all duration-300 relative overflow-hidden`}>
    <div className={`absolute top-0 left-0 w-1 h-full bg-${color}-500/50 group-hover:bg-${color}-400`} />
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-${color}-500/10 rounded border border-${color}-500/20 text-${color}-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all`}>
          <Icon size={18} />
        </div>
        <div>
          <h4 className={`text-xs font-mono font-bold text-${color}-300 tracking-wider`}>{title}</h4>
          <p className="text-[10px] font-mono text-stark-light uppercase tracking-widest">{status}</p>
        </div>
      </div>
      <div className={`text-xl font-mono font-bold text-${color}-100 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]`}>
        {value}
      </div>
    </div>
  </div>
);

const ArmorIntegrityMap = () => (
  <div className="relative w-full aspect-[3/4] border border-arc-500/30 bg-cyan-950/20 backdrop-blur rounded p-4 flex flex-col items-center justify-center overflow-hidden">
     <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
     <h3 className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 font-bold z-10">ARMOR INTEGRITY</h3>
     
     {/* Abstract Body Map */}
     <div className="relative w-2/3 h-2/3 flex items-center justify-center z-10">
        <svg viewBox="0 0 100 200" className="w-full h-full text-cyan-500/50 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
           {/* Head */}
           <circle cx="50" cy="20" r="15" fill="currentColor" className="animate-pulse" />
           {/* Torso */}
           <path d="M 30,45 L 70,45 L 60,110 L 40,110 Z" fill="currentColor" />
           {/* Arms */}
           <rect x="15" y="45" width="10" height="60" rx="3" fill="currentColor" />
           <rect x="75" y="45" width="10" height="60" rx="3" fill="currentColor" />
           {/* Legs */}
           <rect x="35" y="115" width="12" height="70" rx="3" fill="currentColor" />
           <rect x="53" y="115" width="12" height="70" rx="3" fill="currentColor" />
           
           {/* Damage Overlay Example */}
           <circle cx="65" cy="50" r="8" fill="#ff3333" opacity="0.8" className="animate-[ping_2s_infinite]" />
           <line x1="65" y1="50" x2="80" y2="40" stroke="#ff3333" strokeWidth="1" />
           <text x="82" y="38" fill="#ff3333" fontSize="8" fontFamily="monospace">DMG: 12%</text>
        </svg>
     </div>
  </div>
);

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_50%)] blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            MARK 45 ARMOR
          </h1>
          <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] animate-pulse">
            DIAGNOSTICS & TELEMETRY
          </p>
        </div>
        <div className="text-left md:text-right mt-4 md:mt-0">
           <div className="text-[10px] font-mono text-cyan-500/70">ARC REACTOR STATUS</div>
           <div className="text-3xl font-mono font-bold text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
             {power.toFixed(1)}%
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
        <div className="lg:col-span-2 relative flex flex-col items-center justify-center min-h-[400px]">
          {/* Hologram Scanner Ring */}
          <div className="absolute top-1/2 -translate-y-1/2 w-[80%] aspect-square border border-cyan-500/20 rounded-full animate-[ping_4s_linear_infinite] opacity-30 pointer-events-none" />
          <div className="absolute top-0 w-full h-[2px] bg-cyan-400/50 animate-[scan_3s_linear_infinite] shadow-[0_0_20px_rgba(34,211,238,0.8)] z-30 pointer-events-none" />
          
          <video 
            src={suitVideo} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full max-h-[600px] object-contain z-20 pointer-events-none"
            style={{ 
              mixBlendMode: 'screen', // This removes the black background!
              filter: 'contrast(1.2) brightness(1.1) drop-shadow(0 0 20px rgba(6,182,212,0.4))'
            }}
          />
          
          {/* Floor Projection Grid */}
          <div className="absolute bottom-10 w-[60%] h-[100px] rounded-[100%] border border-cyan-500/30 bg-cyan-500/5 [transform:rotateX(70deg)] shadow-[0_0_30px_rgba(6,182,212,0.3)] z-10 animate-pulse pointer-events-none" />
        </div>

        {/* Right Side: Telemetry Data */}
        <div className="flex flex-col justify-between hidden lg:flex">
           <SciFiDataPanel title="TARGETING" value="LOCKED" percentage={100} invert={true} />
           <SciFiDataPanel title="WEAPONS" value="HOT" percentage={85} invert={true} />
           <SciFiDataPanel title="LIFE SUPPORT" value="OPTIMAL" percentage={99} invert={true} />
           
           <div className="mt-4 p-4 border border-cyan-500/30 bg-cyan-950/40 rounded backdrop-blur relative overflow-hidden group">
              <h4 className="text-[10px] font-mono text-cyan-400 font-bold mb-2 flex items-center gap-2 relative z-10">
                 <Activity size={12} className="animate-pulse" />
                 LIVE SENSOR FEED
              </h4>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[200%] w-full animate-[scan_2s_linear_infinite] pointer-events-none" />
              <div className="flex flex-col gap-1 text-[8px] font-mono text-cyan-200/60 overflow-hidden h-32 relative z-10">
                 <p>0x77A12: SCANNING SECTOR 4</p>
                 <p>0x88B34: THERMAL SIGNATURE DETECTED</p>
                 <p>0x99C56: ROUTING POWER TO THRUSTERS</p>
                 <p>0xAA45B: NANOTECH REGENERATION ACTIVE</p>
                 <p className="text-red-400 font-bold">0xBB789: WARNING: UNKNOWN PROJECTILE</p>
                 <p>0xCC112: DEPLOYING FLARES</p>
                 <p>0xDD345: EVASIVE MANEUVERS CALCULATED</p>
                 <p>0xEE678: INCOMING COMM LINK</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default IronManSuit;
