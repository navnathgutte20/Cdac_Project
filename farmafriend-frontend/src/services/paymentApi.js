import axios from 'axios'

// Payment runs as a separate service (default: 8081), independent of the
// main API (8080). Configure its base URL via VITE_PAYMENT_API_BASE_URL.
const PAYMENT_API_BASE_URL = import.meta.env.VITE_PAYMENT_API_BASE_URL || 'http://localhost:8081'

const paymentApi = axios.create({
  baseURL: PAYMENT_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

paymentApi.interceptors.request.use((config) => {
  // Must match the key authSlice.js persists the JWT under (accessToken),
  // not a generic 'token' key -- otherwise every request goes out unauthenticated.
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

paymentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Payment service rejected the token (expired/invalid). Send the user
      // back to login rather than letting the request fail silently.
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default paymentApi
