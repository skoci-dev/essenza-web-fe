import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'

const SearchBar = props => {
  const { checked, locale, isMobile = false } = props
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    router.push(`/${locale}/search?q=${query}`)
    setOpen(false)
  }

  useEffect(() => {
    setOpen(checked)
  }, [checked])

  return (
    <>
      <Fade in={open} timeout={750} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: isMobile ? 'relative' : 'absolute',
            top: isMobile ? 'unset' : 24,
            left: 0,
            zIndex: 1000,
            width: '100%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? 2 : 4,
            borderRadius: '10px',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
            transform: open ? 'translateY(0px)' : 'translateY(-30px)'
          }}
        >
          <form onSubmit={handleSubmit} className='w-full flex items-center gap-2'>
            <TextField
              size='small'
              fullWidth
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='search . . .'
              autoFocus
            />
            <Button
              sx={{
                backgroundColor: '#C1A658',
                color: '#ffffff',
                px: 5,
                py: 1.1,
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: '#a88f4a'
                }
              }}
              size='small'
              type='submit'
            >
              Search
            </Button>
          </form>
        </Box>
      </Fade>
    </>
  )
}

export default SearchBar
