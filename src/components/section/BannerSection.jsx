'use client'

import { useState, useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { Box } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import { getPubBanners } from '@/services/banner'

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
      height: { xs: '65vh', md: '100vh' }
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
      width: { xs: '25px', sm: '35px' },
      height: { xs: '25px', sm: '35px' },
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
      left: { xs: 'calc(100vw - 75px)', sm: 'calc(100vw - 95px)' }
    },
    '& .banner-swiper .swiper-button-next::after, & .banner-swiper .swiper-button-prev::after': {
      fontSize: '16px'
    }
  },
  imageWrapper: {
    width: '100%',
    height: { xs: '65vh', md: '100vh' },
    position: 'relative',
    overflow: 'hidden'
  }
}

const BannerSection = () => {
  const [banners, setBanners] = useState([])

  const fetchBanners = async () => {
    const res = await getPubBanners()

    if (res?.data.length > 0) setBanners(res?.data)
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  return (
    <Box sx={styles.bannerBox}>
      <Swiper
        className='banner-swiper'
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        speed={750}
        loop
      >
        {banners.map((img, i) => (
          <SwiperSlide key={i}>
            <Link href={img?.link_url}>
              <Box sx={styles.imageWrapper}>
                <Image
                  src={img?.image}
                  alt={img?.title}
                  fill
                  sizes='(max-width: 768px) 100vw, 
               100vw'
                  style={{
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}

export default BannerSection
