import apiClient from '@/utils/apiClient'

const getPages = async (params = {}) => {
  return await apiClient.get(`/int/v1/pages`, { params })
}

const getPageById = async id => {
  return await apiClient.get(`/int/v1/pages/${id}`)
}

const createPage = async data => {
  return await apiClient.post(`/int/v1/pages`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const updatePage = async (id, data) => {
  return await apiClient.put(`/int/v1/pages/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const deletePage = async id => {
  return await apiClient.delete(`/int/v1/pages/${id}`)
}

const getPubPageBySlug = async slug => {
  return await apiClient.get(`/pub/v1/pages/${slug}`)
}

export { getPages, getPageById, createPage, updatePage, deletePage, getPubPageBySlug }
