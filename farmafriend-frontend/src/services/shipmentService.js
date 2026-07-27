import axiosInstance from './axiosInstance'

export const shipmentService = {
  create: (payload) => axiosInstance.post('/shipment', payload),
  updateStatus: (id, status) => axiosInstance.put(`/shipment/${id}/status`, null, { params: { status } }),
  track: (trackingNumber) => axiosInstance.get(`/shipment/track/${trackingNumber}`),
  getForDealer: (dealerId) => axiosInstance.get(`/shipment/dealer/${dealerId}`),
}
