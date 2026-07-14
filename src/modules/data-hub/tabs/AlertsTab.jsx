import React from 'react'
import { motion } from 'framer-motion'
import { AlertOctagon, AlertTriangle, Info, BellRing, Filter, CheckCircle } from 'lucide-react'

const AlertsTab = () => {
  const alerts = [
    { id: 1, type: 'critical', title: 'Unauthorized Access Attempt', desc: 'Multiple failed login attempts detected in Sector 4 Subnet.', time: '2 mins ago', icon: AlertOctagon },
    { id: 2, type: 'warning', title: 'Power Fluctuation', desc: 'Arc reactor ring 3 exhibiting 0.04% variance. Auto-stabilizers engaged.', time: '14 mins ago', icon: AlertTriangle },
    { id: 3, type: 'info', title: 'System Update Ready', desc: 'J.A.R.V.I.S neural net vocabulary patch available for installation.', time: '1 hour ago', icon: Info },
    { id: 4, type: 'critical', title: 'Perimeter Breach', desc: 'Motion sensors triggered at Avengers Compound East Gate.', time: '2 hours ago', icon: AlertOctagon },
    { id: 5, type: 'warning', title: 'High Memory Usage', desc: 'Analytics clustering module consuming 94% allocated RAM.', time: '3 hours ago', icon: AlertTriangle },
  ]

  const styles = {
    critical: 'bg-red-500/10 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-display font-semibold text-white tracking-wide">Incident Response</h2>
          <p className="text-xs text-white/50">Real-time threat monitoring and system anomalies.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-stark-light/10 text-white/60 hover:text-white border border-white/5 transition-colors">
            <Filter size={16} />
            <span className="text-sm">Filter</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-arc-500/10 text-arc-400 hover:bg-arc-500/20 border border-arc-500/30 transition-colors">
            <CheckCircle size={16} />
            <span className="text-sm">Mark All Read</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {alerts.map((alert, index) => (
          <motion.div 
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start gap-4 p-4 rounded-xl border bg-stark-dark/50 backdrop-blur-md transition-all hover:scale-[1.01] cursor-pointer ${
              alert.type === 'critical' ? 'border-red-500/20 hover:border-red-500/50' :
              alert.type === 'warning' ? 'border-yellow-500/20 hover:border-yellow-500/50' :
              'border-blue-500/20 hover:border-blue-500/50'
            }`}
          >
            <div className={`p-3 rounded-full ${styles[alert.type]} shrink-0 shadow-lg`}>
              <alert.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-semibold text-white truncate">{alert.title}</h3>
                <span className="text-[10px] text-white/40 whitespace-nowrap ml-4">{alert.time}</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{alert.desc}</p>
            </div>
            {alert.type === 'critical' && (
              <button className="shrink-0 px-3 py-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-bold uppercase tracking-wider transition-colors border border-red-500/30">
                Resolve
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AlertsTab
