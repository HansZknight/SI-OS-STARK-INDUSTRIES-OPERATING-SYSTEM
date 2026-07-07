// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - PROJECT ACTIVITY CHART
// R&D project progress and activity visualization
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { TrendingUp } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT DATA
// ═══════════════════════════════════════════════════════════════════════════

const projectData = [
  { name: 'Mark LXXXV', progress: 95, color: '#00D4FF' },
  { name: 'Hulkbuster 2.0', progress: 78, color: '#A855F7' },
  { name: 'Arc Reactor v4', progress: 88, color: '#3B82F6' },
  { name: 'Nanotech Suite', progress: 92, color: '#10B981' },
  { name: 'EDITH System', progress: 65, color: '#F59E0B' },
  { name: 'Project Jericho', progress: 42, color: '#EF4444' }
]

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-stark-dark/95 backdrop-blur-xl border border-arc-500/30 rounded-lg p-3 shadow-2xl">
      <p className="text-sm text-white font-medium mb-1">{payload[0].payload.name}</p>
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: payload[0].payload.color }}
        />
        <span className="text-xs text-white/60">Progress:</span>
        <span className="text-sm text-arc-400 font-mono font-bold">
          {payload[0].value}%
        </span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT ACTIVITY CHART COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function ProjectActivityChart() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-arc-500" />
            Project Progress
          </h3>
          <p className="text-xs text-white/40 mt-1">
            Active R&D initiatives
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-white/40">Total Projects</p>
          <p className="text-2xl font-bold text-arc-400 font-mono">
            {projectData.length}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded-lg bg-stark-light/30 border border-arc-500/10">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
            
            <XAxis
              dataKey="name"
              stroke="rgba(255, 255, 255, 0.3)"
              style={{ fontSize: '10px', fontFamily: 'monospace' }}
              tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            
            <YAxis
              stroke="rgba(255, 255, 255, 0.3)"
              style={{ fontSize: '10px', fontFamily: 'monospace' }}
              tick={{ fill: 'rgba(255, 255, 255, 0.5)' }}
              domain={[0, 100]}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 212, 255, 0.1)' }} />
            
            <Bar dataKey="progress" radius={[8, 8, 0, 0]}>
              {projectData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {projectData.map((project, index) => (
          <motion.div
            key={index}
            className="p-3 rounded-lg bg-stark-light/30 border border-arc-500/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80 font-medium">
                {project.name}
              </span>
              <span className="text-sm font-mono font-bold" style={{ color: project.color }}>
                {project.progress}%
              </span>
            </div>
            <div className="h-1.5 bg-stark-dark/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: project.color }}
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}