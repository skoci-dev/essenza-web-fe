'use client'

import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'
import { getPubSettingBySlug } from '@/services/setting'

const VisionSection = () => {
  const [visionContent, setVisionContent] = useState('')
  const [missionContent, setMissionContent] = useState('')

  const styles = {
    container: {
      background: 'linear-gradient(180deg, #EDEDED, #F9F9F9)',
      width: '100vw',
      padding: { xs: '50px 0', sm: '100px 0' }
    },
    containerNd: {
      background: '#FFFFFF',
      width: '100vw',
      padding: { xs: '25px 0', sm: '50px 0' }
    },
    image: {
      width: '100%',
      height: { xs: '220px', sm: '420px' },
      objectFit: 'cover',
      borderRadius: '10px'
    },
    containerText: {
      paddingTop: '0 !important',
      paddingRight: { xs: 0, sm: '2rem !important' }
    },
    title: {
      fontSize: { xs: '28px', md: '24px' },
      fontWeight: 500,
      textAlign: { xs: 'center', sm: 'left' },
      color: '#000000'
    },
    description: {
      fontSize: { xs: '14px', sm: '18px' },
      textAlign: { xs: 'center', sm: 'left' },
      color: '#000000',
      marginTop: { xs: 3, sm: 6 },
      whiteSpace: 'pre-line'
    },
    divider: {
      width: '100%',
      height: '2px',
      borderBottomWidth: '1px',
      borderColor: '#000000',
      color: '#000000',
      margin: { xs: '24px 0', sm: '48px 0' }
    }
  }

  const fetchData = async () => {
    const cachedVision = localStorage.getItem('cache_vision')
    const cachedMission = localStorage.getItem('cache_mission')

    if (cachedVision) setVisionContent(cachedVision)
    if (cachedMission) setMissionContent(cachedMission)

    try {
      const [resVision, resMission] = await Promise.all([getPubSettingBySlug('vision'), getPubSettingBySlug('mission')])

      const newVision = resVision?.data?.value || ''
      const newMission = resMission?.data?.value || ''

      setVisionContent(newVision)
      setMissionContent(newMission)
      localStorage.setItem('cache_vision', newVision)
      localStorage.setItem('cache_mission', newMission)
    } catch (error) {
      console.error('Failed to fetch Vision/Mission:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const contentBottom = [
    'The pioneer porcelain tile manufacturer in Indonesia',
    'Indonesian leading brand for Porcelain Tile',
    'Trendsetter for design and quality'
  ]

  return (
    <>
      <Box sx={styles.container}>
        <Grid container className={classnames(frontCommonStyles.layoutSpacing)} spacing={3}>
          <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Box component='img' src={'/images/illustrations/photos/banner-category.jpg'} sx={styles.image} />
              </Grid>
              <Grid item xs={7}>
                <Box component='img' src={'/images/illustrations/photos/category-3.jpg'} sx={styles.image} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4.5} sx={styles.containerText} mt={5}>
            <Typography sx={styles.title}>Vision</Typography>
            <Typography sx={styles.description}>{visionContent}</Typography>
            <Divider sx={styles.divider} />
            <Typography sx={styles.title}>Mission</Typography>
            <Typography sx={styles.description}>{missionContent}</Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box component='img' src={'/images/illustrations/photos/banner-category.jpg'} sx={styles.image} />
          </Grid>
          <Grid item xs={12} md={4.5} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box component='img' src={'/images/illustrations/photos/category-3.jpg'} sx={styles.image} />
          </Grid>
        </Grid>
      </Box>
      <Box sx={styles.containerNd}>
        <Grid container className={classnames(frontCommonStyles.layoutSpacing)} spacing={{ xs: 0, sm: 3 }}>
          {contentBottom.map((content, index) => (
            <Grid
              key={content}
              item
              xs={12}
              md={4}
              sx={{
                ...styles.containerText,
                borderLeft: { xs: 'unset', sm: index >= contentBottom.length - 2 ? '1px solid #000000' : 'none' },
                borderBottom: { xs: '1px solid #000000', sm: 'unset' },
                paddingLeft: { xs: 'unset', sm: index >= contentBottom.length - 2 ? '2.75rem !important' : 0 },
                paddingBottom: { xs: '24px', sm: '0' },
                marginBottom: { xs: '24px', sm: '0' }
              }}
            >
              <Typography
                sx={{ ...styles.title, fontSize: { xs: '16px', sm: '18px' }, padding: { xs: '0 70px', sm: '0 20px' } }}
              >
                {content}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
}

export default VisionSection
