import axiosInstance from './axiosInstance'

export const reService = {
  getAssignedCustomers: () => axiosInstance.get('/re/customers'),
  getCustomer: (id) => axiosInstance.get(`/re/customers/${id}`),
  getCustomerOrders: (id, params) => axiosInstance.get(`/re/customers/${id}/orders`, { params }),
  onboardCustomer: (payload) => axiosInstance.post('/re/customers', payload),
}
