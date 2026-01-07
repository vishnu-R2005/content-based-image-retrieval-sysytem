import axios from 'axios'

// ✅ Set Base URL (adjust if backend URL changes)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

// ✅ Create main Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Attach JWT to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log(`🔑 [Axios] Attached JWT to ${config.url}`)
    } else {
      console.warn(`⚠️ [Axios] No JWT found for ${config.url}`)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Global 401 handler (auto logout optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🚫 [Axios] Unauthorized! Token expired or invalid.')
      // Optional auto-logout:
      // localStorage.removeItem('token')
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== AUTH ====================
export const authAPI = {
  register: (data) => api.post('/api/auth/register/', data),
  login: (data) => api.post('/api/auth/login/', data),
  getUser: () => api.get('/api/auth/user/'),
  promoteUser: (userId) => api.post(`/api/auth/promote/${userId}/`),
}

// ==================== IMAGES ====================
export const imageAPI = {
  upload: (formData) =>
    api.post('/api/images/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  list: () => api.get('/api/images/list/'),
  delete: (id) => api.delete(`/api/images/${id}/`),
}

// ==================== SEARCH ====================
export const searchAPI = {
  search: (formData, topK = 20) => {
    formData.append('top_k', topK)
    return api.post('/api/search/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ==================== STATS ====================
export const statsAPI = {
  getStats: () => api.get('/api/stats/'),
}

export default api
