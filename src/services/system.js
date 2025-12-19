import apiClient from '@/utils/apiClient'

export const getActivityLogs = async (params = {}) => {
  return await apiClient.get(`/int/v1/system/activity-logs`, { params })
}

export const getDetailActivityLog = async id => {
  return await apiClient.get(`/int/v1/system/activity-logs/${id}`)
}

export const getSystemStatus = async () => {
  return await apiClient.get(`/int/v1/system/status`)
}

export const getSystemMetrics = async (params = {}) => {
  return await apiClient.get(`/int/v1/system/metrics`, { params })
}
