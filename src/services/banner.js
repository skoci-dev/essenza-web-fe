import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const getBanners = async (params = {}) => {
  try {
    const res = await axios.get(`${API_URL}/banners`, { params })

    return res.data
  } catch (error) {
    console.error('❌ Error fetching banners:', error)
    throw error
  }
}

const getBannerById = async id => {
  try {
    const res = await axios.get(`${API_URL}/banners/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error fetching banner ${id}:`, error)
    throw error
  }
}

const createBanner = async data => {
  try {
    const res = await axios.post(`${API_URL}/banners`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error('❌ Error creating banner:', error)
    throw error
  }
}

const updateBanner = async (id, data) => {
  try {
    const res = await axios.post(`${API_URL}/banners/${id}?_method=PUT`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error(`❌ Error updating banner ${id}:`, error)
    throw error
  }
}

const deleteBanner = async id => {
  try {
    const res = await axios.delete(`${API_URL}/banners/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error deleting banner ${id}:`, error)
    throw error
  }
}

export { getBanners, getBannerById, createBanner, updateBanner, deleteBanner }
