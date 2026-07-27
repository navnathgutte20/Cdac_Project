import axiosInstance from './axiosInstance'

export const reService = {
  getAssignedCustomers: () => axiosInstance.get('/re/customers'),
}
