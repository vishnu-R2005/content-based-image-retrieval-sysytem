import axios from 'axios'

// ✅ Always use deployed backend in production
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://content-based-image-retrieval-sysytem.onrender.com'

// ✅ Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Attach JWT access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log(`🔑 JWT attached → ${config.url}`)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🚫 Unauthorized – token expired')
      // Optional auto logout
      // localStorage.clear()
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== AUTH ====================
export const authAPI = {
  // Your custom registration endpoint (OK)
  register: (data) => api.post('/api/auth/register/', data),

  // ✅ SimpleJWT login
  login: (data) => api.post('/api/token/', data),

  refresh: (data) => api.post('/api/token/refresh/', data),

  getUser: () => api.get('/api/auth/user/'),
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
