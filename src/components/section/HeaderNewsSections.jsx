'use client'

import Link from 'next/link'

import { useParams } from 'next/navigation'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'

const HeaderNewsSections = ({ articles }) => {
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

  const stripHtml = html => {
    if (!html) return ''

    const cleanText = html.replace(/<[^>]*>?/gm, '')

    if (typeof window !== 'undefined') {
      const doc = new DOMParser().parseFromString(cleanText, 'text/html')

      return doc.documentElement.textContent
    }

    return cleanText
  }

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
                  backgroundImage: `linear-gradient(to bottom,rgba(0, 0, 0, 0) 50%,rgba(0, 0, 0, 0.9) 100%),url(${articles?.thumbnail})`
                }}
              >
                <Grid container sx={{ padding: '24px', height: '100%', display: 'flex', alignItems: 'end' }}>
                  <Grid item sm={9}>
                    <Typography
                      sx={{
                        color: '#FFFFFF',
                        fontSize: { xs: '24px', sm: '40px' },
                        fontWeight: 500,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2,
                        maxHeight: {
                          xs: 'calc(1.2em * 2)',
                          sm: 'calc(1.2em * 2)'
                        }
                      }}
                    >
                      {articles?.title}
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
                      {stripHtml(articles?.snippet_content)}
                    </Typography>
                  </Grid>
                  <Grid item sm={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Link href={`/${articles?.href}`}>
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
                    src={articles?.gallery?.[0] ? articles?.gallery?.[0] : '/images/news/news-3.jpg'}
                    sx={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '6px' }}
                  />
                </Grid>
                <Grid item sm={12} xs={6}>
                  <Box
                    component={'img'}
                    src={articles?.gallery?.[1] ? articles?.gallery?.[1] : '/images/news/news-4.jpg'}
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
