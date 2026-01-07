import { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔄 Load user on page refresh
  useEffect(() => {
    const loadUser = async () => {
      try {
        const access = localStorage.getItem('access')
        if (!access) {
          setLoading(false)
          return
        }
        const res = await authAPI.getUser()
        setUser(res.data)
      } catch (err) {
        localStorage.clear()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  // 🟢 REGISTER
  const register = async (username, email, password, password2) => {
    try {
      const res = await authAPI.register({
        username,
        email,
        password,
        password2,
      })

      // Save tokens
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)

      setUser(res.data.user)

      return { success: true }
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message)
      alert(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        'Registration failed'
      )
      return { success: false }
    }
  }

  // 🔐 LOGIN
  const login = async (username, password) => {
    try {
      const res = await authAPI.login({ username, password })

      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)

      const userRes = await authAPI.getUser()
      setUser(userRes.data)

      return { success: true }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message)
      alert('Invalid username or password')
      return { success: false }
    }
  }

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
