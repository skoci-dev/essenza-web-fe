'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'

import CustomButton from '@/@core/components/mui/Button'

import frontCommonStyles from '@views/front-pages/styles.module.css'
import { getPubStores } from '@/services/stores'
import { getPubDistributors } from '@/services/distributors'

const storeData = [
  {
    city: 'Jakarta',
    companies: [
      {
        id: 'JKT-001',
        name: 'PT DIMENSI PROCIPTA INDONESIA (DP HAUS)',
        address: 'Panglima Polim Raya 107B Jakarta Selatan',
        phone: '(021) 7399606'
      },
      {
        id: 'JKT-002',
        name: 'PT. GADING MAS MULTI PRIMA',
        address: 'Jl. Taman Griya Pratama Blok 7 No. 41 Pegangsaan Dua Kelapa Gading Jakarta Utara',
        phone: '(021) 22468888'
      },
      {
        id: 'JKT-003',
        name: 'Alam Jaya',
        address: 'Daan Mogot KM 12.5 No. 43 Jakarta Barat',
        phone: '021 544 3467'
      }
    ]
  },
  {
    city: 'Bandung',
    companies: [
      {
        id: 'BDG-001',
        name: 'PT ALAS MULIA',
        address: 'Jl. Otto Iskandar Dinata No. 357 Bandung',
        phone: '(022) 4208111'
      },
      {
        id: 'BDG-002',
        name: 'CV. Makmur Sentosa',
        address: 'Jl. Asia Afrika No. 100 Bandung',
        phone: '(022) 7701234'
      },
      {
        id: 'BDG-003',
        name: 'Toko Granit Utama',
        address: 'Jl. Cihampelas No. 50 Bandung',
        phone: '(022) 5432109'
      }
    ]
  },
  {
    city: 'Surabaya',
    companies: [
      {
        id: 'SBY-001',
        name: 'PT BERKAT PUTRA BUANA',
        address: 'Jalan Baliwerti 55 Surabaya',
        phone: '(031) 5350519'
      },
      {
        id: 'SBY-002',
        name: 'Global Keramik SBY',
        address: 'Jl. Raya Darmo No. 45 Surabaya',
        phone: '(031) 8877665'
      },
      {
        id: 'SBY-003',
        name: 'Indah Marmer',
        address: 'Jl. Kertajaya Indah No. 10 Surabaya',
        phone: '(031) 5678901'
      }
    ]
  },
  {
    city: 'Semarang',
    companies: [
      {
        id: 'SMG-001',
        name: 'PT GRAHA PELANGI JAYA',
        address: 'Perkantoran THD Blok A No. 25 Semarang',
        phone: '(024) -3553001'
      },
      {
        id: 'SMG-002',
        name: 'Central Bangunan',
        address: 'Jl. Pemuda No. 10 Semarang',
        phone: '(024) 4455667'
      },
      {
        id: 'SMG-003',
        name: 'Toko Jaya Abadi',
        address: 'Jl. Gajah Mada No. 20 Semarang',
        phone: '(024) 1122334'
      }
    ]
  },
  {
    city: 'Tangerang',
    companies: [
      {
        id: 'TNG-001',
        name: 'Bintang Keramik',
        address: 'Jl. Boulevard Raya Blok A No. 1 BSD City Tangerang',
        phone: '021 199 507'
      },
      {
        id: 'TNG-002',
        name: 'Mitra Mandiri Granit',
        address: 'Ruko Golden Road No. 5 Gading Serpong Tangerang',
        phone: '(021) 9876543'
      },
      {
        id: 'TNG-003',
        name: 'Depo Material',
        address: 'Jl. Raya Serpong KM 8 Tangerang',
        phone: '(021) 1234567'
      }
    ]
  }
]

const styles = {
  container: {
    padding: '36px 0'
  }
}

const ButtonInfo = ({ text, isActive, onClick }) => {
  return (
    <Box
      sx={{
        border: `2px solid ${isActive ? '#BB8B05' : '#E0E0E0'}`,
        color: isActive ? '#BB8B05' : '#E0E0E0',
        height: '56px',
        fontSize: '18px',
        fontWeight: 500,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF'
      }}
      onClick={onClick}
    >
      {text}
    </Box>
  )
}

const BoxItem = ({ data }) => {
  const displayLocation = data?.address || data?.location
  const displayPhone = data?.phone

  return (
    <Box sx={{ borderRadius: '10px', backgroundColor: '#FFFFFF' }}>
      <Box sx={{ padding: '12px 24px' }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#212121' }}>{data?.name}</Typography>
      </Box>
      <Divider />
      <Grid container spacing={5} sx={{ padding: '12px 24px' }}>
        <Grid item sm={7} xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'start',
              marginBottom: 2,
              '& img': { height: '14px', width: 'auto' },
              '& p': { fontSize: '14px', color: '#494949', marginLeft: 2, lineHeight: 1.2 }
            }}
          >
            <Box component={'img'} src='/icons/distance.svg' />
            <Typography>{displayLocation}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& img': { height: '14px', width: 'auto' },
              '& p': { fontSize: '14px', color: '#494949', marginLeft: 2 }
            }}
          >
            <Box component={'img'} src='/icons/call.svg' />
            <Typography>{displayPhone}</Typography>
          </Box>
        </Grid>
        <Grid item sm={5} xs={12}>
          <Grid container spacing={3}>
            <Grid item sm={6} xs={6}>
              <CustomButton>View Location</CustomButton>
            </Grid>
            <Grid item sm={6} xs={6}>
              <Link href={`tel:${data?.phone}`}>
                <CustomButton>Contact Us</CustomButton>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

const InfoSection = () => {
  const isMobile = useMediaQuery('(max-width:768px)')

  const [selectedInfo, setSelectedInfo] = useState('distributor')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [showLocation, setShowLocation] = useState(null)
  const [distributors, setDistributors] = useState([])
  const [stores, setStores] = useState([])
  const [query, setQuery] = useState('')
  const open = Boolean(showLocation)

  const filteredStores =
    storeData
      .find(data => data.city === selectedLocation)
      ?.companies.filter(company => {
        const lowQuery = query.toLowerCase()

        return company.name.toLowerCase().includes(lowQuery) || company.address.toLowerCase().includes(lowQuery)
      }) || []

  const handleClick = event => {
    setShowLocation(event.currentTarget)
  }

  const handleClose = () => {
    setShowLocation(null)
  }

  const handleInfoChange = info => {
    setSelectedInfo(info)
    setSelectedLocation('')
  }

  const fetchStores = async () => {
    const res = await getPubStores()
  }

  const fetchDistributors = async () => {
    const res = await getPubDistributors()

    if (res?.data?.length > 0) {
      const mapoingDistributors = res?.data.map(item => {
        return {
          ...item,
          location: item?.address
        }
      })

      setDistributors(mapoingDistributors)
    }
  }

  const handleSearchStore = e => {
    e.preventDefault()
  }

  useEffect(() => {
    fetchStores()
    fetchDistributors()
  }, [])

  return (
    <Container maxWidth='lg' sx={styles.container} className={frontCommonStyles.layoutSpacing}>
      <Grid container spacing={3}>
        <Grid item sm={6} xs={12}>
          <ButtonInfo
            text={'Our Distributors'}
            isActive={selectedInfo === 'distributor'}
            onClick={() => handleInfoChange('distributor')}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <ButtonInfo
            text={'Our Stores'}
            isActive={selectedInfo === 'store'}
            onClick={() => handleInfoChange('store')}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={3}>
        {selectedInfo === 'distributor' && (
          <>
            {distributors.map(data => (
              <Grid item sm={12} key={data?.id}>
                <BoxItem data={data} />
              </Grid>
            ))}
          </>
        )}
        {selectedInfo === 'store' && (
          <>
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? 'unset' : 4,
                  borderRadius: '7px',
                  mb: 6
                }}
              >
                <form onSubmit={handleSearchStore} className='w-full flex items-center gap-2'>
                  <TextField
                    size='small'
                    fullWidth
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder='search . . .'
                  />
                  <Button
                    className={'bg-[#C1A658] px-[40px] text-[#ffffff] py-[9px] rounded-[6px]'}
                    size='small'
                    type='submit'
                  >
                    Search
                  </Button>
                </form>
              </Box>
              <Button
                aria-controls={open ? 'location-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                variant='contained'
                disableElevation
                sx={{
                  width: '100% !important',
                  backgroundColor: '#FFFFFF',
                  color: '#212121',
                  border: '1.5px solid #E0E0E0',
                  borderRadius: '7.5px',
                  boxShadow: 'unset',
                  '&:hover': { backgroundColor: '#f5f5f5', color: '#212121' }
                }}
                onClick={handleClick}
                endIcon={
                  showLocation ? (
                    <i className='ri-arrow-up-s-line text-xs' />
                  ) : (
                    <i className='ri-arrow-down-s-line text-xs' />
                  )
                }
              >
                {selectedLocation || 'Select Location'}
              </Button>
              <Menu
                id='location-menu'
                slotProps={{
                  list: {
                    'aria-labelledby': 'demo-customized-button'
                  }
                }}
                anchorEl={showLocation}
                open={open}
                onClose={handleClose}
                sx={{
                  '& .MuiPaper-root': { width: showLocation ? showLocation.offsetWidth : 200, marginTop: 1 },
                  '& .MuiList-root ': { padding: 0 }
                }}
              >
                {storeData.map(data => (
                  <MenuItem
                    onClick={() => {
                      setSelectedLocation(data?.city)
                      handleClose()
                    }}
                    disableRipple
                    key={data?.city}
                    sx={{ justifyContent: 'center' }}
                  >
                    {data?.city}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
            {selectedLocation && (
              <Grid item xs={12}>
                <Fade in={filteredStores.length > 0} timeout={1000} sx={{ height: 'auto' }}>
                  <Grid container spacing={3}>
                    {filteredStores.map(data => (
                      <Grid item xs={12} key={data?.id}>
                        <BoxItem data={data} />
                      </Grid>
                    ))}
                  </Grid>
                </Fade>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Container>
  )
}

export default InfoSection
