import apiClient from '@/utils/apiClient'

const getCities = async (params = {}) => {
  return await apiClient.get(`/int/v1/master-data/cities`, { params })
}

export { getCities }
