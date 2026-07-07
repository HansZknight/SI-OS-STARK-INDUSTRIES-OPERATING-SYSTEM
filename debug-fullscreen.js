// Debug Fullscreen API
console.log('=== FULLSCREEN DEBUG ===')

// Check API support
console.log('Fullscreen API Support:')
console.log('- document.fullscreenEnabled:', document.fullscreenEnabled)
console.log('- document.webkitFullscreenEnabled:', document.webkitFullscreenEnabled)
console.log('- document.mozFullScreenEnabled:', document.mozFullScreenEnabled)
console.log('- document.msFullscreenEnabled:', document.msFullscreenEnabled)

// Check current fullscreen element
console.log('Current Fullscreen Element:')
console.log('- document.fullscreenElement:', document.fullscreenElement)
console.log('- document.webkitFullscreenElement:', document.webkitFullscreenElement)
console.log('- document.mozFullScreenElement:', document.mozFullScreenElement)
console.log('- document.msFullscreenElement:', document.msFullscreenElement)

// Check request methods
const element = document.documentElement
console.log('Request Methods:')
console.log('- element.requestFullscreen:', typeof element.requestFullscreen)
console.log('- element.webkitRequestFullscreen:', typeof element.webkitRequestFullscreen)
console.log('- element.webkitRequestFullScreen:', typeof element.webkitRequestFullScreen)
console.log('- element.mozRequestFullScreen:', typeof element.mozRequestFullScreen)
console.log('- element.msRequestFullscreen:', typeof element.msRequestFullscreen)

// Check exit methods
console.log('Exit Methods:')
console.log('- document.exitFullscreen:', typeof document.exitFullscreen)
console.log('- document.webkitExitFullscreen:', typeof document.webkitExitFullscreen)
console.log('- document.webkitCancelFullScreen:', typeof document.webkitCancelFullScreen)
console.log('- document.mozCancelFullScreen:', typeof document.mozCancelFullScreen)
console.log('- document.msExitFullscreen:', typeof document.msExitFullscreen)

// Test function
window.testFullscreen = () => {
  console.log('Testing fullscreen...')
  
  if (!document.fullscreenElement) {
    // Try to enter fullscreen
    const requestFullscreen = 
      element.requestFullscreen ||
      element.webkitRequestFullscreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen

    if (requestFullscreen) {
      requestFullscreen.call(element).then(() => {
        console.log('✅ Fullscreen entered successfully')
      }).catch(err => {
        console.error('❌ Error entering fullscreen:', err)
      })
    } else {
      console.error('❌ No fullscreen request method available')
    }
  } else {
    // Try to exit fullscreen
    const exitFullscreen = 
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.webkitCancelFullScreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen

    if (exitFullscreen) {
      exitFullscreen.call(document).then(() => {
        console.log('✅ Fullscreen exited successfully')
      }).catch(err => {
        console.error('❌ Error exiting fullscreen:', err)
      })
    } else {
      console.error('❌ No fullscreen exit method available')
    }
  }
}

console.log('Run window.testFullscreen() to test fullscreen API')
