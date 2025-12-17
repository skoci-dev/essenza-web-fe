'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, pipe, nonEmpty } from 'valibot'
import classnames from 'classnames'

// Component Imports
import { CircularProgress } from '@mui/material'

import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

import { createAuthToken, getAuthUser } from '@/services/auth'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import { setCookie, getCookie, deleteCookie } from '@/utils/cookies'

const schema = object({
  username: pipe(string(), minLength(1, 'This field is required')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(8, 'Password must be at least 8 characters long')
  )
})

const Login = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [savedUsername, setSavedUsername] = useState('')

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-login-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-login-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'
  const authToken = window?.localStorage?.getItem('token') || null

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const { settings } = useSettings()
  const { loaded: recaptchaLoaded, execute, cleanup } = useRecaptcha(null, { version: 'v3', autoLoad: !authToken })

  console.log('recaptchaLoaded', recaptchaLoaded)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      captcha_token: '',
      username: savedUsername,
      password: ''
    }
  })

  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const fetchUser = async () => {
    const res = await getAuthUser()

    if (res?.data) {
      localStorage.setItem('dataUser', JSON.stringify(res?.data))
    }
  }

  // Check for error in cookie on mount
  useEffect(() => {
    const savedError = getCookie('login_error')
    const savedUser = getCookie('login_username')

    if (authToken) {
      const redirectURL = searchParams.get('redirectTo') ?? '/esse-panel/dashboard'

      return router.replace(redirectURL)
    }

    if (savedError) {
      setErrorState({ message: [savedError] })
      deleteCookie('login_error')
    }

    if (savedUser) {
      setSavedUsername(savedUser)
      deleteCookie('login_username')
    }
  }, [])

  useEffect(() => {
    if (savedUsername) {
      reset({
        username: savedUsername,
        password: ''
      })
    }
  }, [savedUsername, reset])

  const onSubmit = async data => {
    setLoading(true)
    setErrorState(null)

    let recaptchaData

    try {
      recaptchaData = await execute('login')
    } catch (error) {
      setErrorState({ message: ['Failed to verify reCAPTCHA'] })
      setLoading(false)

      return
    }

    const res = await createAuthToken({
      username: data.username,
      password: data.password,
      ...recaptchaData
    })

    console.log('Login response:', res)

    if (!res.success) {
      setCookie('login_error', res.message, 5)
      setCookie('login_username', data.username, 5)

      window.location.reload()

      return
    }

    const { token, refresh_token } = res.data

    fetchUser()
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refresh_token)

    // Cleanup reCAPTCHA after successful login
    setTimeout(() => {
      cleanup()
      window.location.reload()
    }, 2000)
  }

  return (
    !authToken && (
      <div className='flex bs-full justify-center'>
        <div
          className={classnames(
            'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
            {
              'border-ie': settings.skin === 'bordered'
            }
          )}
        >
          <div className='plb-12 pis-12'>
            <img
              src={characterIllustration}
              alt='character-illustration'
              className='max-bs-[500px] max-is-full bs-auto'
            />
          </div>
          <Illustrations
            image1={{ src: '/images/illustrations/objects/tree-2.png' }}
            image2={null}
            maskImg={{ src: authBackground }}
          />
        </div>
        <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
          <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
            <img className='h-[22px]' src={'/logo.svg'} />
          </div>
          <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]'>
            <div>
              <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
              <Typography>Please sign-in to your account and start the adventure</Typography>
            </div>
            <form
              noValidate
              action={() => {}}
              autoComplete='off'
              onSubmit={recaptchaLoaded ? handleSubmit(onSubmit) : undefined}
              className='flex flex-col gap-5'
            >
              <Controller
                name='username'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    autoFocus
                    type='text'
                    label='Email/Username'
                    disabled={loading}
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.username || errorState !== null) && {
                      error: true,
                      helperText: errors?.username?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Password'
                    id='login-password'
                    disabled={loading}
                    type={isPasswordShown ? 'text' : 'password'}
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    {...(errors.password && { error: true, helperText: errors.password.message })}
                  />
                )}
              />
              <div className='flex justify-between items-center flex-wrap gap-x-3 gap-y-1'>
                <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' disabled={loading} />
                <Typography className='text-end' color='primary' component={Link} href='/esse-panel/forgot-password'>
                  Forgot password?
                </Typography>
              </div>
              <Button fullWidth variant='contained' type='submit' disabled={loading || !recaptchaLoaded}>
                {loading ? <CircularProgress size={20} sx={{ color: '#2b2b2b' }} /> : 'Log In'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  )
}

export default Login
