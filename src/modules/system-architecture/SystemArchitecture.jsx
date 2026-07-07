// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// System Architecture - Infrastructure Topology
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Database,
  Cpu,
  Cloud,
  Shield,
  Wifi,
  Activity,
  RefreshCw,
  Maximize2,
  Minimize2,
  Info,
  Loader2,
  Search,
  Filter,
  Settings,
  X,
  AlertCircle,
  BarChart2,
  Terminal,
  Power,
  Layers,
  LayoutGrid,
  List,
  Clock,
  AlertTriangle,
  ChevronDown,
  Sliders,
  Eye,
  EyeOff,
  HardDrive,
  Box
} from 'lucide-react';

// Lazy load the 3D network graph component
const NetworkGraph3D = lazy(() => import('@/components/network/NetworkGraph3D'));

// Loading component for the 3D graph
const GraphLoading = () => (
  <div className="w-full h-full flex items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-arc-500" />
  </div>
);

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

const NodeCard = ({ 
  icon: Icon, 
  label, 
  status, 
  connections, 
  metrics, 
  onClick, 
  isSelected,
  className = ''
}) => {
  const statusColors = {
    online: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
    warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
    error: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
    offline: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' }
  };

  const statusConfig = statusColors[status] || statusColors.offline;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-arc-500 border-arc-500/30 bg-arc-800/50' 
          : 'border-arc-700/50 bg-arc-800/30 hover:border-arc-600/50 hover:bg-arc-800/40'
      } ${className}`}
      variants={itemVariants}
      whileHover={{ 
        y: -2,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
      }}
      onClick={onClick}
    >
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 h-1 w-full ${statusConfig.bg}`}>
        <div className={`h-full ${statusConfig.dot} ${status !== 'offline' ? 'animate-pulse' : ''}`} style={{ width: '80%' }} />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${statusConfig.bg} ${statusConfig.text}`}>
              <Icon size={20} className="shrink-0" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-white group-hover:text-arc-300 transition-colors">{label}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-white/60">{connections} connections</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span className="flex items-center gap-1 text-xs">
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dot} ${status !== 'offline' ? 'animate-pulse' : ''}`}></span>
                  <span className="capitalize">{status}</span>
                </span>
              </div>
            </div>
          </div>
          
          {isSelected && (
            <div className="text-arc-400">
              <Maximize2 size={16} />
            </div>
          )}
        </div>

        {metrics && (
          <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-arc-700/30">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="group">
                <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors capitalize">{key}</p>
                <p className="text-sm font-mono text-white font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-arc-900/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
        <button className="w-full py-1.5 text-xs font-medium bg-arc-700/50 hover:bg-arc-600/50 rounded-md transition-colors">
          View Details
        </button>
      </div>
    </motion.div>
  )
}

const SystemArchitecture = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showHelp, setShowHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showMetrics, setShowMetrics] = useState(true);

  // Enhanced nodes data with more details
  const [nodes, setNodes] = useState([
    { 
      id: 'core', 
      name: 'Core Servers', 
      type: 'server', 
      status: 'online', 
      connections: 24, 
      location: 'Primary Data Center',
      lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      metrics: { 
        uptime: '99.9%', 
        load: '45%', 
        temp: '42°C',
        memory: '64GB/128GB',
        network: '2.4 Gb/s',
        threads: '256',
        processes: '124'
      },
      alerts: 0,
      tags: ['critical', 'high-availability']
    },
    { 
      id: 'db1', 
      name: 'Database Cluster', 
      type: 'database', 
      status: 'warning', 
      connections: 12,
      location: 'Secondary Data Center',
      lastSeen: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      metrics: { 
        size: '2.4TB/5TB', 
        queries: '1.2M', 
        latency: '2ms',
        cache: '87%',
        replication: 'active',
        connections: '1.2k',
        active: '845'
      },
      alerts: 2,
      tags: ['critical', 'replicated']
    },
    { 
      id: 'cloud1', 
      name: 'Cloud Storage', 
      type: 'cloud', 
      status: 'online', 
      connections: 8, 
      location: 'AWS us-east-1',
      lastSeen: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
      metrics: { 
        used: '60%', 
        sync: '100%', 
        speed: '1Gb/s',
        objects: '2.4M',
        buckets: '24',
        transfer: '45TB',
        requests: '1.2M'
      },
      alerts: 0,
      tags: ['storage', 'distributed']
    },
    { 
      id: 'cpu1', 
      name: 'Processing Units', 
      type: 'cpu', 
      status: 'online', 
      connections: 16, 
      location: 'Primary Data Center',
      lastSeen: new Date(Date.now() - 1000 * 30), // 30 seconds ago
      metrics: { 
        cores: '128', 
        usage: '38%', 
        freq: '4.2GHz',
        temp: '65°C',
        cache: '96MB',
        threads: '256',
        power: '320W'
      },
      alerts: 0,
      tags: ['compute', 'high-performance']
    },
    { 
      id: 'sec1', 
      name: 'Security Layer', 
      type: 'security', 
      status: 'online', 
      connections: 32, 
      location: 'Edge Network',
      lastSeen: new Date(),
      metrics: { 
        blocked: '0', 
        scans: '24/h', 
        status: 'Secure',
        threats: '0',
        encrypted: '100%',
        policies: '12',
        alerts: '0'
      },
      alerts: 0,
      tags: ['security', 'firewall']
    },
    { 
      id: 'net1', 
      name: 'Network Gateway', 
      type: 'network', 
      status: 'online', 
      connections: 48, 
      location: 'Edge Network',
      lastSeen: new Date(),
      metrics: { 
        in: '2.4Gb/s', 
        out: '1.8Gb/s', 
        ping: '1ms',
        packets: '1.2M',
        errors: '0',
        dropped: '0',
        uptime: '99.99%'
      },
      alerts: 1,
      tags: ['network', 'gateway']
    },
  ]);

  // Filter nodes based on search and active filter
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' || 
                          node.status === activeFilter || 
                          (activeFilter === 'alert' && node.alerts > 0);
      
      return matchesSearch && matchesFilter;
    });
  }, [nodes, searchQuery, activeFilter]);

  // Group nodes by status for the status bar
  const statusCounts = useMemo(() => {
    return nodes.reduce((acc, node) => {
      acc[node.status] = (acc[node.status] || 0) + 1;
      return acc;
    }, { total: nodes.length });
  }, [nodes]);

  // Calculate system health status
  const systemHealth = useMemo(() => {
    if (nodes.some(n => n.status === 'error')) return 'error';
    if (nodes.some(n => n.status === 'warning')) return 'warning';
    return 'healthy';
  }, [nodes]);

  // Toggle fullscreen mode
  const toggleFullscreen = async () => {
    const elem = document.documentElement;
    try {
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
          await elem.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  // Refresh data
  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  // Handle node selection
  const handleNodeSelect = (node) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  };

  // Get icon component based on node type
  const getNodeIcon = (type) => {
    switch (type) {
      case 'server': return Server;
      case 'database': return Database;
      case 'cloud': return Cloud;
      case 'cpu': return Cpu;
      case 'security': return Shield;
      case 'network': return Wifi;
      default: return Box;
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            System Architecture
          </h1>
          <p className="text-white/50 text-sm">
            Interactive 3D visualization of the Stark Industries infrastructure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Help"
          >
            <Info size={18} className="text-arc-300" />
          </button>
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isLoading ? 'animate-spin' : ''}`}
            title="Refresh Data"
          >
            <RefreshCw size={18} className="text-arc-300" />
          </button>
        </div>
      </motion.div>

      {/* Help Panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="hud-panel p-4 mb-6 text-sm">
              <h3 className="font-semibold text-arc-300 mb-2">Interactive 3D Network Visualization</h3>
              <ul className="list-disc pl-5 space-y-1 text-white/70">
                <li>Click and drag to rotate the view</li>
                <li>Scroll to zoom in/out</li>
                <li>Right-click and drag to pan</li>
                <li>Click on a node to select and focus on it</li>
                <li>Click on a node card to highlight it in the 3D view</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter Bar */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
      >
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-arc-300" />
          <input
            type="text"
            placeholder="Search nodes by name, type, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-arc-800/50 border border-arc-700/50 rounded-lg text-sm text-white placeholder-arc-400 focus:outline-none focus:ring-2 focus:ring-arc-500/50 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-arc-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="inline-flex rounded-lg border border-arc-700/50 bg-arc-800/30 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-arc-700/50 text-arc-300' : 'text-arc-400 hover:bg-arc-700/30'}`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-arc-700/50 text-arc-300' : 'text-arc-400 hover:bg-arc-700/30'}`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>

          <div className="inline-flex rounded-lg border border-arc-700/50 bg-arc-800/30 p-0.5">
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className={`p-1.5 rounded-md transition-colors ${showMetrics ? 'text-arc-300' : 'text-arc-400 hover:bg-arc-700/30'}`}
              title={showMetrics ? 'Hide Metrics' : 'Show Metrics'}
            >
              {showMetrics ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <div className="relative">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm rounded-lg border border-arc-700/50 bg-arc-800/50 text-white focus:outline-none focus:ring-2 focus:ring-arc-500/50 focus:border-transparent transition-all"
            >
              <option value="all">All Nodes</option>
              <option value="online">Online</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="alert">With Alerts</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-arc-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Status Bar */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-arc-800/50 border border-arc-700/30"
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="text-arc-400">Status:</span>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>{statusCounts.online || 0} Online</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span>{statusCounts.warning || 0} Warning</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>{statusCounts.error || 0} Error</span>
          </div>
        </div>
        
        <div className="h-4 w-px bg-arc-700/50" />
        
        <div className="flex items-center gap-2 text-sm text-arc-300">
          <span>Total: {nodes.length} nodes</span>
          <span>•</span>
          <span>{filteredNodes.length} filtered</span>
          {searchQuery && (
            <>
              <span>•</span>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-arc-400 hover:text-arc-200 transition-colors flex items-center gap-1"
              >
                <X size={14} />
                <span>Clear search</span>
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* 3D Network Graph */}
      <motion.div
        className={`hud-panel p-0 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 m-0' : 'h-[600px]'}`}
        variants={itemVariants}
      >
        <div className="relative h-full">
          {/* Graph Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button 
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 size={16} className="text-white" />
              ) : (
                <Maximize2 size={16} className="text-white" />
              )}
            </button>
          </div>
          
          {/* Last Updated */}
          <div className="absolute bottom-4 right-4 z-10 text-xs text-white/50">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
          
          {/* 3D Graph */}
          <div className="w-full h-full">
            <Suspense fallback={<GraphLoading />}>
              <NetworkGraph3D />
            </Suspense>
          </div>
        </div>
      </motion.div>

      {/* System Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => {
          const Icon = getNodeIcon(node.type);
          return (
            <NodeCard
              key={node.id}
              icon={Icon}
              label={node.name}
              status={node.status}
              connections={node.connections}
              metrics={node.metrics}
              isSelected={selectedNode?.id === node.id}
              onClick={() => handleNodeSelect(node)}
            />
          );
        })}
      </div>

      {/* System Health */}
      <motion.div
        className="hud-panel p-6"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider">
            System Health
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <motion.div 
              className="flex items-center gap-1.5 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-2.5 h-2.5 rounded-full bg-green-400"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(74, 222, 128, 0.7)',
                    '0 0 0 6px rgba(74, 222, 128, 0)',
                    '0 0 0 0 rgba(74, 222, 128, 0)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <span className="text-white/80 group-hover:text-white transition-colors">Normal</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-1.5 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-2.5 h-2.5 rounded-full bg-yellow-400"
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <span className="text-white/80 group-hover:text-white transition-colors">Warning</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-1.5 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-2.5 h-2.5 rounded-full bg-red-400"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <span className="text-white/80 group-hover:text-white transition-colors">Critical</span>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              label: 'CPU Usage', 
              value: 45, 
              max: 100, 
              unit: '%', 
              status: 'normal',
              icon: (
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 0.9, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.2, 0.4, 0.6]
                  }}
                >
                  <Cpu size={16} className="text-arc-300" />
                </motion.div>
              ),
              animation: {
                type: 'wave',
                color: '#3b82f6',
                secondaryColor: 'rgba(59, 130, 246, 0.2)'
              }
            },
            { 
              label: 'Memory', 
              value: 62, 
              max: 100, 
              unit: '%', 
              status: 'normal',
              icon: <HardDrive size={16} className="text-arc-300" />
            },
            { 
              label: 'Network', 
              value: 78, 
              max: 100, 
              unit: '%', 
              status: 'warning',
              icon: <Wifi size={16} className="text-arc-300" />
            },
            { 
              label: 'Storage', 
              value: 52, 
              max: 100, 
              unit: '%', 
              status: 'normal',
              icon: <Database size={16} className="text-arc-300" />
            }
          ].map((metric, index) => (
            <motion.div 
              key={index} 
              className="p-4 rounded-lg bg-stark-light/10 border border-arc-500/10 hover:bg-stark-light/20 transition-colors"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-arc-500/10">
                    {metric.icon}
                  </div>
                  <span className="text-xs font-medium text-white/70">{metric.label}</span>
                </div>
                <span className={`text-sm font-mono ${
                  metric.status === 'normal' ? 'text-green-400' :
                  metric.status === 'warning' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {metric.value}{metric.unit}
                </span>
              </div>
              <div className="h-1.5 bg-stark-dark/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    metric.status === 'normal' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                    metric.status === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                    'bg-gradient-to-r from-red-400 to-pink-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-2xs text-white/30">0%</span>
                <span className="text-2xs text-white/30">100%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Status Legend */}
        <div className="mt-6 pt-4 border-t border-arc-500/10">
          <div className="flex items-center justify-between text-xs text-white/50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span>All Systems Operational</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-white/30">•</span>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
            <button 
              className="text-arc-300 hover:text-arc-200 transition-colors flex items-center gap-1"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SystemArchitecture