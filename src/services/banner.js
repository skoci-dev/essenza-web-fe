import apiClient from '@/utils/apiClient'

const getBanners = async (params = {}) => {
  return await apiClient.get('/int/v1/banners', { params })
}

const getBannerById = async id => {
  return await apiClient.get(`/int/v1/banners/${id}`)
}

const createBanner = async data => {
  return await apiClient.post('/int/v1/banners', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const updateBanner = async (id, data) => {
  return await apiClient.put(`/int/v1/banners/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const deleteBanner = async id => {
  return await apiClient.delete(`/int/v1/banners/${id}`)
}

export { getBanners, getBannerById, createBanner, updateBanner, deleteBanner }
