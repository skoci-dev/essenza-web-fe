// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

const footerSections = [
  {
    sectionId: 'about-essenza',
    title: 'About Essenza',
    links: [
      { id: 'about-essenza', label: 'About Essenza', href: '/about' },
      { id: 'find-a-store', label: 'Find a Store', href: '/store' },
      { id: 'news-event', label: 'News & Event', href: '/news' }
    ]
  },
  {
    sectionId: 'customer-care',
    title: 'Customer Care',
    links: [
      { id: 'customer-care', label: 'Customer Care', href: '/customer-care' },
      { id: 'download', label: 'Download', href: '/download' },
      { id: 'esprienza', label: 'Esprienza', href: '/esprienza' }
    ]
  },
  {
    sectionId: 'get-in-touch',
    title: 'Get in Touch',
    links: [
      { id: 'get-it-touch', label: 'Get in Touch', href: '/get-in-touch' },
      { id: 'contact-us', label: 'Contact Us', href: '/contact-us' }
    ]
  },
  {
    sectionId: 'info',
    title: 'Info',
    links: [{ id: 'info', label: 'Info', href: '/info' }]
  }
]

const socialMedia = [
  { id: 'instagram', icon: '/icons/instagram.svg', href: '' },
  { id: 'facebook', icon: '/icons/facebook.svg', href: '' },
  { id: 'youtube', icon: '/icons/youtube.svg', href: '' }
]

function Footer() {
  return (
    <footer className={'bg-white border-t border-[#D1D1D1]'}>
      <div className={classnames('pb-6', frontCommonStyles.layoutSpacing)}>
        <Grid container rowSpacing={10} columnSpacing={12}>
          <Grid item xs={12} sm={6} lg={8}>
            <div className='flex flex-col items-start gap-1'>
              <Link href='/'>
                <img className='h-[74px]' src={'/logo.svg'} />
              </Link>
              <hr className='border-t border-[#212121] w-full'></hr>
              <Grid container>
                {footerSections.map(section => (
                  <Grid key={section.sectionId} item xs={12} sm={6} lg={2.5}>
                    {section.links.map(link => (
                      <a key={link.id} href={link.href} className='text-sm hover:underline'>
                        <Typography className='text-[#212121] mt-3 font-weigth-400 text-xs'>{link.label}</Typography>
                      </a>
                    ))}
                  </Grid>
                ))}
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Grid container className='flex items-center py-5' spacing={2}>
              <Grid item xs={6} sm={6} lg={6}>
                <Button variant='outlined' className='w-full text-[#757575] border-[#757575] rounded-[6px]' fullWidth>
                  Esperianza
                </Button>
              </Grid>
              <Grid item xs={6} sm={6} lg={6}>
                <Button variant='outlined' className='w-full text-[#757575] border-[#757575] rounded-[6px]' fullWidth>
                  Tokopedia
                </Button>
              </Grid>
            </Grid>
            <Typography className='text-[#212121] mt-1 font-weigth-400 text-xs'>
              Enter your email to receive news, information about essenza
            </Typography>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={9} sm={9} lg={9}>
                <TextField
                  className='w-full rounded-[6px]'
                  size='small'
                  label=''
                  placeholder='Input your email address'
                  variant='outlined'
                  sx={{
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: '#757575',
                      fontSize: '13px',
                      opacity: 1
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#757575'
                      },
                      '& .MuiInputBase-input': {
                        padding: '6.5px 14px'
                      }
                    }
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3} sm={3} lg={3}>
                <Button variant='contained' className='w-full text-[#FFFFFF] rounded-[6px]' size='small' fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
            <hr className='border-t border-[#212121] w-full mt-6 mb-3'></hr>
            <Grid container spacing={2}>
              <Grid item>
                <Typography className='text-[#212121] font-weigth-400 text-md'>Follow Us :</Typography>
              </Grid>
              {socialMedia.map(social => (
                <Grid item key={social.id}>
                  <img className='h-[26px]' src={social.icon} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className='bg-[#414141]'>
        <div className={'flex items-center justify-center py-3'}>
          <p className='text-white text-[13px] opacity-[0.92]'>
            <span>{`©essenza Co. All Rights Reserved`}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
