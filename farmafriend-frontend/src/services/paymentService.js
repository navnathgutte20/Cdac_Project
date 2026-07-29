import axiosInstance from './axiosInstance'

export const paymentService = {
  createOrder: (payload) => api.post('/api/payment/create-order', payload),
  verifyPayment: (payload) => api.post('/api/payment/verify', payload),
}
