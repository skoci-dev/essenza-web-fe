const COOKIE_PREFIX = 'essenza_'

const browserEnvironmentOnly = () => {
  if (typeof document === 'undefined') throw new Error('setCookie can only be used in a browser environment')
}

export const setCookie = (name, value, minutes = 5) => {
  browserEnvironmentOnly()
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString()

  document.cookie = `${COOKIE_PREFIX + name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Strict`
}

export const getCookie = name => {
  browserEnvironmentOnly()
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_PREFIX + name + '=([^;]+)'))

  return match ? decodeURIComponent(match[2]) : null
}

export const deleteCookie = name => {
  browserEnvironmentOnly()
  document.cookie = `${COOKIE_PREFIX + name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`
}
