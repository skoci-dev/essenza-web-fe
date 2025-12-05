import apiClient from '@/utils/apiClient'

const getProjects = async (params = {}) => {
  return await apiClient.get(`/int/v1/projects`, { params })
}

const getProjectById = async id => {
  return await apiClient.get(`/int/v1/projects/${id}`)
}

const createProject = async data => {
  return await apiClient.post(`/int/v1/projects`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const updateProject = async (id, data) => {
  return await apiClient.put(`/int/v1/projects/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const deleteProject = async id => {
  return await apiClient.delete(`/int/v1/projects/${id}`)
}

export { getProjects, getProjectById, createProject, updateProject, deleteProject }
