'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'

// Third-party Imports
import classnames from 'classnames'

import SearchBar from './SearchBar'

const staticMenu = [
  {
    label: 'About Us',
    link: '/about-us',
    children: [],
    order_no: 1
  },
  {
    label: 'Product',
    link: '/product',
    children: [],
    order_no: 2
  },
  {
    label: 'News',
    link: '/news',
    children: [],
    order_no: 3
  },
  {
    label: 'Project',
    link: '/project',
    children: [],
    order_no: 4
  },
  {
    label: 'Contact Us',
    link: '/contact-us',
    children: [],
    order_no: 5
  },
  {
    label: 'Info',
    link: '/info',
    children: [],
    order_no: 6
  }
]

const styles = {
  containerDrawer: {
    '& .MuiDrawer-paper': {
      width: ['100%', 300],
      borderRadius: '10px',
      width: 'calc(100vw - 48px)',
      height: 'fit-content',
      position: 'fixed',
      top: '115px',
      left: '0',
      margin: '0 auto'
    },
    '& .MuiDrawer-paper .btn-esperianza': {
      marginTop: '18px',
      width: 'fit-content'
    },
    '& .MuiBackdrop-invisible': {
      backgroundColor: 'transparent'
    }
  },
  menu: {
    padding: { xs: '18px 0', md: '0' },
    borderBottom: { xs: '1px solid #2121214D', md: 'unset' }
  },
  activeMenu: {
    position: { md: 'relative' },
    bottom: { md: '-0.3rem' },
    padding: { xs: '18px 0', md: '0 0.5rem 0.5rem 0.5rem' },
    borderBottom: { xs: '1px solid #2121214D', md: '1.5px solid #BD8100' },
    transition: { md: 'border-bottom 0.3s ease-out, bottom 0.3s ease-out' }
  }
}

const Wrapper = props => {
  // Props
  const { children, isBelowLgScreen, className, isDrawerOpen, setIsDrawerOpen } = props

  if (isBelowLgScreen) {
    return (
      <Drawer
        variant='temporary'
        anchor='top'
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ModalProps={{
          disablePortal: true,
          keepMounted: true
        }}
        sx={styles.containerDrawer}
        className={classnames('p-5', className)}
      >
        <div className='p-4 flex flex-col gap-x-3'>{children}</div>
      </Drawer>
    )
  }

  return <div className={classnames('flex items-center flex-wrap gap-x-4 gap-y-3', className)}>{children}</div>
}

const FrontMenu = props => {
  // Props
  const { isDrawerOpen, setIsDrawerOpen } = props
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const pathname = usePathname()

  const handleClickSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  // Hooks
  const isBelowLgScreen = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const isMobile = useMediaQuery('(max-width:768px)')
  const { lang: locale } = useParams()

  useEffect(() => {
    if (!isBelowLgScreen && isDrawerOpen) {
      setIsDrawerOpen(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBelowLgScreen])

  const navigationMenus = useMemo(() => {
    return props.menuItems || staticMenu
  }, [props.menuItems])

  return (
    <>
      <Wrapper isBelowLgScreen={isBelowLgScreen} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <SearchBar checked={true} locale={locale} isMobile={true} />
        </Box>
        {navigationMenus.map((menu, i) => (
          <Box
            key={'headerMenu' + i}
            sx={pathname === `/${locale}${menu.link}` && !isMobile ? styles.activeMenu : styles.menu}
          >
            <Typography
              component={Link}
              href={`/${locale}${menu.link}`}
              className={'text-[#212121]'}
              onClick={() => setIsDrawerOpen(false)}
            >
              {menu.label}
            </Typography>
          </Box>
        ))}
        <Typography
          component={Link}
          href={`/${locale}`}
          className={'bg-[#C1A658] px-[40px] text-[#ffffff] py-[9px] rounded-[6px] btn-esperianza'}
          color='text.primary'
        >
          Esperianza
        </Typography>
        <Box
          component='img'
          src='/icons/search.svg'
          alt='search'
          className='cursor-pointer'
          sx={{ display: { xs: 'none', md: 'block' } }}
          onClick={handleClickSearch}
        />
      </Wrapper>
      <SearchBar checked={isSearchOpen} locale={locale} />
    </>
  )
}

export default FrontMenu
