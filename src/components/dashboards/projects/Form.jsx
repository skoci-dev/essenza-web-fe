'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import {
  Button,
  Card,
  Grid,
  Typography,
  Box,
  IconButton,
  CardContent,
  FormControlLabel,
  Switch,
  CardHeader,
  Divider
} from '@mui/material'

import { createProject, getProjectById, updateProject } from '@/services/projects'

import useSnackbar from '@/@core/hooks/useSnackbar'
import CustomTextField from '@/@core/components/custom-inputs/TextField'
import FormActions from '@/components/FormActions'
import BackdropLoading from '@/components/BackdropLoading'

import { handleApiResponse } from '@/utils/handleApiResponse'
import { slugify } from '@/utils/helpers'

const defaultData = {
  title: '',
  location: '',
  description: '',
  image: '',
  gallery: [],
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  slug: '',
  is_active: true
}

const ImageUploader = ({ preview, onFileChange, onRemove, required = false, error = '' }) => (
  <Grid item xs={12}>
    <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
      Project Image {required && '*'}
    </Typography>

    {preview ? (
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Box
          component='img'
          src={preview}
          alt='Preview'
          sx={{ width: 220, height: 120, objectFit: 'cover', borderRadius: 1, border: '1px solid #ccc' }}
        />
        <IconButton
          color='error'
          size='small'
          onClick={onRemove}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: 'white',
            boxShadow: 1,
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          <i className='ri-delete-bin-line' style={{ color: '#f44336', fontSize: '18px' }} />
        </IconButton>
      </Box>
    ) : (
      <Button
        variant='outlined'
        component='label'
        sx={{ width: { xs: '100%', sm: 'auto' } }}
        size='small'
        startIcon={<i className='ri-upload-2-line' style={{ fontSize: '18px' }} />}
        color={error ? 'error' : 'primary'}
      >
        Upload Image
        <input type='file' hidden accept='image/*' onChange={onFileChange} />
      </Button>
    )}
    {error && (
      <Typography variant='caption' color='error' sx={{ display: 'block', mt: 0.5 }}>
        {error}
      </Typography>
    )}
  </Grid>
)

const MultipleImageUploader = ({ label = 'Gallery Images', galleryPreview, onFileChange, onRemoveGalleryImage }) => (
  <Grid item xs={12}>
    <Typography variant='subtitle2' className='mb-2'>
      {label}
    </Typography>
    <Box className='flex flex-wrap gap-3'>
      {galleryPreview.map((src, index) => (
        <Box key={index} className='relative inline-block'>
          <img src={src} alt={`Gallery ${index}`} className='w-[120px] h-[80px] object-cover rounded border' />
          <IconButton
            color='error'
            size='small'
            className='absolute top-1 right-1 bg-white shadow'
            onClick={() => onRemoveGalleryImage(index)}
          >
            <i className='ri-delete-bin-line text-red-500 text-lg' />
          </IconButton>
        </Box>
      ))}
      <Button variant='outlined' component='label' startIcon={<i className='ri-upload-2-line text-lg' />}>
        Add Images
        <input type='file' hidden accept='image/*' multiple onChange={onFileChange} />
      </Button>
    </Box>
  </Grid>
)

const ProjectForm = ({ id }) => {
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(defaultData)
  const [preview, setPreview] = useState('')
  const [galleryPreview, setGalleryPreview] = useState(defaultData.gallery || [])
  const [errors, setErrors] = useState({})

  const fields = useMemo(
    () => [
      { name: 'title', label: 'Title', placeholder: 'Title', size: 6, required: true },
      { name: 'slug', label: 'Slug', placeholder: 'slug', size: 6, required: true },
      { name: 'location', label: 'Location', placeholder: 'Location', size: 6 },
      { name: 'description', label: 'Description', placeholder: 'Description', size: 12, multiline: true, rows: 4 },
      { name: 'meta_title', label: 'Meta Title', placeholder: 'Meta Title', size: 6 },
      { name: 'meta_keywords', label: 'Meta Keywords', placeholder: 'keyword1, keyword2, keyword3', size: 6 },
      {
        name: 'meta_description',
        label: 'Meta Description',
        placeholder: 'Meta Description',
        size: 12,
        multiline: true,
        rows: 3
      }
    ],
    []
  )

  const isRequiredMainImage = useMemo(() => data.id && data.originImage, [data.id, data.originImage])

  const handleChange = useCallback(e => {
    const { name, value } = e.target

    setData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSwitchChange = useCallback(e => {
    setData(prev => ({ ...prev, is_active: e.target.checked }))
  }, [])

  const handleImageChange = useCallback(e => {
    const file = e.target.files[0]

    if (file) {
      const imageUrl = URL.createObjectURL(file)

      setPreview(imageUrl)
      setData(prev => ({ ...prev, image: file }))
      setErrors(prev => ({ ...prev, image: '' }))
    }
  }, [])

  const handleRemoveImage = useCallback(() => {
    setPreview('')
    setData(prev => ({ ...prev, image: '' }))
    setErrors(prev => ({ ...prev, image: '' }))
  }, [])

  const handleGalleryChange = useCallback(
    e => {
      const files = Array.from(e.target.files || [])

      if (files.length) {
        const urls = files.map(URL.createObjectURL)

        setGalleryPreview(prev => [...prev, ...urls])
        setData(prev => ({ ...prev, gallery: [...prev.gallery, ...files] }))
      }
    },
    [setGalleryPreview, setData]
  )

  const handleRemoveGalleryImage = useCallback(
    index => {
      setGalleryPreview(prev => prev.filter((_, i) => i !== index))
      setData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }))
    },
    [setGalleryPreview, setData]
  )

  const fetchProject = useCallback(
    async id => {
      setLoading(true)

      try {
        const res = await getProjectById(id)

        setData({ ...res.data, originImage: res.data.image })

        if (res.data?.image) {
          setPreview(res.data.image)
        }

        if (res.data?.gallery && Array.isArray(res.data.gallery)) {
          setGalleryPreview(res.data.gallery)
        }
      } catch {
        error('Failed to load project details.')
      } finally {
        setLoading(false)
      }
    },
    [error]
  )

  useEffect(() => {
    setPreview('')
    if (id) fetchProject(id)
  }, [id, fetchProject])

  const validateForm = () => {
    const newErrors = {}

    if (isRequiredMainImage && !data.image && !preview) {
      newErrors.image = 'Main image is required'
      error('Please upload a main image')
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)

      return false
    }

    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    const formData = new FormData()

    const dataToSubmit = { ...data }

    delete dataToSubmit.image
    delete dataToSubmit.gallery

    Object.keys(dataToSubmit).forEach(key => {
      formData.append(key, dataToSubmit[key] || '')
    })

    if (data.image instanceof File || typeof data.image === 'string') {
      formData.append('image', data.image)
    }

    if (data.gallery && Array.isArray(data.gallery)) {
      data.gallery.forEach((item, index) => {
        if (item instanceof File || typeof item === 'string') {
          formData.append('gallery', item)
        }
      })
    }

    await handleApiResponse(() => (id ? updateProject(id, formData) : createProject(formData)), {
      success: msg => success(msg),
      error: msg => error(msg),
      onSuccess: () =>
        setTimeout(() => {
          router.push('/esse-panel/projects')
        }, 2000),
      onError: () => {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (data?.title) {
      const newSlug = slugify(data?.title)

      setData(prevData => ({
        ...prevData,
        slug: newSlug
      }))
    } else {
      setData(prevData => ({
        ...prevData,
        slug: ''
      }))
    }
  }, [data?.title, setData])

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card sx={{ boxShadow: 3, mb: 4 }}>
          <CardHeader title={id ? 'Edit Project' : 'Add Project'} />
          <Divider />
          <CardContent>
            <Grid container spacing={5}>
              {fields.map(field => (
                <CustomTextField
                  {...field}
                  key={field.name}
                  type={field.type || 'text'}
                  value={data[field.name] || ''}
                  onChange={handleChange}
                  fullWidth
                  inputProps={field.type === 'number' ? { min: 1 } : {}}
                />
              ))}
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Switch checked={data.is_active} onChange={handleSwitchChange} />}
                  label={data?.is_active ? 'Active' : 'Inactive'}
                />
              </Grid>
              <ImageUploader
                preview={preview}
                onFileChange={handleImageChange}
                onRemove={handleRemoveImage}
                required={isRequiredMainImage}
                error={errors.image}
              />
              <MultipleImageUploader
                galleryPreview={galleryPreview}
                onFileChange={handleGalleryChange}
                onRemoveGalleryImage={handleRemoveGalleryImage}
              />
            </Grid>
          </CardContent>
          <Divider />
          <FormActions onCancel={() => router.push('/esse-panel/projects')} isEdit={!!id} />
        </Card>
      </form>
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default ProjectForm
