import axios from 'axios'

export const INSUFFICIENT_ROLE_CODE = 'auth_insufficient_role'

const handleUnauthorized = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    window.location.href = '/esse-panel/login'
  }
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' }
})

apiClient.interceptors.request.use(config => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  response => {
    return {
      success: true,
      status: response.status,
      data: response.data.data,
      meta: response.data.meta,
      message: response.data.message || 'Success'
    }
  },

  error => {
    const errRes = error.response || {}
    const status = errRes.status
    const errorCode = errRes.data?.meta?.error_code || null

    if (status === 401 || (status === 403 && !errorCode === INSUFFICIENT_ROLE_CODE)) {
      console.warn(`Unauthorized/Forbidden response received (Status: ${status}). Logging out...`)

      handleUnauthorized()

      return Promise.resolve({
        success: false,
        status: status,
        message: 'Access denied. Session expired or invalid permission.'
      })
    }

    return Promise.resolve({
      success: false,
      status: status || 500,
      message: errRes.data?.message || error.message || 'An error occurred, please try again.',
      errorCode
    })
  }
)

export default apiClient
