import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'

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
      <Slide direction='down' in={open} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: isMobile ? 'relative' : 'absolute',
            top: isMobile ? 'unset' : 124,
            left: isMobile ? 'unset' : 144,
            backgroundColor: 'white',
            width: isMobile ? '100%' : 'calc(100vw - 288px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? 'unset' : 4,
            borderRadius: '10px'
          }}
        >
          <form onSubmit={handleSubmit} className='w-full flex items-center gap-2'>
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
      </Slide>
    </>
  )
}

export default SearchBar
