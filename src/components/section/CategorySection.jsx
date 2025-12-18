'use client'

import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'

const styles = {
  sectionBox: {},
  title: {
    fontSize: { xs: '18px', md: '24px' },
    margin: '12px 0',
    width: '100%',
    color: '#212121'
  },
  cardWrapper: {
    borderRadius: '6px',
    height: { xs: '170px', md: '360px' },
    position: 'relative',
    overflow: 'hidden'
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 5
    }
  },
  cardLabel: {
    zIndex: 10,
    fontSize: { xs: '18px', md: '24px' },
    position: 'absolute',
    top: '47%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    width: '100%',
    color: '#FFFFFF',
    fontFamily: 'Maison Neue',
    fontWeight: 600,
    '& span': {
      fontWeight: 100
    }
  },
  bigCard: {
    borderRadius: '10px',
    height: { xs: '45vh', md: '90vh' },
    position: 'relative',
    overflow: 'hidden',
    '& img': {
      height: '100%',
      width: '100%',
      objectFit: 'cover'
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.45)',
      zIndex: 5
    }
  },

  bigCardButton: {
    position: 'absolute',
    right: '24px',
    bottom: '24px',
    color: 'white',
    borderColor: 'white',
    borderRadius: '10px',
    zIndex: 10
  }
}

const data = [
  { id: 1, label: 'Marble', image: '/images/illustrations/photos/category-1.jpg' },
  { id: 2, label: 'Stone', image: '/images/illustrations/photos/category-2.jpg' },
  { id: 3, label: 'Classic', image: '/images/illustrations/photos/category-3.jpg' },
  { id: 4, label: 'Granity', image: '/images/illustrations/photos/category-4.jpg' },
  { id: 5, label: 'Cemento', image: '/images/illustrations/photos/category-5.jpg' },
  { id: 6, label: 'Wood', image: '/images/illustrations/photos/category-6.jpg' }
]

const CategorySection = () => {
  return (
    <Box className={classnames('pb-6', frontCommonStyles.layoutSpacing)} sx={styles.sectionBox}>
      <Typography sx={styles.title}>Marble</Typography>

      <Grid container spacing={3}>
        {data.map(item => (
          <Grid key={item.id} item xs={6} sm={6} lg={4}>
            <Card sx={styles.cardWrapper}>
              <Box sx={styles.imageWrapper}>
                <img src={item.image} alt={item.label} />
              </Box>
              <Typography sx={styles.cardLabel}>
                {item.label} <span>Series</span>
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container mt={8}>
        <Grid item xs={12}>
          <Card sx={styles.bigCard}>
            <img src='/images/illustrations/photos/banner-category.jpg' alt='go' />
            <Button sx={styles.bigCardButton} variant='outlined' size='small'>
              Go To Essenza New Design
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CategorySection
