import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'

const AwardSection = () => {
  const styles = {
    container: {
      padding: { xs: '50px 0', sm: '100px 0' }
    },
    year: {
      fontSize: '28px',
      color: '#212121',
      textAlign: { xs: 'center', sm: 'left' }
    },
    title: {
      fontSize: { xs: '14px', sm: '18px' },
      textAlign: { xs: 'center', sm: 'left' },
      color: '#212121'
    },
    yearAward: {
      fontSize: { xs: '18px', sm: '22px' },
      textAlign: { xs: 'center', sm: 'left' },
      color: '#212121'
    },
    itemBox: {
      padding: { xs: '10px', sm: '40px' },
      height: { xs: '150px', sm: '100%' },
      borderColor: '#d0d0d0',
      borderStyle: 'solid'
    },
    awardImage: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    }
  }

  const awards = [
    { year: '2007', title: 'Primaniyarta Award' },
    { year: '2009', title: 'Businessweek Award – Frontier Indonesia Most Admired Company' },
    { year: '2013', title: 'IDEA Rumah Readers Choice Award' },
    { year: '2014', title: 'Super Brands, SWA Top 250 Original Indonesia Brands' },
    { year: '2015', title: 'Forbes Indonesia, 50 Rising Global Stars' },
    { year: '2017', title: 'Top Brand, Frontier Consulting Award' },
    { year: '2018', title: 'Property Product Satisfaction Award in Property' },
    { year: '2022 - 2023', title: '', image: '/icons/top-brand.svg' }
  ]

  return (
    <Box sx={styles.container}>
      <Grid container className={classnames(frontCommonStyles.layoutSpacing)}>
        {awards.map((award, i) => {
          const totalItems = awards.length

          return (
            <Grid item xs={6} md={3} key={i}>
              <Box
                sx={{
                  ...styles.itemBox,
                  borderBottom: {
                    xs: i < totalItems - 2 ? '1px solid #ccc' : 'none',
                    md: i < 4 ? '1px solid #ccc' : 'none'
                  },
                  borderRight: {
                    xs: (i + 1) % 2 !== 0 ? '1px solid #ccc' : 'none',
                    md: (i + 1) % 4 !== 0 ? '1px solid #ccc' : 'none'
                  },
                  paddingTop: {
                    xs: i < 2 ? 0 : '20px',
                    md: i < 4 ? 0 : '40px'
                  },
                  paddingBottom: '20px'
                }}
              >
                {award.image ? (
                  <Box mt={3} sx={styles.awardImage}>
                    <Box
                      component={'img'}
                      src={award.image}
                      alt={award.title}
                      sx={{ width: { xs: '90px', sm: '120px' } }}
                    />
                    <Typography sx={styles.yearAward}>{award.year}</Typography>
                  </Box>
                ) : (
                  <>
                    <Typography sx={styles.year}>{award.year}</Typography>
                    <Typography sx={styles.title}>{award.title}</Typography>
                  </>
                )}
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default AwardSection
