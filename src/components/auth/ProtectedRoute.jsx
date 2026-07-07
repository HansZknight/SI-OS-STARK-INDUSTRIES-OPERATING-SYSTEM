// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES - PROTECTED ROUTE
// Route guard for authenticated users
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { motion } from 'framer-motion'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checkSession, updateActivity } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    // Check session validity
    checkSession()
    
    // Update activity on route change
    updateActivity()
  }, [location.pathname])

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}
