'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'

import EndSection from '@/components/section/EndSection'

const NotFoundSite = () => {
  // Vars

  return (
    <>
      <Box sx={{ backgroundColor: '#F0F0F0', minHeight: '100vh', mt: '-115px', position: 'relative' }}>
        <Box
          component={'img'}
          src='/images/background/bg-404-1.png'
          sx={{ height: '450px', position: 'absolute', right: 0, top: '25vh' }}
        />
        <Box className={classnames(frontCommonStyles.layoutSpacing)}>
          <Box component={'img'} src='/images/background/bg-404-2.png' sx={{ height: '100px', mt: '150px' }} />
          <Typography
            sx={{
              fontFamily: '"Roboto", sans-serif',
              fontWeight: 100,
              fontStyle: 'normal',
              fontSize: '317.36px',
              lineHeight: '371.81px',
              letterSpacing: '-7.44px',
              verticalAlign: 'middle',
              marginTop: '-130px',
              color: '#FFFFFF'
            }}
          >
            404
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Roboto", sans-serif',
              fontWeight: 100,
              fontSize: '30px',
              color: '#212121',
              mb: 3
            }}
          >
            Ooops ! Page not found
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Roboto", sans-serif',
              fontWeight: 400,
              fontSize: '15px',
              color: '#212121',
              mb: 3
            }}
          >
            The page you’re looking for doesn’t exist or has been moved.
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Roboto", sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              color: '#212121',
              mb: 3
            }}
          >
            Let’s return to the essence of Essenza.
          </Typography>
          <Button
            sx={{
              backgroundColor: '#404040',
              color: '#FFFFFF',
              padding: '10px 20px'
            }}
          >
            Homepage <Box sx={{ ml: '6px', height: '14px' }} component={'img'} src='/icons/to-homepage.svg' />
          </Button>
        </Box>
      </Box>
      <EndSection />
    </>
  )
}

export default NotFoundSite
