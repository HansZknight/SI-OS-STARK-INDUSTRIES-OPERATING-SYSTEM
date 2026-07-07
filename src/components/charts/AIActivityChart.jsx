// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - AI ACTIVITY CHART
// J.A.R.V.I.S neural network activity visualization
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { Brain, Zap, MessageSquare, Sparkles } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// AI CAPABILITIES DATA
// ═══════════════════════════════════════════════════════════════════════════

const aiCapabilities = [
  { subject: 'NLP', A: 92, fullMark: 100 },
  { subject: 'Vision', A: 88, fullMark: 100 },
  { subject: 'Reasoning', A: 95, fullMark: 100 },
  { subject: 'Learning', A: 90, fullMark: 100 },
  { subject: 'Creativity', A: 78, fullMark: 100 },
  { subject: 'Memory', A: 96, fullMark: 100 }
]

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE NEURAL ACTIVITY DATA
// ═══════════════════════════════════════════════════════════════════════════

const generateNeuralData = () => {
  const data = []
  const now = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 2000)
    data.push({
      time: time.toLocaleTimeString('en-US', {
        hour12: false,
        minute: '2-digit',
        second: '2-digit'
      }),
      processing: Math.floor(Math.random() * 40) + 50,
      inference: Math.floor(Math.random() * 30) + 40,
      learning: Math.floor(Math.random() * 20) + 20
    })
  }
  
  return data
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-stark-dark/95 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-3 shadow-2xl">
      <p className="text-xs text-white/60 mb-2 font-mono">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-white/80">{entry.name}:</span>
          <span className="text-xs font-mono font-bold" style={{ color: entry.color }}>
            {entry.value}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// AI ACTIVITY CHART COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function AIActivityChart() {
  const [data, setData] = useState(generateNeuralData())
  const [view, setView] = useState('neural') // 'neural' or 'capabilities'

  // Update data every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)]
        const now = new Date()
        
        newData.push({
          time: now.toLocaleTimeString('en-US', {
            hour12: false,
            minute: '2-digit',
            second: '2-digit'
          }),
          processing: Math.floor(Math.random() * 40) + 50,
          inference: Math.floor(Math.random() * 30) + 40,
          learning: Math.floor(Math.random() * 20) + 20
        })
        
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Current stats
  const currentStats = data[data.length - 1]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            J.A.R.V.I.S Neural Activity
          </h3>
          <p className="text-xs text-white/40 mt-1">
            Real-time AI processing metrics
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('neural')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'neural'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            Neural
          </button>
          <button
            onClick={() => setView('capabilities')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'capabilities'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            Capabilities
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-white/60">Processing</span>
          </div>
          <span className="text-2xl font-bold text-cyan-400 font-mono">
            {currentStats?.processing || 0}%
          </span>
        </motion.div>

        <motion.div
          className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/60">Inference</span>
          </div>
          <span className="text-2xl font-bold text-purple-400 font-mono">
            {currentStats?.inference || 0}%
          </span>
        </motion.div>

        <motion.div
          className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/60">Learning</span>
          </div>
          <span className="text-2xl font-bold text-green-400 font-mono">
            {currentStats?.learning || 0}%
          </span>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded-lg bg-stark-light/30 border border-arc-500/10">
        {view === 'neural' ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
              
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
                domain={[0, 100]}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey="processing"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={false}
                name="Processing"
              />
              
              <Line
                type="monotone"
                dataKey="inference"
                stroke="#A855F7"
                strokeWidth={2}
                dot={false}
                name="Inference"
              />
              
              <Line
                type="monotone"
                dataKey="learning"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name="Learning"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={aiCapabilities}>
              <PolarGrid stroke="rgba(0, 212, 255, 0.2)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}
              />
              <Radar
                name="J.A.R.V.I.S"
                dataKey="A"
                stroke="#06B6D4"
                fill="#06B6D4"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* AI Status */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-white">J.A.R.V.I.S Status</span>
          </div>
          <span className="text-sm text-cyan-400 font-mono">FULLY OPERATIONAL</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-white/40">Response Time</p>
            <p className="text-sm text-white font-mono">0.023s</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Queries Today</p>
            <p className="text-sm text-white font-mono">1,247</p>
          </div>
          <div>
            <p className="text-xs text-white/40">Accuracy Rate</p>
            <p className="text-sm text-white font-mono">99.7%</p>
          </div>
        </div>
      </div>
    </div>
  )
}