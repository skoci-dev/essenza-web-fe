'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import { createBrochure, getBrochureById, updateBrochure } from '@/services/brochures'

import useSnackbar from '@/@core/hooks/useSnackbar'
import CustomTextField from '@/@core/components/custom-inputs/TextField'
import FormActions from '@/components/FormActions'

import { handleApiResponse } from '@/utils/handleApiResponse'
import BackdropLoading from '@/components/BackdropLoading'
import { ShowElse, ShowIf } from '@/components/ShowIf'

const defaultData = {
  title: '',
  file: null
}

const BrochuresForm = ({ id }) => {
  const router = useRouter()
  const isEdit = !!id

  const [originData, setOriginData] = useState(null)
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(defaultData.file || '')
  const [previewImage, setPreviewImage] = useState('')
  const [errors, setErrors] = useState({})

  const { success, error, SnackbarComponent } = useSnackbar()

  const fields = useMemo(
    () => [{ name: 'title', label: 'Title', placeholder: 'Brochure Title', size: 6, required: true }],
    []
  )

  const validate = useCallback(() => {
    const errs = {}

    if (!data.title) errs.title = 'Title is required'

    if (!isEdit) {
      if (!data.file) errs.file = 'File is required'
    } else {
      if (!data.file && !data.file_url) errs.file = 'File is required'
    }

    if (!isEdit) {
      if (!data.image) errs.image = 'Image is required'
    } else {
      if (!data.image && !previewImage) errs.image = 'Image is required'
    }

    setErrors(errs)

    return Object.keys(errs).length === 0
  }, [data, isEdit, previewImage])

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    const formData = new FormData()

    formData.append('title', data.title)

    if (data.file) formData.append('file', data.file)
    if (data.image) formData.append('image', data.image)

    if (isEdit) {
      formData.append('_method', 'PUT')
    }

    await handleApiResponse(() => (isEdit ? updateBrochure(id, formData) : createBrochure(formData)), {
      success: msg => success(msg),
      error: msg => error(msg),
      onSuccess: () =>
        setTimeout(() => {
          router.push('/esse-panel/brochures')
        }, 1000),
      onError: () => setLoading(false)
    })
  }

  const handleChange = e => {
    const { name, value } = e.target

    setErrors(prev => ({ ...prev, [name]: '' }))
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = e => {
    const file = e.target.files[0]

    if (file) {
      setErrors(prev => ({ ...prev, file: '' }))
      setData(prev => ({ ...prev, file }))
      setPreview(file.name)
    }
  }

  const handleRemoveFile = () => {
    setData(prev => ({ ...prev, file: null, file_url: '' }))
    setPreview('')
  }

  const handleImageChange = e => {
    const image = e.target.files[0]

    if (image) {
      setErrors(prev => ({ ...prev, image: '' }))
      setData(prev => ({ ...prev, image }))
      setPreviewImage(image ? URL.createObjectURL(image) : '')
    }
  }

  const handleRemoveImage = () => {
    setData(prev => ({ ...prev, image: null }))
    setPreviewImage('')
  }

  const fetchBrochure = async id => {
    try {
      const res = await getBrochureById(id)

      setData({ ...res.data, image: null, file: null })
      setOriginData(res.data)
      setPreviewImage(res.data.image || '')

      if (res.data?.file_url) {
        const fileName = res.data.file_url.split('/').pop() || res.data.file_url

        setPreview(fileName)
      }
    } catch {
      error('Failed to load Brochure')
    }
  }

  useEffect(() => {
    setPreview('')
    if (id) fetchBrochure(id)
  }, [id])

  return (
    <>
      <Card className='shadow'>
        <CardHeader title={defaultData.id ? 'Edit Brochure' : 'Add Brochure'} />
        <Divider />

        <form onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={4}>
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

              {/* File Upload */}
              <Grid item xs={12}>
                <Typography variant='subtitle2' className='mb-2'>
                  File PDF *
                </Typography>
                <ShowIf when={preview}>
                  <Box className='flex items-center justify-between border rounded p-3'>
                    <ShowIf when={isEdit}>
                      <a
                        href={data.file_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{ color: 'blue', textDecoration: 'underline' }}
                      >
                        <Typography variant='body2'>{preview}</Typography>
                      </a>

                      <ShowElse>
                        <Typography variant='body2'>{preview}</Typography>
                      </ShowElse>
                    </ShowIf>
                    <IconButton color='error' size='small' onClick={handleRemoveFile} className='bg-white shadow'>
                      <i className='ri-delete-bin-line text-red-500 text-lg' />
                    </IconButton>
                  </Box>

                  <ShowElse>
                    <Button
                      variant='outlined'
                      component='label'
                      startIcon={<i className='ri-upload-2-line text-lg' />}
                      color={errors.file ? 'error' : 'primary'}
                    >
                      Upload PDF
                      <input type='file' hidden accept='application/pdf' onChange={handleFileChange} />
                    </Button>
                    <ShowIf when={errors.file}>
                      <Typography variant='caption' color='error' sx={{ display: 'block', mt: 0.5 }}>
                        {errors.file}
                      </Typography>
                    </ShowIf>
                  </ShowElse>
                </ShowIf>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle2' className='mb-2'>
                  Image *
                </Typography>
                <ShowIf when={previewImage}>
                  <Box className='relative inline-block'>
                    <img src={previewImage} alt='Preview' className='w-[220px] h-[120px] object-cover rounded border' />
                    <IconButton
                      color='error'
                      size='small'
                      className='absolute top-1 right-1 bg-white shadow'
                      onClick={handleRemoveImage}
                    >
                      <i className='ri-delete-bin-line text-red-500 text-lg' />
                    </IconButton>
                  </Box>

                  <ShowElse>
                    <Button
                      variant='outlined'
                      component='label'
                      startIcon={<i className='ri-upload-2-line text-lg' />}
                      color={errors.image ? 'error' : 'primary'}
                    >
                      Upload Image
                      <input type='file' hidden accept='image/*' onChange={handleImageChange} />
                    </Button>
                    <ShowIf when={errors.image}>
                      <Typography variant='caption' color='error' sx={{ display: 'block', mt: 0.5 }}>
                        {errors.image}
                      </Typography>
                    </ShowIf>
                  </ShowElse>
                </ShowIf>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <FormActions onCancel={() => router.push('/esse-panel/brochures')} isEdit={isEdit} />
        </form>
      </Card>
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default BrochuresForm
