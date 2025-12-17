import apiClient from '@/utils/apiClient'

const contactMessages = async data => {
  return await apiClient.post('/pub/v1/contact-messages', data)
}

export { contactMessages }
