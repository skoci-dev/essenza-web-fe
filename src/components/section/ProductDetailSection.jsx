'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

import { Divider, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'

import CustomButton from '@/@core/components/mui/Button'
import { handleApiResponse } from '@/utils/handleApiResponse'
import { getPubProductBySlug } from '@/services/products'
import { ShowIf, ShowElse } from '@components/ShowIf'

const styles = {
  gridContainer: {
    margin: '56px 0',
    paddingRight: { xs: '2rem', sm: '1.75rem' }
  },
  boxImg: {
    height: { xs: '100%', sm: '460px' },
    width: { xs: '100%', sm: '460px' },
    objectFit: 'cover',
    borderRadius: '6px'
  },
  boxSpec: {
    mt: 4,
    borderRadius: '6px',
    boxShadow: '0px 0.75px 2.25px 0.75px #00000026, 0px 0.75px 1.5px 0px #0000004D'
  },
  title: {
    fontSize: '45px',
    fontWeight: 700,
    color: '#212121'
  },
  subTitle: {
    fontSize: '21px',
    fontWeight: 500,
    color: '#C1A658',
    mt: 1
  },
  tagline: {
    fontSize: '24px',
    fontWeight: 400,
    color: '#494949',
    mt: 10,
    width: '65%'
  },
  boxButton: {
    width: '240px',
    mt: 3,
    '& button': {
      padding: { xs: '10px !important' },
      fontSize: { xs: '12px', sm: '16px' }
    }
  },
  boxTitleSpec: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleSpec: {
    m: '20px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 500,
    color: '#212121'
  },
  descSpec: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#494949',
    ml: 1
  }
}

const SpecItem = ({ data }) => (
  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 3, '& img': { height: '14px' } }}>
    <Box component='img' src={`/icons/${data.icon}.svg`} />
    <Typography sx={styles.descSpec}>
      {data.title}: {data.value}
    </Typography>
  </Box>
)

const FeatureItem = ({ data }) => (
  <Box sx={{ width: '124px', textAlign: 'center', '& img': { height: '24px', width: 'auto' } }}>
    <Box component='img' src={`/icons/${data.icon}.svg`} />
    <Typography sx={{ color: '#212121', fontWeight: 500, fontSize: { xs: '10px', sm: '14px' }, mt: 1 }}>
      {data.label}
    </Typography>
    <Divider sx={{ color: '#212121', mt: 1 }} />
    <Typography sx={{ color: '#212121', fontWeight: 500, fontSize: { xs: '8px', sm: '12px' }, mt: 1 }}>
      {data.value}
    </Typography>
  </Box>
)

const ProductDetailSection = ({ slug }) => {
  const [dataDetail, setDataDetail] = useState(null)
  const isMobile = useMediaQuery('(max-width:768px)')

  useEffect(() => {
    handleApiResponse(() => getPubProductBySlug(slug), {
      onSuccess: ({ data }) => {
        setDataDetail(data)
      }
    })
  }, [slug])

  const { highlightedSpecifications, technicalSpecifications } = useMemo(() => {
    if (!dataDetail?.specifications) {
      return { highlightedSpecifications: [], technicalSpecifications: [] }
    }

    const sortByOrder = (a, b) => (a.order_number ?? 0) - (b.order_number ?? 0)
    const highlighted = []
    const technical = []

    dataDetail.specifications.forEach(spec => {
      if (spec.highlighted) {
        highlighted.push(spec)
      } else {
        technical.push(spec)
      }
    })

    return {
      highlightedSpecifications: highlighted.sort(sortByOrder),
      technicalSpecifications: technical.sort(sortByOrder)
    }
  }, [dataDetail])

  return (
    <Container maxWidth='lg'>
      <ShowIf when={dataDetail !== null}>
        <Grid container sx={styles.gridContainer} spacing={4}>
          <Grid item sm={5} xs={12}>
            <Box sx={styles.boxImg} component='img' src={dataDetail?.image} />
          </Grid>
          <Grid item sm={7} xs={12}>
            <Grid container spacing={4}>
              <Grid item sm={6} xs={12}>
                <Typography sx={styles.title}>{dataDetail?.name}</Typography>
                <Typography sx={styles.subTitle}>{dataDetail?.category}</Typography>
                <Typography sx={styles.tagline}>{dataDetail?.description}</Typography>
                <Box mt={8} />
                <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, gap: { xs: 2, sm: 2 } }}>
                  <Box sx={styles.boxButton}>
                    <a
                      href='https://wa.me/+6282295228745?text=Halo%Essenza%20Team%2C%20saya%20melihat%20produk-produk%Essenza%20dan%20sangat%20tertarik.%20Boleh%20dibantu%20info%20lebih%20lengkapnya%3F%20Terima%20kasih%20😊'
                      target='_blank'
                    >
                      <CustomButton borderColor='#BB8B05'>Request a Sample</CustomButton>
                    </a>
                  </Box>
                  <Box sx={styles.boxButton}>
                    <a href='/catalogue/ESSENZA-ECATALOGUE-2025.pdf' target='_blank'>
                      <CustomButton borderColor='#BB8B05'>
                        {isMobile ? 'Download Catalogue' : 'Download All Catalogue'}
                      </CustomButton>
                    </a>
                  </Box>
                </Box>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Box sx={styles.boxSpec}>
                  <Box sx={styles.boxTitleSpec}>
                    <Typography sx={styles.titleSpec}>TECHNICAL SPECIFICATIONS</Typography>
                  </Box>
                  <Divider />
                  <Box p='20px 48px'>
                    {technicalSpecifications.map((item, i) => (
                      <SpecItem data={item} key={i} />
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item sm={12} xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'row', mt: 12 }}>
                  {highlightedSpecifications.map((item, i) => (
                    <FeatureItem data={item} key={i} />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <ShowElse>
          <Box sx={{ minHeight: '55vh' }} />
        </ShowElse>
      </ShowIf>
    </Container>
  )
}

export default ProductDetailSection
