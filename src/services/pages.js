import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const getPages = async (params = {}) => {
  try {
    const res = await axios.get(`${API_URL}/pages`, { params })

    return res.data
  } catch (error) {
    console.error('❌ Error fetching Pages:', error)
    throw error
  }
}

const getPageById = async id => {
  try {
    const res = await axios.get(`${API_URL}/pages/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error fetching Page ${id}:`, error)
    throw error
  }
}

const createPage = async data => {
  try {
    const res = await axios.post(`${API_URL}/pages`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error('❌ Error creating Page:', error)
    throw error
  }
}

const updatePage = async (id, data) => {
  try {
    const res = await axios.post(`${API_URL}/pages/${id}?_method=PUT`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error(`❌ Error updating Page ${id}:`, error)
    throw error
  }
}

const deletePage = async id => {
  try {
    const res = await axios.delete(`${API_URL}/pages/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error deleting Page ${id}:`, error)
    throw error
  }
}

export { getPages, getPageById, createPage, updatePage, deletePage }
