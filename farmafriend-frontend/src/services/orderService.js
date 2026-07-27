import axiosInstance from './axiosInstance'

export const orderService = {
  placeOrder: (payload) => axiosInstance.post('/orders', payload),
  getOrder: (id) => axiosInstance.get(`/orders/${id}`),
  myOrders: (params) => axiosInstance.get('/orders/my-orders', { params }),
  allOrders: (params) => axiosInstance.get('/orders', { params }),
  ordersForDealer: (dealerId, params) => axiosInstance.get(`/orders/dealer/${dealerId}`, { params }),
  unclaimedOrders: (params) => axiosInstance.get('/orders/unclaimed', { params }),
  claimOrder: (id) => axiosInstance.put(`/orders/${id}/claim`),
  cancelOrder: (id) => axiosInstance.put(`/orders/${id}/cancel`),
  getInvoice: (id) => axiosInstance.get(`/orders/${id}/invoice`),
  initiatePayment: (payload) => axiosInstance.post('/orders/payment', payload),
  createShipment: (payload) => axiosInstance.post('/orders/shipment', payload),
  updateShipmentStatus: (id, status) => axiosInstance.put(`/orders/${id}/shipment-status`, null, { params: { status } }),
  track: (trackingNumber) => axiosInstance.get(`/orders/track/${trackingNumber}`),
}
