import axiosInstance from './axiosInstance'

export const financeService = {
  apply: (payload) => axiosInstance.post('/finance/apply', payload),
  getById: (id) => axiosInstance.get(`/finance/${id}`),
  myApplications: () => axiosInstance.get('/finance/my-applications'),
  verify: (id, payload) => axiosInstance.put(`/finance/verify/${id}`, payload),
  approve: (id, payload) => axiosInstance.put(`/finance/approve/${id}`, payload),
  emiSchedule: (id) => axiosInstance.get(`/finance/${id}/emi-schedule`),
  payEmi: (emiId) => axiosInstance.post(`/finance/emi/${emiId}/pay`),
}
