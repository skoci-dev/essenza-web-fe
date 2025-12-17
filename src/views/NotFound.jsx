'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import Illustrations from '@components/Illustrations'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

const NotFound = ({ mode }) => {
  // Vars
  const lightImg = '/images/pages/misc-mask-light.png'

  // Hooks

  return (
    <div className='flex items-center justify-center h-[550px] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center gap-10'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset]'>
          <Typography className='font-medium text-8xl' color='text.primary'>
            404
          </Typography>
          <Typography variant='h4'>Page Not Found ⚠️</Typography>
          <Typography>We couldn&#39;t find the page you are looking for.</Typography>
        </div>
        <Button href='/esse-panel/dashboard' component={Link} variant='contained'>
          Back to Home
        </Button>
      </div>
      <Illustrations maskImg={{ src: lightImg }} />
    </div>
  )
}

export default NotFound
