import axiosInstance from './axiosInstance'

export const dashboardService = {
  admin: () => axiosInstance.get('/dashboard/admin'),
}
