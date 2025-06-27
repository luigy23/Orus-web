import axios from 'axios'

// Crear instancia
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  //withCredentials: true
})

// Interceptor para añadir el token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
      const cleanToken = token.replace(/^"|"$/g, '')
      config.headers.Authorization = `Bearer ${cleanToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosClient
