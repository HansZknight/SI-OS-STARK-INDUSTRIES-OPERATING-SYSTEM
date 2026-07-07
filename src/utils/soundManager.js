// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OS - SOUND MANAGER
// Audio feedback system for notifications
// ═══════════════════════════════════════════════════════════════════════════

class SoundManager {
  constructor() {
    this.enabled = true
    this.volume = 0.3
    this.sounds = {}
    
    // Initialize Web Audio API
    this.audioContext = null
    this.initAudioContext()
  }
  
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio API not supported')
    }
  }
  
  // Generate Arc Reactor power-up sound
  playArcReactorPowerUp() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    const now = ctx.currentTime
    
    // Main oscillator
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(220, now)
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.2)
    
    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(this.volume * 0.3, now + 0.05)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    
    osc1.start(now)
    osc1.stop(now + 0.3)
  }
  
  // Generate success notification sound
  playSuccess() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    const now = ctx.currentTime
    
    // Two-tone success
    const frequencies = [523.25, 659.25] // C5, E5
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.value = freq
      
      const startTime = now + (i * 0.1)
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(this.volume * 0.2, startTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start(startTime)
      osc.stop(startTime + 0.15)
    })
  }
  
  // Generate error notification sound
  playError() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    const now = ctx.currentTime
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3)
    
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start(now)
    osc.stop(now + 0.3)
  }
  
  // Generate warning notification sound
  playWarning() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    const now = ctx.currentTime
    
    // Pulsing warning
    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'square'
      osc.frequency.value = 440
      
      const startTime = now + (i * 0.15)
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(this.volume * 0.15, startTime + 0.01)
      gain.gain.linearRampToValueAtTime(0, startTime + 0.08)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start(startTime)
      osc.stop(startTime + 0.08)
    }
  }
  
  // Generate info notification sound
  playInfo() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    const now = ctx.currentTime
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = 800
    
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(this.volume * 0.15, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start(now)
    osc.stop(now + 0.1)
  }
  
  // Generate system notification sound
  playSystem() {
    this.playArcReactorPowerUp()
  }
  
  // Generate security alert sound
  playSecurity() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    const now = ctx.currentTime
    
    // Alarm-like sound
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sawtooth'
      osc.frequency.value = i % 2 === 0 ? 600 : 800
      
      const startTime = now + (i * 0.12)
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(this.volume * 0.2, startTime + 0.01)
      gain.gain.linearRampToValueAtTime(0, startTime + 0.1)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start(startTime)
      osc.stop(startTime + 0.1)
    }
  }
  
  // Generate AI notification sound
  playAI() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    const now = ctx.currentTime
    
    // Digital, futuristic sound
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1000, now)
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.05)
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15)
    
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(this.volume * 0.2, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start(now)
    osc.stop(now + 0.2)
  }
  
  // Play sound by type
  play(type) {
    const soundMap = {
      success: () => this.playSuccess(),
      error: () => this.playError(),
      warning: () => this.playWarning(),
      info: () => this.playInfo(),
      system: () => this.playSystem(),
      security: () => this.playSecurity(),
      ai: () => this.playAI()
    }
    
    const playSound = soundMap[type]
    if (playSound) {
      playSound()
    }
  }
  
  // Toggle sound on/off
  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }
  
  // Set volume (0-1)
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
  }
}

// Create singleton instance
export const soundManager = new SoundManager()

// Convenience functions
export const playNotificationSound = (type) => {
  soundManager.play(type)
}

export const toggleSound = () => {
  return soundManager.toggle()
}

export const setSoundVolume = (volume) => {
  soundManager.setVolume(volume)
}

export default soundManager