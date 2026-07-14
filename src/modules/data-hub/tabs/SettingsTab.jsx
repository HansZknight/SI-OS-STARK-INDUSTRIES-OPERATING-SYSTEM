import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Shield, Key, RefreshCw, Database } from 'lucide-react'

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    autoSync: true,
    aiPredictive: true,
    deepScan: false,
    retention: '30',
    encryption: 'aes-256'
  })

  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-display font-semibold text-white tracking-wide">Hub Configuration</h2>
          <p className="text-xs text-white/50">Manage data processing parameters and security policies.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-arc-500 text-stark-darker hover:bg-arc-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,212,255,0.4)] font-bold">
          <Save size={16} />
          <span className="text-sm">Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sync Settings */}
        <div className="hud-panel p-6">
          <div className="flex items-center gap-2 mb-6 text-arc-400 border-b border-arc-500/20 pb-2">
            <RefreshCw size={18} />
            <h3 className="font-display font-bold uppercase tracking-wider text-sm">Synchronization</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-sm font-medium text-white mb-1">Global Auto-Sync</span>
                <span className="block text-xs text-white/50">Continuously sync data across all connected nodes.</span>
              </div>
              <button 
                onClick={() => toggleSetting('autoSync')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoSync ? 'bg-arc-500' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.autoSync ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-sm font-medium text-white mb-1">J.A.R.V.I.S Predictive Processing</span>
                <span className="block text-xs text-white/50">Pre-compute analytics using neural networks.</span>
              </div>
              <button 
                onClick={() => toggleSetting('aiPredictive')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.aiPredictive ? 'bg-arc-500' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.aiPredictive ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="hud-panel p-6">
          <div className="flex items-center gap-2 mb-6 text-purple-400 border-b border-purple-500/20 pb-2">
            <Shield size={18} />
            <h3 className="font-display font-bold uppercase tracking-wider text-sm">Security & Privacy</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-sm font-medium text-white mb-1">Deep Packet Inspection</span>
                <span className="block text-xs text-white/50">Scan all incoming data for advanced threats. (High CPU)</span>
              </div>
              <button 
                onClick={() => toggleSetting('deepScan')}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.deepScan ? 'bg-purple-500' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${settings.deepScan ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-white mb-2">Encryption Standard</span>
              <select 
                value={settings.encryption}
                onChange={(e) => setSettings(prev => ({ ...prev, encryption: e.target.value }))}
                className="w-full bg-stark-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="aes-128">AES-128 (Standard)</option>
                <option value="aes-256">AES-256 (Military Grade)</option>
                <option value="quantum">Quantum Resistance (Experimental)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="hud-panel p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-6 text-green-400 border-b border-green-500/20 pb-2">
            <Database size={18} />
            <h3 className="font-display font-bold uppercase tracking-wider text-sm">Data Retention Policy</h3>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <span className="block text-sm font-medium text-white mb-2">Keep telemetry logs for:</span>
              <div className="flex gap-2">
                {['7', '30', '90', '365'].map(days => (
                  <button
                    key={days}
                    onClick={() => setSettings(prev => ({ ...prev, retention: days }))}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                      settings.retention === days 
                        ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden sm:block w-px h-16 bg-white/10 mx-4" />
            <div className="hidden sm:block">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 max-w-xs">
                <div className="flex items-start gap-2 text-red-400 mb-1">
                  <Key size={14} className="shrink-0 mt-0.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Danger Zone</span>
                </div>
                <button className="text-xs text-red-400/80 hover:text-red-400 hover:underline">
                  Purge all telemetry caches immediately.
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
