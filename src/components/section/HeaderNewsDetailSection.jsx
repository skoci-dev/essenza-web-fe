'use client'

import Box from '@mui/material/Box'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const HeaderNewsDetailSection = ({ image = [] }) => {
  const styles = {
    container: {
      width: '100vw',
      height: { xs: '735px', sm: '590px', md: '740px' },
      position: 'relative',
      marginTop: '-115px',
      paddingTop: 36,
      background: 'linear-gradient(180deg, #404040 0%, #131313 100%)',
      '& .banner-swiper': {
        paddingBottom: '63px',
        position: 'relative'
      },
      '& .banner-swiper .swiper-pagination': {
        bottom: '25px !important',
        left: '0px !important',
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
        right: '0'
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
        left: { xs: 'calc(100% - 69px)', sm: 'calc(100% - 69px)', md: 'calc(100% - 69px)' },
        position: 'absolute'
      },
      '& .banner-swiper .swiper-button-next::after, & .banner-swiper .swiper-button-prev::after': {
        fontSize: '16px'
      }
    },
    thumbnail: {
      width: '100%',
      height: '530px',
      objectFit: 'cover',
      borderRadius: '7px'
    }
  }

  return (
    <>
      <Box sx={styles.container}>
        <Box className={classnames(frontCommonStyles.layoutSpacing)}>
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
                <Box component={'img'} src={item !== null ? item : '/images/broken-image.png'} sx={styles.thumbnail} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
    </>
  )
}

export default HeaderNewsDetailSection
