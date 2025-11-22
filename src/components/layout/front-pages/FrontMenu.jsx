'use client'

// React Imports
import { useEffect } from 'react'

// Next Imports
import { usePathname, useParams } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// Component Imports
import DropdownMenu from './DropdownMenu'

const staticMenu = [
  {
    id: 1,
    label: 'About Us',
    href: '/about-us'
  },
  {
    id: 1,
    label: 'Product',
    href: '/product'
  },
  {
    id: 1,
    label: 'Download',
    href: '/download'
  },
  {
    id: 1,
    label: 'News',
    href: '/news'
  },
  {
    id: 1,
    label: 'Project',
    href: '/project'
  },
  {
    id: 1,
    label: 'Contact Us',
    href: '/contact-us'
  },
  {
    id: 1,
    label: 'Info',
    href: '/info'
  }
]

const Wrapper = props => {
  // Props
  const { children, isBelowLgScreen, className, isDrawerOpen, setIsDrawerOpen } = props

  if (isBelowLgScreen) {
    return (
      <Drawer
        variant='temporary'
        anchor='left'
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ModalProps={{
          keepMounted: true
        }}
        sx={{ '& .MuiDrawer-paper': { width: ['100%', 300] } }}
        className={classnames('p-5', className)}
      >
        <div className='p-4 flex flex-col gap-x-3'>
          <IconButton onClick={() => setIsDrawerOpen(false)} className='absolute inline-end-4 block-start-2'>
            <i className='ri-close-line' />
          </IconButton>
          {children}
        </div>
      </Drawer>
    )
  }

  return <div className={classnames('flex items-center flex-wrap gap-x-4 gap-y-3', className)}>{children}</div>
}

const FrontMenu = props => {
  // Props
  const { isDrawerOpen, setIsDrawerOpen, mode } = props

  // Hooks
  const pathname = usePathname()
  const isBelowLgScreen = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const { intersections } = useIntersection()
  const { lang: locale } = useParams()

  console.log('locale', locale)

  useEffect(() => {
    if (!isBelowLgScreen && isDrawerOpen) {
      setIsDrawerOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBelowLgScreen])

  return (
    <Wrapper isBelowLgScreen={isBelowLgScreen} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
      {staticMenu.map((menu, i) => (
        <Typography key={menu.id} component={Link} href={`/${locale}/${menu.href}`} className={'text-[#212121]'}>
          {menu.label}
        </Typography>
      ))}
      <Typography
        component={Link}
        href={`/${locale}`}
        className={'bg-[#C1A658] px-[40px] text-[#ffffff] py-[9px] rounded-[6px]'}
        color='text.primary'
      >
        Esperianza
      </Typography>
      <img src='/icons/search.svg' alt='search' />
    </Wrapper>
  )
}

export default FrontMenu
