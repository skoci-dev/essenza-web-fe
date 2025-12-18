import apiClient from '@/utils/apiClient'

export const getPubIndonesianCities = async () => {
  return await apiClient.get('/pub/v1/geo/countries/ID/cities')
}
