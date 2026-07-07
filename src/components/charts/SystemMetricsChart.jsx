// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - SYSTEM METRICS CHART
// Real-time system performance visualization
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-stark-dark/95 backdrop-blur-xl border border-arc-500/30 rounded-lg p-3 shadow-2xl">
      <p className="text-xs text-white/60 mb-2 font-mono">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-white/80 font-medium">
            {entry.name}:
          </span>
          <span className="text-xs text-arc-400 font-mono font-bold">
            {entry.value}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE INITIAL DATA
// ═══════════════════════════════════════════════════════════════════════════

const generateInitialData = () => {
  const data = []
  const now = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 2000)
    data.push({
      time: time.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 40) + 30,
      network: Math.floor(Math.random() * 50) + 10
    })
  }
  
  return data
}

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM METRICS CHART COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function SystemMetricsChart() {
  const [data, setData] = useState(generateInitialData())
  const [isPaused, setIsPaused] = useState(false)

  // Update data every 2 seconds
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)]
        const now = new Date()
        
        newData.push({
          time: now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          cpu: Math.floor(Math.random() * 30) + 20,
          memory: Math.floor(Math.random() * 40) + 30,
          network: Math.floor(Math.random() * 50) + 10
        })
        
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isPaused])

  // Current metrics (latest data point)
  const currentMetrics = data[data.length - 1]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-arc-500" />
            System Performance
          </h3>
          <p className="text-xs text-white/40 mt-1">
            Real-time metrics monitoring
          </p>
        </div>
        
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-medium
            transition-all
            ${isPaused
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-arc-500/20 text-arc-300 border border-arc-500/30'
            }
          `}
        >
          {isPaused ? 'Paused' : 'Live'}
        </button>
      </div>

      {/* Current Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU */}
        <motion.div
          className="p-4 rounded-lg bg-stark-light/30 border border-arc-500/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Cpu className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm text-white/60">CPU Usage</span>
            </div>
            <span className="text-2xl font-bold text-blue-400 font-mono">
              {currentMetrics.cpu}%
            </span>
          </div>
          <div className="h-1 bg-stark-dark/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${currentMetrics.cpu}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Memory */}
        <motion.div
          className="p-4 rounded-lg bg-stark-light/30 border border-arc-500/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <HardDrive className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm text-white/60">Memory</span>
            </div>
            <span className="text-2xl font-bold text-purple-400 font-mono">
              {currentMetrics.memory}%
            </span>
          </div>
          <div className="h-1 bg-stark-dark/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${currentMetrics.memory}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Network */}
        <motion.div
          className="p-4 rounded-lg bg-stark-light/30 border border-arc-500/10"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Wifi className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm text-white/60">Network</span>
            </div>
            <span className="text-2xl font-bold text-green-400 font-mono">
              {currentMetrics.network}%
            </span>
          </div>
          <div className="h-1 bg-stark-dark/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${currentMetrics.network}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded-lg bg-stark-light/30 border border-arc-500/10">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            
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
            
            <Legend
              wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
              iconType="line"
            />
            
            <Area
              type="monotone"
              dataKey="cpu"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCpu)"
              name="CPU"
            />
            
            <Area
              type="monotone"
              dataKey="memory"
              stroke="#A855F7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMemory)"
              name="Memory"
            />
            
            <Area
              type="monotone"
              dataKey="network"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorNetwork)"
              name="Network"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}