// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - SECURITY THREAT CHART
// Real-time threat monitoring visualization
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// THREAT DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

const generateThreatData = () => {
  const data = []
  const now = new Date()
  
  for (let i = 23; i >= 0; i--) {
    data.push({
      time: `${String(now.getHours() - i).padStart(2, '0')}:00`,
      blocked: Math.floor(Math.random() * 50) + 10,
      detected: Math.floor(Math.random() * 20) + 5,
      critical: Math.floor(Math.random() * 5)
    })
  }
  
  return data
}

const threatCategories = [
  { name: 'Malware', count: 156, color: '#EF4444' },
  { name: 'Phishing', count: 89, color: '#F59E0B' },
  { name: 'DDoS', count: 42, color: '#A855F7' },
  { name: 'Intrusion', count: 28, color: '#3B82F6' },
  { name: 'Data Leak', count: 12, color: '#10B981' }
]

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-stark-dark/95 backdrop-blur-xl border border-red-500/30 rounded-lg p-3 shadow-2xl">
      <p className="text-xs text-white/60 mb-2 font-mono">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-white/80">{entry.name}:</span>
          <span className="text-xs font-mono font-bold" style={{ color: entry.color }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY THREAT CHART COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function SecurityThreatChart() {
  const [data, setData] = useState(generateThreatData())
  const [view, setView] = useState('timeline') // 'timeline' or 'categories'

  // Simulated live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)]
        const now = new Date()
        newData.push({
          time: `${String(now.getHours()).padStart(2, '0')}:00`,
          blocked: Math.floor(Math.random() * 50) + 10,
          detected: Math.floor(Math.random() * 20) + 5,
          critical: Math.floor(Math.random() * 5)
        })
        return newData
      })
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // Calculate totals
  const totals = {
    blocked: data.reduce((sum, d) => sum + d.blocked, 0),
    detected: data.reduce((sum, d) => sum + d.detected, 0),
    critical: data.reduce((sum, d) => sum + d.critical, 0)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            Threat Monitoring
          </h3>
          <p className="text-xs text-white/40 mt-1">
            24-hour security overview
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'timeline'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setView('categories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'categories'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/60">Blocked</span>
          </div>
          <span className="text-2xl font-bold text-green-400 font-mono">
            {totals.blocked}
          </span>
        </motion.div>

        <motion.div
          className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-white/60">Detected</span>
          </div>
          <span className="text-2xl font-bold text-yellow-400 font-mono">
            {totals.detected}
          </span>
        </motion.div>

        <motion.div
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-white/60">Critical</span>
          </div>
          <span className="text-2xl font-bold text-red-400 font-mono">
            {totals.critical}
          </span>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded-lg bg-stark-light/30 border border-arc-500/10">
        {view === 'timeline' ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(239, 68, 68, 0.1)" />
              
              <XAxis
                dataKey="time"
                stroke="rgba(255, 255, 255, 0.3)"
                style={{ fontSize: '10px', fontFamily: 'monospace' }}
                tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
              />
              
              <YAxis
                stroke="rgba(255, 255, 255, 0.3)"
                style={{ fontSize: '10px', fontFamily: 'monospace' }}
                tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="blocked"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBlocked)"
                name="Blocked"
              />
              
              <Area
                type="monotone"
                dataKey="detected"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDetected)"
                name="Detected"
              />
              
              <Area
                type="monotone"
                dataKey="critical"
                stroke="#EF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCritical)"
                name="Critical"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={threatCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(239, 68, 68, 0.1)" />
              
              <XAxis
                dataKey="name"
                stroke="rgba(255, 255, 255, 0.3)"
                style={{ fontSize: '10px', fontFamily: 'monospace' }}
                tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
              />
              
              <YAxis
                stroke="rgba(255, 255, 255, 0.3)"
                style={{ fontSize: '10px', fontFamily: 'monospace' }}
                tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Threats">
                {threatCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Threat Categories List */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {threatCategories.map((category, index) => (
          <motion.div
            key={index}
            className="p-3 rounded-lg bg-stark-light/20 border border-arc-500/10 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <span 
              className="text-lg font-bold font-mono"
              style={{ color: category.color }}
            >
              {category.count}
            </span>
            <p className="text-xs text-white/50 mt-1">{category.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}