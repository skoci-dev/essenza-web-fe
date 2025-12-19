'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import FrontMenu from './FrontMenu'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'

const Header = ({ mode, headerMenus }) => {
  // States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Hooks
  const isBelowLgScreen = useMediaQuery(theme => theme.breakpoints.down('lg'))

  // Detect window scroll
  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true
  })

  return (
    <header className={classnames(frontLayoutClasses.header, styles.header)}>
      <div
        className={classnames(
          frontLayoutClasses.navbar,
          styles.navbar,
          { [styles.headerScrolled]: trigger },
          'bg-white mt-[40px] rounded-[10px] py-0 pl-1 pr-3'
        )}
      >
        <div className={classnames(frontLayoutClasses.navbarContent, styles.navbarContent)}>
          {isBelowLgScreen ? (
            <div className='contents items-center gap-1 sm:gap-4 relative'>
              <Link href='/'>
                <img className='h-[60px] flex' src={'/logo.svg'} />
              </Link>
              <IconButton
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className='-mis-2'
                sx={{ border: isDrawerOpen ? 'unset' : '1px solid #212121', borderRadius: '6px', zIndex: 9999 }}
              >
                {isDrawerOpen ? (
                  <Box component='img' src='/icons/close.svg' alt='close' />
                ) : (
                  <Box component='img' src='/icons/menu.svg' alt='menu' />
                )}
              </IconButton>
              <FrontMenu
                mode={mode}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                menuItems={headerMenus}
              />
            </div>
          ) : (
            <div className='contents items-center gap-10 relative'>
              <Link href='/'>
                <img className='h-[74px] flex' src={'/logo.svg'} />
              </Link>
              <FrontMenu
                mode={mode}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                menuItems={headerMenus}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
