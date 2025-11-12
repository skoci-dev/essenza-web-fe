import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const getProjects = async (params = {}) => {
  try {
    const res = await axios.get(`${API_URL}/projects`, { params })

    return res.data
  } catch (error) {
    console.error('❌ Error fetching Projects:', error)
    throw error
  }
}

const getProjectById = async id => {
  try {
    const res = await axios.get(`${API_URL}/projects/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error fetching Project ${id}:`, error)
    throw error
  }
}

const createProject = async data => {
  try {
    const res = await axios.post(`${API_URL}/projects`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error('❌ Error creating Project:', error)
    throw error
  }
}

const updateProject = async (id, data) => {
  try {
    const res = await axios.post(`${API_URL}/projects/${id}?_method=PUT`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error(`❌ Error updating Project ${id}:`, error)
    throw error
  }
}

const deleteProject = async id => {
  try {
    const res = await axios.delete(`${API_URL}/projects/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error deleting Project ${id}:`, error)
    throw error
  }
}

export { getProjects, getProjectById, createProject, updateProject, deleteProject }
