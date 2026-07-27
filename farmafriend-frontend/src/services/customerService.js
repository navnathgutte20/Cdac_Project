import axiosInstance from './axiosInstance'

export const customerService = {
  getById: (id) => axiosInstance.get(`/customers/${id}`),
  getAll: () => axiosInstance.get('/customers'),
  assignRe: (id, reId) => axiosInstance.put(`/customers/${id}/assign-re/${reId}`),
}
