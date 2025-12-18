'use client'

import Link from 'next/link'

import { Box, Typography, Grid, Card } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const styles = {
  containerBox: bgColor => ({
    padding: { xs: '12px 0', sm: '24px 0' },
    background: bgColor || 'white'
  }),
  bannerBox: {
    width: '100%',
    overflow: 'visible',
    '& .banner-swiper': {
      paddingTop: { xs: 0, sm: '56px' },
      paddingBottom: { xs: '48px', sm: '56px' },
      marginTop: { xs: '52px', sm: 'unset' }
    },
    '& .banner-swiper .swiper-pagination': {
      bottom: { xs: '14px !important', sm: '0 !important' },
      left: { xs: '-4px !important', sm: '0 !important' },
      textAlign: 'left !important',
      width: 'auto !important'
    },
    '& .banner-swiper .swiper-pagination .swiper-pagination-bullet': {
      backgroundColor: '#FFFFFF',
      border: '1.5px solid #ACACAC'
    },
    '& .banner-swiper .swiper-pagination .swiper-pagination-bullet-active': {
      borderColor: '#BD8100',
      backgroundColor: '#BD8100'
    },
    '& .banner-swiper .swiper-button-next, & .banner-swiper .swiper-button-prev': {
      width: { xs: '25px', sm: '35px' },
      height: { xs: '25px', sm: '35px' },
      background: 'transparent',
      color: '#212121',
      zIndex: 99,
      position: 'absolute',
      top: { xs: 'unset', sm: '30px' },
      bottom: { xs: '12px', sm: 'unset' }
    },
    '& .banner-swiper .swiper-button-next': {
      borderTop: '1px solid #212121',
      borderBottom: '1px solid #212121',
      borderRight: '1px solid #212121',
      padding: '6px',
      borderRadius: '0 6px 6px 0'
    },
    '& .banner-swiper .swiper-button-prev': {
      borderTop: '1px solid #212121',
      borderBottom: '1px solid #212121',
      borderLeft: '1px solid #212121',
      padding: '6px',
      borderRadius: '6px 0 0 6px',
      left: { xs: 'calc(100% - 54px)', sm: 'calc(100% - 74px)' }
    },
    '& .banner-swiper .swiper-button-next::before': {
      content: '""',
      position: 'absolute',
      left: '0',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1px',
      height: '70%',
      background: '#212121'
    },
    '& .banner-swiper .swiper-button-next::after, & .banner-swiper .swiper-button-prev::after': {
      fontSize: '16px'
    }
  },
  titleBanner: {
    fontSize: { xs: '14px', md: '24px' },
    margin: '12px 0',
    width: '100%',
    color: '#212121',
    marginBottom: '-48px'
  },
  descriptionBanner: {
    fontSize: { xs: '12px', md: '16px' }
  },
  bannerImage: {
    width: '100%',
    height: { xs: '150px', md: '360px' },
    objectFit: 'cover',
    borderRadius: '10px'
  },
  bannerImageSquare: {
    width: '100%',
    height: { xs: '150px', md: '260px' },
    objectFit: 'cover',
    borderRadius: '10px'
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
  }
}

const CardCarousel = props => {
  const { data = [], title, bgColor, duration = 1000, isCategory = false, slidesPerView = 3 } = props

  return (
    <Box sx={styles.containerBox(bgColor)}>
      <Box className={classnames(frontCommonStyles.layoutSpacing)} sx={styles.bannerBox}>
        <Typography sx={styles.titleBanner}>{title}</Typography>
        <Swiper
          className='banner-swiper'
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: duration }}
          loop
          speed={750}
          slidesPerView={slidesPerView}
          spaceBetween={10}
          breakpoints={{
            0: {
              slidesPerView: 2
            },
            768: {
              slidesPerView: slidesPerView
            }
          }}
        >
          {isCategory ? (
            <>
              <Grid container spacing={3}>
                {data.map((item, i) => (
                  <SwiperSlide key={i}>
                    <Grid key={item.id} item xs={6} sm={6} lg={4}>
                      <Link href={item?.href || '#'}>
                        <Card sx={styles.cardWrapper}>
                          <Box sx={styles.imageWrapper}>
                            <img src={item.src} alt={item.title} />
                          </Box>
                          <Typography sx={styles.cardLabel}>
                            {item.title} <span>Series</span>
                          </Typography>
                        </Card>
                      </Link>
                    </Grid>
                  </SwiperSlide>
                ))}
              </Grid>
            </>
          ) : (
            <>
              {data.map((img, i) => (
                <SwiperSlide key={i}>
                  <Link href={img?.href || '#'}>
                    <Box
                      component='img'
                      src={img.src}
                      alt={img.title}
                      sx={slidesPerView === 3 ? styles.bannerImage : styles.bannerImageSquare}
                    />
                    <Typography sx={styles.descriptionBanner}>{img.title}</Typography>
                  </Link>
                </SwiperSlide>
              ))}
            </>
          )}
        </Swiper>
      </Box>
    </Box>
  )
}

export default CardCarousel
