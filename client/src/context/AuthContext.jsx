import { createContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const isMounted = useRef(true)
  const abortControllerRef = useRef(null)

  // ✅ Helper: Safe localStorage operations
  const storage = {
    get: (key) => {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      } catch {
        return null
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (err) {
        console.error('Storage error:', err)
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key)
      } catch (err) {
        console.error('Storage remove error:', err)
      }
    }
  }

  // ✅ GET CURRENT USER
  const fetchUser = useCallback(async () => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    const token = storage.get('token')
    console.log('🔍 fetchUser: Token exists?', !!token)
    
    if (!token) {
      if (isMounted.current) {
        setUser(null)
        setLoading(false)
      }
      return
    }
    
    if (isMounted.current) setLoading(true)
    
    try {
      const res = await authService.getMe()
      if (!isMounted.current) return
      
      const userData = res?.user || res
      const normalizedUser = userData ? { ...userData, role: userData.role?.toLowerCase() } : null
      
      console.log('🔍 AUTH RESPONSE:', res)
      console.log('🔍 NORMALIZED USER ROLE:', normalizedUser?.role)
      
      setUser(normalizedUser)
      if (normalizedUser) {
        storage.set('user', normalizedUser)
      }
      setError(null)
    } catch (err) {
      if (!isMounted.current) return
      
      console.log('❌ fetchUser error:', err.response?.status, err.response?.data?.message)
      setUser(null)
      storage.remove('token')
      storage.remove('user')
      
      if (err.response?.status !== 401) {
        setError(err?.response?.data?.message || err.message)
      } else {
        console.log('🔐 401 - cleared token & logged out')
      }
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [])

  // ✅ LOGIN
  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authService.login({ email, password })
      const userData = res?.user || res
      
      if (isMounted.current) {
        setUser(userData || null)
        if (userData) {
          storage.set('user', userData)
        }
        setError(null)
      }
      return res
    } catch (err) {
      if (!isMounted.current) throw err
      
      const message = err?.response?.data?.message || err.message
      setError(message)
      throw err
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [])

  // ✅ REGISTER
  const register = useCallback(async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authService.register(userData)
      const data = res?.user || res
      
      if (isMounted.current) {
        setUser(data || null)
        if (data) {
          storage.set('user', data)
        }
        setError(null)
      }
      return res
    } catch (err) {
      if (!isMounted.current) throw err
      
      const message = err?.response?.data?.message || err.message
      setError(message)
      throw err
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [])

  // ✅ LOGOUT
  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      if (isMounted.current) {
        setUser(null)
        setError(null)
        storage.remove('user')
        storage.remove('token')
        navigate('/', { replace: true })
      }
    }
  }, [navigate])

  // ✅ UPDATE PROFILE
  const updateProfile = useCallback(async (formData) => {
    setError(null)
    try {
      const res = await authService.updateProfile(formData)
      const data = res?.user || res
      
      if (isMounted.current) {
        setUser(data || null)
        if (data) {
          storage.set('user', data)
        }
        setError(null)
      }
      return res
    } catch (err) {
      if (!isMounted.current) throw err
      
      const message = err?.response?.data?.message || err.message
      setError(message)
      throw err
    }
  }, [])

  // ✅ Initial load + cleanup
  useEffect(() => {
    isMounted.current = true
    fetchUser()
    
    return () => {
      isMounted.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchUser])

  // ✅ Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    fetchUser
  }), [user, loading, error, login, register, logout, updateProfile, fetchUser])

  // ✅ Loading state UI (simple, accessible)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" aria-hidden="true" />
          <span className="text-sm text-slate-500">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}