// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// R&D Laboratory Interface - Research & Development Hub
// ═══════════════════════════════════════════════════════════════════════════
// Classification: STARK INDUSTRIES PROPRIETARY
// Author: Tony Stark
// System: SI-OS v1.0.0 | Codename: J.A.R.V.I.S
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FlaskConical,
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
  MoreVertical,
  Star,
  StarOff,
  Archive,
  Trash2,
  Edit,
  Eye,
  FileText,
  Users,
  Tag,
  Calendar,
  Target,
  Zap,
  Atom,
  Beaker,
  TestTube,
  Microscope,
  Layers,
  GitBranch,
  Box,
  Cpu,
  Activity,
  BarChart3,
  PieChart,
  Lightbulb,
  Rocket,
  Shield,
  Lock,
  Unlock,
  Save,
  X,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Settings,
  ChevronDown,
  UserPlus,
  FolderOpen,
  FilePlus,
  Link,
  ExternalLink,
  Timer,
  Power,
  Battery
} from 'lucide-react'

// Stores
import { useProjectsStore, useSystemStore } from '../../stores/systemStore'

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.08, duration: 0.6 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
}

const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT STATS CARDS
// ═══════════════════════════════════════════════════════════════════════════

const StatsCard = ({ icon: Icon, label, value, trend, color = 'arc', interactive = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const colorClasses = {
    arc: 'bg-gradient-to-br from-arc-500/10 to-cyan-500/10 text-arc-400 border-arc-500/20 hover:border-arc-500/40',
    green: 'bg-gradient-to-br from-green-400/10 to-emerald-400/10 text-green-400 border-green-400/20 hover:border-green-400/40',
    yellow: 'bg-gradient-to-br from-yellow-400/10 to-orange-400/10 text-yellow-400 border-yellow-400/20 hover:border-yellow-400/40',
    purple: 'bg-gradient-to-br from-purple-400/10 to-violet-400/10 text-purple-400 border-purple-400/20 hover:border-purple-400/40'
  }

  return (
    <motion.div
      className={`hud-panel-angled p-5 cursor-pointer transition-all duration-300 ${
        interactive ? 'hover:scale-[1.02] hover:shadow-2xl' : ''
      } ${colorClasses[color]}`}
      variants={itemVariants}
      whileHover={interactive ? { y: -3, scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl transition-all duration-300 ${
          isHovered ? 'scale-110 shadow-lg' : ''
        }`}>
          <Icon size={20} />
        </div>
        {trend && (
          <motion.div 
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
              trend > 0 ? 'bg-green-400/10 text-green-400 border border-green-400/30' : 'bg-red-400/10 text-red-400 border border-red-400/30'
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
            <span>{Math.abs(trend)}%</span>
          </motion.div>
        )}
      </div>
      
      <p className="text-xs text-white/50 uppercase tracking-wider mb-2 font-medium">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-display font-bold text-white">{value}</span>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="mt-3 relative">
        <div className="h-2 bg-stark-light rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              color === 'arc' ? 'bg-gradient-to-r from-arc-500 via-cyan-400 to-jarvis-500' :
              color === 'green' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
              color === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
              'bg-gradient-to-r from-purple-400 to-violet-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(value, 100)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              boxShadow: `0 0 20px ${color === 'arc' ? 'rgba(0, 212, 255, 0.5)' : 'currentColor'}`
            }}
          />
        </div>
        {/* Animated glow effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 h-2 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${
                color === 'arc' ? 'rgba(0, 212, 255, 0.3)' :
                color === 'green' ? 'rgba(74, 222, 128, 0.3)' :
                color === 'yellow' ? 'rgba(250, 204, 21, 0.3)' :
                'rgba(168, 85, 247, 0.3)'
              }, transparent)`
            }}
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ProjectCard = ({ project, onSelect, isSelected, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isFavorite, setIsFavorite] = useState(project.isFavorite || false)
  const projectsStore = useProjectsStore()
  const { updateProject, deleteProject, toggleFavorite, duplicateProject } = projectsStore
  const { addNotification } = useSystemStore()

  const statusConfig = {
    'planning': { color: 'yellow', label: 'Planning', icon: Lightbulb },
    'in-progress': { color: 'arc', label: 'In Progress', icon: Activity },
    'testing': { color: 'purple', label: 'Testing', icon: TestTube },
    'completed': { color: 'green', label: 'Completed', icon: CheckCircle },
    'on-hold': { color: 'gray', label: 'On Hold', icon: Pause },
    'cancelled': { color: 'red', label: 'Cancelled', icon: AlertCircle }
  }

  const priorityConfig = {
    low: { color: 'text-white/40', label: 'Low' },
    medium: { color: 'text-yellow-400', label: 'Medium' },
    high: { color: 'text-orange-400', label: 'High' },
    critical: { color: 'text-red-400', label: 'Critical' }
  }

  const categoryIcons = {
    energy: Zap,
    interface: Cpu,
    security: Shield,
    weapons: Target,
    research: Microscope,
    other: Box
  }

  const status = statusConfig[project.status] || statusConfig['planning']
  const priority = priorityConfig[project.priority] || priorityConfig.medium
  const CategoryIcon = categoryIcons[project.category] || categoryIcons.other

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    toggleFavorite(project.id)
    addNotification({
      type: 'info',
      title: 'Project Updated',
      message: `${!isFavorite ? 'Added to' : 'Removed from'} favorites`
    })
  }

  const handleDuplicate = () => {
    duplicateProject(project.id)
    addNotification({
      type: 'success',
      title: 'Project Duplicated',
      message: `Project "${project.name}" has been duplicated`
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      deleteProject(project.id)
      addNotification({
        type: 'warning',
        title: 'Project Deleted',
        message: `Project "${project.name}" has been deleted`
      })
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    if (onEdit) onEdit(project)
  }

  return (
    <motion.div
      className={`hud-panel-angled p-5 cursor-pointer relative group ${
        isSelected ? 'border-arc-500/50' : ''
      }`}
      variants={itemVariants}
      whileHover={{ y: -4 }}
      onClick={() => onSelect(project)}
    >
      {/* Enhanced Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-arc-500/20 to-cyan-500/20 border border-arc-500/20 flex items-center justify-center">
            <CategoryIcon size={18} className="text-arc-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-display font-semibold text-white truncate">
              {project.name}
            </h3>
            <p className="text-xs text-white/40">ID: {project.id}</p>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="p-1.5 rounded-lg text-white/30 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"
        >
          {isFavorite ? (
            <Star size={16} className="fill-yellow-400" />
          ) : (
            <StarOff size={16} />
          )}
        </button>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-arc-500/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={16} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                className="absolute right-0 top-full mt-1 w-44 hud-panel p-1 z-10"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-white/60 hover:bg-arc-500/10 hover:text-white transition-colors"
                  onClick={handleEdit}
                >
                  <Edit size={14} />
                  Edit Project
                </button>
                <button 
                  className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-white/60 hover:bg-arc-500/10 hover:text-white transition-colors"
                  onClick={handleDuplicate}
                >
                  <Copy size={14} />
                  Duplicate
                </button>
                <button 
                  className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-white/60 hover:bg-arc-500/10 hover:text-white transition-colors"
                  onClick={() => {
                    // Archive functionality
                    addNotification({
                      type: 'info',
                      title: 'Project Archived',
                      message: `Project "${project.name}" has been archived`
                    })
                  }}
                >
                  <Archive size={14} />
                  Archive
                </button>
                <button 
                  className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-red-400/60 hover:bg-red-400/10 hover:text-red-400 transition-colors"
                  onClick={handleDelete}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-white/50 mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Enhanced Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-white/40">Progress</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-arc-500">{project.progress}%</span>
            <button
              className="p-1 rounded text-white/30 hover:text-arc-400 hover:bg-arc-500/10 transition-all"
              onClick={() => {
                // Quick progress update
                const newProgress = Math.min(100, project.progress + 10)
                updateProject(project.id, { progress: newProgress })
                addNotification({
                  type: 'success',
                  title: 'Progress Updated',
                  message: `Progress updated to ${newProgress}%`
                })
              }}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
        <div className="h-2 bg-stark-light rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-arc-500 to-jarvis-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
            }}
          />
          {/* Progress shimmer effect */}
          <motion.div
            className="absolute inset-0 h-2 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent)'
            }}
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>
      </div>

      {/* Enhanced Meta Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
            status.color === 'arc' ? 'bg-arc-500/10 text-arc-400 border border-arc-500/20' :
            status.color === 'green' ? 'bg-green-400/10 text-green-400 border border-green-400/20' :
            status.color === 'yellow' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
            status.color === 'purple' ? 'bg-purple-400/10 text-purple-400 border border-purple-400/20' :
            'bg-white/5 text-white/40 border border-white/10'
          }`}>
            {status.label}
          </span>

          {/* Priority */}
          <span className={`text-[10px] font-mono ${priority.color}`}>
            {priority.label}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 text-white/30">
          <button
            className="p-1 rounded hover:text-arc-400 hover:bg-arc-500/10 transition-all"
            onClick={() => {
              // Quick status change
              const statuses = ['planning', 'in-progress', 'testing', 'completed']
              const currentIndex = statuses.indexOf(project.status)
              const nextStatus = statuses[(currentIndex + 1) % statuses.length]
              updateProject(project.id, { status: nextStatus })
              addNotification({
                type: 'info',
                title: 'Status Changed',
                message: `Project status changed to ${nextStatus}`
              })
            }}
          >
            <RefreshCw size={12} />
          </button>
          <button
            className="p-1 rounded hover:text-arc-400 hover:bg-arc-500/10 transition-all"
            onClick={() => {
              // Export project
              addNotification({
                type: 'info',
                title: 'Export Project',
                message: `Exporting "${project.name}"...`
              })
            }}
          >
            <Download size={12} />
          </button>
        </div>

        {/* Updated Time */}
        <div className="flex items-center gap-1 text-white/30">
          <Clock size={10} />
          <span className="text-[10px]">
            {new Date(project.updatedAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-arc-500/10">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-full bg-arc-500/5 text-arc-500/70 text-[10px] font-mono"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-[10px] text-white/30">+{project.tags.length - 3}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT DETAIL PANEL
// ═══════════════════════════════════════════════════════════════════════════

const ProjectDetailPanel = ({ 
  project, 
  onClose, 
  onSave, 
  onEdit, 
  onDelete, 
  isEditing = false 
}) => {
  const [editableProject, setEditableProject] = useState(project);
  
  // Update local state when project prop changes
  useEffect(() => {
    setEditableProject(project);
  }, [project]);

  const handleChange = (field, value) => {
    setEditableProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(editableProject);
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    handleChange('tags', tags);
  };

  if (!project) return null;

  const categoryIcons = {
    energy: Zap,
    interface: Cpu,
    security: Shield,
    weapons: Target,
    research: Microscope,
    other: Box
  }

  const CategoryIcon = categoryIcons[project.category] || categoryIcons.other

  return (
    <motion.div
      className="hud-panel-angled p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-arc-500/10 border border-arc-500/20 flex items-center justify-center">
            <CategoryIcon size={28} className="text-arc-500" />
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editableProject.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-stark-dark/50 border-b border-arc-500/50 text-xl font-display font-bold text-white mb-1 focus:outline-none focus:border-arc-500"
              />
            ) : (
              <h2 className="text-xl font-display font-bold text-white mb-1">
                {project.name}
              </h2>
            )}
            <p className="text-sm text-white/40">Project ID: {project.id}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-arc-500/10 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-2">
          Description
        </h3>
        {isEditing ? (
          <textarea
            value={editableProject.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full h-24 p-2 bg-stark-dark/50 border border-arc-500/50 rounded text-sm text-white/70 focus:outline-none focus:border-arc-500"
          />
        ) : (
          <p className="text-sm text-white/70 leading-relaxed">
            {project.description || 'No description provided.'}
          </p>
        )}
      </div>

      {/* Status Section */}
      <div className="mb-6">
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-3">
          Status
        </h3>
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-white/60 mb-1">Status</label>
              <select
                value={editableProject.status || 'planning'}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full p-2 bg-stark-dark/50 border border-arc-500/50 rounded text-sm text-white focus:outline-none focus:border-arc-500"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Priority</label>
              <select
                value={editableProject.priority || 'medium'}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full p-2 bg-stark-dark/50 border border-arc-500/50 rounded text-sm text-white focus:outline-none focus:border-arc-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Category</label>
              <select
                value={editableProject.category || 'other'}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full p-2 bg-stark-dark/50 border border-arc-500/50 rounded text-sm text-white focus:outline-none focus:border-arc-500"
              >
                <option value="energy">Energy</option>
                <option value="interface">Interface</option>
                <option value="security">Security</option>
                <option value="weapons">Weapons</option>
                <option value="research">Research</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Status</span>
              <span className="px-2 py-1 rounded text-xs font-medium capitalize" style={{
                backgroundColor: 
                  project.status === 'completed' ? 'rgba(34, 197, 94, 0.1)' :
                  project.status === 'in-progress' ? 'rgba(59, 130, 246, 0.1)' :
                  project.status === 'on-hold' ? 'rgba(245, 158, 11, 0.1)' :
                  'rgba(107, 114, 128, 0.1)',
                color: 
                  project.status === 'completed' ? 'rgb(34, 197, 94)' :
                  project.status === 'in-progress' ? 'rgb(59, 130, 246)' :
                  project.status === 'on-hold' ? 'rgb(245, 158, 11)' :
                  'rgb(107, 114, 128)'
              }}>
                {project.status.replace('-', ' ')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Priority</span>
              <span className="px-2 py-1 rounded text-xs font-medium capitalize" style={{
                backgroundColor: 
                  project.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' :
                  project.priority === 'medium' ? 'rgba(245, 158, 11, 0.1)' :
                  project.priority === 'critical' ? 'rgba(220, 38, 38, 0.1)' :
                  'rgba(107, 114, 128, 0.1)',
                color: 
                  project.priority === 'high' ? 'rgb(239, 68, 68)' :
                  project.priority === 'medium' ? 'rgb(245, 158, 11)' :
                  project.priority === 'critical' ? 'rgb(220, 38, 38)' :
                  'rgb(107, 114, 128)'
              }}>
                {project.priority}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Category</span>
              <span className="px-2 py-1 rounded text-xs font-medium text-arc-400 bg-arc-500/10">
                {project.category}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-3">
          Progress
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Completion</span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editableProject.progress || 0}
                  onChange={(e) => handleChange('progress', parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm font-mono text-white w-10 text-right">
                  {editableProject.progress}%
                </span>
              </div>
            ) : (
              <span className="text-lg font-mono text-white">{project.progress}%</span>
            )}
          </div>
          <div className="h-3 bg-stark-light rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-arc-500 via-jarvis-500 to-arc-600 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${isEditing ? (editableProject.progress || 0) : project.progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-6">
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-3">
          Milestones
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Research Phase', progress: 100, status: 'completed' },
            { label: 'Prototype Development', progress: project.progress, status: 'in-progress' },
            { label: 'Testing & Validation', progress: Math.max(0, project.progress - 30), status: project.progress > 70 ? 'in-progress' : 'pending' },
            { label: 'Production Ready', progress: Math.max(0, project.progress - 70), status: project.progress >= 100 ? 'completed' : 'pending' }
          ].map((milestone, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg bg-stark-light/20 border border-arc-500/5"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                milestone.status === 'completed' ? 'bg-green-400/20 text-green-400' :
                milestone.status === 'in-progress' ? 'bg-arc-500/20 text-arc-400' :
                'bg-white/5 text-white/30'
              }`}>
                {milestone.status === 'completed' ? (
                  <CheckCircle size={12} />
                ) : milestone.status === 'in-progress' ? (
                  <Activity size={12} className="animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current opacity-30" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/70">{milestone.label}</p>
              </div>
              <span className="text-xs font-mono text-white/40">{milestone.progress}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-stark-light/20 border border-arc-500/5">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={12} className="text-arc-500/70" />
            <span className="text-xs text-white/40">Created</span>
          </div>
          <p className="text-sm text-white">
            {new Date(project.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-stark-light/20 border border-arc-500/5">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={12} className="text-arc-500/70" />
            <span className="text-xs text-white/40">Updated</span>
          </div>
          <p className="text-sm text-white">
            {new Date(project.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-3">
          Tags
        </h3>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editableProject.tags?.join(', ') || ''}
              onChange={handleTagChange}
              className="w-full p-2 bg-stark-dark/50 border border-arc-500/50 rounded text-sm text-white focus:outline-none focus:border-arc-500"
              placeholder="Enter tags separated by commas"
            />
            <p className="mt-1 text-xs text-white/40">Separate tags with commas</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {project.tags && project.tags.length > 0 ? (
              project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-arc-500/10 border border-arc-500/20 text-arc-400 text-xs font-mono"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-white/40">No tags</span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6 pt-6 border-t border-arc-500/10">
        {isEditing ? (
          <>
            <button 
              onClick={handleSave}
              className="flex-1 hud-button hud-button-primary"
            >
              <Save size={14} />
              Save Changes
            </button>
            <button 
              onClick={onClose}
              className="flex-1 hud-button"
            >
              <X size={14} />
              Cancel
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={onEdit}
              className="flex-1 hud-button hud-button-primary"
            >
              <Edit size={14} />
              Edit Project
            </button>
            <button 
              onClick={onDelete}
              className="flex-1 hud-button bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 hover:border-red-500/40"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FILTER PANEL
// ═══════════════════════════════════════════════════════════════════════════

const FilterPanel = ({ filters, onFilterChange }) => {
  return (
    <div className="hud-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={16} className="text-arc-500" />
        <h3 className="text-sm font-display font-semibold text-white">Filters</h3>
      </div>

      <div className="space-y-4">
        {/* Status Filter */}
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
            Status
          </label>
          <div className="space-y-1">
            {['all', 'planning', 'in-progress', 'testing', 'completed'].map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-arc-500/5 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={filters.status === status}
                  onChange={(e) => onFilterChange('status', e.target.value)}
                  className="w-3 h-3"
                />
                <span className="text-sm text-white/70 capitalize">{status.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
            Priority
          </label>
          <div className="space-y-1">
            {['all', 'low', 'medium', 'high', 'critical'].map((priority) => (
              <label
                key={priority}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-arc-500/5 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  checked={filters.priority === priority}
                  onChange={(e) => onFilterChange('priority', e.target.value)}
                  className="w-3 h-3"
                />
                <span className="text-sm text-white/70 capitalize">{priority}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
            Category
          </label>
          <div className="space-y-1">
            {['all', 'energy', 'interface', 'security', 'weapons', 'research'].map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-arc-500/5 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => onFilterChange('category', e.target.value)}
                  className="w-3 h-3"
                />
                <span className="text-sm text-white/70 capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN R&D LAB COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function RnDLab() {
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject, 
    toggleFavorite, 
    duplicateProject 
  } = useProjectsStore()
  const { addNotification } = useSystemStore()
  
  const [selectedProject, setSelectedProject] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  })
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [sortBy, setSortBy] = useState('updated') // 'name' | 'created' | 'updated' | 'progress'

  // Enhanced Project Creation
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category: 'other',
    priority: 'medium',
    status: 'planning',
    tags: []
  })

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      addNotification({
        type: 'warning',
        title: 'Validation Error',
        message: 'Project name is required'
      })
      return
    }
    
    const projectData = {
      ...newProject,
      id: `PRJ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0
    }
    
    addProject(projectData)
    addNotification({
      type: 'success',
        title: 'Project Created',
        message: `Project "${newProject.name}" has been created`
    })
    
    // Reset form
    setNewProject({
      name: '',
      description: '',
      category: 'other',
      priority: 'medium',
      status: 'planning',
      tags: []
    })
    setShowNewProjectModal(false)
  }

  const handleUpdateProject = (projectId, updates) => {
    updateProject(projectId, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
    addNotification({
      type: 'success',
      title: 'Project Updated',
      message: `Project "${updates.name || 'Untitled'}" has been updated`
    })
    setEditingProject(null)
    
    // Update the selected project in the UI
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({
        ...selectedProject,
        ...updates,
        updatedAt: new Date().toISOString()
      })
    }
  }

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId)
      addNotification({
        type: 'warning',
        title: 'Project Deleted',
        message: 'Project has been deleted'
      })
      if (selectedProject?.id === projectId) {
        setSelectedProject(null)
      }
    }
  }

  // Filter and search projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filters.status === 'all' || project.status === filters.status
    const matchesPriority = filters.priority === 'all' || project.priority === filters.priority
    const matchesCategory = filters.category === 'all' || project.category === filters.category

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  // Stats
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    avgProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleNewProject = () => {
    setShowNewProjectModal(true)
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-2">
            R&D Laboratory
          </h1>
          <p className="text-white/50">
            Research & Development Projects - Innovation Hub
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="hud-button hud-button-primary flex items-center gap-2"
          >
            <Plus size={16} />
            New Project
          </button>
          
          <button
            onClick={() => {
              // Import projects
              addNotification({
                type: 'info',
                title: 'Import Projects',
                message: 'Import functionality coming soon...'
              })
            }}
            className="hud-button flex items-center gap-2"
          >
            <Upload size={16} />
            Import
          </button>
          
          <button
            onClick={() => {
              // Export projects
              addNotification({
                type: 'info',
                title: 'Export Projects',
                message: 'Exporting all projects...'
              })
            }}
            className="hud-button flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={FlaskConical}
          label="Total Projects"
          value={stats.total}
          color="arc"
        />
        <StatsCard
          icon={Activity}
          label="Active Projects"
          value={stats.active}
          trend={12}
          color="green"
        />
        <StatsCard
          icon={CheckCircle}
          label="Completed"
          value={stats.completed}
          trend={5}
          color="purple"
        />
        <StatsCard
          icon={BarChart3}
          label="Avg Progress"
          value={`${stats.avgProgress}%`}
          trend={8}
          color="yellow"
        />
      </div>

      {/* Enhanced Search & View Controls */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-stark-light/30 border border-arc-500/10 text-white text-sm placeholder-white/30 focus:border-arc-500/30 focus:outline-none transition-colors"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => {}}
            className="flex items-center gap-2 p-2 rounded-lg bg-stark-light/30 border border-arc-500/10 text-white/60 hover:text-white hover:bg-arc-500/10 transition-colors"
          >
            <BarChart3 size={16} />
            <span className="text-sm">Sort: {sortBy}</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-stark-light/30 border border-arc-500/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-arc-500/20 text-arc-400'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <Grid3x3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-arc-500/20 text-arc-400'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </motion.div>

      {/* New Project Modal */
      <AnimatePresence>
        {showNewProjectModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="hud-panel-angled w-full max-w-2xl mx-4 p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-white">
                  Create New Project
                </h2>
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-arc-500/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-stark-light/30 border border-arc-500/10 text-white text-sm placeholder-white/30 focus:border-arc-500/30 focus:outline-none transition-colors"
                    placeholder="Enter project name..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-stark-light/30 border border-arc-500/10 text-white text-sm placeholder-white/30 focus:border-arc-500/30 focus:outline-none transition-colors resize-none"
                    rows={3}
                    placeholder="Describe your project..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Category
                    </label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-stark-light/30 border border-arc-500/10 text-white text-sm focus:border-arc-500/30 focus:outline-none transition-colors"
                    >
                      <option value="other">Other</option>
                      <option value="energy">Energy</option>
                      <option value="interface">Interface</option>
                      <option value="security">Security</option>
                      <option value="weapons">Weapons</option>
                      <option value="research">Research</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Priority
                    </label>
                    <select
                      value={newProject.priority}
                      onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-stark-light/30 border border-arc-500/10 text-white text-sm focus:border-arc-500/30 focus:outline-none transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Status
                  </label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-stark-light/30 border border-arc-500/10 text-white text-sm focus:border-arc-500/30 focus:outline-none transition-colors"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="testing">Testing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newProject.tags.join(', ')}
                  onChange={(e) => setNewProject(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) }))}
                  className="w-full px-3 py-2.5 rounded-lg bg-stark-light/30 border border-arc-500/10 text-white text-sm placeholder-white/30 focus:border-arc-500/30 focus:outline-none transition-colors"
                  placeholder="react, ai, javascript, web-dev"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-red-400/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-arc-500/20 text-arc-400 hover:bg-arc-500/30 transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  Create Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
}
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Projects Grid/List */}
        <div className={`lg:col-span-${selectedProject ? '2' : '3'}`}>
          {filteredProjects.length === 0 ? (
            <motion.div
              className="hud-panel-angled p-12 text-center"
              variants={itemVariants}
            >
              <FlaskConical size={48} className="text-arc-500/30 mx-auto mb-4" />
              <h3 className="text-lg font-display text-white/70 mb-2">No Projects Found</h3>
              <p className="text-sm text-white/40">
                {searchQuery || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Start by creating a new project'}
              </p>
            </motion.div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={setSelectedProject}
                  isSelected={selectedProject?.id === project.id}
                  onEdit={(p) => {
                    setSelectedProject(p)
                    setEditingProject(p)
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Project Detail Panel */}
        <AnimatePresence>
          {selectedProject && (
            <div className="lg:col-span-1">
              <ProjectDetailPanel
                project={editingProject || selectedProject}
                onClose={() => {
                  if (editingProject) {
                    setEditingProject(null)
                  } else {
                    setSelectedProject(null)
                  }
                }}
                onSave={(updatedProject) => {
                  handleUpdateProject(selectedProject.id, updatedProject)
                }}
                onEdit={() => setEditingProject({ ...selectedProject })}
                onDelete={() => handleDeleteProject(selectedProject.id)}
                isEditing={!!editingProject}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
export default RnDLab;
