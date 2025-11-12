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

import useSnackbar from '@/@core/hooks/useSnackbar'

const defaultSettings = {
  site_name: 'PT. Maju Jaya Keramik',
  site_description: 'Distributor ubin dan keramik terpercaya dengan berbagai pilihan motif, warna, dan ukuran.',
  site_logo: '/images/logo.png',
  favicon: '/favicon.ico',
  meta_keywords: 'keramik, ubin, granit, lantai, interior, bangunan',
  meta_description:
    'PT. Maju Jaya Keramik menyediakan ubin dan keramik berkualitas tinggi untuk hunian dan proyek Anda.'
}

const GeneralSettings = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [settings, setSettings] = useState(defaultSettings)

  const { showSnackbar, SnackbarComponent } = useSnackbar()

  const handleChange = e => {
    const { name, value } = e.target

    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    console.log('Saving settings...', settings)
    showSnackbar('success', 'Settings saved successfully!')
    setIsEdit(false)
  }

  return (
    <>
      <Card>
        <CardHeader title='General Settings' />
        <Divider />
        <CardContent>
          <Grid container spacing={5} className='mbe-5'>
            <Grid item xs={12} sm={6}>
              <TextField
                size='small'
                disabled={!isEdit}
                fullWidth
                label='Site Name'
                name='site_name'
                value={settings.site_name}
                onChange={handleChange}
                placeholder='Masukkan nama situs'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size='small'
                disabled={!isEdit}
                fullWidth
                label='Favicon URL'
                name='favicon'
                value={settings.favicon}
                onChange={handleChange}
                placeholder='/favicon.ico'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size='small'
                disabled={!isEdit}
                fullWidth
                label='Site Logo URL'
                name='site_logo'
                value={settings.site_logo}
                onChange={handleChange}
                placeholder='/images/logo.png'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size='small'
                disabled={!isEdit}
                fullWidth
                label='Meta Keywords'
                name='meta_keywords'
                value={settings.meta_keywords}
                onChange={handleChange}
                placeholder='kata kunci SEO dipisahkan koma'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size='small'
                disabled={!isEdit}
                fullWidth
                multiline
                minRows={3}
                label='Site Description'
                name='site_description'
                value={settings.site_description}
                onChange={handleChange}
                placeholder='Deskripsi singkat tentang situs atau perusahaan'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size='small'
                disabled={!isEdit}
                fullWidth
                multiline
                minRows={3}
                label='Meta Description'
                name='meta_description'
                value={settings.meta_description}
                onChange={handleChange}
                placeholder='Deskripsi untuk meta tag SEO'
              />
            </Grid>
          </Grid>

          <Divider className='mb-5' />
          <Box className='text-right flex justify-between flex-row-reverse'>
            {!isEdit ? (
              <Button
                className='w-1/4'
                variant='contained'
                color='secondary'
                onClick={() => setIsEdit(true)}
                startIcon={<i className='ri-pencil-line text-lg' />}
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  className='w-1/4'
                  variant='contained'
                  color='success'
                  onClick={handleSubmit}
                  startIcon={<i className='ri-save-3-line text-lg' />}
                >
                  Save
                </Button>
                <Button
                  className='w-1/4'
                  variant='contained'
                  color='warning'
                  onClick={() => setIsEdit(false)}
                  startIcon={<i className='ri-close-line text-lg' />}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
      {SnackbarComponent}
    </>
  )
}

export default GeneralSettings
