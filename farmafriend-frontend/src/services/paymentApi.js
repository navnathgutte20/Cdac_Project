// src/services/paymentApi.js — new axios instance pointed at the payment service (8081)
import axios from 'axios'

const paymentApi = axios.create({
  baseURL: 'http://localhost:8081',
})

paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default paymentApi