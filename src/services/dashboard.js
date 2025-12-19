import apiClient from '@/utils/apiClient'

export const getDashboardStatistics = async () => {
  return await apiClient.get('/int/v1/dashboard/stats')
}
