const updateGeneralSetting = async (id, data) => {
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

const updateSocialMedia = async (id, data) => {
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

export { updateGeneralSetting, updateSocialMedia }
