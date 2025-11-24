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
    fontSize: '24px',
    margin: '12px 0',
    width: '100%',
    color: '#212121'
  },
  cardWrapper: {
    borderRadius: '6px',
    opacity: 0.5,
    height: '360px',
    position: 'relative',
    overflow: 'hidden',
    '& img': {
      height: '360px',
      width: '100%',
      objectFit: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 5
    }
  },
  cardLabel: {
    zIndex: 10,
    fontSize: '24px',
    position: 'absolute',
    top: '47%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    width: '100%',
    color: '#FFFFFF'
  },
  bigCard: {
    borderRadius: '10px',
    height: '90vh',
    position: 'relative',
    overflow: 'hidden',
    '& img': {
      height: '90vh',
      width: '100%',
      objectFit: 'cover'
    }
  },
  bigCardButton: {
    position: 'absolute',
    right: '24px',
    bottom: '24px',
    color: 'white',
    borderColor: 'white',
    borderRadius: '10px'
  }
}

const data = [
  { id: 1, label: 'Marble Series', image: '/images/illustrations/photos/category-1.jpg' },
  { id: 2, label: 'Marble Series', image: '/images/illustrations/photos/category-2.jpg' },
  { id: 3, label: 'Marble Series', image: '/images/illustrations/photos/category-3.jpg' },
  { id: 4, label: 'Marble Series', image: '/images/illustrations/photos/category-4.jpg' },
  { id: 5, label: 'Marble Series', image: '/images/illustrations/photos/category-5.jpg' },
  { id: 6, label: 'Marble Series', image: '/images/illustrations/photos/category-6.jpg' }
]

const CategorySection = () => {
  return (
    <Box className={classnames('pb-6', frontCommonStyles.layoutSpacing)} sx={styles.sectionBox}>
      <Typography sx={styles.title}>Marble</Typography>

      <Grid container spacing={3}>
        {data.map(item => (
          <Grid key={item.id} item xs={12} sm={6} lg={4}>
            <Card sx={styles.cardWrapper}>
              <img src={item.image} alt={item.label} />

              <Typography sx={styles.cardLabel}>{item.label}</Typography>
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
