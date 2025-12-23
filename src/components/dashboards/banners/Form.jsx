'use client'

import { useState, useMemo, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import CustomTextField from '@/@core/components/custom-inputs/TextField'
import useSnackbar from '@/@core/hooks/useSnackbar'
import { createBanner, updateBanner, getBannerById } from '@/services/banner'
import { handleApiResponse } from '@/utils/handleApiResponse'
import FormActions from '@/components/FormActions'
import BackdropLoading from '@/components/BackdropLoading'

const defaultData = {
  title: '',
  subtitle: '',
  file: '',
  link_url: '',
  order_no: 1,
  is_active: true
}

const BannersForm = ({ id }) => {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const [fileType, setFileType] = useState('image')

  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const fields = useMemo(
    () => [
      { name: 'title', label: 'Title', placeholder: 'Banner Title', size: 6, required: true },
      { name: 'subtitle', label: 'Subtitle', placeholder: 'Sub Title Banner', size: 6 },
      { name: 'link_url', label: 'Link URL (Optional)', placeholder: 'https://example.com', size: 6 },
      { name: 'order_no', label: 'Order No', type: 'number', size: 4 }
    ],
    []
  )

  const fetchBanner = async id => {
    try {
      const res = await getBannerById(id)

      setData(res.data)

      if (res.data?.file) {
        setPreview(res.data.file)

        const isVideo = res.data.file.match(/\.(mp4|webm|ogg)$/i)

        setFileType(isVideo ? 'video' : 'image')
      }
    } catch {
      error('Failed to load Banner')
    }
  }

  useEffect(() => {
    setPreview('')
    if (id) fetchBanner(id)
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target

    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = e => {
    setData(prev => ({ ...prev, is_active: e.target.checked }))
  }

  const handleFileChange = e => {
    const file = e.target.files[0]

    if (file) {
      const fileUrl = URL.createObjectURL(file)

      setPreview(fileUrl)

      if (file.type.startsWith('video/')) {
        setFileType('video')
      } else {
        setFileType('image')
      }

      setData(prev => ({ ...prev, file: file }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    await handleApiResponse(() => (id ? updateBanner(id, data) : createBanner(data)), {
      success: msg => success(msg),
      error: msg => error(msg),
      onSuccess: () =>
        setTimeout(() => {
          router.push('/esse-panel/banners')
        }, 1000),
      onError: () => setLoading(false)
    })
  }

  return (
    <>
      <Card className='shadow'>
        <CardHeader title={id ? 'Edit Banner' : 'Add Banner'} subheader='Isi semua informasi banner di bawah ini.' />
        <Divider />

        <form onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={5} className='mbe-5'>
              {fields.map(field => (
                <CustomTextField
                  key={field.name}
                  {...field}
                  type={field.type || 'text'}
                  value={data[field.name] || ''}
                  onChange={handleChange}
                  inputProps={field.type === 'number' ? { min: 1 } : {}}
                />
              ))}

              <Grid item xs={12} sm={2}>
                <FormControlLabel
                  control={<Switch checked={data.is_active} onChange={handleSwitchChange} />}
                  label={data?.is_active ? 'Active' : 'Inactive'}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle2' className='mb-2'>
                  Banner Media (Image/Video)
                </Typography>

                {preview ? (
                  <Box className='relative inline-block'>
                    {fileType === 'video' ? (
                      <video src={preview} className='w-[320px] h-[180px] object-cover rounded border' controls />
                    ) : (
                      <img src={preview} alt='Preview' className='w-[320px] h-[180px] object-cover rounded border' />
                    )}

                    <IconButton
                      color='error'
                      size='small'
                      className='absolute top-1 right-1 bg-white shadow'
                      onClick={() => {
                        setPreview('')
                        setData(prev => ({ ...prev, file: '' }))
                      }}
                    >
                      <i className='ri-delete-bin-line text-red-500 text-lg' />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant='outlined'
                    component='label'
                    className='min-w-[200px]'
                    size='small'
                    startIcon={<i className='ri-upload-2-line text-lg' />}
                    color='primary'
                  >
                    Upload Media
                    <input type='file' hidden accept='image/*,video/*' onChange={handleFileChange} />
                  </Button>
                )}
                <Typography variant='caption' display='block' className='mt-1'>
                  Supported formats: JPG, PNG, MP4, WebM
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <FormActions onCancel={() => router.push('/esse-panel/banners')} isEdit={id} />
        </form>
      </Card>
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default BannersForm
