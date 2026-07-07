// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// Tony Mode - Personal Interface & Quick Commands
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Zap,
  Terminal,
  MessageSquare,
  FileText,
  Star,
  Clock,
  Calendar,
  Bookmark,
  Command,
  Lightbulb,
  Target,
  TrendingUp,
  Activity,
  Coffee,
  Music,
  Settings,
  Edit,
  Plus
} from 'lucide-react'

import { useSystemStore, useAIStore } from '../../stores/systemStore'

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

const QuickCommandCard = ({ icon: Icon, label, description, onClick, shortcut = null }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      className="hud-panel p-4 text-left w-full hover:border-arc-500/30 transition-all group relative overflow-hidden"
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-arc-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10 flex items-start gap-3">
        <motion.div 
          className="w-10 h-10 rounded-lg bg-arc-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-arc-500/20 transition-colors"
          animate={isHovered ? { rotate: 5 } : { rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <Icon size={18} className="text-arc-400 group-hover:text-arc-300 transition-colors" />
        </motion.div>
        <div>
          <h4 className="text-sm font-medium text-white mb-1 group-hover:text-arc-300 transition-colors">
            {label}
            <motion.span 
              className="inline-block ml-2 text-arc-500 opacity-0 group-hover:opacity-100"
              initial={{ x: -10 }}
              animate={isHovered ? { x: 0 } : { x: -10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              →
            </motion.span>
          </h4>
          <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{description}</p>
          {shortcut && (
            <p className="text-xs text-white/30 mt-1">{shortcut}</p>
          )}
        </div>
      </div>
    </motion.button>
  )
}

function TonyMode() {
  const { user, currentTime } = useSystemStore()
  const { openChat, sendMessage } = useAIStore()
  
  // Module navigation using URL hash and custom events
  const navigateToModule = (moduleName) => {
    try {
      // Update URL hash
      if (window.location) {
        // Remove any existing hash change listener to prevent duplicates
        window.removeEventListener('hashchange', handleHashChange);
        
        // Update URL
        window.location.hash = `#/${moduleName}`;
        
        // Add new hash change listener
        window.addEventListener('hashchange', handleHashChange);
      }
      
      // Emit custom event for parent components
      const event = new CustomEvent('moduleChange', { 
        detail: { module: moduleName }
      });
      window.dispatchEvent(event);
      
      // For development
      console.log(`Navigating to module: ${moduleName}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  
  // Handle browser back/forward navigation
  const handleHashChange = () => {
    const moduleName = window.location.hash.replace(/^#\//, '');
    if (moduleName) {
      console.log('Hash changed to:', moduleName);
      // Emit the module change event
      const event = new CustomEvent('moduleChange', { 
        detail: { module: moduleName }
      });
      window.dispatchEvent(event);
    }
  };
  
  // Set up initial hash change listener
  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(true)
  const [note, setNote] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [activeNoteTab, setActiveNoteTab] = useState('notes')
  const [isProcessing, setIsProcessing] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    cpu: 0.32,
    memory: 0.68,
    storage: 0.45,
    network: 0.12
  })
  
  // Initialize component
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Load saved note
    const savedNote = localStorage.getItem('tonyModeNote');
    if (savedNote) setNote(savedNote);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Sample projects data
  const [projects, setProjects] = useState([
    { id: 1, name: 'Arc Reactor 2.0', status: 'in-progress', progress: 75 },
    { id: 2, name: 'J.A.R.V.I.S AI', status: 'active', progress: 90 },
    { id: 3, name: 'Mark 85 Suit', status: 'planning', progress: 20 },
  ])
  
  // Sample notes
  const [savedNotes, setSavedNotes] = useState([
    { id: 1, title: 'Meeting with Pepper', content: 'Discuss Q2 financials and new R&D budget', date: '2023-06-15' },
    { id: 2, title: 'Suit Upgrades', content: 'New repulsor tech needs testing', date: '2023-06-10' },
  ])
  
  // Sample recent files
  const [recentFiles, setRecentFiles] = useState([
    { id: 1, name: 'ArcReactorSpecs.pdf', type: 'pdf', lastOpened: '2 hours ago' },
    { id: 2, name: 'JARVIS_AI_Model_v4.2', type: 'ai', lastOpened: '5 hours ago' },
    { id: 3, name: 'StarkExpo_Presentation', type: 'ppt', lastOpened: '1 day ago' },
  ])

  const quickCommands = [
    {
      icon: MessageSquare,
      label: 'Talk to J.A.R.V.I.S',
      description: 'Open AI chat interface',
      onClick: () => {
        if (typeof openChat === 'function') {
          openChat();
        } else if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('openChat'));
        }
      },
      shortcut: '⌘J',
      category: 'ai'
    },
    {
      icon: Terminal,
      label: 'Command Terminal',
      description: 'Execute system commands',
      onClick: () => navigateToModule('terminal'),
      shortcut: '⌘T',
      category: 'system'
    },
    {
      icon: FileText,
      label: 'New Note',
      description: 'Create a new note',
      onClick: () => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.focus();
          setNote('');
        }
      },
      shortcut: '⌘N',
      category: 'productivity'
    },
    {
      icon: Activity,
      label: 'System Status',
      description: 'View all system metrics',
      onClick: () => setActiveTab(prev => prev === 'status' ? 'all' : 'status'),
      shortcut: '⌘S',
      category: 'system'
    },
    {
      icon: Target,
      label: 'Project Overview',
      description: 'See active projects',
      onClick: () => setActiveTab('projects'),
      shortcut: '⌘P',
      category: 'projects'
    },
    {
      icon: Lightbulb,
      label: 'Ideas & Notes',
      description: 'Access scratchpad',
      onClick: () => setActiveTab('notes'),
      shortcut: '⌘I',
      category: 'productivity'
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'System preferences',
      onClick: () => navigateToModule('settings'),
      shortcut: '⌘,',
      category: 'system'
    },
    {
      icon: User,
      label: 'User Profile',
      description: 'View and edit profile',
      onClick: () => navigateToModule('profile'),
      shortcut: '⌘U',
      category: 'user'
    },
    {
      icon: Zap,
      label: 'Quick Actions',
      description: 'Perform quick actions',
      onClick: () => {
        const input = document.querySelector('input[placeholder="Search or command..."]');
        if (input) {
          input.focus();
        }
      },
      shortcut: '⌘K',
      category: 'system'
    }
  ]

  const recentActivities = [
    { icon: FileText, action: 'Reviewed Arc Reactor specs', time: '10 minutes ago' },
    { icon: MessageSquare, action: 'Chat with J.A.R.V.I.S', time: '25 minutes ago' },
    { icon: Terminal, action: 'Ran system diagnostics', time: '1 hour ago' },
    { icon: Settings, action: 'Updated system preferences', time: '2 hours ago' }
  ]

  const shortcuts = [
    { keys: ['⌘', 'K'], action: 'Command Palette' },
    { keys: ['⌘', 'J'], action: 'AI Chat' },
    { keys: ['⌘', 'N'], action: 'New Note' },
    { keys: ['⌘', 'P'], action: 'Quick Search' }
  ]

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger if not typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // Allow basic text editing shortcuts
        if (!e.metaKey && !e.ctrlKey) return;
        if (['a', 'c', 'v', 'x', 'z', 'y'].includes(e.key.toLowerCase())) {
          return;
        }
      }

      // Global shortcuts (work anywhere)
      if (e.metaKey || e.ctrlKey) {
        const key = e.key.toLowerCase();
        const command = quickCommands.find(cmd => 
          cmd.shortcut && cmd.shortcut.toLowerCase().includes(key)
        );
        
        if (command) {
          e.preventDefault();
          command.onClick();
          return;
        }

        // Additional global shortcuts
        switch (key) {
          case 'k':
            e.preventDefault();
            document.querySelector('input[placeholder="Search or command..."]')?.focus();
            break;
          case 's':
            e.preventDefault();
            if (note.trim()) {
              saveNote();
            }
            break;
          case 'f':
            e.preventDefault();
            document.querySelector('input[placeholder="Search or command..."]')?.focus();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openChat, note, quickCommands]);
  
  // Save note function
  const saveNote = () => {
    if (!note.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newNote = {
        id: Date.now(),
        title: note.split('\n')[0].substring(0, 50) || 'Untitled Note',
        content: note,
        date: new Date().toISOString().split('T')[0]
      };
      
      setSavedNotes(prev => [newNote, ...prev]);
      setNote('');
      setIsProcessing(false);
      
      // Show success feedback
      showToast('Note saved successfully', 'success');
    }, 500);
  };
  
  // Show toast notification
  const showToast = (message, type = 'info') => {
    // In a real app, you'd use a toast library or context
    console.log(`${type.toUpperCase()}: ${message}`);
    // For now, we'll just log to console
  };
  
  // Process AI command
  const processAICommand = async (command) => {
    setIsProcessing(true);
    try {
      const response = await sendMessage(command);
      // Handle AI response
      console.log('AI Response:', response);
      showToast('AI command processed', 'success');
    } catch (error) {
      console.error('AI Command Error:', error);
      showToast('Failed to process AI command', 'error');
    }
    setIsProcessing(false);
  };
  
  // Filter commands based on search and active tab
  const filteredCommands = quickCommands.filter(cmd => {
    const matchesSearch = cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         cmd.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || cmd.category === activeTab;
    return matchesSearch && matchesTab;
  });

  // Auto-save note
  useEffect(() => {
    if (note) {
      const timer = setTimeout(() => {
        localStorage.setItem('tonyModeNote', note);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [note]);

  // Load saved note
  useEffect(() => {
    const savedNote = localStorage.getItem('tonyModeNote');
    if (savedNote) setNote(savedNote);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stark-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-arc-500/30 border-t-arc-500 rounded-full animate-spin"></div>
          <p className="text-arc-300 font-mono text-sm">INITIALIZING TONY MODE...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-stark-dark p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with Search and User Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2 hud-panel p-4 flex items-center"
        >
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-arc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 bg-stark-light/20 border border-arc-500/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-arc-500/50 focus:border-arc-500/50 transition-all duration-200"
              placeholder="Search commands, notes, or ask J.A.R.V.I.S... (⌘K to focus)"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  if (searchQuery.startsWith('/')) {
                    processAICommand(searchQuery.slice(1));
                  } else {
                    // Fallback search
                    console.log('Searching for:', searchQuery);
                  }
                }
              }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <kbd className="px-2 py-1 text-xs rounded bg-arc-500/20 text-arc-300 border border-arc-500/30">⌘K</kbd>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="hud-panel p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-arc-500/30 to-jarvis-500/30 border border-arc-500/30 flex items-center justify-center">
                <span className="text-xl font-bold text-arc-300">TS</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-stark-dark"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-display font-bold text-white">
                {user.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider
                  ${user.clearanceLevel === 'OMEGA' ? 'bg-arc-500/10 text-arc-300 border border-arc-500/20' : ''}
                `}>
                  {user.clearanceLevel}
                </span>
                <span className="text-xs text-white/50">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            <div className="h-8 w-px bg-arc-500/20"></div>
            <button className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-arc-500/10 transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Commands with Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.h2 
            variants={itemVariants}
            className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider"
          >
            Quick Commands
          </motion.h2>
          
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex rounded-lg bg-stark-light/10 p-1">
              {['all', 'ai', 'system', 'productivity', 'projects', 'user'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-arc-500/20 text-arc-300'
                      : 'text-white/50 hover:bg-stark-light/20 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => (
              <QuickCommandCard 
                key={cmd.label} 
                {...cmd} 
                shortcut={cmd.shortcut}
              />
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-white/50">
              <p>No commands found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scratchpad */}
        <motion.div
          className="lg:col-span-2 hud-panel p-6 flex flex-col"
          variants={itemVariants}
        >
          <div className="flex border-b border-arc-500/10 mb-2">
            <button 
              onClick={() => setActiveNoteTab('notes')}
              className={`px-4 py-2 text-sm font-medium ${activeNoteTab === 'notes' ? 'text-arc-300 border-b-2 border-arc-500' : 'text-white/50 hover:text-white'}`}
            >
              Quick Notes
            </button>
            <button 
              onClick={() => setActiveNoteTab('saved')}
              className={`px-4 py-2 text-sm font-medium ${activeNoteTab === 'saved' ? 'text-arc-300 border-b-2 border-arc-500' : 'text-white/50 hover:text-white'}`}
            >
              Saved Notes
            </button>
            <button 
              onClick={() => setActiveNoteTab('files')}
              className={`px-4 py-2 text-sm font-medium ${activeNoteTab === 'files' ? 'text-arc-300 border-b-2 border-arc-500' : 'text-white/50 hover:text-white'}`}
            >
              Recent Files
            </button>
          </div>
          
          {activeNoteTab === 'notes' ? (
            <>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                    e.preventDefault();
                    saveNote();
                  }
                }}
                placeholder="Type your thoughts, ideas, or commands here... (⌘S to save, ⌘N for new note)"
                className="w-full h-full p-4 rounded-b-lg bg-stark-light/10 border border-arc-500/10 text-white text-sm placeholder-white/30 resize-none focus:border-arc-500/30 focus:outline-none transition-all duration-200 font-mono backdrop-blur-sm"
                style={{ minHeight: '200px' }}
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => setNote('')}
                  disabled={!note.trim()}
                  className="px-3 py-1 text-xs rounded bg-stark-light/10 text-white/60 hover:bg-stark-light/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={saveNote}
                  disabled={!note.trim() || isProcessing}
                  className="px-3 py-1 text-xs rounded bg-arc-500/90 text-white hover:bg-arc-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  {isProcessing ? 'Saving...' : 'Save Note'}
                  {isProcessing && <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                </button>
              </div>
            </>
          ) : activeNoteTab === 'saved' ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {savedNotes.length > 0 ? (
                savedNotes.map((savedNote) => (
                  <div 
                    key={savedNote.id}
                    className="p-3 rounded-lg bg-stark-light/5 hover:bg-stark-light/10 border border-arc-500/5 cursor-pointer transition-colors"
                    onClick={() => setNote(savedNote.content)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-white/90">{savedNote.title}</h4>
                      <span className="text-xs text-white/30">{savedNote.date}</span>
                    </div>
                    <p className="text-sm text-white/60 mt-1 line-clamp-2">
                      {savedNote.content.replace(/^#+\s*/, '').split('\n')[0]}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/40">
                  <p>No saved notes yet.</p>
                  <p className="text-xs mt-1">Create a note and save it to see it here.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {recentFiles.map((file, index) => (
                <div key={index} className="p-2 rounded-lg hover:bg-stark-light/10 cursor-pointer">
                  <p className="text-sm text-white/80">{file.name}</p>
                  <p className="text-xs text-white/30">{file.path}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="hud-panel p-6"
          variants={itemVariants}
        >
          <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
            Recent Activity
          </h3>

          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-stark-light/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-arc-500/10 flex items-center justify-center flex-shrink-0">
                  <activity.icon size={14} className="text-arc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70">{activity.action}</p>
                  <p className="text-xs text-white/30">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Keyboard Shortcuts */}
      <motion.div
        className="hud-panel p-6"
        variants={itemVariants}
      >
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
          Keyboard Shortcuts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-stark-light/20 border border-arc-500/10"
            >
              <span className="text-sm text-white/60">{shortcut.action}</span>
              <div className="flex items-center space-x-2">
                {shortcut.keys.map((key, i) => (
                  <React.Fragment key={i}>
                    <kbd className="px-2 py-1 rounded bg-stark-dark border border-arc-500/20 text-xs font-mono text-arc-500">
                      {key}
                    </kbd>
                    {i < shortcut.keys.length - 1 && <span className="text-white/30">+</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TonyMode