'use client'

import { Box } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const styles = {
  bannerBox: {
    width: '100%',
    overflow: 'hidden',
    marginTop: '-115px',

    '& .banner-swiper': {
      width: '100vw',
      height: '100vh'
    },
    '& .banner-swiper .swiper-pagination': {
      bottom: '18px !important',
      left: '24px !important',
      textAlign: 'left !important',
      width: 'auto !important'
    },
    '& .banner-swiper .swiper-pagination .swiper-pagination-bullet': {
      backgroundColor: 'black',
      border: '1px solid white'
    },
    '& .banner-swiper .swiper-pagination .swiper-pagination-bullet-active': {
      backgroundColor: 'white'
    },
    '& .banner-swiper .swiper-button-next, & .banner-swiper .swiper-button-prev': {
      bottom: '20px !important',
      top: 'auto !important',
      width: '35px',
      height: '35px',
      background: 'rgba(0,0,0,0.3)',
      color: '#fff'
    },
    '& .banner-swiper .swiper-button-next': {
      borderTop: '1px solid #ffffff',
      borderBottom: '1px solid #ffffff',
      borderRight: '1px solid #ffffff',
      padding: '6px',
      borderRadius: '0 6px 6px 0',
      right: '25px'
    },
    '& .banner-swiper .swiper-button-next::before': {
      content: '""',
      position: 'absolute',
      left: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1px',
      height: '70%',
      background: 'rgba(255, 255, 255, 1)'
    },
    '& .banner-swiper .swiper-button-prev': {
      borderTop: '1px solid #ffffff',
      borderBottom: '1px solid #ffffff',
      borderLeft: '1px solid #ffffff',
      padding: '6px',
      borderRadius: '6px 0 0 6px',
      left: 'calc(100vw - 95px)'
    },
    '& .banner-swiper .swiper-button-next::after, & .banner-swiper .swiper-button-prev::after': {
      fontSize: '16px'
    }
  },

  bannerImage: {
    width: '100%',
    height: '100vh',
    objectFit: 'cover'
  }
}

const BannerSection = () => {
  const banners = [
    '/images/illustrations/photos/banner-1.png',
    '/images/illustrations/photos/banner-2.png',
    '/images/illustrations/photos/banner-3.png'
  ]

  return (
    <Box sx={styles.bannerBox}>
      <Swiper
        className='banner-swiper'
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
      >
        {banners.map((img, i) => (
          <SwiperSlide key={i}>
            <Box component='img' src={img} alt={`Banner ${i + 1}`} sx={styles.bannerImage} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}

export default BannerSection
