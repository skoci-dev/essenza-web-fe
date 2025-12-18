'use client'

import { useEffect, useState, useMemo } from 'react'

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
              <a href={data?.gmap_link || '#'} target='_blank'>
                <CustomButton>View Location</CustomButton>
              </a>
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

  const cityList = useMemo(() => {
    const cities = stores.map(item => item.city)

    return [...new Set(cities)].sort()
  }, [stores])

  const filteredStores = useMemo(() => {
    return stores.filter(item => {
      const matchesLocation = selectedLocation ? item.city.toLowerCase() === selectedLocation.toLowerCase() : true

      const matchesQuery = query
        ? item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.address.toLowerCase().includes(query.toLowerCase())
        : true

      return matchesLocation && matchesQuery
    })
  }, [stores, selectedLocation, query])

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

    if (res?.data?.length > 0) {
      const mappingStores = res?.data.map(item => {
        return {
          ...item,
          location: item?.address
        }
      })

      setStores(mappingStores)
    }
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
                anchorEl={showLocation}
                open={open}
                onClose={() => setShowLocation(null)}
                PaperProps={{ style: { width: showLocation?.offsetWidth } }}
              >
                <MenuItem
                  onClick={() => {
                    setSelectedLocation('')
                    setShowLocation(null)
                  }}
                >
                  All Locations
                </MenuItem>
                {cityList.map(city => (
                  <MenuItem
                    key={city}
                    onClick={() => {
                      setSelectedLocation(city)
                      setShowLocation(null)
                    }}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {city}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
            <Grid item xs={12}>
              <Fade in={true} timeout={500}>
                <Grid container spacing={3}>
                  {filteredStores.length > 0 ? (
                    filteredStores.map((data, index) => (
                      <Grid item sm={12} key={index}>
                        <BoxItem key={index} data={data} />
                      </Grid>
                    ))
                  ) : (
                    <Typography sx={{ textAlign: 'center', py: 5, color: '#999' }}>
                      No stores found in this location or search criteria.
                    </Typography>
                  )}
                </Grid>
              </Fade>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  )
}

export default InfoSection
