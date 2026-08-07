import axiosInstance from './axiosInstance'

export const addressService = {
  getAll: () => axiosInstance.get('/addresses'),
  add: (address) => axiosInstance.post('/addresses', address),
  remove: (id) => axiosInstance.delete(`/addresses/${id}`),
}
