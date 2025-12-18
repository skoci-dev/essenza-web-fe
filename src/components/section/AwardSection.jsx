import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'

const AwardSection = () => {
  const styles = {
    container: {
      padding: '100px 0'
    },
    year: {
      fontSize: '34px',
      color: '#212121'
    },
    title: {
      fontSize: '22px',
      color: '#212121'
    },
    itemBox: {
      padding: '40px',
      height: '100%',
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
          const isFirstRow = i < 4
          const isLastCol = (i + 1) % 4 === 0

          return (
            <Grid item xs={6} md={3} key={i}>
              <Box
                sx={{
                  ...styles.itemBox,
                  borderBottomWidth: isFirstRow ? '1px' : 0,
                  borderRightWidth: !isLastCol ? '1px' : 0,
                  paddingTop: i < 4 ? 0 : '40px'
                }}
              >
                {award.image ? (
                  <Box mt={3} sx={styles.awardImage}>
                    <img src={award.image} alt={award.title} style={{ width: '120px' }} />
                    <Typography>{award.year}</Typography>
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
