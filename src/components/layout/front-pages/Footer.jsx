'use client'

import { useCallback, useState } from 'react'

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

const footerSections = [
  {
    sectionId: 'about-essenza',
    title: 'About Essenza',
    links: [
      { id: 'about-essenza', label: 'About Essenza', href: '/about' },
      { id: 'find-a-store', label: 'Find a Store', href: '/store' },
      { id: 'news-event', label: 'News & Event', href: '/news' }
    ]
  },
  {
    sectionId: 'customer-care',
    title: 'Customer Care',
    links: [
      { id: 'customer-care', label: 'Customer Care', href: '/customer-care' },
      { id: 'download', label: 'Download', href: '/download' },
      { id: 'esprienza', label: 'Esprienza', href: '/esprienza' }
    ]
  },
  {
    sectionId: 'get-in-touch',
    title: 'Get in Touch',
    links: [
      { id: 'get-it-touch', label: 'Get in Touch', href: '/get-in-touch' },
      { id: 'contact-us', label: 'Contact Us', href: '/contact-us' }
    ]
  },
  {
    sectionId: 'info',
    title: 'Info',
    links: [{ id: 'info', label: 'Info', href: '/info' }]
  }
]

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

      console.log('result', result)

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
  }, [email])

  return (
    <>
      <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
        <Typography sx={styles.textSubcribe}>Enter your email to receive news, information about essenza</Typography>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={9}>
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
          <Grid item xs={3}>
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
          <Grid item>
            <Typography className='text-[#212121] font-weigth-400 text-md'>Follow Us :</Typography>
          </Grid>
          {socialMedia.map(social => (
            <Grid item key={social.href}>
              <a href={social?.href || '#'} target='_blank'>
                <img className='h-[26px]' src={social.icon} />
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

const Footer = ({ initialSocialMedia }) => {
  return (
    <footer className='bg-white border-t border-[#D1D1D1]'>
      <div className={classnames('pb-6', frontCommonStyles.layoutSpacing)}>
        <Grid container rowSpacing={10} columnSpacing={12}>
          {/* Left Section */}
          <Grid item xs={12} sm={6} lg={8}>
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
                  <Grid item xs={6} className='w-full'>
                    <CustomButton>Esperianza</CustomButton>
                  </Grid>
                  <Grid item xs={6} className='w-full'>
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
                {footerSections.map(section => (
                  <Grid key={section.sectionId} item xs={6} sm={6} lg={2.5}>
                    {section.links.map(link => (
                      <a key={link.href} href={link.href} className='text-sm hover:underline'>
                        <Typography className='text-[#212121] mt-3 font-weigth-400 text-xs'>{link.label}</Typography>
                      </a>
                    ))}
                  </Grid>
                ))}
              </Grid>
            </div>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} sm={6} lg={4}>
            <Grid container className='items-center py-5' spacing={2} sx={styles.rightButtonGroup}>
              <Grid item xs={6}>
                <CustomButton>Esperianza</CustomButton>
              </Grid>
              <Grid item xs={6}>
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
