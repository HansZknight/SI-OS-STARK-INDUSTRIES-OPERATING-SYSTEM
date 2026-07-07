// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// Data Intelligence Hub - Analytics & Visualization
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Zap,
  Server,
  HardDrive,
  Cpu,
  Globe,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Sliders,
  ChevronDown,
  Info,
  AlertCircle,
  Clock,
  X,
  Plus,
  AlertTriangle,
  CheckCircle,
  BarChart2,
  Settings,
  Layers,
  Wifi,
  Shield,
  Terminal
} from 'lucide-react'

// Chart Components
import SystemMetricsChart from '../../components/charts/SystemMetricsChart'
import ProjectActivityChart from '../../components/charts/ProjectActivityChart'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const DataCard = ({ icon: Icon, label, value, unit, color = 'arc', trend, onClick, isLoading = false }) => {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-arc-300'
  }

  return (
    <motion.div
      className="hud-panel p-5 cursor-pointer group relative overflow-hidden"
      variants={itemVariants}
      whileHover={{ 
        y: -3,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Animated background on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-arc-500/5 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div className={`w-12 h-12 rounded-lg mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110
            ${color === 'arc' ? 'bg-arc-500/10 text-arc-400' : ''}
            ${color === 'green' ? 'bg-green-400/10 text-green-400' : ''}
            ${color === 'purple' ? 'bg-purple-400/10 text-purple-400' : ''}
            ${color === 'red' ? 'bg-red-400/10 text-red-400' : ''}
            ${isLoading ? 'animate-pulse' : ''}
          `}>
            {isLoading ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              <Icon size={24} />
            )}
          </div>
          
          {trend && (
            <span className={`text-xs flex items-center gap-1 ${trendColors[trend] || 'text-arc-300'}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} 
              {trend !== 'neutral' && '2.5%'}
            </span>
          )}
        </div>
        
        <p className="text-xs text-white/40 uppercase tracking-wider mb-1 group-hover:text-white/60 transition-colors">
          {label}
        </p>
        
        <div className="flex items-baseline gap-1">
          {isLoading ? (
            <div className="h-7 w-24 bg-arc-700/50 rounded animate-pulse"></div>
          ) : (
            <>
              <span className="text-2xl font-display font-bold text-white">{value}</span>
              {unit && <span className="text-sm text-white/40">{unit}</span>}
            </>
          )}
        </div>
        
        {/* Progress indicator */}
        {!isLoading && (
          <div className="mt-3 h-1 bg-arc-700/50 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${
                color === 'arc' ? 'bg-arc-400' : 
                color === 'green' ? 'bg-green-400' :
                color === 'purple' ? 'bg-purple-400' : 'bg-red-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Filter Panel Component
const FilterPanel = ({ isOpen, onClose, filters, setFilters }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="w-full max-w-md bg-arc-800 h-full overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-bold">Filter Data</h3>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-arc-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-arc-400" size={16} />
                    <input
                      type="text"
                      value={filters.searchQuery}
                      onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                      className="w-full bg-arc-700 border border-arc-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-arc-400 focus:outline-none focus:ring-2 focus:ring-arc-400 focus:border-transparent"
                      placeholder="Search datasets..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                  <div className="space-y-2">
                    {['All', 'Active', 'Inactive', 'Error'].map((status) => (
                      <label key={status} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status.toLowerCase())}
                          onChange={(e) => {
                            const newStatus = [...filters.status];
                            if (e.target.checked) {
                              newStatus.push(status.toLowerCase());
                            } else {
                              const index = newStatus.indexOf(status.toLowerCase());
                              if (index > -1) {
                                newStatus.splice(index, 1);
                              }
                            }
                            setFilters({ ...filters, status: newStatus });
                          }}
                          className="rounded border-arc-600 text-arc-400 focus:ring-arc-400"
                        />
                        <span className="text-white/80">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Date Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-white/50 mb-1">From</label>
                      <input
                        type="date"
                        value={filters.dateRange.from}
                        onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, from: e.target.value } })}
                        className="w-full bg-arc-700 border border-arc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-arc-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1">To</label>
                      <input
                        type="date"
                        value={filters.dateRange.to}
                        onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, to: e.target.value } })}
                        className="w-full bg-arc-700 border border-arc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-arc-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-arc-700">
                  <div className="flex justify-between space-x-3">
                    <button
                      onClick={() => setFilters({
                        searchQuery: '',
                        status: [],
                        dateRange: { from: '', to: '' }
                      })}
                      className="px-4 py-2 text-sm font-medium text-arc-300 hover:text-white transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-arc-400 hover:bg-arc-300 text-arc-900 font-medium rounded-lg transition-colors flex-1"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const DataHub = () => {
  // State for filter panel and filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: '',
    status: [],
    dateRange: { from: '', to: '' }
  });
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for loading and data
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dataStats, setDataStats] = useState({
    totalRecords: 1245000,
    activeStreams: 24,
    growthRate: 18.5,
    processingSpeed: 2.4
  });
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small fluctuations in the data
      setDataStats(prev => ({
        totalRecords: prev.totalRecords + Math.floor(Math.random() * 1000) - 200,
        activeStreams: Math.max(15, Math.min(32, prev.activeStreams + Math.floor(Math.random() * 3) - 1)),
        growthRate: Math.max(15, Math.min(22, prev.growthRate + (Math.random() * 0.5 - 0.25))),
        processingSpeed: Math.max(1.8, Math.min(3.2, prev.processingSpeed + (Math.random() * 0.1 - 0.05)))
      }));
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  // Simulate data refresh with animation
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setDataStats({
        totalRecords: 1200000 + Math.floor(Math.random() * 100000),
        activeStreams: 20 + Math.floor(Math.random() * 10),
        growthRate: 15 + Math.random() * 10,
        processingSpeed: 2 + Math.random() * 1.5
      });
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 800);
  };
  
  // Tab navigation items
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'sources', label: 'Data Sources', icon: Database },
    { id: 'alerts', label: 'Alerts', icon: AlertCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
  
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with Tabs */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-white mb-1">
              Data Intelligence Hub
            </h1>
            <p className="text-white/50">
              Real-time analytics, data visualization, and intelligence processing.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-arc-400" size={16} />
              <input
                type="text"
                placeholder="Search datasets..."
                className="w-full bg-arc-700/50 border border-arc-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-arc-400 focus:outline-none focus:ring-2 focus:ring-arc-400 focus:border-transparent transition-all duration-200"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="px-3 py-2 bg-arc-700/50 hover:bg-arc-700 border border-arc-600 rounded-lg text-arc-200 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className={`p-2 rounded-lg border border-arc-600 ${isLoading ? 'text-arc-400' : 'text-arc-200 hover:text-white hover:bg-arc-700/50'} transition-colors`}
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-arc-700 mb-6 overflow-x-auto">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-arc-400/10 text-arc-400 border-b-2 border-arc-400' 
                    : 'text-arc-300 hover:bg-arc-800/50 hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Last Updated Indicator */}
      <motion.div 
        className="flex items-center justify-end gap-2 text-xs text-arc-400 mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Clock size={12} />
        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        <div className="hud-panel p-6">
          <SystemMetricsChart />
        </div>

        <div className="hud-panel p-6">
          <ProjectActivityChart />
        </div>
      </div>

      {/* Data Sources */}
      <motion.div
        className="hud-panel p-6"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider">
            Active Data Sources
          </h3>
          <button className="p-2 rounded-lg bg-arc-500/10 text-arc-400 hover:bg-arc-500/20 transition-colors">
            <RefreshCw size={16} />
          </button>
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
      <motion.div
        className="hud-panel p-6"
        variants={itemVariants}
      >
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
          System Performance Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Response Time */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">Avg Response Time</span>
              <span className="text-sm text-green-400 font-mono">12ms</span>
            </div>
            <div className="h-2 bg-stark-dark rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: '88%' }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          {/* Throughput */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">Data Throughput</span>
              <span className="text-sm text-blue-400 font-mono">2.1 GB/s</span>
            </div>
            <div className="h-2 bg-stark-dark rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: '76%' }}
                transition={{ duration: 1, delay: 0.1 }}
              />
            </div>
          </div>

          {/* Uptime */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/60">System Uptime</span>
              <span className="text-sm text-purple-400 font-mono">99.97%</span>
            </div>
            <div className="h-2 bg-stark-dark rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-500"
                initial={{ width: 0 }}
                animate={{ width: '99.97%' }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Log */}
      <motion.div
        className="hud-panel p-6"
        variants={itemVariants}
      >
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
              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                log.type === 'success' ? 'bg-green-400' : 'bg-arc-500'
              }`} />
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

export default DataHub;