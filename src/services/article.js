import apiClient from '@/utils/apiClient'

const getArticles = async (params = {}) => {
  return await apiClient.get('/articles', { params })
}

const getArticleById = async id => {
  return await apiClient.get(`/articles/${id}`)
}

const createArticle = async data => {
  return await apiClient.post('/articles', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const updateArticle = async (id, data) => {
  return await apiClient.put(`/articles/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const deleteArticle = async id => {
  return await apiClient.delete(`/articles/${id}`)
}

export { getArticles, getArticleById, createArticle, updateArticle, deleteArticle }
