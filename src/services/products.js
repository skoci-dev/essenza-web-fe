import apiClient from '@/utils/apiClient'

const getProducts = async (params = {}) => {
  return await apiClient.get(`/int/v1/products`, { params })
}

const getProductById = async id => {
  return await apiClient.get(`/int/v1/products/${id}`)
}

const createProduct = async data => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'gallery' && Array.isArray(value)) {
      value.forEach(file => formData.append('gallery', file))
    } else if (key !== 'gallery') {
      formData.append(key, value)
    }
  })

  return await apiClient.post(`/int/v1/products`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const updateProduct = async (id, data) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'gallery' && Array.isArray(value)) {
      value.forEach(file => formData.append('gallery', file))
    } else if (key !== 'gallery') {
      formData.append(key, value)
    }
  })

  return await apiClient.put(`/int/v1/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const deleteProduct = async id => {
  return await apiClient.delete(`/int/v1/products/${id}`)
}

const getProductCategories = async () => {
  return await apiClient.get('/int/v1/products/categories')
}

const getProductSpecifications = async (params = {}) => {
  return await apiClient.get('/int/v1/products/specifications', { params })
}

const addSpecificationToProduct = async (productId, specificationData) => {
  return await apiClient.post(`/int/v1/products/${productId}/specifications`, specificationData)
}

const removeSpecificationFromProduct = async (productId, specSlug) => {
  return await apiClient.delete(`/int/v1/products/${productId}/specifications/${specSlug}`)
}

const toggleProductActiveStatus = async (id, isActive) => {
  return await apiClient.patch(`/int/v1/products/${id}/toggle`, { is_active: isActive })
}

const getPubProducts = async (params = {}) => {
  return await apiClient.get('/pub/v1/products', { params })
}

const getPubProductBySlug = async slug => {
  return await apiClient.get(`/pub/v1/products/${slug}`)
}

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getProductSpecifications,
  addSpecificationToProduct,
  removeSpecificationFromProduct,
  toggleProductActiveStatus,
  getPubProducts,
  getPubProductBySlug
}
