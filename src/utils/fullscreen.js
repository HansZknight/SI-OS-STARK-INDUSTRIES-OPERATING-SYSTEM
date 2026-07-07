// Fullscreen utilities for PWA

/**
 * Memeriksa apakah browser mendukung fullscreen mode
 * @returns {boolean} - True jika browser mendukung fullscreen
 */
export const isFullscreenSupported = () => {
  return (
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled
  );
};

/**
 * Meminta fullscreen mode
 * @returns {Promise<void>}
 */
export const requestFullscreen = async () => {
  if (isFullscreenSupported()) {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      await element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      await element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      await element.msRequestFullscreen();
    }
  }
};

/**
 * Keluar dari fullscreen mode
 * @returns {Promise<void>}
 */
export const exitFullscreen = async () => {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    await document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    await document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    await document.msExitFullscreen();
  }
};

/**
 * Memeriksa apakah saat ini dalam mode fullscreen
 * @returns {boolean} - True jika dalam mode fullscreen
 */
export const isFullscreen = () => {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};

/**
 * Toggle fullscreen mode
 * @returns {Promise<void>}
 */
export const toggleFullscreen = async () => {
  if (isFullscreen()) {
    await exitFullscreen();
  } else {
    await requestFullscreen();
  }
};

/**
 * Menambahkan event listener untuk menangani perubahan fullscreen
 * @param {Function} callback - Fungsi yang akan dipanggil saat status fullscreen berubah
 * @returns {Function} - Fungsi untuk menghapus event listener
 */
export const onFullscreenChange = (callback) => {
  const events = [
    'fullscreenchange',
    'webkitfullscreenchange',
    'mozfullscreenchange',
    'MSFullscreenChange'
  ];

  const handler = () => callback(isFullscreen());
  
  events.forEach(event => {
    document.addEventListener(event, handler, false);
  });

  // Return cleanup function
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, handler, false);
    });
  };
};

/**
 * Inisialisasi fullscreen mode
 * @param {boolean} autoFullscreen - Jika true, akan mencoba masuk ke fullscreen secara otomatis
 */
export const initFullscreen = (autoFullscreen = true) => {
  // Check if running as PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone || 
               document.referrer.includes('android-app://');

  // Check if on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Auto fullscreen for PWA on desktop
  if (autoFullscreen && isPWA && !isMobile) {
    // Use a small delay to ensure the app is fully loaded
    setTimeout(() => {
      requestFullscreen().catch(err => {
        console.log('Fullscreen error:', err);
      });
    }, 1000);
  }

  // Add event listener for fullscreen changes
  return onFullscreenChange((isFullscreen) => {
    console.log('Fullscreen changed:', isFullscreen);
    // You can add additional logic here when fullscreen state changes
  });
};

export default {
  isFullscreenSupported,
  requestFullscreen,
  exitFullscreen,
  isFullscreen,
  toggleFullscreen,
  onFullscreenChange,
  initFullscreen
};
