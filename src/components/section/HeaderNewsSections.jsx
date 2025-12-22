'use client'

import Link from 'next/link'

import { useParams } from 'next/navigation'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'

const HeaderNewsSections = () => {
  const styles = {
    container: {
      width: '100vw',
      height: { xs: '695px', sm: '550px', md: '700px' },
      position: 'relative',
      marginTop: '-115px',
      paddingTop: 28,
      background: 'linear-gradient(180deg, #404040 0%, #131313 100%)'
    },
    title: {
      fontWeight: 500,
      fontSize: { xs: '18px', sm: '36px' },
      color: '#FFFFFF',
      textAlign: 'start',
      width: '100%',
      margin: '24px 0'
    },
    boxContent: {
      position: 'relative'
    }
  }

  const { lang: locale } = useParams()

  return (
    <>
      <Box sx={styles.container}>
        <Box className={classnames(frontCommonStyles.layoutSpacing)} sx={styles.boxContent}>
          <Typography sx={styles.title}>Explore Our Journal</Typography>
          <Grid container spacing={2}>
            <Grid item sm={8.5} xs={12}>
              <Box
                sx={{
                  height: { xs: '320px', sm: '99%' },
                  borderRadius: '6px',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundImage: `linear-gradient(to bottom,rgba(0, 0, 0, 0) 50%,rgba(0, 0, 0, 0.9) 100%),url(/images/news/news-1.jpg)`
                }}
              >
                <Grid container sx={{ padding: '24px', height: '100%', display: 'flex', alignItems: 'end' }}>
                  <Grid item sm={9}>
                    <Typography sx={{ color: '#FFFFFF', fontSize: { xs: '24px', sm: '40px' }, fontWeight: 500 }}>
                      Meeting Distributor Nasional
                    </Typography>
                    <Typography
                      sx={{
                        color: '#FFFFFF',
                        fontSize: { xs: '12px', sm: '20px' },
                        fontWeight: 400,
                        display: '-webkit-box',
                        WebkitLineClamp: { xs: 2, sm: 3 },
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      Pada 3  Desember 2019 lalu, Essenza menggelar acara Distributor Gathering di Jakarta. Acara yang
                      berlokasi di Gran Melia, Kuningan, Jakarta Selatan
                    </Typography>
                  </Grid>
                  <Grid item sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Link href={`/${locale}/news/ngopi-kongsi-bersama-aristek-arsitek-bandung`}>
                      <Button
                        variant='outlined'
                        fullWidth
                        sx={{ border: '1px solid #FFFFFF', color: '#FFFFFF', borderRadius: '7px' }}
                      >
                        See More
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item sm={3.5} xs={12}>
              <Grid
                container
                spacing={2}
                sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'row', sm: 'column' } }}
              >
                <Grid item sm={12} xs={6}>
                  <Box
                    component={'img'}
                    src='/images/news/news-3.jpg'
                    sx={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '6px' }}
                  />
                </Grid>
                <Grid item sm={12} xs={6}>
                  <Box
                    component={'img'}
                    src='/images/news/news-4.jpg'
                    sx={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '6px' }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Link href={`/${locale}/news/ngopi-kongsi-bersama-aristek-arsitek-bandung`}>
                <Button
                  variant='outlined'
                  fullWidth
                  sx={{ border: '1px solid #FFFFFF', color: '#FFFFFF', borderRadius: '7px' }}
                >
                  See More
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default HeaderNewsSections
