import paymentApi from './paymentApi'

export const paymentService = {
  createOrder: (payload) => paymentApi.post('/api/payment/create-order', payload),
  verifyPayment: (payload) => paymentApi.post('/api/payment/verify', payload),
  getStatus: (orderId) => paymentApi.get(`/api/payment/status/${orderId}`),
}
