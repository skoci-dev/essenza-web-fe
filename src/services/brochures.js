import apiClient from '@/utils/apiClient'

const getBrochures = async (params = {}) => {
  return await apiClient.get(`/int/v1/brochures`, { params })
}

const getBrochureById = async id => {
  return await apiClient.get(`/int/v1/brochures/${id}`)
}

const createBrochure = async data => {
  return await apiClient.post(`/int/v1/brochures`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const updateBrochure = async (id, data) => {
  return await apiClient.put(`/int/v1/brochures/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const deleteBrochure = async id => {
  return await apiClient.delete(`/int/v1/brochures/${id}`)
}

const getPubBrochures = async (params = {}) => {
  return await apiClient.get(`/pub/v1/products/brochures`, { params })
}

export { getBrochures, getBrochureById, createBrochure, updateBrochure, deleteBrochure, getPubBrochures }
