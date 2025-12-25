'use client'

import Link from 'next/link'

import { Box, Grid, Typography, useMediaQuery } from '@mui/material'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import CustomButton from '@/@core/components/mui/Button'

const CardDownloadCarousel = ({ data = [], title, titleColor, bgColor, duration = 1000, useMultipleView = false }) => {
  const isMobile = useMediaQuery('(max-width:768px)')

  const styles = {
    containerBox: bgColor => ({
      padding: { xs: '12px 0', sm: '24px 0' },
      background: bgColor || 'white'
    }),
    bannerBox: {
      width: '100%',
      position: 'relative',
      overflow: 'visible',
      '& .banner-swiper': {
        paddingTop: { xs: 0, sm: '80px' },
        paddingBottom: { xs: '48px', sm: 0 },
        marginTop: { xs: '52px', sm: 'unset' }
      },
      '& .banner-swiper .swiper-pagination': {
        bottom: { xs: '14px !important', sm: '36px !important' },
        left: { xs: '-4px !important', sm: '24px !important' },
        textAlign: 'left !important',
        width: 'auto !important'
      },
      '& .banner-swiper .swiper-pagination .swiper-pagination-bullet': {
        backgroundColor: 'black',
        border: '1px solid white'
      },
      '& .banner-swiper .swiper-pagination .swiper-pagination-bullet-active': {
        borderColor: '#BD8100',
        backgroundColor: '#BD8100'
      },
      '& .banner-swiper .swiper-button-next, & .banner-swiper .swiper-button-prev': {
        width: { xs: '25px', sm: '35px' },
        height: { xs: '25px', sm: '35px' },
        background: 'transparent',
        color: { xs: '#212121', sm: '#FFFFFF' },
        zIndex: 99,
        position: 'absolute',
        top: { xs: 'unset', sm: '30px' },
        bottom: { xs: '12px', sm: 'unset' }
      },
      '& .banner-swiper .swiper-button-next': {
        borderTop: { xs: '1px solid #212121', sm: '1px solid #FFFFFF' },
        borderBottom: { xs: '1px solid #212121', sm: '1px solid #FFFFFF' },
        borderRight: { xs: '1px solid #212121', sm: '1px solid #FFFFFF' },
        padding: '6px',
        borderRadius: '0 6px 6px 0'
      },
      '& .banner-swiper .swiper-button-prev': {
        borderTop: { xs: '1px solid #212121', sm: '1px solid #FFFFFF' },
        borderBottom: { xs: '1px solid #212121', sm: '1px solid #FFFFFF' },
        borderLeft: { xs: '1px solid #212121', sm: '1px solid #FFFFFF' },
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
        background: { xs: '#212121', sm: '#FFFFFF' }
      },
      '& .banner-swiper .swiper-button-next::after, & .banner-swiper .swiper-button-prev::after': {
        fontSize: '16px'
      }
    },
    titleSection: {
      fontSize: { xs: '14px', md: '24px' },
      margin: '12px 0',
      width: '100%',
      color: titleColor || '#FFFFFF',
      position: 'absolute',
      top: { xs: '-50px', sm: 0 }
    },
    titleProduct: {
      fontWeight: 600,
      color: '#212121',
      minHeight: '50px',
      fontSize: { xs: '12px', md: '16px' },
      mt: 2,
      mb: 1
    },
    bannerImage: {
      width: { xs: '100%', md: '100%' },
      height: { xs: '150px', md: '280px' },
      objectFit: 'cover',
      borderRadius: '7px'
    }
  }

  const chunkArray = (arr, size) => {
    if (!arr || arr.length === 0) return []
    const chunkedArr = []

    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size))
    }

    return chunkedArr
  }

  const productsPerSlide = isMobile ? 4 : 8
  const chunkedData = chunkArray(data, productsPerSlide)

  return (
    <Box sx={styles.containerBox(bgColor)}>
      <Box className={classnames(frontCommonStyles.layoutSpacing)} sx={styles.bannerBox}>
        <Typography sx={styles.titleSection}>{title}</Typography>
        <Swiper
          className='banner-swiper'
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: duration }}
          loop
          speed={750}
          slidesPerView={1}
          spaceBetween={isMobile ? 5 : 10}
          breakpoints={{
            0: {
              slidesPerView: 1
            },
            768: {
              slidesPerView: 1
            }
          }}
        >
          {chunkedData.map((productChunk, chunkIndex) => (
            <SwiperSlide key={chunkIndex}>
              <Grid container spacing={isMobile ? 3 : 2}>
                {productChunk.map((product, productIndex) => (
                  <Grid item xs={6} sm={3} key={productIndex}>
                    <a href={product?.href || '#'} target='_blank'>
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box component='img' src={product.image} alt={`${product.name}`} sx={styles.bannerImage} />
                        <Typography sx={styles.titleProduct}>{product.name}</Typography>
                        <Box sx={{ height: '50px', display: 'flex', alignItems: 'end' }}>
                          <CustomButton>Download</CustomButton>
                        </Box>
                      </Box>
                    </a>
                  </Grid>
                ))}
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  )
}

export default CardDownloadCarousel
