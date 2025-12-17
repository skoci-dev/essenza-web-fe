import apiClient from '@/utils/apiClient'

const getContactMessages = async (params = {}) => {
  return await apiClient.get(`/int/v1/contact-messages`, { params })
}

const readContactMessages = async id => {
  return await apiClient.patch(`/int/v1/contact-messages/${id}/read`, { is_read: true })
}

const contactMessages = async data => {
  return await apiClient.post('/pub/v1/contact-messages', data)
}

export { getContactMessages, readContactMessages, contactMessages }
