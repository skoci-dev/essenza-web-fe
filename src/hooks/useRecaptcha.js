import { useEffect, useState, useCallback, useRef, useMemo } from 'react'

/**
 * Custom hook for Google reCAPTCHA integration
 * @param {string|null} containerId - Container ID for v2 widget auto-render
 * @param {Object} options - Configuration options
 * @param {'v2'|'v3'} options.version - reCAPTCHA version
 * @param {boolean} options.autoLoad - Auto load script on mount
 */
export function useRecaptcha(containerId = null, { version = 'v2', autoLoad = true } = {}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)

  const [recaptchaData, setRecaptchaData] = useState({
    captcha_token: '',
    captcha_version: version
  })

  const widgetIdRef = useRef(null)

  // Memoize site key based on version
  const siteKey = useMemo(
    () =>
      version === 'v2'
        ? process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || ''
        : process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY || '',
    [version]
  )

  // Auto-render helper function
  const autoRender = useCallback(
    targetContainerId => {
      if (!window.grecaptcha?.ready) return

      window.grecaptcha.ready(() => {
        const element = document.getElementById(targetContainerId)

        if (!element) {
          console.warn(`reCAPTCHA container '${targetContainerId}' not found`)

          return
        }

        if (widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current)
        } else {
          widgetIdRef.current = window.grecaptcha.render(targetContainerId, {
            sitekey: siteKey,
            callback: token => setRecaptchaData({ captcha_token: token, captcha_version: version })
          })
        }
      })
    },
    [siteKey, version]
  )

  const renderCheckbox = useCallback(
    (containerId, callback) => {
      if (version !== 'v2') throw new Error('renderCheckbox only works with v2')
      if (!window.grecaptcha) throw new Error('reCAPTCHA not loaded yet')

      window.grecaptcha.ready(() => {
        const element = document.getElementById(containerId)

        if (!element) {
          console.warn(`Element with ID '${containerId}' not found`)

          return
        }

        const tokenHandler = token => {
          setRecaptchaData({ captcha_token: token, captcha_version: version })
          callback?.(token)
        }

        if (widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current)
        } else {
          widgetIdRef.current = window.grecaptcha.render(containerId, {
            sitekey: siteKey,
            callback: tokenHandler
          })
        }
      })
    },
    [siteKey, version]
  )

  // Handle script loading and auto-rendering
  useEffect(() => {
    if (!autoLoad || !siteKey) {
      if (!siteKey) setError(`reCAPTCHA site key for version ${version} is not defined`)

      return
    }

    // Handle auto-rendering after load
    const handleLoad = () => {
      setLoaded(true)

      if (containerId && version === 'v2') {
        setTimeout(() => autoRender(containerId), 100)
      }
    }

    // If already loaded
    if (window.grecaptcha) {
      handleLoad()

      return
    }

    // Check for existing script
    const existingScript = document.getElementById('recaptcha-script')

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true })

      return
    }

    // Create and load new script
    const script = document.createElement('script')

    script.id = 'recaptcha-script'
    script.src =
      version === 'v3'
        ? `https://www.google.com/recaptcha/api.js?render=${siteKey}`
        : 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = handleLoad
    script.onerror = () => setError('Failed to load reCAPTCHA script')

    document.body.appendChild(script)

    return () => document.getElementById('recaptcha-script')?.remove()
  }, [version, siteKey, autoLoad, containerId, autoRender])

  const execute = useCallback(
    (action = 'submit') => {
      if (!loaded || !window.grecaptcha) {
        return Promise.reject(new Error('reCAPTCHA not loaded yet'))
      }

      if (version === 'v3') {
        return window.grecaptcha.execute(siteKey, { action })
      }

      return Promise.reject(new Error('v2 requires manual user interaction'))
    },
    [loaded, siteKey, version]
  )

  const reset = useCallback(() => {
    if (window.grecaptcha && widgetIdRef.current !== null) {
      window.grecaptcha.reset(widgetIdRef.current)
      setRecaptchaData(prev => ({ ...prev, captcha_token: '' }))
    }
  }, [])

  return {
    loaded,
    error,
    execute,
    renderCheckbox,
    reset,
    recaptchaData
  }
}
