import axiosInstance from './axiosInstance'

export const dealerService = {
  getAll: () => axiosInstance.get('/dealer'),
  getById: (id) => axiosInstance.get(`/dealer/${id}`),
  updateStock: (payload) => axiosInstance.put('/dealer/inventory', payload),
  getInventory: (id) => axiosInstance.get(`/dealer/${id}/inventory`),
}
