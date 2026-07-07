// Voice Interface Test Script
// Run this in browser console to test voice functionality

console.log('=== VOICE INTERFACE TEST ===')

// Test 1: Check voice service availability
if (window.voiceService) {
  console.log('✅ Voice service loaded')
  console.log('Supported:', window.voiceService.isSupported)
  console.log('Listening:', window.voiceService.isListening)
  console.log('Speaking:', window.voiceService.isSpeaking)
} else {
  console.log('❌ Voice service not found')
}

// Test 2: Check microphone permissions
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log('✅ Microphone API available')
  
  navigator.permissions.query({ name: 'microphone' })
    .then(result => {
      console.log('Microphone permission state:', result.state)
    })
    .catch(err => {
      console.log('Permissions API not supported, but getUserMedia should work')
    })
} else {
  console.log('❌ Microphone API not available')
}

// Test 3: Check speech synthesis
if ('speechSynthesis' in window) {
  console.log('✅ Speech synthesis available')
  const voices = window.speechSynthesis.getVoices()
  console.log('Available voices:', voices.length)
  
  // Log male voices
  const maleVoices = voices.filter(v => 
    v.name.toLowerCase().includes('male') || 
    ['david', 'daniel', 'james'].some(name => v.name.toLowerCase().includes(name))
  )
  console.log('Male voices:', maleVoices.map(v => v.name))
} else {
  console.log('❌ Speech synthesis not available')
}

// Test 4: Test voice service functions
if (window.voiceService && window.voiceService.isSupported) {
  console.log('=== TESTING VOICE SERVICE ===')
  
  // Test voice logging
  window.voiceService.logVoices()
  
  // Test starting listening (will request permission)
  console.log('Testing voice recognition...')
  const started = window.voiceService.startListening()
  console.log('Voice recognition started:', started)
  
  // Stop after 3 seconds
  setTimeout(() => {
    window.voiceService.stopListening()
    console.log('Voice recognition stopped')
    
    // Test speech synthesis
    console.log('Testing speech synthesis...')
    window.voiceService.speak('Voice interface test complete. All systems operational.')
  }, 3000)
}

console.log('=== TEST COMPLETE ===')
