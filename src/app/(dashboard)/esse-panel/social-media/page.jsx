'use client'

import { useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

const defaultSocialMedia = [{ platform: 'Facebook', url: 'https://facebook.com/yourpage' }]

const platforms = [
  { name: 'Facebook', icon: 'ri-facebook-fill' },
  { name: 'Instagram', icon: 'ri-instagram-line' },
  { name: 'Twitter', icon: 'ri-twitter-fill' },
  { name: 'LinkedIn', icon: 'ri-linkedin-fill' },
  { name: 'TikTok', icon: 'ri-tiktok-line' },
  { name: 'YouTube', icon: 'ri-youtube-fill' },
  { name: 'Pinterest', icon: 'ri-pinterest-fill' },
  { name: 'WhatsApp', icon: 'ri-whatsapp-fill' },
  { name: 'Telegram', icon: 'ri-telegram-fill' },
  { name: 'Discord', icon: 'ri-discord-fill' }
]

const SocialMediaPage = () => {
  const [socialMedia, setSocialMedia] = useState(defaultSocialMedia)

  const handleAdd = () => {
    setSocialMedia(prev => [...prev, { platform: '', url: '' }])
  }

  const handleRemove = index => {
    setSocialMedia(prev => prev.filter((_, i) => i !== index))
  }

  const handleChange = (index, field, value) => {
    const updated = [...socialMedia]

    updated[index][field] = value
    setSocialMedia(updated)
  }

  const handleSubmit = () => {
    console.log('Saving social media settings...', socialMedia)
    alert('Social media settings saved successfully!')
  }

  // platforms yang sudah dipakai
  const usedPlatforms = socialMedia.map(item => item.platform).filter(Boolean)

  return (
    <Card>
      <CardHeader title='Social Media Settings' />
      <CardContent>
        <Grid container spacing={3} className='mb-5'>
          {socialMedia.map((item, index) => (
            <Grid container item spacing={2} key={index} alignItems='center'>
              <Grid item xs={5}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Platform</InputLabel>
                  <Select
                    value={item.platform}
                    label='Platform'
                    onChange={e => handleChange(index, 'platform', e.target.value)}
                  >
                    {platforms.map(p => (
                      <MenuItem
                        key={p.name}
                        value={p.name}
                        disabled={usedPlatforms.includes(p.name) && p.name !== item.platform}
                      >
                        <i className={`${p.icon} text-lg mr-2`} /> {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={5}>
                <TextField
                  fullWidth
                  size='small'
                  label='URL'
                  placeholder='https://'
                  value={item.url}
                  onChange={e => handleChange(index, 'url', e.target.value)}
                />
              </Grid>

              <Grid item xs={2}>
                <IconButton color='error' onClick={() => handleRemove(index)}>
                  <i className='ri-delete-bin-line text-red-500 text-lg' />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Box className='mb-5'>
          <Button
            startIcon={<i className='ri-add-circle-line text-blue-500 text-lg' />}
            variant='outlined'
            color='primary'
            onClick={handleAdd}
            disabled={socialMedia.length >= platforms.length} // disable jika semua sudah ditambahkan
          >
            Add Social Media
          </Button>
        </Box>

        <Divider className='mb-5' />

        <Box className='text-right'>
          <Button className='w-1/4' variant='contained' color='success' onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SocialMediaPage
