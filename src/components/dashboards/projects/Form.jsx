'use client'

import { useEffect, useState, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

import { CardHeader, Divider } from '@mui/material'

import { createProject, getProjectById, updateProject } from '@/services/projects'

import useSnackbar from '@/@core/hooks/useSnackbar'
import CustomTextField from '@/@core/components/custom-inputs/TextField'
import FormActions from '@/components/FormActions'

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

const ProjectForm = ({ id }) => {
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(defaultData)
  const [preview, setPreview] = useState(defaultData.image || '')

  const fields = useMemo(
    () => [
      { name: 'title', label: 'Title', placeholder: 'Judul', size: 6, required: true },
      { name: 'slug', label: 'Slug', placeholder: 'slug-url-anda', size: 6 },
      { name: 'location', label: 'Location', placeholder: 'Lokasi', size: 6 },
      { name: 'description', label: 'Description', placeholder: 'Deskripsi', size: 12, multiline: true, rows: 4 },
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

  useEffect(() => {
    if (id) {
      getProjectById(id).then(e => setData(e))
    }
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target

    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = e => {
    setData(prev => ({ ...prev, is_active: e.target.checked }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]

    if (file) {
      const imageUrl = URL.createObjectURL(file)

      setPreview(imageUrl)
      setData(prev => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      if (id) await updateProject(id, data)
      else await createProject(data)
      alert('Saved successfully!')
      router.push('/esse-panel/projects')
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card className='shadow'>
          <CardHeader title={id ? 'Edit Project' : 'Add Project'} subheader='' />
          <Divider />
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
              <Grid item xs={6} sm={2}>
                <FormControlLabel
                  control={<Switch checked={data.is_active} onChange={handleSwitchChange} />}
                  label={data?.is_active ? 'Active' : 'Inactive'}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle2' className='mb-2'>
                  Project Image
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
                        setData(prev => ({ ...prev, image: '' }))
                      }}
                    >
                      <i className='ri-delete-bin-line text-red-500 text-lg' />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant='outlined'
                    component='label'
                    className='w-1/6'
                    size='small'
                    startIcon={<i className='ri-upload-2-line text-lg' />}
                    color='primary'
                  >
                    Upload Image
                    <input type='file' hidden accept='image/*' onChange={handleImageChange} />
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <FormActions onCancel={() => router.push('/esse-panel/banners')} isEdit={id} />
        </Card>
      </form>
      {SnackbarComponent}
    </>
  )
}

export default ProjectForm
