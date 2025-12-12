export const formatDateToCustomStringNative = isoString => {
  if (!isoString) return ''

  const date = new Date(isoString)

  const datePart = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)

  const timePart = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date)

  const cleanTimePart = timePart.replace(/\./g, ':')

  return `${datePart} | ${cleanTimePart}`
}

export const formatDateToFullMonth = isoString => {
  if (!isoString) return ''

  const date = new Date(isoString)

  // Menggunakan locale 'en-US' untuk format standar Amerika (Month Day, Year)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', // 2025
    month: 'long', // December
    day: 'numeric' // 13
  }).format(date)
}

export const slugify = text => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export const convertStringtoArray = rawValue => {
  let tags = []

  if (typeof rawValue === 'string' && rawValue.trim() !== '') {
    tags = rawValue
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
  } else if (Array.isArray(rawValue)) {
    tags = rawValue
  }

  return tags
}

export const getFilename = (input = '') => {
  if (!input) return ''

  return input.trim().split('/').pop()
}
