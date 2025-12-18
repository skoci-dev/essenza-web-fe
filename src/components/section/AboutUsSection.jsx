import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'

const AboutUsSection = () => {
  const styles = {
    container: {
      background: 'linear-gradient(180deg, #414141, #121212)',
      width: '100vw',
      padding: { xs: '30px 0', sm: '100px 0' }
    },
    image: {
      width: '100%',
      objectFit: 'cover',
      borderRadius: '10px'
    },
    containerText: {
      padding: '1rem 2rem !important'
    },
    title: {
      fontSize: { xs: '24px', md: '24px' },
      textAlign: { xs: 'center', sm: 'left' },
      color: 'white'
    },
    description: {
      fontSize: { xs: '14px', sm: '18px' },
      textAlign: { xs: 'center', sm: 'left' },
      color: 'white',
      marginTop: 6
    }
  }

  return (
    <Box sx={styles.container}>
      <Grid
        container
        className={classnames(frontCommonStyles.layoutSpacing)}
        sx={styles.bannerBox}
        spacing={{ xs: 0, sm: 4 }}
      >
        <Grid item xs={12} md={6}>
          <Box>
            <Box component='img' src={'/images/illustrations/photos/banner-6.jpg'} alt={`about us`} sx={styles.image} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={styles.containerText}>
          <Typography sx={styles.title}>About Us</Typography>
          <Typography sx={styles.description}>
            Essenza, locally and internationally well known as the leader of Indonesian Tile Manufacturer (Porcelain
            Tile). Since 1994 the Essenza brand has successfully established as a leading brand in the Indonesian
            starting Tile Market. In early 1994, we have entered the international market starting in Singapore.
            <br />
            <br />
            The success of Essenza in penetrating the world market is rooted in the commitment of the management and
            staff of Internusa Keramik Alamasri to provide high quality products and services to the market. Essenza is
            continuously being appreciated by public with many awards,
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AboutUsSection
