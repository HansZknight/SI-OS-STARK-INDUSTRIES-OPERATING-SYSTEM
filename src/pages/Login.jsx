// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES AUTHENTICATION
// Futuristic Login Component with Multiple Auth Methods
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { toast } from '../components/ui/Toast';
import { analyzeVoiceLogin } from '../ai/aiController';

// Icons
import { Lock, User, Fingerprint, Mic, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';

// Sound effects
const clickSound = new Audio('/sounds/click.mp3');
const successSound = new Audio('/sounds/success.mp3');
const errorSound = new Audio('/sounds/error.mp3');

const BiometricScannerOverlay = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="relative w-64 h-64 flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 rounded-full border-2 border-arc-cyan/30 animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-4 rounded-full border-2 border-arc-blue/40 animate-[spin_3s_linear_infinite_reverse]" />
        
        {/* Fingerprint Icon Container */}
        <div className="relative z-10 w-32 h-32 text-arc-cyan">
          <Fingerprint className="w-full h-full opacity-80" strokeWidth={1} />
          
          {/* Scanning Line */}
          <motion.div
            className="absolute left-0 right-0 h-1 bg-arc-cyan shadow-[0_0_15px_rgba(0,212,255,0.8)]"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
          />
        </div>
        
        <div className="mt-8 text-center">
          <div className="text-arc-cyan font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
            Scanning Identity
          </div>
          <div className="text-xs text-stark-gray mt-1 font-mono opacity-50">
            Please hold still...
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  // Auth state
  const { login, isAuthenticated, loginWithBiometric, loginWithVoice, authError, clearError } = useAuthStore();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState('password'); // 'password', 'biometric', 'voice'
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showBiometricScanner, setShowBiometricScanner] = useState(false);
  
  // Refs
  const recognitionRef = useRef(null);
  const voiceTextRef = useRef('');
  const isListeningRef = useRef(false);
  
  // Keep refs in sync
  useEffect(() => {
    voiceTextRef.current = voiceText;
  }, [voiceText]);
  
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);
  
  // Check authentication status and redirect if needed
  useEffect(() => {
    if (isAuthenticated) {
      // Small delay to ensure all auth state is properly set
      const timer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
    
    // Clear any previous errors on mount
    clearError();
    
    // Initialize voice recognition if available
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // Set to English
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setVoiceText(transcript);
      };
      
      recognitionRef.current.onend = () => {
        const currentText = voiceTextRef.current;
        const currentIsListening = isListeningRef.current;
        
        if (currentText.trim() && currentText !== 'Listening...' && currentText !== 'Analyzing neural intent...') {
          // User finished speaking, process immediately
          setIsListening(false);
          handleVoiceLogin(currentText);
        } else if (currentIsListening) {
          // Restart listening only if nothing was said
          try { recognitionRef.current.start(); } catch(e) {}
        } else {
          setVoiceText('');
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice Recognition', 'Failed to access microphone. Please check permissions.');
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate, from]);
  
  // Play sound effect
  const playSound = (sound) => {
    if (!soundEnabled) return;
    
    const audio = new Audio(sound);
    audio.volume = 0.5;
    audio.play().catch(e => console.error('Error playing sound:', e));
  };
  
  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice Recognition', 'Your browser does not support voice recognition.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setVoiceText('Listening...');
        playSound(clickSound);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        toast.error('Voice Recognition', 'Failed to access microphone. Please check permissions.');
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    playSound(clickSound);
    
    // Basic validation
    if (!email.trim()) {
      toast.error('Authentication', 'Please enter your email');
      return;
    }
    
    if (!password) {
      toast.error('Authentication', 'Please enter your password');
      return;
    }
    
    setIsLoading(true);
    clearError();
    
    try {
      await login(email, password);
      playSound(successSound);
      toast.success('Authentication', 'Login successful! Welcome back.');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      playSound(errorSound);
      const errorMessage = error?.response?.data?.message || 
                         error?.message || 
                         authError || 
                         'Failed to sign in. Please check your credentials and try again.';
      toast.error('Authentication', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle biometric login
  const handleBiometricLogin = async () => {
    playSound(clickSound);
    setShowBiometricScanner(true);
    setIsLoading(true);
    clearError();
    
    try {
      const targetEmail = email || 'tony@stark.com';
      await loginWithBiometric(targetEmail);
      playSound(successSound);
      toast.success('Biometric Authentication', 'Biometric verification successful!');
      setShowBiometricScanner(false);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Biometric login error:', error);
      playSound(errorSound);
      toast.error('Biometric Authentication', 'Biometric verification failed.');
      setShowBiometricScanner(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle voice login via AI
  const handleVoiceLogin = async (transcript) => {
    setIsLoading(true);
    setVoiceText('Analyzing neural intent...');
    
    try {
      const aiResponse = await analyzeVoiceLogin(transcript);
      
      if (aiResponse.authorize) {
        setVoiceText(aiResponse.message || 'Identity confirmed. Authorizing...');
        playSound(successSound);
        
        // Use extracted credentials if available, otherwise fallback to default Tony Stark
        if (aiResponse.email && aiResponse.password) {
           await login(aiResponse.email, aiResponse.password);
        } else {
           await loginWithVoice('tony@stark.com');
        }
        
        toast.success('Voice Authentication', 'Welcome back, Sir.');
        navigate(from, { replace: true });
      } else {
        // AI determined the user is not trying to login, or denied access
        setVoiceText(aiResponse.message || 'Access denied.');
        playSound(errorSound);
        toast.error('Authentication', aiResponse.message || 'Unrecognized voice command.');
        setTimeout(() => {
          setVoiceText('');
          setIsListening(false);
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 3000);
      }
    } catch (error) {
      console.error('AI Voice login error:', error);
      playSound(errorSound);
      toast.error('System Error', 'Voice authentication server failed.');
      setVoiceText('Neural core offline. Try manual login.');
      setTimeout(() => setVoiceText(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    playSound(clickSound);
  };
  
  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    playSound(clickSound);
  };
  
  // Demo credentials quick fill
  const handleDemoCredentials = (email, password) => {
    setEmail(email);
    setPassword(password);
    playSound(clickSound);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-stark-black p-4 overflow-hidden">
      <AnimatePresence>
        {showBiometricScanner && <BiometricScannerOverlay isActive={showBiometricScanner} />}
      </AnimatePresence>
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Gradient Background with Holographic Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-stark-dark via-black to-stark-darker">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(0, 212, 255, 0.15), transparent 50%), radial-gradient(circle at 70% 60%, rgba(0, 149, 255, 0.15), transparent 50%)',
          }}></div>
        </div>
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.07) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite',
        }}></div>
        
        {/* Holographic Scan Lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 212, 255, 0.02) 50%, rgba(0, 0, 0, 0) 100%)',
          animation: 'scan 8s linear infinite',
        }}></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => {
            const size = Math.random() * 5 + 2;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 5;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            return (
              <div 
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-arc-blue/40 to-arc-cyan/40 backdrop-blur-[1px]"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${posX}%`,
                  top: `${posY}%`,
                  animation: `float ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                  boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)',
                  filter: 'blur(0.5px)'
                }}
              ></div>
            );
          })}
        </div>
        
        {/* Corner Accents - Hidden on mobile for performance */}
        <div className="hidden md:block absolute top-0 left-0 w-48 h-48 -ml-24 -mt-24 bg-arc-blue/5 rounded-full filter blur-3xl"></div>
        <div className="hidden md:block absolute bottom-0 right-0 w-64 h-64 -mr-32 -mb-32 bg-arc-cyan/5 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Enhanced Main Login Card */}
      <motion.div 
        className="w-full max-w-md relative z-10 px-4 sm:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Enhanced Arc Reactor Animation */}
        <div className="flex justify-center mb-6 md:mb-10 relative group">
          <div className="relative w-28 h-28 md:w-40 md:h-40">
            {/* Outer Glow - Hidden on mobile for performance */}
            <div className="hidden md:block absolute inset-0 rounded-full bg-arc-blue/10 blur-xl animate-pulse"></div>
            
            {/* Outer Ring with Animation */}
            <div className="absolute inset-0 rounded-full border-2 border-arc-blue/30 animate-spin-slow">
              <div className="absolute top-0 left-1/2 w-1 h-3 -mt-1 -ml-0.5 bg-arc-blue rounded-full"></div>
              <div className="absolute top-1/2 right-0 w-3 h-1 -mt-0.5 -mr-1 bg-arc-blue/80 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 w-1 h-3 -mb-1 -ml-0.5 bg-arc-blue/60 rounded-full"></div>
              <div className="absolute top-1/2 left-0 w-3 h-1 -mt-0.5 -ml-1 bg-arc-blue/40 rounded-full"></div>
            </div>
            
            {/* Middle Ring */}
            <div className="absolute inset-4 rounded-full border border-arc-blue/20 animate-pulse"></div>
            
            {/* Inner Core */}
            <motion.div 
              className="absolute inset-8 rounded-full bg-gradient-to-br from-arc-blue to-arc-cyan"
              animate={{
                boxShadow: [
                  '0 0 15px rgba(0, 212, 255, 0.5)',
                  '0 0 30px rgba(0, 149, 255, 0.6)',
                  '0 0 15px rgba(0, 212, 255, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm"></div>
              
              {/* Pulsing Core */}
              <motion.div 
                className="absolute inset-1 rounded-full bg-arc-blue"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              ></motion.div>
            </motion.div>
            
            {/* Connecting Lines - Hidden on mobile for performance */}
            <div className="hidden md:block absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-arc-blue/30 to-transparent"
                  style={{
                    transform: `rotate(${i * 45}deg) translateX(50%)`,
                    transformOrigin: 'left center'
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Enhanced Sound Toggle */}
          <motion.button 
            onClick={toggleSound}
            className="absolute top-0 right-0 p-2.5 rounded-full bg-stark-darker/80 backdrop-blur-sm border border-arc-500/20 hover:border-arc-blue/40 transition-all duration-300 group"
            aria-label={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-arc-blue group-hover:text-white transition-colors" />
            ) : (
              <VolumeX className="w-5 h-5 text-arc-gray/60 group-hover:text-white transition-colors" />
            )}
          </motion.button>
        </div>
        
        {/* Auth Mode Tabs */}
        <div className="flex mb-6 border-b border-stark-dark/30">
          {['password', 'biometric', 'voice'].map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setAuthMode(mode);
                playSound(clickSound);
              }}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center transition-colors ${
                authMode === mode 
                  ? 'text-arc-blue border-b-2 border-arc-blue' 
                  : 'text-stark-gray hover:text-white'
              }`}
            >
              {mode === 'password' && 'Password'}
              {mode === 'biometric' && 'Biometric'}
              {mode === 'voice' && 'Voice'}
            </button>
          ))}
        </div>
        
        {/* Auth Content */}
        <motion.div 
          className="bg-stark-dark/80 backdrop-blur-md rounded-xl p-5 sm:p-6 border border-stark-dark/30 shadow-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">STARK INDUSTRIES</h1>
            <p className="text-stark-gray text-sm">Secure Authentication Required</p>
          </div>
          
          {/* Password Auth */}
          <AnimatePresence mode="wait">
            {authMode === 'password' && (
              <motion.form 
                onSubmit={handleSubmit}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-arc-blue" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-3 bg-stark-darker/50 border border-stark-dark/50 rounded-lg text-white placeholder-stark-gray/70 focus:outline-none focus:ring-2 focus:ring-arc-blue/50 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-arc-blue" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 bg-stark-darker/50 border border-stark-dark/50 rounded-lg text-white placeholder-stark-gray/70 focus:outline-none focus:ring-2 focus:ring-arc-blue/50 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stark-gray hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-arc-blue to-arc-cyan text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition-all ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Authenticating...
                      </span>
                    ) : 'Access System'}
                  </button>
                </div>
                
                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    className="text-xs text-stark-gray hover:text-arc-blue transition-colors"
                    onClick={() => toast.info('Help', 'Please contact your system administrator.')}
                  >
                    Forgot your credentials?
                  </button>
                </div>
                
                {/* Demo Credentials */}
                <div className="mt-6 pt-4 border-t border-stark-dark/30">
                  <p className="text-xs text-stark-gray/70 text-center mb-2">Try demo accounts:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoCredentials('tony@stark.com', 'ironman3000')}
                      className="text-xs py-1.5 px-2 bg-stark-darker/50 hover:bg-stark-darker rounded text-stark-gray hover:text-arc-blue transition-colors truncate"
                      title="Tony Stark - Administrator"
                    >
                      Tony
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoCredentials('pepper@stark.com', 'pepper123')}
                      className="text-xs py-1.5 px-2 bg-stark-darker/50 hover:bg-stark-darker rounded text-stark-gray hover:text-arc-blue transition-colors truncate"
                      title="Pepper Potts - Executive"
                    >
                      Pepper
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoCredentials('rhodey@stark.com', 'warmachine')}
                      className="text-xs py-1.5 px-2 bg-stark-darker/50 hover:bg-stark-darker rounded text-stark-gray hover:text-arc-blue transition-colors truncate"
                      title="James Rhodes - Security"
                    >
                      Rhodey
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
            
            {/* Biometric Auth */}
            {authMode === 'biometric' && (
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-center py-8"
              >
                <div className="bg-stark-darker/50 p-6 rounded-xl mb-6 border border-stark-dark/50">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <Fingerprint 
                      size={80} 
                      className="text-arc-blue mx-auto"
                    />
                    <div className="absolute inset-0 rounded-full bg-arc-blue/10 animate-ping opacity-75"></div>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Biometric Authentication</h3>
                  <p className="text-stark-gray text-sm mb-6">Verify your identity using your device&apos;s biometric sensor</p>
                  
                  <button
                    onClick={handleBiometricLogin}
                    disabled={isLoading}
                    className={`inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-arc-blue to-arc-cyan text-white font-medium rounded-lg shadow-md hover:opacity-90 transition-all ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      'Scan Fingerprint'
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-stark-gray/70">
                  Don&apos;t have biometrics set up? <br />
                  <button 
                    onClick={() => setAuthMode('password')}
                    className="text-arc-blue hover:underline"
                  >
                    Use password instead
                  </button>
                </p>
              </motion.div>
            )}
            
            {/* Voice Auth */}
            {authMode === 'voice' && (
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-center py-8"
              >
                <div className="bg-stark-darker/50 p-6 rounded-xl mb-6 border border-stark-dark/50">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`relative w-16 h-16 rounded-full bg-arc-blue/10 flex items-center justify-center ${
                        isListening ? 'animate-pulse' : ''
                      }`}>
                        <Mic 
                          size={32} 
                          className={`text-arc-blue transition-transform ${
                            isListening ? 'scale-110' : ''
                          }`}
                        />
                      </div>
                      
                      {/* Voice Waveform Animation */}
                      {isListening && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div 
                              key={i}
                              className="w-1 h-2 bg-arc-blue rounded-full"
                              style={{
                                animation: `wave 1.5s ease-in-out infinite`,
                                animationDelay: `${i * 0.1}s`,
                                height: `${Math.random() * 12 + 4}px`,
                                transformOrigin: 'bottom center'
                              }}
                            ></div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium text-white mb-2">Voice Authentication</h3>
                  <p className="text-stark-gray text-sm mb-6">
                    {isListening 
                      ? 'Speak your credentials now...'
                      : 'Click below and speak your email and password'}
                  </p>
                  
                  <div className="min-h-12 mb-6 px-4 py-2 bg-stark-darker/70 rounded-lg border border-stark-dark/50">
                    <p className="text-sm font-medium text-white/80 max-w-[250px] truncate">
                      {voiceText || (isListening ? 'Listening...' : 'Say "Jarvis, log me in"')}
                    </p>
                  </div>
                  
                  <button
                    onClick={toggleVoiceRecognition}
                    className={`inline-flex items-center px-6 py-2.5 ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-gradient-to-r from-arc-blue to-arc-cyan hover:opacity-90'
                    } text-white font-medium rounded-lg shadow-md transition-all`}
                  >
                    {isListening ? (
                      <>
                        <svg className="animate-pulse -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" rx="2"/>
                          <rect x="14" y="4" width="4" height="16" rx="2"/>
                        </svg>
                        Stop Listening
                      </>
                    ) : (
                      'Start Voice Authentication'
                    )}
                  </button>
                </div>
                
                <p className="text-xs text-stark-gray/70">
                  Having trouble? <br />
                  <button 
                    onClick={() => setAuthMode('password')}
                    className="text-arc-blue hover:underline"
                  >
                    Use password instead
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-stark-gray/50">
            STARK INDUSTRIES SECURE LOGIN
            <br />
            <span className="text-[10px]">UNAUTHORIZED ACCESS PROHIBITED</span>
          </p>
        </div>
      </motion.div>
      
      {/* Enhanced Global Styles */}
      <style>{`
        @keyframes float {
          0% { 
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.8;
          }
          25% { 
            transform: translateY(-15px) translateX(5px) rotate(2deg);
            opacity: 1;
          }
          50% { 
            transform: translateY(-25px) translateX(10px) rotate(0deg);
            opacity: 0.9;
          }
          75% { 
            transform: translateY(-15px) translateX(5px) rotate(-2deg);
            opacity: 1;
          }
          100% { 
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.8;
          }
        }
        
        @keyframes wave {
          0%, 100% { 
            transform: scaleY(0.3);
            opacity: 0.7;
          }
          50% { 
            transform: scaleY(1.8);
            opacity: 1;
          }
        }
        
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        
        @keyframes scan {
          0% { background-position: 0 -100%; }
          100% { background-position: 0 200%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Selection styling */
        ::selection {
          background: rgba(0, 212, 255, 0.3);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Login;
