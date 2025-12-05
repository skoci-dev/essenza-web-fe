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

// Asumsi: handleApiResponse berfungsi dengan baik
import { handleApiResponse } from '@/utils/handleApiResponse'

// --- 1. DATA DEFAULT ---
const defaultData = {
  title: '',
  location: '',
  description: '',
  image: '', // Akan menampung File Object (saat baru) atau URL string (saat load data lama)
  gallery: [],
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  slug: '',
  is_active: true
}

// --- 2. KOMPONEN HELPER IMAGE UPLOADER ---
const ImageUploader = ({ preview, onFileChange, onRemove }) => (
  <Grid item xs={12}>
    <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
      Project Image
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
        color='primary'
      >
        Upload Image
        <input type='file' hidden accept='image/*' onChange={onFileChange} />
      </Button>
    )}
  </Grid>
)

// --- 3. KOMPONEN UTAMA PROJECT FORM ---
const ProjectForm = ({ id }) => {
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(defaultData)
  const [preview, setPreview] = useState('')

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

  // --- HANDLERS ---
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

      // Simpan File Object ke state data
      setData(prev => ({ ...prev, image: file }))
    }
  }, [])

  const handleRemoveImage = useCallback(() => {
    setPreview('')

    // Set image ke string kosong, yang akan ditangani di handleSubmit
    setData(prev => ({ ...prev, image: '' }))
  }, [])

  // --- LOGIC FETCH DATA ---
  const fetchProject = async id => {
    setLoading(true) // Mulai loading saat fetching

    try {
      const res = await getProjectById(id)

      setData(res.data)

      if (res.data?.image) {
        setPreview(res.data.image) // Set preview ke URL lama
      }
    } catch {
      error('Failed to load social media')
    } finally {
      setLoading(false) // Selesai loading
    }
  }

  useEffect(() => {
    setPreview('') // Reset preview saat ID berubah
    if (id) fetchProject(id)
  }, [id])

  // --- LOGIC SUBMIT (KUNCI PERBAIKAN) ---
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    // 1. Buat FormData
    const formData = new FormData()

    // 2. Siapkan data tanpa field 'image' dan 'gallery'
    // Menggunakan data state saat ini.
    const dataToSubmit = { ...data }

    delete dataToSubmit.image
    delete dataToSubmit.gallery

    // 3. Tambahkan semua field teks/boolean yang tersisa ke FormData
    Object.keys(dataToSubmit).forEach(key => {
      // Append value. Konversi boolean ke string 'true'/'false' jika BE memerlukannya
      formData.append(key, dataToSubmit[key] || '')
    })

    // 4. LOGIC IMAGE FILE HANDLING: Hanya tambahkan 'image' jika itu adalah File Object BARU
    if (data.image instanceof File) {
      // KUNCI: Kirim File Object
      formData.append('image', data.image)
    }

    // JANGAN kirim field 'image' jika isinya URL string (pertahankan gambar lama)

    // Opsional: Handle kasus di mana gambar dihapus (jika BE Anda memerlukannya)
    if (id && data.image === '' && preview.startsWith('http')) {
      // Kirim sinyal khusus ke BE untuk menghapus gambar lama jika diperlukan
      // Contoh: formData.append('image_action', 'DELETE');
    }

    // 5. Handle Gallery (jika gallery memiliki File Object baru)
    if (data.gallery && Array.isArray(data.gallery)) {
      data.gallery.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`gallery[${index}]`, item)
        }
      })
    }

    // 6. Kirim FormData
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

  // --- RENDER ---
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card sx={{ boxShadow: 3, mb: 4 }}>
          <CardHeader title={id ? 'Edit Project' : 'Add Project'} />
          <Divider />
          <CardContent>
            <Grid container spacing={5}>
              {fields.map(field => (
                <Grid item xs={12} sm={field.size} key={field.name}>
                  <CustomTextField
                    {...field}
                    type={field.type || 'text'}
                    value={data[field.name] || ''}
                    onChange={handleChange}
                    fullWidth
                    inputProps={field.type === 'number' ? { min: 1 } : {}}
                  />
                </Grid>
              ))}
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Switch checked={data.is_active} onChange={handleSwitchChange} />}
                  label={data?.is_active ? 'Active' : 'Inactive'}
                />
              </Grid>
              <ImageUploader preview={preview} onFileChange={handleImageChange} onRemove={handleRemoveImage} />
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
