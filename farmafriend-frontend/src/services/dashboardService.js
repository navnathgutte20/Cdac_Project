import axiosInstance from './axiosInstance'

export const dashboardService = {
  admin: () => axiosInstance.get('/dashboard/admin'),
  dealer: () => axiosInstance.get('/dashboard/dealer'),
  re: () => axiosInstance.get('/dashboard/re'),
}
