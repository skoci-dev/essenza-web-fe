'use client'

import { useCallback, useState } from 'react'

import { useParams } from 'next/navigation'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import classnames from 'classnames'

import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3'

import { CircularProgress } from '@mui/material'

import Link from '@components/Link'

import frontCommonStyles from '@views/front-pages/styles.module.css'
import CustomButton from '@/@core/components/mui/Button'
import { subscribeUser } from '@/services/subscribe'

const styles = {
  subscribePlaceholder: {
    '& .MuiOutlinedInput-input::placeholder': {
      color: '#757575 !important',
      fontSize: '13px',
      opacity: 1
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#757575 !important'
      },
      '& .MuiInputBase-input': {
        padding: '6.5px 14px'
      }
    }
  },
  buttonSubcribe: {
    fontSize: '12px',
    textTransform: 'capitalize',
    height: '34px',
    backgroundColor: '#BB8B05 !important'
  },
  dividerFullWidth: {
    borderBottomWidth: 'inherit',
    width: { xs: '100vw', sm: '100%' },
    marginLeft: { xs: '-24px', sm: 0 }
  },
  dividerMobileOnly: {
    borderBottomWidth: 'inherit',
    margin: '24px 0',
    width: '100%'
  },
  subscribeMobileWrapper: {
    display: { xs: 'block', sm: 'block', md: 'none' },
    width: { xs: '100%' }
  },
  subscribeDesktopWrapper: {
    display: { xs: 'none', sm: 'none', md: 'block' }
  },
  mobileButtonGroup: {
    display: { xs: 'flex', sm: 'none' },
    flexDirection: { xs: 'column' },
    alignItems: { xs: 'end' }
  },
  logoWrapper: {
    display: { xs: 'flex' },
    width: { xs: '100%' },
    alignItems: { xs: 'center' }
  },
  rightButtonGroup: {
    display: { xs: 'none', sm: 'flex' }
  },
  textSubcribe: {
    color: '#212121',
    mt: { xs: 4, sm: 1 },
    fontWeight: 400,
    fontSize: '12px'
  }
}

const SubcribesFooter = ({ socialMedia }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState()
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false)

  const onVerify = useCallback(token => {
    setToken(token)
  }, [])

  const handleEmailChange = useCallback(e => {
    setEmail(e.target.value)
  }, [])

  const handleSubscribe = useCallback(async () => {
    setLoading(true)

    try {
      const data = {
        captcha_token: token,
        captcha_version: 'v3',
        email: email
      }

      const result = await subscribeUser(data)

      if (result.success) {
        alert('Terima kasih! Langganan berhasil.')
        setEmail('')
      } else {
        alert(result.message || 'Gagal berlangganan. Coba lagi.')
      }
    } catch (error) {
      console.error('Subscription Error:', error)
      alert('Terjadi kesalahan sistem. Coba lagi nanti.')
    } finally {
      setLoading(false)
      setRefreshReCaptcha(r => !r)
    }
  }, [email, token])

  return (
    <>
      <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
        <Typography sx={styles.textSubcribe}>Enter your email to receive news, information about essenza</Typography>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={9} key='subscribe-email-input'>
            <TextField
              className='w-full rounded-[6px]'
              size='small'
              placeholder='Input your email address'
              variant='outlined'
              sx={styles.subscribePlaceholder}
              value={email}
              onChange={handleEmailChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={3} key='subscribe-submit-button'>
            <GoogleReCaptcha onVerify={onVerify} refreshReCaptcha={refreshReCaptcha} />
            <Button
              sx={styles.buttonSubcribe}
              variant='contained'
              className='w-full text-[#FFFFFF] rounded-[6px]'
              size='small'
              fullWidth
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#2b2b2b' }} /> : 'Submit'}
            </Button>
          </Grid>
        </Grid>
        <Divider sx={styles.dividerMobileOnly} className='border-t border-[#212121]' />
        <Grid container spacing={2}>
          <Grid item key='follow-us-label'>
            <Typography className='text-[#212121] font-weigth-400 text-md'>Follow Us :</Typography>
          </Grid>
          {socialMedia?.map((social, index) => (
            <Grid item key={social.id || `social-${index}`}>
              <a href={social?.href || '#'} target='_blank' rel='noopener noreferrer'>
                <img className='h-[26px]' src={social.icon} alt={social.name || 'social media'} />
              </a>
            </Grid>
          ))}
        </Grid>
        <Divider
          sx={{ ...styles.dividerFullWidth, display: { sm: 'none' } }}
          className='border-t border-[#212121] mt-6 mb-3'
        />
      </GoogleReCaptchaProvider>
    </>
  )
}

const Footer = ({ initialSocialMedia, footerMenus }) => {
  const { lang: locale } = useParams()

  return (
    <footer className='bg-white border-t border-[#D1D1D1]'>
      <div className={classnames('pb-6', frontCommonStyles.layoutSpacing)}>
        <Grid container rowSpacing={10} columnSpacing={12}>
          {/* Left Section */}
          <Grid item xs={12} sm={6} lg={8} key='footer-left-section'>
            <div className='flex flex-col items-start gap-1'>
              <Box sx={styles.logoWrapper}>
                <Link href='/'>
                  <Box
                    component='img'
                    alt='Essenza Logo'
                    sx={{ height: { xs: '60px', sm: '74px' } }}
                    src={'/logo.svg'}
                  />
                </Link>

                {/* Mobile Buttons */}
                <Grid container className='py-5' spacing={2} sx={styles.mobileButtonGroup}>
                  <Grid item xs={6} className='w-full' key='mobile-esperianza'>
                    <CustomButton>Esperianza</CustomButton>
                  </Grid>
                  <Grid item xs={6} className='w-full' key='mobile-tokopedia'>
                    <CustomButton>Tokopedia</CustomButton>
                  </Grid>
                </Grid>
              </Box>

              <Divider className='border-t border-[#212121]' sx={styles.dividerFullWidth} />

              {/* Mobile Subscribe */}
              <Box sx={styles.subscribeMobileWrapper}>
                <SubcribesFooter socialMedia={initialSocialMedia} />
              </Box>

              {/* Footer Links */}
              <Grid container>
                {footerMenus?.map((section, sectionIndex) => (
                  <Grid key={section.sectionId || `section-${sectionIndex}`} item xs={6} sm={6} lg={2.5}>
                    {section.items?.map((item, itemIndex) => (
                      <Box key={item.link || `item-${sectionIndex}-${itemIndex}`}>
                        <a href={'/' + locale + item.link} className='text-sm hover:underline'>
                          <Typography className='text-[#212121] mt-3 font-weigth-400 text-xs'>{item.label}</Typography>
                        </a>
                      </Box>
                    ))}
                  </Grid>
                ))}
              </Grid>
            </div>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} sm={6} lg={4} key='footer-right-section'>
            <Grid container className='items-center py-5' spacing={2} sx={styles.rightButtonGroup}>
              <Grid item xs={6} key='desktop-esperianza'>
                <CustomButton>Esperianza</CustomButton>
              </Grid>
              <Grid item xs={6} key='desktop-tokopedia'>
                <CustomButton>Tokopedia</CustomButton>
              </Grid>
            </Grid>

            {/* Desktop Subscribe */}
            <Box sx={styles.subscribeDesktopWrapper}>
              <SubcribesFooter socialMedia={initialSocialMedia} />
            </Box>
          </Grid>
        </Grid>
      </div>

      <div className='bg-[#414141]'>
        <div className='flex items-center justify-center py-3'>
          <p className='text-white text-[13px] opacity-[0.92]'>©essenza Co. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
