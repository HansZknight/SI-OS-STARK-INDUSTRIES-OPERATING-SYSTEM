import React from 'react'
import { motion } from 'framer-motion'
import { Server, HardDrive, Cpu, Globe, Download, Upload } from 'lucide-react'

// Chart Components
import SystemMetricsChart from '../../../components/charts/SystemMetricsChart'
import ProjectActivityChart from '../../../components/charts/ProjectActivityChart'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const OverviewTab = () => {
  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="grid grid-cols-1 gap-6" variants={itemVariants}>
        <div className="hud-panel p-6">
          <SystemMetricsChart />
        </div>
        <div className="hud-panel p-6">
          <ProjectActivityChart />
        </div>
      </div>

      {/* Data Sources Overview */}
      <motion.div className="hud-panel p-6" variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider">
            Active Data Sources Overview
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Server, label: 'Primary Database', status: 'online', load: 45 },
            { icon: HardDrive, label: 'Storage Cluster', status: 'online', load: 62 },
            { icon: Cpu, label: 'Processing Units', status: 'online', load: 38 },
            { icon: Globe, label: 'Network Nodes', status: 'online', load: 51 },
            { icon: Download, label: 'Input Streams', status: 'active', load: 28 },
            { icon: Upload, label: 'Output Streams', status: 'active', load: 33 }
          ].map((source, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-stark-light/20 border border-arc-500/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-lg bg-arc-500/10 flex items-center justify-center">
                <source.icon size={18} className="text-arc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{source.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-stark-dark rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-arc-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${source.load}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="text-xs text-white/40 font-mono">{source.load}%</span>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                source.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-arc-500 animate-pulse'
              }`} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Overview */}
      <motion.div className="hud-panel p-6" variants={itemVariants}>
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
          System Performance Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">Avg Response Time</span>
              <span className="text-sm text-green-400 font-mono">12ms</span>
            </div>
            <div className="h-2 bg-stark-dark rounded-full overflow-hidden">
              <motion.div className="h-full bg-green-500" initial={{ width: 0 }} animate={{ width: '88%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">Data Throughput</span>
              <span className="text-sm text-blue-400 font-mono">2.1 GB/s</span>
            </div>
            <div className="h-2 bg-stark-dark rounded-full overflow-hidden">
              <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: '76%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">System Uptime</span>
              <span className="text-sm text-purple-400 font-mono">99.97%</span>
            </div>
            <div className="h-2 bg-stark-dark rounded-full overflow-hidden">
              <motion.div className="h-full bg-purple-500" initial={{ width: 0 }} animate={{ width: '99.97%' }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Log */}
      <motion.div className="hud-panel p-6" variants={itemVariants}>
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
          Recent Data Activity
        </h3>
        <div className="space-y-3">
          {[
            { time: '14:32:18', action: 'Data sync completed', type: 'success', details: '1.2M records processed' },
            { time: '14:31:45', action: 'New data source connected', type: 'info', details: 'Satellite feed #7' },
            { time: '14:30:22', action: 'Analytics report generated', type: 'success', details: 'Q4 performance metrics' },
            { time: '14:29:55', action: 'Backup initiated', type: 'info', details: 'Incremental backup started' },
            { time: '14:28:12', action: 'Query optimization', type: 'success', details: '45% performance increase' }
          ].map((log, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-stark-light/10 border border-arc-500/5 hover:border-arc-500/20 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 ${log.type === 'success' ? 'bg-green-400' : 'bg-arc-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-white/40 font-mono">{log.time}</span>
                  <span className="text-sm text-white">{log.action}</span>
                </div>
                <p className="text-xs text-white/50">{log.details}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default OverviewTab
