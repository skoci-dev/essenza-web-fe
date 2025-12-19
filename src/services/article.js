import apiClient from '@/utils/apiClient'

const getArticles = async (params = {}) => {
  return await apiClient.get('/int/v1/articles', { params })
}

const getArticleById = async id => {
  return await apiClient.get(`/int/v1/articles/${id}`)
}

const createArticle = async data => {
  return await apiClient.post('/int/v1/articles', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const updateArticle = async (id, data) => {
  return await apiClient.put(`/int/v1/articles/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const deleteArticle = async id => {
  return await apiClient.delete(`/int/v1/articles/${id}`)
}

const getPubArticles = async (params = {}) => {
  return await apiClient.get('/pub/v1/articles', { params })
}

const getPubArticleBySlug = async slug => {
  return await apiClient.get(`/pub/v1/articles/${slug}`)
}

export { getArticles, getArticleById, createArticle, updateArticle, deleteArticle, getPubArticles, getPubArticleBySlug }
