import React from 'react'
import { motion } from 'framer-motion'
import { Database, Wifi, Globe, Server, Plus, Shield, ShieldAlert, Zap } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
}

const DataSourcesTab = () => {
  const sources = [
    { name: 'Stark Satellite Network', type: 'Orbital Array', status: 'Optimal', ping: '12ms', bandwidth: '4.2 TB/s', icon: Globe, color: 'arc' },
    { name: 'Wakandan Server Node', type: 'Vibranium Core', status: 'Encrypted', ping: '2ms', bandwidth: '12.8 TB/s', icon: Server, color: 'purple' },
    { name: 'Avengers Compound DB', type: 'Local Storage', status: 'Syncing', ping: '5ms', bandwidth: '850 GB/s', icon: Database, color: 'blue' },
    { name: 'Deep Sea Relay', type: 'Undersea Cable', status: 'Degraded', ping: '145ms', bandwidth: '120 GB/s', icon: Wifi, color: 'yellow' },
    { name: 'S.H.I.E.L.D Legacy Vault', type: 'Archive', status: 'Restricted', ping: '--', bandwidth: '0 B/s', icon: Shield, color: 'red' },
    { name: 'Arc Reactor Telemetry', type: 'Direct Feed', status: 'Active', ping: '1ms', bandwidth: '5.5 TB/s', icon: Zap, color: 'green' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-display font-semibold text-white tracking-wide">Global Data Nodes</h2>
          <p className="text-xs text-white/50">Manage active connections across the Stark grid.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-arc-500/10 text-arc-400 border border-arc-500/30 hover:bg-arc-500/20 hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)]">
          <Plus size={16} />
          <span className="text-sm font-medium">Add New Source</span>
        </button>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
        {sources.map((source, idx) => {
          const isError = source.status === 'Degraded' || source.status === 'Restricted'
          const isSyncing = source.status === 'Syncing'
          return (
            <motion.div key={idx} variants={itemVariants} className="hud-panel p-5 relative overflow-hidden group cursor-pointer hover:border-arc-500/40">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <source.icon size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg bg-${source.color}-500/20 text-${source.color}-400 shadow-[0_0_15px_rgba(0,212,255,0.2)]`}>
                    <source.icon size={24} />
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border flex items-center gap-1.5 ${
                    isError ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                    isSyncing ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                    'bg-green-500/10 border-green-500/30 text-green-400'
                  }`}>
                    {isError ? <ShieldAlert size={10} /> : <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-blue-400 animate-pulse' : 'bg-green-400'}`} />}
                    {source.status}
                  </div>
                </div>
                
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-arc-300 transition-colors">{source.name}</h3>
                <p className="text-xs text-white/40 mb-4 font-mono">{source.type}</p>
                
                <div className="flex justify-between items-end border-t border-white/5 pt-3">
                  <div>
                    <span className="block text-[10px] text-white/30 uppercase mb-0.5">Latency</span>
                    <span className="text-sm font-mono text-white/80">{source.ping}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-white/30 uppercase mb-0.5">Bandwidth</span>
                    <span className="text-sm font-mono text-arc-400">{source.bandwidth}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default DataSourcesTab
