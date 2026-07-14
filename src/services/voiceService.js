// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - VOICE SERVICE (MALE VOICE)
// Safe Speech Recognition and Synthesis Service
// ═══════════════════════════════════════════════════════════════════════════

class VoiceService {
  constructor() {
    // State
    this.isListening = false
    this.isSpeaking = false
    this.recognition = null
    this.synthesis = null
    this.selectedVoice = null
    
    // Callbacks
    this.onResult = null
    this.onError = null
    this.onStart = null
    this.onEnd = null
    this.onSpeechStart = null
    this.onSpeechEnd = null
    
    // Voice preferences - MALE VOICES
    this.preferredVoices = [
      'Google UK English Male',
      'Microsoft David',
      'David',
      'Daniel',
      'James',
      'Google US English',
      'Alex',
      'Fred',
      'Male',
      'en-GB',
      'de-DE',
      'de_DE',
      'en-US'
    ]
    
    // Check browser support
    this.isSupported = this.checkSupport()
    
    // Initialize if supported
    if (this.isSupported) {
      this.init()
    }
  }
  
  // Check if browser supports speech APIs
  checkSupport() {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const hasSynthesis = 'speechSynthesis' in window
      return !!(SpeechRecognition && hasSynthesis)
    } catch (e) {
      console.warn('[Voice] Browser does not support Speech APIs')
      return false
    }
  }
  
  // Initialize speech recognition
  init() {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        this.isSupported = false
        return
      }
      
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US'
      
      this.recognition.onstart = () => {
        this.isListening = true
        if (this.onStart) this.onStart()
      }
      
      this.recognition.onend = () => {
        this.isListening = false
        if (this.onEnd) this.onEnd()
      }
      
      this.recognition.onresult = (event) => {
        try {
          const result = event.results[event.results.length - 1]
          const transcript = result[0].transcript
          const isFinal = result.isFinal
          
          if (this.onResult) {
            this.onResult({ transcript, isFinal, isWakeWord: false })
          }
        } catch (e) {
          console.error('[Voice] Result error:', e)
        }
      }
      
      this.recognition.onerror = (event) => {
        console.error('[Voice] Recognition error:', event.error)
        this.isListening = false
        
        let errorMessage = 'Speech recognition error'
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected'
            break
          case 'audio-capture':
            errorMessage = 'Microphone not available'
            break
          case 'not-allowed':
            errorMessage = 'Microphone permission denied'
            break
          case 'network':
            errorMessage = 'Network error'
            break
          default:
            errorMessage = `Speech recognition error: ${event.error}`
        }
        
        if (this.onError) {
          this.onError({ type: event.error, message: errorMessage })
        }
        if (this.onEnd) this.onEnd()
      }
      
      // Setup synthesis
      this.synthesis = window.speechSynthesis
      
      // Load voices
      this.loadVoices()
      
      // Voices might load async
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => this.loadVoices()
      }
      
    } catch (e) {
      console.error('[Voice] Init error:', e)
      this.isSupported = false
    }
  }
  
  // Load and select best male voice
  loadVoices() {
    if (!this.synthesis) return
    
    const voices = this.synthesis.getVoices()
    console.log('[Voice] Available voices:', voices.length)
    
    // Find best male voice
    this.selectedVoice = this.findBestMaleVoice(voices)
    
    if (this.selectedVoice) {
      console.log('[Voice] Selected voice:', this.selectedVoice.name)
    }
  }
  
  // Find the best male voice available
  findBestMaleVoice(voices) {
    if (!voices || voices.length === 0) return null
    
    // Priority 1: Google UK English Male (Chrome Desktop)
    let voice = voices.find(v => v.name.includes('Google UK English Male'))
    if (voice) return voice
    
    // Priority 2: Known Android / Mobile Male Voices for UK & US
    // 'rjs' is Android Google TTS UK Male, 'iom' is US Male, 'cgb' is UK Male
    const mobileMaleIdentifiers = ['en-gb-x-rjs', 'en-gb-x-cgb', 'en-us-x-iom']
    voice = voices.find(v => 
      mobileMaleIdentifiers.some(id => v.name.toLowerCase().includes(id)) ||
      mobileMaleIdentifiers.some(id => v.voiceURI.toLowerCase().includes(id))
    )
    if (voice) return voice
    
    // Priority 3: Look for voices with "Male" in name
    voice = voices.find(v => 
      v.name.toLowerCase().includes('male') && 
      !v.name.toLowerCase().includes('female')
    )
    if (voice) return voice
    
    // Priority 4: Look for known male voice names (Apple/Windows)
    const maleNames = ['david', 'daniel', 'james', 'alex', 'fred', 'george', 'mark', 'arthur']
    voice = voices.find(v => 
      maleNames.some(name => v.name.toLowerCase().includes(name))
    )
    if (voice) return voice
    
    // Priority 5: Any English UK voice (Jarvis is British)
    voice = voices.find(v => (v.lang.includes('en-GB') || v.lang.includes('en_GB')) && !v.name.toLowerCase().includes('female'))
    if (voice) return voice
    
    // Priority 5.5: German Voice (User requested German accent deep voice)
    voice = voices.find(v => (v.lang.includes('de-DE') || v.lang.includes('de_DE')) && !v.name.toLowerCase().includes('female'))
    if (voice) return voice

    // Priority 6: Any US English (avoid female)
    voice = voices.find(v => (v.lang.includes('en-US') || v.lang.includes('en_US')) && !v.name.toLowerCase().includes('female'))
    if (voice) return voice
    
    // Fallback: First available English voice
    voice = voices.find(v => v.lang.startsWith('en'))
    if (voice) return voice
    
    // Ultimate Fallback
    return voices[0]
  }
  
  // Get all available voices (for debugging)
  getVoices() {
    if (!this.synthesis) return []
    return this.synthesis.getVoices()
  }
  
  // Log all available voices (for debugging)
  logVoices() {
    const voices = this.getVoices()
    console.log('[Voice] All available voices:')
    voices.forEach((v, i) => {
      console.log(`  ${i}: ${v.name} (${v.lang}) ${v.localService ? '[Local]' : '[Remote]'}`)
    })
  }

  // Unlock audio context for mobile browsers (must be called from a user gesture)
  unlockAudio() {
    if (this.synthesis) {
      try {
        // iOS/Android trick: Speak a long silent text and pause it immediately.
        // This keeps the speech synthesis engine "active" and allows us to cancel
        // and speak asynchronously later without losing the user-gesture lock.
        const utterance = new SpeechSynthesisUtterance('A'.repeat(500));
        utterance.volume = 0;
        this.synthesis.speak(utterance);
        
        // Pause it immediately to keep it in the queue
        setTimeout(() => {
          this.synthesis.pause();
        }, 10);
        
        this._audioUnlocked = true;
        console.log('[Voice] Audio context unlocked and paused for mobile');
      } catch (e) {
        console.warn('[Voice] Failed to unlock audio context', e);
      }
    }
  }
  
  // Start listening
  startListening() {
    this.unlockAudio(); // Prime the audio engine during the click event

    if (!this.isSupported || !this.recognition) {
      console.warn('[Voice] Speech recognition not available')
      if (this.onError) {
        this.onError({ type: 'not-supported', message: 'Speech recognition not supported in this browser' })
      }
      return false
    }
    
    if (this.isListening) {
      console.log('[Voice] Already listening')
      return true
    }
    
    try {
      console.log('[Voice] Starting speech recognition...')
      this.recognition.start()
      return true
    } catch (e) {
      console.error('[Voice] Start error:', e)
      
      // Try to recover
      try {
        console.log('[Voice] Attempting to recover...')
        this.recognition.abort()
        setTimeout(() => {
          try {
            this.recognition.start()
            console.log('[Voice] Recovery successful')
          } catch (e2) {
            console.error('[Voice] Recovery failed:', e2)
            if (this.onError) {
              this.onError({ type: 'start-failed', message: 'Failed to start speech recognition' })
            }
          }
        }, 100)
        return true
      } catch (e2) {
        console.error('[Voice] Recovery error:', e2)
        if (this.onError) {
          this.onError({ type: 'recovery-failed', message: 'Speech recognition recovery failed' })
        }
        return false
      }
    }
  }
  
  // Stop listening
  stopListening() {
    if (!this.recognition) return
    
    try {
      this.recognition.stop()
    } catch (e) {
      try {
        this.recognition.abort()
      } catch (e2) {
        // Ignore
      }
    }
    this.isListening = false
  }
  
  getAvailableVoices() {
    return this.synthesis ? this.synthesis.getVoices() : []
  }

  setVoice(name) {
    if (!this.synthesis) return false
    const voices = this.synthesis.getVoices()
    const voice = voices.find(v => v.name === name)
    if (voice) {
      this.selectedVoice = voice
      console.log('[Voice] Manually selected voice:', voice.name)
      return true
    }
    return false
  }

  // Speak text with male voice
  speak(text, options = {}) {
    if (!this.synthesis) {
      console.warn('[Voice] Speech synthesis not available')
      return false
    }
    
    try {
      // Cancel any ongoing speech
      this.synthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Voice settings for J.A.R.V.I.S
      utterance.lang = 'en-GB'          // British English (J.A.R.V.I.S style)
      utterance.pitch = 0.8             // Lower pitch = deeper, more male J.A.R.V.I.S voice
      utterance.rate = 0.95             // Slightly slower for more dramatic AI feel
      utterance.volume = 1.0            // Full volume
      
      // Use selected male voice
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice
        utterance.lang = this.selectedVoice.lang || 'en-GB'
      } else {
        // Try to find male voice again
        const voices = this.synthesis.getVoices()
        const maleVoice = this.findBestMaleVoice(voices)
        if (maleVoice) {
          utterance.voice = maleVoice
          this.selectedVoice = maleVoice
          utterance.lang = maleVoice.lang || 'en-GB'
        } else {
          utterance.lang = 'en-GB'
        }
      }
      
      utterance.pitch = 0.8; // Reverted back to original deep JARVIS pitch
      
      utterance.onstart = () => {
        this.isSpeaking = true
        if (this.onSpeechStart) this.onSpeechStart()
      }
      
      utterance.onend = () => {
        this.isSpeaking = false
        if (this.onSpeechEnd) this.onSpeechEnd()
      }
      
      utterance.onerror = (e) => {
        console.error('[Voice] Speech error:', e)
        this.isSpeaking = false
        if (this.onSpeechEnd) this.onSpeechEnd()
      }
      
      // Speak!
      this.synthesis.speak(utterance)
      return true
      
    } catch (e) {
      console.error('[Voice] Speak error:', e)
      return false
    }
  }
  
  // Stop speaking
  stopSpeaking() {
    if (this.synthesis) {
      try {
        this.synthesis.cancel()
      } catch (e) {
        // Ignore
      }
    }
    this.isSpeaking = false
  }
  
  // Set voice by name (manual selection)
  setVoice(voiceName) {
    if (!this.synthesis) return false
    
    const voices = this.synthesis.getVoices()
    const voice = voices.find(v => v.name.includes(voiceName))
    
    if (voice) {
      this.selectedVoice = voice
      console.log('[Voice] Voice set to:', voice.name)
      return true
    }
    
    return false
  }
}

// Create singleton instance with error handling
let voiceServiceInstance

try {
  voiceServiceInstance = new VoiceService()
} catch (e) {
  console.error('[Voice] Failed to create voice service:', e)
  // Create dummy service that does nothing
  voiceServiceInstance = {
    isSupported: false,
    isListening: false,
    isSpeaking: false,
    onResult: null,
    onError: null,
    onStart: null,
    onEnd: null,
    onSpeechStart: null,
    onSpeechEnd: null,
    startListening: () => false,
    stopListening: () => {},
    speak: () => false,
    stopSpeaking: () => {},
    getVoices: () => [],
    logVoices: () => {},
    setVoice: () => false
  }
}

export const voiceService = voiceServiceInstance
export default voiceServiceInstance