import apiClient from '@/utils/apiClient'

const createSetting = async data => {
  return await apiClient.post('/int/v1/settings', data)
}

const getSettings = async (params = {}) => {
  return await apiClient.get('/int/v1/settings', { params })
}

const getSettingBySlug = async slug => {
  return await apiClient.get(`/int/v1/settings/${slug}`)
}

const updateSetting = async (slug, data) => {
  return await apiClient.patch(`/int/v1/settings/${slug}`, data)
}

const deleteSetting = async slug => {
  return await apiClient.delete(`/int/v1/settings/${slug}`)
}

const getPubSettings = async (params = {}) => {
  return await apiClient.get('/int/v1/settings', { params })
}

const getPubSettingBySlug = async slug => {
  return await apiClient.get(`/int/v1/settings/${slug}`)
}

export {
  createSetting,
  getSettings,
  getSettingBySlug,
  updateSetting,
  deleteSetting,
  getPubSettings,
  getPubSettingBySlug
}
