// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// AI Core Panel - J.A.R.V.I.S Neural Interface (VOICE ENABLED)
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Send,
  Mic,
  MicOff,
  Settings,
  Trash2,
  Plus,
  MessageSquare,
  Sparkles,
  Activity,
  Cpu,
  HardDrive,
  Bot,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  Copy,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Lightbulb,
  Code,
  FileText,
  Search,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react'

// Stores
import { useAIStore, useSystemStore } from '../../stores/systemStore'

// Gemini AI Service
import { 
  initializeGemini, 
  sendMessage as sendGeminiMessage, 
  startNewChat,
  resetChat,
  isConfigured,
  setApiKey,
  setProvider,
  getAIStatus 
} from '../../ai/aiController'

// Charts
import { AIActivityChart, ResourceDistributionChart } from '../../components/charts'

// Toast Notifications
import { toast } from '../../components/ui/Toast'

// Fullscreen Component
import { SimpleFullscreenButton } from '../../components/ui/SimpleFullscreenButton'

// Voice Service
import voiceService from '../../services/voiceService'

import JarvisCore3D from './components/JarvisCore3D';
import AdvancedVoiceVisualizer from './components/AdvancedVoiceVisualizer';
import SciFiDataPanel from './components/SciFiDataPanel';

// ═══════════════════════════════════════════════════════════════════════════
// AI STATUS PANEL
// ═══════════════════════════════════════════════════════════════════════════

const AIStatusPanel = ({ isGeminiConfigured, isListening, isSpeaking }) => {
  const { aiStatus, aiName, aiVersion } = useAIStore()
  const { metrics } = useSystemStore()

  const getStatusInfo = () => {
    if (isListening) return { color: 'purple', label: 'Listening' }
    if (isSpeaking) return { color: 'cyan', label: 'Speaking' }
    
    switch(aiStatus) {
      case 'processing': return { color: 'yellow', label: 'Processing' }
      case 'listening': return { color: 'green', label: 'Listening' }
      case 'error': return { color: 'red', label: 'Error' }
      default: return { color: 'arc', label: 'Standing By' }
    }
  }

  const status = getStatusInfo()

  // Voice Selection State
  const [availableVoices, setAvailableVoices] = useState([])
  const [selectedVoiceName, setSelectedVoiceName] = useState('')

  useEffect(() => {
    const loadVoices = () => {
      if (voiceService.isSupported) {
        const voices = voiceService.getAvailableVoices()
        setAvailableVoices(voices)
        if (voiceService.selectedVoice) {
          setSelectedVoiceName(voiceService.selectedVoice.name)
        }
      }
    }
    
    setTimeout(loadVoices, 1000)
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const handleVoiceChange = (e) => {
    const name = e.target.value
    if (voiceService.setVoice(name)) {
      setSelectedVoiceName(name)
      toast.success('Voice Setup', `JARVIS voice changed to ${name}`)
    }
  }

  // API Key State
  const [activeProviderState, setActiveProviderState] = useState(localStorage.getItem('stark_ai_provider') || 'gemini')
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [isConfiguredLocal, setIsConfiguredLocal] = useState(isGeminiConfigured)
  const [showSettings, setShowSettings] = useState(!isGeminiConfigured)

  useEffect(() => {
    setIsConfiguredLocal(isGeminiConfigured)
  }, [isGeminiConfigured])

  const handleProviderChange = (e) => {
    const newProvider = e.target.value
    setActiveProviderState(newProvider)
    setProvider(newProvider)
    setIsConfiguredLocal(isConfigured())
    setShowSettings(true)
  }

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim().length > 20 || activeProviderState !== 'gemini') {
      const success = setApiKey(apiKeyInput.trim())
      if (success || isConfigured()) {
        setIsConfiguredLocal(true)
        toast.success('System Online', `${activeProviderState.toUpperCase()} AI Core is now connected.`)
        setApiKeyInput('')
        setShowSettings(false)
      } else {
        toast.error('Connection Failed', 'Invalid API Key provided.')
      }
    }
  }

  return (
    <div className="hud-panel p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-arc-500/20 to-blue-500/20 border border-arc-500/30 flex items-center justify-center">
              <Brain size={28} className="text-arc-400" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-stark-dark
              ${status.color === 'arc' ? 'bg-arc-500' : ''}
              ${status.color === 'green' ? 'bg-green-400' : ''}
              ${status.color === 'purple' ? 'bg-purple-400 animate-pulse' : ''}
              ${status.color === 'cyan' ? 'bg-cyan-400 animate-pulse' : ''}
              ${status.color === 'yellow' ? 'bg-yellow-400 animate-pulse' : ''}
              ${status.color === 'red' ? 'bg-red-400' : ''}
            `} />
          </div>
          
          <div>
            <h2 className="text-xl font-display font-bold text-white">{aiName}</h2>
            <p className="text-xs text-white/40">Version {aiVersion}</p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-2
          ${status.color === 'arc' ? 'bg-arc-500/10 text-arc-400 border border-arc-500/20' : ''}
          ${status.color === 'green' ? 'bg-green-400/10 text-green-400 border border-green-400/20' : ''}
          ${status.color === 'purple' ? 'bg-purple-400/10 text-purple-400 border border-purple-400/20' : ''}
          ${status.color === 'cyan' ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' : ''}
          ${status.color === 'yellow' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : ''}
          ${status.color === 'red' ? 'bg-red-400/10 text-red-400 border border-red-400/20' : ''}
        `}>
          {aiStatus === 'processing' && <Loader2 size={12} className="animate-spin" />}
          {isListening && <Mic size={12} />}
          {isSpeaking && <Volume2 size={12} />}
          {status.label}
        </div>
      </div>

      {/* API Status */}
      <div className={`mb-4 p-3 rounded-lg flex flex-col gap-3 transition-colors ${
        isConfiguredLocal 
          ? 'bg-green-400/10 border border-green-400/20' 
          : 'bg-yellow-400/10 border border-yellow-400/20'
      }`}>
        <div className="flex items-center gap-3">
          {isConfiguredLocal ? (
            <>
              <Wifi size={16} className="text-green-400" />
              <div className="flex-1">
                <p className="text-xs text-green-400 font-medium">{activeProviderState.toUpperCase()} AI Connected</p>
                <p className="text-[10px] text-green-400/60">Voice + Neural core operational</p>
              </div>
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="text-green-400/70 hover:text-green-400 p-1 transition-colors"
                title="Configure AI Provider"
              >
                 <Settings size={14} />
              </button>
            </>
          ) : (
            <>
              <WifiOff size={16} className="text-yellow-400" />
              <div className="flex-1">
                <p className="text-xs text-yellow-400 font-medium">Demo Mode Active</p>
                <p className="text-[10px] text-yellow-400/60">AI features are currently simulated</p>
              </div>
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="text-yellow-400/70 hover:text-yellow-400 p-1 transition-colors"
                title="Configure AI Provider"
              >
                 <Settings size={14} />
              </button>
            </>
          )}
        </div>
        
        {(!isConfiguredLocal || showSettings) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col gap-2 mt-1 pt-2 border-t border-white/10"
          >
            <label className="text-[10px] text-white/50 uppercase tracking-wider">AI Provider Configuration</label>
            <select
              value={activeProviderState}
              onChange={handleProviderChange}
              className={`bg-stark-dark/50 border text-white text-xs rounded p-1.5 outline-none w-full transition-colors
                ${isConfiguredLocal ? 'border-green-400/30 focus:border-green-400' : 'border-yellow-400/30 focus:border-yellow-400'}`}
            >
              <option value="gemini">Google Gemini (Default)</option>
              <option value="openai">OpenAI (ChatGPT)</option>
              <option value="groq">Groq (Llama-3)</option>
              <option value="anthropic">Anthropic (Claude)</option>
            </select>
            <div className="flex gap-2">
              <input 
                type="password" 
                placeholder={`Paste ${activeProviderState.toUpperCase()} API Key here...`}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className={`flex-1 bg-stark-dark/50 border text-white text-xs rounded p-1.5 outline-none transition-colors
                  ${isConfiguredLocal ? 'border-green-400/30 focus:border-green-400' : 'border-yellow-400/30 focus:border-yellow-400'}`}
              />
              <button 
                onClick={handleSaveApiKey}
                className={`text-xs px-3 rounded transition-colors
                  ${isConfiguredLocal ? 'bg-green-400/20 hover:bg-green-400/40 text-green-400' : 'bg-yellow-400/20 hover:bg-yellow-400/40 text-yellow-400'}`}
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 3D Neural Core Visualizer moved to Main HUD */}
      
      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <motion.div 
          className="p-3 rounded-lg bg-stark-light/30 border border-arc-500/10 text-center cursor-pointer hover:border-arc-500/30"
          whileHover={{ scale: 1.02 }}
          onClick={() => toast.ai('Neural Load', `Current AI processing load: ${metrics?.aiLoad || 0}%`)}
        >
          <Cpu size={16} className="text-arc-500/70 mx-auto mb-1" />
          <p className="text-lg font-mono text-white">{metrics?.aiLoad || 0}%</p>
          <p className="text-[10px] text-white/40">Neural Load</p>
        </motion.div>
        <motion.div 
          className="p-3 rounded-lg bg-stark-light/30 border border-arc-500/10 text-center cursor-pointer hover:border-arc-500/30"
          whileHover={{ scale: 1.02 }}
          onClick={() => toast.ai('Memory', 'AI memory allocation: 2.4GB of 8GB')}
        >
          <HardDrive size={16} className="text-arc-500/70 mx-auto mb-1" />
          <p className="text-lg font-mono text-white">2.4GB</p>
          <p className="text-[10px] text-white/40">Memory</p>
        </motion.div>
        <motion.div 
          className="p-3 rounded-lg bg-stark-light/30 border border-arc-500/10 text-center cursor-pointer hover:border-arc-500/30"
          whileHover={{ scale: 1.02 }}
          onClick={() => toast.success('Uptime', 'J.A.R.V.I.S has been online for 720 hours')}
        >
          <Activity size={16} className="text-arc-500/70 mx-auto mb-1" />
          <p className="text-lg font-mono text-white">99%</p>
          <p className="text-[10px] text-white/40">Uptime</p>
        </motion.div>
      </div>

      {/* Voice Selection Dropdown */}
      {availableVoices.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-stark-light/30 border border-arc-500/10">
          <label className="block text-[10px] text-white/50 mb-1">JARVIS VOICE PROFILE</label>
          <select 
            value={selectedVoiceName}
            onChange={handleVoiceChange}
            className="w-full bg-stark-dark/50 border border-arc-500/30 text-white text-xs rounded p-1.5 outline-none focus:border-arc-500"
          >
            {availableVoices.map((v, i) => (
              <option key={i} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAT MESSAGE
// ═══════════════════════════════════════════════════════════════════════════

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    toast.success('Copied!', 'Message copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSpeak = () => {
    voiceService.speak(message.content)
    toast.info('Speaking', 'Playing voice response...')
  }

  return (
    <motion.div 
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isUser ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-arc-500/20 border border-arc-500/30'}
      `}>
        {isUser ? <User size={14} className="text-blue-400" /> : <Bot size={14} className="text-arc-400" />}
      </div>

      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-3 rounded-lg ${
          isUser 
            ? 'bg-blue-500/10 border border-blue-500/20 text-white' 
            : 'bg-stark-light/50 border border-arc-500/10 text-white/90'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {message.isDemo && !isUser && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-arc-500/10">
              <Info size={10} className="text-yellow-400/60" />
              <span className="text-[10px] text-yellow-400/60">Demo response</span>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : ''}`}>
          <span className="text-[10px] text-white/30">
            {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && (
            <>
              {voiceService.isSupported && (
                <button onClick={handleSpeak} className="p-1 rounded text-white/30 hover:text-white/60" title="Speak message">
                  <Volume2 size={12} />
                </button>
              )}
              <button onClick={handleCopy} className="p-1 rounded text-white/30 hover:text-white/60" title="Copy message">
                {copied ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} />}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAT INTERFACE WITH VOICE
// ═══════════════════════════════════════════════════════════════════════════

const ChatInterface = ({ isGeminiConfigured, onVoiceStateChange }) => {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [interimTranscript, setInterimTranscript] = useState('')
  const messagesEndRef = useRef(null)
  
  const { 
    aiStatus, 
    setAIStatus, 
    conversations, 
    currentConversationId,
    createConversation,
    addMessage,
    getCurrentConversation,
    clearAllConversations
  } = useAIStore()

  const currentConversation = getCurrentConversation()
  const messages = currentConversation?.messages || []

  const quickPrompts = [
    { icon: Activity, label: 'System Status', prompt: 'Give me a detailed system status report' },
    { icon: Search, label: 'Analyze Data', prompt: 'Analyze the current project metrics and performance' },
    { icon: Lightbulb, label: 'Suggestions', prompt: 'What improvements would you suggest for the system?' },
    { icon: Code, label: 'Code Review', prompt: 'Help me review and optimize my code structure' }
  ]

  useEffect(() => {
    if (!voiceService.isSupported) {
      console.warn('[AI Core] Voice service not supported')
      return
    }

    console.log('[AI Core] Setting up voice service...')

    voiceService.onStart = () => {
      console.log('[AI Core] Voice recognition started')
      setIsListening(true)
      onVoiceStateChange?.({ listening: true, speaking: isSpeaking })
    }

    voiceService.onEnd = () => {
      console.log('[AI Core] Voice recognition ended')
      setIsListening(false)
      setInterimTranscript('')
      onVoiceStateChange?.({ listening: false, speaking: isSpeaking })
    }

    voiceService.onResult = (result) => {
      console.log('[AI Core] Voice result:', result)
      if (result.isFinal) {
        setInput(result.transcript)
        setInterimTranscript('')
        
        // Auto-send on voice input globally
        setTimeout(() => {
          if (result.transcript.trim()) {
            handleSend(result.transcript)
          }
        }, 1000)
      } else {
        setInterimTranscript(result.transcript)
      }
    }

    voiceService.onSpeechStart = () => {
      console.log('[AI Core] Speech synthesis started')
      setIsSpeaking(true)
      onVoiceStateChange?.({ listening: isListening, speaking: true })
    }

    voiceService.onSpeechEnd = () => {
      console.log('[AI Core] Speech synthesis ended')
      setIsSpeaking(false)
      onVoiceStateChange?.({ listening: isListening, speaking: false })
    }

    voiceService.onError = (error) => {
      console.error('[AI Core] Voice error:', error)
      toast.error('Voice Error', error.message)
    }

    return () => {
      console.log('[AI Core] Cleaning up voice service...')
      voiceService.stopListening()
      voiceService.stopSpeaking()
    }
  }, [])

  useEffect(() => {
    // Auto-scroll disabled globally per user request to keep 3D Core in view
    /*
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    */
  }, [messages])

  useEffect(() => {
    if (!currentConversationId) {
      createConversation('New Conversation')
    }
  }, [currentConversationId, createConversation])

  const handleSend = useCallback(async (voiceText = null) => {
    const userMessage = voiceText || input.trim()
    if (!userMessage || aiStatus === 'processing') return

    setInput('')
    setInterimTranscript('')

    addMessage(currentConversationId, {
      role: 'user',
      content: userMessage
    })

    setAIStatus('processing')
    setIsTyping(true)
    
    // Unlock audio context on mobile before the async operation
    if (voiceEnabled && voiceService.isSupported) {
      voiceService.unlockAudio()
    }

    try {
      const response = await sendGeminiMessage(userMessage)

      addMessage(currentConversationId, {
        role: 'assistant',
        content: response.content,
        isDemo: response.isDemo
      })
      
      // Speak response if voice is enabled and Gemini is configured
      if (voiceEnabled && isGeminiConfigured && voiceService.isSupported) {
        setTimeout(() => {
          voiceService.speak(response.content)
        }, 300)
      }
      
      toast.ai('J.A.R.V.I.S', 'Response generated')
    } catch (err) {
      addMessage(currentConversationId, {
        role: 'assistant',
        content: "I apologize, Sir. A temporary disruption occurred. Please try again.",
        isDemo: true
      })
      toast.error('AI Error', 'Failed to process request')
    } finally {
      setAIStatus('standby')
      setIsTyping(false)
    }
  }, [input, aiStatus, currentConversationId, addMessage, setAIStatus, isGeminiConfigured, voiceEnabled])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    resetChat()
    createConversation('New Conversation')
    toast.info('New Chat', 'Started a new conversation')
  }

  const handleClearAll = () => {
    if (window.confirm('Clear all conversations?')) {
      resetChat()
      clearAllConversations()
      createConversation('New Conversation')
      toast.warning('Cleared', 'All conversations have been deleted')
    }
  }

  const toggleVoiceInput = () => {
    console.log('[AI Core] Toggling voice input, current state:', isListening)
    
    // CRITICAL: Unlock audio context SYNCHRONOUSLY on button click
    if (voiceEnabled && voiceService.isSupported) {
      voiceService.unlockAudio()
    }

    if (isListening) {
      voiceService.stopListening()
      const textToSend = (input || interimTranscript).trim()
      if (textToSend) {
        // Since this is triggered by a direct user tap, mobile audio autoplay will work!
        handleSend(textToSend)
      } else {
        toast.info('Voice Input', 'Stopped listening')
      }
    } else {
      // Check microphone permissions first
      navigator.permissions.query({ name: 'microphone' }).then((result) => {
        console.log('[AI Core] Microphone permission state:', result.state)
        
        if (result.state === 'denied') {
          toast.error('Microphone Access', 'Please allow microphone access in your browser settings')
          return
        }
        
        const started = voiceService.startListening()
        if (started) {
          toast.info('Listening', 'Speak now...')
        } else {
          toast.error('Voice Error', 'Could not start voice input. Please check microphone permissions.')
        }
      }).catch(() => {
        // Fallback for browsers that don't support permissions API
        console.log('[AI Core] Permissions API not supported, trying anyway...')
        const started = voiceService.startListening()
        if (started) {
          toast.info('Listening', 'Speak now...')
        } else {
          toast.error('Voice Error', 'Could not start voice input. Please check microphone permissions.')
        }
      })
    }
  }

  return (
    <div className="hud-panel flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-arc-500/10">
        <div className="flex items-center gap-3">
          <MessageSquare size={18} className="text-arc-500" />
          <div>
            <h3 className="text-sm font-display font-semibold text-white">Neural Chat</h3>
            <p className="text-xs text-white/40">
              {isGeminiConfigured ? 'Gemini + Voice Enabled' : 'Demo Mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Toggle */}
          {voiceService.isSupported && (
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled)
                toast.info('Voice Output', voiceEnabled ? 'Muted' : 'Enabled')
              }}
              className={`p-2 rounded-lg transition-colors ${
                voiceEnabled 
                  ? 'text-arc-400 hover:bg-arc-500/10' 
                  : 'text-white/40 hover:bg-white/5'
              }`}
              title="Toggle voice output"
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          )}
          
          <button 
            onClick={handleNewChat}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-arc-500/10 transition-colors"
            title="New Chat"
          >
            <Plus size={16} />
          </button>
          <button 
            onClick={handleClearAll}
            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Clear All"
          >
            <Trash2 size={16} />
          </button>
          <SimpleFullscreenButton />
          <button 
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-arc-500/10 transition-colors"
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-arc-500/10 border border-arc-500/20 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-arc-500" />
            </div>
            <h4 className="text-lg font-display text-white mb-2">How can I assist you, Sir?</h4>
            <p className="text-sm text-white/40 max-w-sm mb-4">
              I'm J.A.R.V.I.S, your AI assistant. Type or speak to me.
            </p>

            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {quickPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-lg bg-stark-light/30 border border-arc-500/10 text-left hover:border-arc-500/30 transition-all"
                  onClick={() => setInput(prompt.prompt)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <prompt.icon size={14} className="text-arc-500/70" />
                  <span className="text-xs text-white/60">{prompt.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-8 h-8 rounded-full bg-arc-500/20 border border-arc-500/30 flex items-center justify-center">
                  <Bot size={14} className="text-arc-400" />
                </div>
                <div className="px-4 py-3 rounded-lg bg-stark-light/50 border border-arc-500/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-arc-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-arc-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-arc-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Listening Indicator */}
      {(isListening || interimTranscript) && (
        <div className="px-4 py-2 border-t border-arc-500/20 bg-purple-500/10">
          <div className="flex items-center gap-3">
            <AdvancedVoiceVisualizer isActive={isListening} state={isListening ? 'listening' : 'idle'} />
            <div className="flex-1">
              <p className="text-xs text-purple-400 font-medium">Listening...</p>
              {interimTranscript && (
                <p className="text-xs text-white/60 italic">{interimTranscript}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-arc-500/10">
        <div className="flex items-end gap-3">
          {/* Voice Button */}
          {voiceService.isSupported && (
            <motion.button
              onClick={toggleVoiceInput}
              className={`p-3 rounded-lg transition-all ${
                isListening
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </motion.button>
          )}

          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask J.A.R.V.I.S anything... (or use voice)"
              className="w-full px-4 py-3 rounded-lg bg-stark-light/30 border border-arc-500/10 text-white text-sm placeholder-white/30 resize-none focus:border-arc-500/30 focus:outline-none transition-colors"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={aiStatus === 'processing'}
            />
          </div>

          <motion.button
            onClick={() => handleSend()}
            disabled={!input.trim() || aiStatus === 'processing'}
            className={`p-3 rounded-lg transition-all ${
              input.trim() && aiStatus !== 'processing'
                ? 'bg-arc-500 text-white hover:bg-arc-400'
                : 'bg-stark-light/30 text-white/30 cursor-not-allowed'
            }`}
            whileHover={input.trim() && aiStatus !== 'processing' ? { scale: 1.05 } : {}}
            whileTap={input.trim() && aiStatus !== 'processing' ? { scale: 0.95 } : {}}
          >
            {aiStatus === 'processing' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </motion.button>
        </div>
        <p className="text-[10px] text-white/20 mt-2 text-center flex items-center justify-center gap-2">
          <span>Press Enter to send • Shift+Enter for new line</span>
          {voiceService.isSupported && (
            <>
              <span>•</span>
              <Mic size={10} />
              <span>Click mic or speak</span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CAPABILITIES PANEL
// ═══════════════════════════════════════════════════════════════════════════

const CapabilitiesPanel = ({ isGeminiConfigured }) => {
  const capabilities = [
    { icon: MessageSquare, title: 'Natural Language', status: 'active', level: 98 },
    { icon: Code, title: 'Code Analysis', status: isGeminiConfigured ? 'active' : 'limited', level: 95 },
    { icon: Search, title: 'Data Analysis', status: isGeminiConfigured ? 'active' : 'limited', level: 92 },
    { icon: FileText, title: 'Documents', status: isGeminiConfigured ? 'active' : 'limited', level: 88 },
    { icon: Lightbulb, title: 'Creative', status: isGeminiConfigured ? 'active' : 'limited', level: 85 },
    { icon: Volume2, title: 'Voice', status: voiceService.isSupported ? 'active' : 'coming', level: voiceService.isSupported ? 95 : 0 }
  ]

  const statusColors = {
    active: 'bg-green-400/10 text-green-400 border-green-400/20',
    limited: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    coming: 'bg-white/5 text-white/30 border-white/10'
  }

  return (
    <div className="hud-panel p-5">
      <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
        AI Capabilities
      </h3>

      <div className="space-y-3">
        {capabilities.map((cap, index) => (
          <motion.div
            key={index}
            className="p-3 rounded-lg bg-stark-light/20 border border-arc-500/5 hover:border-arc-500/20 transition-colors cursor-pointer"
            whileHover={{ scale: 1.01 }}
            onClick={() => toast.ai(cap.title, `Capability level: ${cap.level}%`)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-arc-500/10 flex items-center justify-center">
                <cap.icon size={18} className="text-arc-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{cap.title}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${statusColors[cap.status]}`}>
                {cap.status === 'active' ? 'Active' : cap.status === 'limited' ? 'Limited' : 'Soon'}
              </span>
            </div>
            
            {cap.status !== 'coming' && (
              <div className="h-1.5 bg-stark-dark rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-arc-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${cap.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY PANEL
// ═══════════════════════════════════════════════════════════════════════════

const MemoryPanel = () => {
  const { memory, clearMemory, conversations } = useAIStore()
  const totalMessages = conversations.reduce((acc, conv) => acc + (conv.messages?.length || 0), 0)

  const handleClearMemory = () => {
    if (window.confirm('Clear AI memory?')) {
      clearMemory()
      toast.warning('Memory Cleared', 'AI short-term and long-term memory has been reset')
    }
  }

  return (
    <div className="hud-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider">
          AI Memory
        </h3>
        <button 
          onClick={handleClearMemory}
          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          title="Clear Memory"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => toast.info('Conversations', `You have ${conversations.length} active conversations`)}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40">Conversations</span>
            <span className="text-xs font-mono text-arc-500/70">{conversations.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-arc-500/50" />
            <span className="text-sm text-white">{totalMessages} messages</span>
          </div>
        </motion.div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40">Short-Term Memory</span>
            <span className="text-xs font-mono text-arc-500/70">{memory?.shortTerm?.length || 0}/10</span>
          </div>
          <div className="h-2 bg-stark-light rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-arc-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((memory?.shortTerm?.length || 0) / 10) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40">Long-Term Memory</span>
            <span className="text-xs font-mono text-arc-500/70">{memory?.longTerm?.length || 0}/100</span>
          </div>
          <div className="h-2 bg-stark-light rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((memory?.longTerm?.length || 0) / 100) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// QUICK AI ACTIONS
// ═══════════════════════════════════════════════════════════════════════════

const QuickAIActions = () => {
  const actions = [
    { icon: Brain, label: 'Run Diagnostics', action: () => toast.ai('Diagnostics', 'Running full AI system diagnostics...') },
    { icon: Zap, label: 'Optimize Performance', action: () => toast.success('Optimization', 'Neural pathways optimized. 12% improvement.') },
    { icon: HardDrive, label: 'Clear Cache', action: () => toast.info('Cache', 'AI response cache cleared.') },
    { icon: Activity, label: 'Health Check', action: () => toast.success('Health Check', 'All AI systems operating normally.') }
  ]

  return (
    <div className="hud-panel p-5">
      <h3 className="text-sm font-display font-semibold text-arc-500 uppercase tracking-wider mb-4">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            onClick={action.action}
            className="p-3 rounded-lg bg-stark-light/20 border border-arc-500/10 hover:border-arc-500/30 transition-all group text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <action.icon className="w-5 h-5 text-arc-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs text-white/60">{action.label}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN AI CORE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function AICore() {
  const { metrics } = useSystemStore()
  const { aiStatus } = useAIStore()
  const [geminiConfigured, setGeminiConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCharts, setShowCharts] = useState(true)
  const [voiceState, setVoiceState] = useState({ listening: false, speaking: false })

  useEffect(() => {
    try {
      setGeminiConfigured(isConfigured())
      initializeGemini()
      toast.ai('J.A.R.V.I.S', 'Neural interface initialized. Voice enabled.')
    } catch (err) {
      console.error('[J.A.R.V.I.S] Init error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 size={48} className="text-arc-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Initializing AI Core...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-2">
            AI Core Interface
          </h1>
          <p className="text-white/50 flex items-center gap-2">
            J.A.R.V.I.S Neural Network - {geminiConfigured ? 'Gemini Powered' : 'Demo Mode'}
            {voiceService.isSupported && (
              <>
                <span>•</span>
                <Mic size={14} />
                <span>Voice Enabled</span>
              </>
            )}
          </p>
        </div>
        
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="hud-button flex items-center gap-2"
        >
          <Activity size={16} />
          {showCharts ? 'Hide Analytics' : 'Show Analytics'}
        </button>
      </div>

      {/* Main Sci-Fi Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 xl:gap-8 min-h-[600px]">
        
        {/* Left Side Panels */}
        <div className="hidden lg:flex flex-col justify-between">
          <SciFiDataPanel title="SYSTEM OP" value="NORMAL" percentage={98} />
          <SciFiDataPanel title="CORE TEMP" value={`${metrics?.temp || 45.2}°C`} percentage={metrics?.temp || 45} />
          <SciFiDataPanel title="MEM ALLOC" value={`${metrics?.ram || 42}%`} percentage={metrics?.ram || 42} />
          <SciFiDataPanel title="CPU LOAD" value={`${metrics?.cpu || 15}%`} percentage={metrics?.cpu || 15} />
        </div>

        {/* Center - Massive 3D Core & Chat Overlay */}
        <div className="lg:col-span-2 relative flex flex-col items-center justify-center min-h-[500px]">
          {/* Settings & Status placed absolutely or at the top of center */}
          <div className="absolute top-0 left-0 right-0 z-50 p-2 bg-stark-dark/80 backdrop-blur border border-arc-500/20 rounded-lg">
             <AIStatusPanel 
              isGeminiConfigured={geminiConfigured}
              isListening={voiceState.listening}
              isSpeaking={voiceState.speaking}
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center -mt-20">
             {/* The large core */}
             <JarvisCore3D 
               state={voiceState.listening ? 'listening' : (aiStatus === 'processing' ? 'processing' : 'idle')} 
               className="w-full max-w-[600px] aspect-square"
             />
          </div>

          {/* Chat Interface overlay at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-40 bg-stark-dark/60 backdrop-blur-md border-t border-cyan-500/30 pt-4 rounded-t-3xl shadow-[0_-10px_30px_rgba(6,182,212,0.1)]">
            <ChatInterface 
              isGeminiConfigured={geminiConfigured}
              onVoiceStateChange={setVoiceState}
            />
          </div>
        </div>

        {/* Right Side Panels */}
        <div className="hidden lg:flex flex-col justify-between">
          <SciFiDataPanel title="AI NEURAL" value={aiStatus.toUpperCase()} percentage={metrics?.aiLoad || 15} invert={true} />
          <SciFiDataPanel title="NETWORK" value={metrics?.ping ? `${metrics.ping}ms` : '32ms'} percentage={100} invert={true} />
          <SciFiDataPanel title="BATTERY" value={metrics?.battery ? `${metrics.battery}%` : '100%'} percentage={metrics?.battery || 100} invert={true} />
          <SciFiDataPanel title="UPTIME" value="99.9%" percentage={99} invert={true} />
        </div>
        
        {/* Mobile View Capabilities (Hidden on Desktop since Desktop has the SciFi UI) */}
        <div className="block lg:hidden">
           <MemoryPanel />
           <QuickAIActions />
           <CapabilitiesPanel isGeminiConfigured={geminiConfigured} />
        </div>
      </div>

      {/* AI Activity Charts */}
      <AnimatePresence>
        {showCharts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-6"
          >
            {/* Neural Activity Chart */}
            <motion.div 
              className="hud-panel p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AIActivityChart />
            </motion.div>

            {/* Resource Distribution */}
            <motion.div 
              className="hud-panel p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ResourceDistributionChart />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AICore