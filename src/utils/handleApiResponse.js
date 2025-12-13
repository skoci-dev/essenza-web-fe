import { INSUFFICIENT_ROLE_CODE } from './apiClient'

export const handleApiResponse = async (apiCall, { success, error, onSuccess, onError, onValidationError } = {}) => {
  try {
    const res = await apiCall()

    const isSuccess = res?.status === 200 || res?.status === 201 || res?.success

    if (isSuccess) {
      if (success) success(res.message || 'Action completed successfully!')
      if (onSuccess) onSuccess(res)

      return res.data || res
    } else {
      const msg =
        res.errorCode == INSUFFICIENT_ROLE_CODE
          ? 'You do not have sufficient permissions to perform this action.'
          : res?.message || 'Unexpected API response'

      if (error) error(msg)
      if (onError) onError(res)

      if (res?.status === 422 && onValidationError) onValidationError(res.errors || [])
      throw new Error(msg)
    }
  } catch (err) {
    console.error('❌ API Error:', err)

    const msg = err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.'

    if (error) error(msg)
    if (onError) onError(err)
    throw err
  }
}
