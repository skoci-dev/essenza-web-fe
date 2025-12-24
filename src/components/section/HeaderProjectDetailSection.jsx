'use client'

import Box from '@mui/material/Box'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const HeaderProjectDetailSection = ({ image = [] }) => {
  const styles = {
    container: {
      width: '100vw',
      height: { xs: '60vh', sm: '100vh' },
      position: 'relative',
      marginTop: '-115px',
      '& .banner-swiper': {
        position: 'relative'
      },
      '& .banner-swiper .swiper-pagination': {
        bottom: '25px !important',
        left: { xs: '24px', md: '180px !important' },
        textAlign: 'left !important',
        width: 'auto !important'
      },
      '& .banner-swiper .swiper-pagination .swiper-pagination-bullet': {
        backgroundColor: 'black',
        border: '1px solid white'
      },
      '& .banner-swiper .swiper-pagination .swiper-pagination-bullet-active': {
        backgroundColor: '#BD8100',
        borderColor: '#BD8100'
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
        right: { xs: '24px', md: '180px' }
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
        left: { xs: 'calc(100% - 74px)', sm: 'calc(100% - 95px)', md: 'calc(100% - 249px)' },
        position: 'absolute'
      },
      '& .banner-swiper .swiper-button-next::after, & .banner-swiper .swiper-button-prev::after': {
        fontSize: '16px'
      }
    },
    title: {
      fontWeight: 500,
      fontSize: { xs: '24px', sm: '48px' },
      color: '#FFFFFF',
      textAlign: 'center',
      width: '100%',
      lineHeight: 1.2,
      position: 'absolute',
      top: { xs: '25vh', sm: '45vh' }
    },
    subTitle: {
      fontSize: { xs: '18px', md: '24px' },
      fontWeight: 300,
      color: '#FFFFFF',
      textAlign: 'center',
      width: '100%',
      position: 'absolute',
      top: { xs: '29vh', sm: '52vh' }
    },
    image: {
      height: { xs: '60vh', sm: '100vh' },
      width: '100vw',
      objectFit: 'cover'
    }
  }

  return (
    <>
      <Box sx={styles.container}>
        <Swiper
          className='banner-swiper'
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          speed={750}
          loop
        >
          {image.map((item, i) => (
            <SwiperSlide key={i}>
              <Box component={'img'} src={item} sx={styles.image} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </>
  )
}

export default HeaderProjectDetailSection
