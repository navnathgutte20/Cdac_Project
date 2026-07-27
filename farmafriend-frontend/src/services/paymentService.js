import axiosInstance from './axiosInstance'

export const paymentService = {
  initiate: (payload) => axiosInstance.post('/payment', payload),
  getByOrder: (orderId) => axiosInstance.get(`/payment/order/${orderId}`),
}
