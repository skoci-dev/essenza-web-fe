import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const getProducts = async (params = {}) => {
  try {
    const res = await axios.get(`${API_URL}/products`, { params })

    return res.data
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    throw error
  }
}

const getProductById = async id => {
  try {
    const res = await axios.get(`${API_URL}/products/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error fetching product ${id}:`, error)
    throw error
  }
}

const createProduct = async data => {
  try {
    const res = await axios.post(`${API_URL}/products`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error('❌ Error creating product:', error)
    throw error
  }
}

const updateProduct = async (id, data) => {
  try {
    const res = await axios.post(`${API_URL}/products/${id}?_method=PUT`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error(`❌ Error updating product ${id}:`, error)
    throw error
  }
}

const deleteProduct = async id => {
  try {
    const res = await axios.delete(`${API_URL}/products/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error deleting product ${id}:`, error)
    throw error
  }
}

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct }
