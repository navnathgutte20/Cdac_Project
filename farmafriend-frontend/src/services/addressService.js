import axiosInstance from './axiosInstance'

export const addressService = {
  getAll: () => axiosInstance.get('/addresses'),
  add: (payload) => axiosInstance.post('/addresses', payload),
  remove: (id) => axiosInstance.delete(`/addresses/${id}`),
}
