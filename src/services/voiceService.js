// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - VOICE SERVICE (MALE VOICE)
// Safe Speech Recognition and Synthesis Service
// ═══════════════════════════════════════════════════════════════════════════

class VoiceService {
  constructor() {
    // State
    this.isListening = false
    this.isSpeaking = false
    this.synthesis = null
    this.selectedVoice = null
    this.audioElement = null // Untuk pemutar Neural TTS
    this.neuralVoices = [] // Daftar suara Neural
    this.wakeWordEngine = null
    
    
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
        
        // Restart wake word
        const isElectron = navigator.userAgent.toLowerCase().includes('electron');
        if (!isElectron && this.wakeWordEngine && !this.isSpeaking) {
          try { this.wakeWordEngine.start(); } catch(e){}
        }
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
        
        // Restart wake word
        const isElectron = navigator.userAgent.toLowerCase().includes('electron');
        if (!isElectron && this.wakeWordEngine && !this.isSpeaking) {
          try { this.wakeWordEngine.start(); } catch(e){}
        }
      }
      
      // Setup synthesis
      this.synthesis = window.speechSynthesis
      
      // Load voices
      this.loadVoices()
      
      // Voices might load async
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => this.loadVoices()
      }
      
      // Start wake word if web/mobile
      setTimeout(() => this.startWakeWord(), 2000);
      
    } catch (e) {
      console.error('[Voice] Init error:', e)
      this.isSupported = false
    }
  }
  
  // Load and select best male voice
  loadVoices() {
    const isElectron = navigator.userAgent.toLowerCase().includes('electron');
    if (isElectron) {
      this.neuralVoices = [
        { name: 'en-GB-ThomasNeural', lang: 'en-GB', nameDisplay: 'J.A.R.V.I.S (UK Male - Deep)' },
        { name: 'en-GB-RyanNeural', lang: 'en-GB', nameDisplay: 'J.A.R.V.I.S (UK Male - Clear)' },
        { name: 'en-US-GuyNeural', lang: 'en-US', nameDisplay: 'J.A.R.V.I.S (US Male)' },
        { name: 'id-ID-ArdiNeural', lang: 'id-ID', nameDisplay: 'J.A.R.V.I.S (Indonesian Male)' },
        { name: 'en-GB-SoniaNeural', lang: 'en-GB', nameDisplay: 'F.R.I.D.A.Y (UK Female)' },
        { name: 'id-ID-GadisNeural', lang: 'id-ID', nameDisplay: 'F.R.I.D.A.Y (Indonesian Female)' }
      ];
      this.selectedVoice = this.neuralVoices[0];
      console.log('[Voice] Loaded Neural Voices for Desktop');
      return;
    }

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
    const isElectron = navigator.userAgent.toLowerCase().includes('electron');
    if (isElectron) return this.neuralVoices || [];
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

    // Deteksi jika berjalan di Electron
    const isElectron = navigator.userAgent.toLowerCase().includes('electron');
    if (isElectron) {
      if (this.isListening) return true;
      this.isListening = true;
      if (this.onStart) this.onStart();
      
      console.log('[Voice] Menggunakan Python Bridge (stark-bridge) untuk Mendengar...');
      
      const bridgeHost = window.location.hostname || '127.0.0.1';
      fetch(`http://${bridgeHost}:5000/listen?lang=id-ID`)
        .then(res => res.json())
        .then(data => {
          this.isListening = false;
          if (data.status === 'success') {
            if (this.onResult) {
              this.onResult({ transcript: data.text, isFinal: true, isWakeWord: false });
            }
          } else {
            if (this.onError) this.onError({ type: 'bridge-error', message: data.message });
          }
          if (this.onEnd) this.onEnd();
        })
        .catch(err => {
          this.isListening = false;
          if (this.onError) this.onError({ type: 'network', message: 'Gagal terhubung ke stark-bridge' });
          if (this.onEnd) this.onEnd();
        });
        
      return true;
    }

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
    const isElectron = navigator.userAgent.toLowerCase().includes('electron');
    if (isElectron) return this.neuralVoices || [];
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
    const isElectron = navigator.userAgent.toLowerCase().includes('electron');
    if (isElectron) {
      console.log('[Voice] Menggunakan Neural TTS dari stark-bridge...');
      try {
        this.isSpeaking = true;
        if (this.onSpeechStart) this.onSpeechStart();
        
        const bridgeHost = window.location.hostname || '127.0.0.1';
        const voiceName = this.selectedVoice ? this.selectedVoice.name : 'en-GB-ThomasNeural';
        const url = `http://${bridgeHost}:5000/speak?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voiceName)}`;
        
        if (this.audioElement) {
          this.audioElement.pause();
        }
        
        this.audioElement = new window.Audio(url);
        this.audioElement.onended = () => {
          this.isSpeaking = false;
          if (this.onSpeechEnd) this.onSpeechEnd();
        };
        this.audioElement.onerror = (e) => {
          console.error('[Voice] Audio element error:', e);
          this.isSpeaking = false;
          if (this.onSpeechEnd) this.onSpeechEnd();
        };
        
        this.audioElement.play().catch(e => {
          console.error('[Voice] Play error:', e);
          this.isSpeaking = false;
          if (this.onSpeechEnd) this.onSpeechEnd();
        });
        return true;
      } catch (e) {
        console.error('[Voice] Electron speak error:', e);
        this.isSpeaking = false;
        if (this.onSpeechEnd) this.onSpeechEnd();
        return false;
      }
    }

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
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch(e) {}
    }
    if (this.synthesis) {
      try {
        this.synthesis.cancel()
      } catch (e) {
        // Ignore
      }
    }
    this.isSpeaking = false
    
    // Restart wake word
    const isElectron = navigator.userAgent.toLowerCase().includes('electron');
    if (!isElectron && this.wakeWordEngine && !this.isListening) {
      try { this.wakeWordEngine.start(); } catch(e){}
    }
  }

  // Wake word untuk Web / Mobile
  startWakeWord() {
    const isElectron = navigator.userAgent.toLowerCase().includes('electron');
    if (isElectron) return; // Desktop uses Ctrl+Space shortcut
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      
      this.wakeWordEngine = new SpeechRecognition();
      this.wakeWordEngine.continuous = true;
      this.wakeWordEngine.interimResults = true;
      this.wakeWordEngine.lang = 'en-US';
      
      this.wakeWordEngine.onresult = (event) => {
        if (this.isListening) return; // Jangan bentrok
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript.toLowerCase();
          if (transcript.includes('jarvis') || transcript.includes('friday') || transcript.includes('hey jarvis')) {
            console.log('[Voice] WAKE WORD DETECTED:', transcript);
            this.wakeWordEngine.stop(); // Stop sementara
            
            // Kasih notif suara
            this.speak("Yes sir?");
            
            // Mulai dengar perintah asli setelah 1 detik
            setTimeout(() => {
              this.startListening();
            }, 1000);
            return;
          }
        }
      };
      
      this.wakeWordEngine.onend = () => {
        // Auto-restart if it dies unexpectedly and we are not doing anything else
        if (!this.isListening && !this.isSpeaking) {
          try { this.wakeWordEngine.start(); } catch(e){}
        }
      };
      
      this.wakeWordEngine.start();
      console.log('[Voice] Wake Word Engine Started for Web/Mobile');
    } catch (e) {
      console.error('[Voice] Wake Word error:', e);
    }
  }
  
  // Set voice by name (manual selection)
  setVoice(voiceName) {
    const isElectron = navigator.userAgent.toLowerCase().includes('electron');
    if (isElectron && this.neuralVoices) {
      const voice = this.neuralVoices.find(v => v.name.includes(voiceName) || v.nameDisplay === voiceName);
      if (voice) {
        this.selectedVoice = voice;
        console.log('[Voice] Neural Voice set to:', voice.nameDisplay || voice.name);
        return true;
      }
      return false;
    }

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