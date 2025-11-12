import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const getBrochures = async (params = {}) => {
  try {
    const res = await axios.get(`${API_URL}/brochures`, { params })

    return res.data
  } catch (error) {
    console.error('❌ Error fetching brochures:', error)
    throw error
  }
}

const getBrochureById = async id => {
  try {
    const res = await axios.get(`${API_URL}/brochures/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error fetching product ${id}:`, error)
    throw error
  }
}

const createBrochure = async data => {
  try {
    const res = await axios.post(`${API_URL}/brochures`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error('❌ Error creating product:', error)
    throw error
  }
}

const updateBrochure = async (id, data) => {
  try {
    const res = await axios.post(`${API_URL}/brochures/${id}?_method=PUT`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error(`❌ Error updating product ${id}:`, error)
    throw error
  }
}

const deleteBrochure = async id => {
  try {
    const res = await axios.delete(`${API_URL}/brochures/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error deleting product ${id}:`, error)
    throw error
  }
}

export { getBrochures, getBrochureById, createBrochure, updateBrochure, deleteBrochure }
