'use client'

import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'
import { getPubSettingBySlug } from '@/services/setting'

const AboutUsSection = () => {
  const [stringContent, setStringContent] = useState('')

  const styles = {
    container: {
      background: 'linear-gradient(180deg, #414141, #121212)',
      width: '100vw',
      padding: { xs: '30px 0', sm: '100px 0' }
    },
    image: {
      width: '100%',
      objectFit: 'cover',
      borderRadius: '10px'
    },
    containerText: {
      padding: '1rem 2rem !important'
    },
    title: {
      fontSize: { xs: '24px', md: '24px' },
      textAlign: { xs: 'center', sm: 'left' },
      color: 'white'
    },
    description: {
      fontSize: { xs: '14px', sm: '18px' },
      textAlign: { xs: 'center', sm: 'left' },
      color: 'white',
      marginTop: 6,
      whiteSpace: 'pre-line'
    }
  }

  const fetchStringContent = async () => {
    const cachedData = localStorage.getItem('about_us_content')

    if (cachedData) {
      setStringContent(cachedData)
    }

    try {
      const res = await getPubSettingBySlug('about_us')
      const newValue = res?.data?.value || ''

      if (newValue !== cachedData) {
        setStringContent(newValue)
        localStorage.setItem('about_us_content', newValue)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchStringContent()
  }, [])

  return (
    <Box sx={styles.container}>
      <Grid
        container
        className={classnames(frontCommonStyles.layoutSpacing)}
        sx={styles.bannerBox}
        spacing={{ xs: 0, sm: 4 }}
      >
        <Grid item xs={12} md={6}>
          <Box>
            <Box component='img' src={'/images/illustrations/photos/banner-6.jpg'} alt={`about us`} sx={styles.image} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={styles.containerText}>
          <Typography sx={styles.title}>About Us</Typography>
          <Typography sx={styles.description}>{stringContent}</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AboutUsSection
