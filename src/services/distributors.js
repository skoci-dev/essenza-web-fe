import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const getDistributors = async (params = {}) => {
  try {
    const res = await axios.get(`${API_URL}/distributors`, { params })

    return res.data
  } catch (error) {
    console.error('❌ Error fetching distributors:', error)
    throw error
  }
}

const getDistributorById = async id => {
  try {
    const res = await axios.get(`${API_URL}/distributors/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error fetching distributor ${id}:`, error)
    throw error
  }
}

const createDistributor = async data => {
  try {
    const res = await axios.post(`${API_URL}/distributors`, data)

    return res.data
  } catch (error) {
    console.error('❌ Error creating distributor:', error)
    throw error
  }
}

const updateDistributor = async (id, data) => {
  try {
    const res = await axios.post(`${API_URL}/distributors/${id}?_method=PUT`, data)

    return res.data
  } catch (error) {
    console.error(`❌ Error updating distributor ${id}:`, error)
    throw error
  }
}

const deleteDistributor = async id => {
  try {
    const res = await axios.delete(`${API_URL}/distributors/${id}`)

    return res.data
  } catch (error) {
    console.error(`❌ Error deleting distributor ${id}:`, error)
    throw error
  }
}

export { getDistributors, getDistributorById, createDistributor, updateDistributor, deleteDistributor }
