import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Activity, TrendingUp, TrendingDown, Zap, BarChart2 } from 'lucide-react'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const AnalyticsTab = () => {
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsProcessing(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={itemVariants}>
        {[
          { label: 'Quantum Processing Load', value: '87.4%', icon: Brain, color: 'arc', trend: '+4.2%' },
          { label: 'Global Network Traffic', value: '1.2 PB/s', icon: Activity, color: 'green', trend: '+1.8%' },
          { label: 'Anomaly Detection Rate', value: '0.001%', icon: Zap, color: 'red', trend: '-0.5%' },
          { label: 'Predictive Accuracy', value: '99.9%', icon: BarChart2, color: 'purple', trend: '+0.1%' }
        ].map((stat, idx) => (
          <motion.div key={idx} className="hud-panel p-5 relative overflow-hidden group" whileHover={{ y: -2 }}>
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400`}>
                  <stat.icon size={20} />
                </div>
                <span className={`text-xs font-mono ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-xs text-white/50 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2 hud-panel p-6 min-h-[400px] flex flex-col" variants={itemVariants}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider">Predictive Trend Analysis</h3>
              <p className="text-xs text-white/40 mt-1">J.A.R.V.I.S Neural Network Projections</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-arc-500/10 text-arc-400 border border-arc-500/20 text-xs flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-arc-500 animate-pulse" />
                Live Feed
              </span>
            </div>
          </div>
          <div className="flex-1 relative flex items-center justify-center border border-arc-500/10 rounded-lg bg-stark-dark/50 overflow-hidden">
            {isProcessing ? (
              <div className="flex flex-col items-center text-arc-500">
                <Brain className="w-12 h-12 mb-4 animate-pulse opacity-50" />
                <span className="text-xs tracking-widest uppercase animate-pulse">Synthesizing Data...</span>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-end p-4 gap-2">
                {/* Dummy Chart Bars */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const height = 20 + Math.random() * 80;
                  return (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-arc-500/80 to-cyan-400/80 rounded-t-sm"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                    />
                  )
                })}
              </div>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          </div>
        </motion.div>

        <motion.div className="hud-panel p-6" variants={itemVariants}>
          <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">Deep Learning Insights</h3>
          <div className="space-y-4">
            {[
              { title: 'Energy Fluctuation Detected', desc: 'Arc reactor output varies by 0.02% in Sector 7.', threat: 'Low' },
              { title: 'Bandwidth Optimization', desc: 'Rerouting communications through Stark Satellite Network.', threat: 'Info' },
              { title: 'Security Anomaly', desc: 'Unusual ping frequency from unregistered subnet.', threat: 'Elevated' }
            ].map((insight, i) => (
              <div key={i} className="p-3 border border-arc-500/20 rounded-lg bg-stark-light/5 hover:bg-arc-500/5 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-white group-hover:text-arc-300 transition-colors">{insight.title}</span>
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full border ${
                    insight.threat === 'Elevated' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    insight.threat === 'Info' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}>{insight.threat}</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{insight.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AnalyticsTab
