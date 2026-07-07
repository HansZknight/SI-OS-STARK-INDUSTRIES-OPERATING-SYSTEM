// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - RESOURCE DISTRIBUTION CHART
// Pie/Donut chart for resource allocation
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'
import { PieChart as PieIcon, Layers } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════

const resourceData = [
  { name: 'AI Processing', value: 35, color: '#06B6D4' },
  { name: 'Security Systems', value: 25, color: '#EF4444' },
  { name: 'R&D Projects', value: 20, color: '#A855F7' },
  { name: 'Data Storage', value: 12, color: '#3B82F6' },
  { name: 'Network Ops', value: 8, color: '#10B981' }
]

const storageData = [
  { name: 'Project Files', value: 45, color: '#06B6D4' },
  { name: 'Backups', value: 25, color: '#3B82F6' },
  { name: 'Media', value: 15, color: '#A855F7' },
  { name: 'Logs', value: 10, color: '#F59E0B' },
  { name: 'Temp', value: 5, color: '#EF4444' }
]

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-stark-dark/95 backdrop-blur-xl border border-arc-500/30 rounded-lg p-3 shadow-2xl">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: payload[0].payload.color }}
        />
        <span className="text-sm text-white font-medium">{payload[0].name}</span>
      </div>
      <p className="text-lg text-arc-400 font-mono font-bold mt-1">
        {payload[0].value}%
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// RESOURCE DISTRIBUTION CHART COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function ResourceDistributionChart() {
  const [dataType, setDataType] = useState('resources') // 'resources' or 'storage'
  const [activeIndex, setActiveIndex] = useState(null)

  const data = dataType === 'resources' ? resourceData : storageData

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-arc-500" />
            Resource Distribution
          </h3>
          <p className="text-xs text-white/40 mt-1">
            System resource allocation overview
          </p>
        </div>
        
        {/* Type Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDataType('resources')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              dataType === 'resources'
                ? 'bg-arc-500/20 text-arc-300 border border-arc-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            Compute
          </button>
          <button
            onClick={() => setDataType('storage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              dataType === 'storage'
                ? 'bg-arc-500/20 text-arc-300 border border-arc-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            Storage
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded-lg bg-stark-light/30 border border-arc-500/10">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  style={{
                    filter: activeIndex === index ? 'brightness(1.2)' : 'none',
                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none hidden">
          <p className="text-xs text-white/40">Total</p>
          <p className="text-2xl font-bold text-white font-mono">100%</p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
              activeIndex === index
                ? 'bg-white/10 border-white/20'
                : 'bg-stark-light/20 border-arc-500/10 hover:border-arc-500/30'
            }`}
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-white/60 truncate">{item.name}</span>
            </div>
            <span
              className="text-lg font-bold font-mono"
              style={{ color: item.color }}
            >
              {item.value}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}