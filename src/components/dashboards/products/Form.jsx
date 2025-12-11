'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Components
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'

import useSnackbar from '@/@core/hooks/useSnackbar'
import BackdropLoading from '@/components/BackdropLoading'

import { handleApiResponse } from '@/utils/handleApiResponse'
import {
  addSpecificationToProduct,
  createProduct,
  getProductCategories,
  getProductSpecifications
} from '@/services/products'
import { slugify } from '@/utils/helpers'

// Default blank product
const defaultProduct = {
  id: null,
  name: '',
  slug: '',
  category: 'cemento',
  description: '',
  product_type: 'lantai',
  image: '',
  gallery: [],
  brochure_id: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  is_active: true,
  specifications: []
}

const ProductForm = ({ initialData = defaultProduct, onCancel }) => {
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [form, setForm] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(initialData.image || '')
  const [galleryPreview, setGalleryPreview] = useState(initialData.gallery || [])
  const [categories, setCategories] = useState([])
  const [specifications, setSpecifications] = useState([])
  const [selectedSpecs, setSelectedSpecs] = useState(initialData.specifications || [])
  const [errors, setErrors] = useState({})

  // Load categories and specifications on mount
  useEffect(() => {
    handleApiResponse(getProductCategories, {
      onSuccess: ({ data }) => setCategories(data)
    })

    handleApiResponse(() => getProductSpecifications({ active: true }), {
      onSuccess: ({ data }) => setSpecifications(data.sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0)))
    })
  }, [])

  useEffect(() => {
    if (form.name) {
      setForm(prev => ({ ...prev, slug: slugify(form.name) }))
    }
  }, [form.name])

  const handleChange = e => {
    const { name, value } = e.target

    setForm(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSwitchChange = e => {
    setForm(prev => ({ ...prev, is_active: e.target.checked }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]

    if (file) {
      setPreview(URL.createObjectURL(file))
      setForm(prev => ({ ...prev, image: file }))
    }
  }

  const handleGalleryChange = e => {
    const files = Array.from(e.target.files || [])

    if (files.length) {
      const urls = files.map(URL.createObjectURL)

      setGalleryPreview(prev => [...prev, ...urls])
      setForm(prev => ({ ...prev, gallery: [...prev.gallery, ...files] }))
    }
  }

  const handleRemoveGalleryImage = index => {
    setGalleryPreview(prev => prev.filter((_, i) => i !== index))
    setForm(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }))
  }

  const handleAddSpecification = () => {
    setSelectedSpecs(prev => [...prev, { slug: '', value: '', highlighted: false }])
  }

  const handleSpecificationChange = (index, field, value) => {
    setSelectedSpecs(prev => prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)))
  }

  const handleRemoveSpecification = index => {
    setSelectedSpecs(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Validate required fields
    const newErrors = {}

    if (!form.name.trim()) newErrors.name = 'Product name is required'
    if (!form.slug.trim()) newErrors.slug = 'Slug is required'

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      error('Please fill in all required fields')

      return
    }

    setLoading(true)
    const { specifications, ...formData } = form

    await handleApiResponse(() => createProduct(formData), {
      success,
      error,
      onSuccess: async ({ data: { id } }) => {
        await handleApiResponse(() => addSpecificationToProduct(id, { specifications: selectedSpecs }), {
          success,
          error,
          onSuccess: () => {
            success('Product created successfully!')
            router.push('/esse-panel/products')
          },
          onError: () => setLoading(false)
        })
      },
      onError: () => setLoading(false)
    })
  }

  return (
    <>
      <Card className='shadow'>
        <CardHeader
          title={initialData.id ? 'Edit Product' : 'Add New Product'}
          subheader='Isi semua informasi produk di bawah ini.'
        />
        <Divider />

        <form onSubmit={handleSubmit}>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size='small'
                  label='Product Name'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  placeholder='Nama produk'
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size='small'
                  label='Slug'
                  name='slug'
                  value={form.slug}
                  onChange={handleChange}
                  placeholder='contoh: keramik-lantai-motif-kayu'
                  error={!!errors.slug}
                  helperText={errors.slug}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Category'
                  name='category'
                  value={form.category}
                  onChange={handleChange}
                >
                  {categories.map(category => (
                    <MenuItem key={category.slug} value={category.slug}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size='small'
                  label='Product Type'
                  name='product_type'
                  value={form.product_type}
                  onChange={handleChange}
                >
                  <MenuItem value='lantai'>Lantai</MenuItem>
                  <MenuItem value='dinding'>Dinding</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size='small'
                  multiline
                  rows={4}
                  label='Description'
                  name='description'
                  value={form.description}
                  onChange={handleChange}
                  placeholder='Deskripsi produk'
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle2' className='mb-2'>
                  Main Image
                </Typography>
                {preview ? (
                  <Box className='relative inline-block'>
                    <img src={preview} alt='Preview' className='w-[220px] h-[120px] object-cover rounded border' />
                    <IconButton
                      color='error'
                      size='small'
                      className='absolute top-1 right-1 bg-white shadow'
                      onClick={() => {
                        setPreview('')
                        setForm(prev => ({ ...prev, image: '' }))
                      }}
                    >
                      <i className='ri-delete-bin-line text-red-500 text-lg' />
                    </IconButton>
                  </Box>
                ) : (
                  <Button variant='outlined' component='label' startIcon={<i className='ri-upload-2-line text-lg' />}>
                    Upload Image
                    <input type='file' hidden accept='image/*' onChange={handleImageChange} />
                  </Button>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle2' className='mb-2'>
                  Gallery Images
                </Typography>
                <Box className='flex flex-wrap gap-3'>
                  {galleryPreview.map((src, index) => (
                    <Box key={index} className='relative inline-block'>
                      <img
                        src={src}
                        alt={`Gallery ${index}`}
                        className='w-[120px] h-[80px] object-cover rounded border'
                      />
                      <IconButton
                        color='error'
                        size='small'
                        className='absolute top-1 right-1 bg-white shadow'
                        onClick={() => handleRemoveGalleryImage(index)}
                      >
                        <i className='ri-delete-bin-line text-red-500 text-lg' />
                      </IconButton>
                    </Box>
                  ))}
                  <Button variant='outlined' component='label' startIcon={<i className='ri-upload-2-line text-lg' />}>
                    Add Images
                    <input type='file' hidden accept='image/*' multiple onChange={handleGalleryChange} />
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='Meta Title'
                  name='meta_title'
                  value={form.meta_title}
                  onChange={handleChange}
                  placeholder='SEO Title'
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='Meta Keywords'
                  name='meta_keywords'
                  value={form.meta_keywords}
                  onChange={handleChange}
                  placeholder='Keyword1, Keyword2'
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size='small'
                  multiline
                  rows={3}
                  label='Meta Description'
                  name='meta_description'
                  value={form.meta_description}
                  onChange={handleChange}
                  placeholder='SEO Description'
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={<Switch checked={form.is_active} onChange={handleSwitchChange} />}
                  label='Active'
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle2' className='mb-2'>
                  Specification
                </Typography>

                <Box className='my-4 space-y-3'>
                  {selectedSpecs.map((spec, index) => (
                    <Card key={index} variant='outlined' className='p-4'>
                      <Grid container spacing={4} alignItems='center'>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            select
                            fullWidth
                            size='small'
                            label='Specification'
                            value={spec.slug}
                            onChange={e => handleSpecificationChange(index, 'slug', e.target.value)}
                          >
                            {specifications.map(s => (
                              <MenuItem key={s.id} value={s.slug}>
                                <Box component='img' sx={{ height: '14px', mr: 2 }} src={`/icons/${s.icon}.svg`} />
                                {s.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            size='small'
                            label='Value'
                            value={spec.value}
                            onChange={e => handleSpecificationChange(index, 'value', e.target.value)}
                            placeholder='Enter value'
                          />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                size='small'
                                checked={spec.highlighted}
                                onChange={e => handleSpecificationChange(index, 'highlighted', e.target.checked)}
                              />
                            }
                            label={spec.highlighted ? 'Highlighted' : 'Technical'}
                          />
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <IconButton color='error' onClick={() => handleRemoveSpecification(index)} size='small'>
                            <i className='ri-delete-bin-line' />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </Box>

                <Button
                  variant='outlined'
                  startIcon={<i className='ri-add-line text-lg' />}
                  onClick={handleAddSpecification}
                >
                  Add Specification
                </Button>
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          <Box className='flex justify-between gap-3 p-4'>
            <Button
              variant='outlined'
              className='w-1/4'
              color='secondary'
              startIcon={<i className='ri-close-line text-lg' />}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              className='w-1/4'
              color='success'
              startIcon={<i className='ri-save-3-line text-lg' />}
            >
              {initialData.id ? 'Update' : 'Save'}
            </Button>
          </Box>
        </form>
      </Card>
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default ProductForm
