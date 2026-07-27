import axiosInstance from './axiosInstance'

export const productService = {
  search: (params) => axiosInstance.get('/products', { params }),
  getById: (id) => axiosInstance.get(`/products/${id}`),
  create: (payload) => axiosInstance.post('/products', payload),
  update: (id, payload) => axiosInstance.put(`/products/${id}`, payload),
  remove: (id) => axiosInstance.delete(`/products/${id}`),
  updateStock: (payload) => axiosInstance.put('/products/stock', payload),
  getForDealer: (dealerId) => axiosInstance.get(`/products/dealer/${dealerId}`),
}
