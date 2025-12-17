import apiClient from '@/utils/apiClient'

export const getActivityLogs = async (params = {}) => {
  return await apiClient.get(`/int/v1/system/activity-logs`, { params })
}

export const getDetailActivityLog = async id => {
  return await apiClient.get(`/int/v1/system/activity-logs/${id}`)
}
