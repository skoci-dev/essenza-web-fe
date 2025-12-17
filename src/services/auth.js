import apiClient from '@/utils/apiClient'

const createAuthToken = async data => {
  return await apiClient.post('/int/v1/auth/token', data)
}

const refreshAuthToken = async (data = {}) => {
  return await apiClient.put('/int/v1/auth/token', data)
}

const getAuthUser = async () => {
  return await apiClient.get('/int/v1/auth/me')
}

const updateAuthUser = async data => {
  return await apiClient.patch('/int/v1/auth/me', data)
}

const changeAuthPassword = async data => {
  return await apiClient.put('/int/v1/auth/password', data)
}

const getAccountActivities = async params => {
  return await apiClient.get('/int/v1/auth/account-activities', { params })
}

export { createAuthToken, refreshAuthToken, getAuthUser, updateAuthUser, changeAuthPassword, getAccountActivities }
