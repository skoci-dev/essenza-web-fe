'use client'

import { useEffect, useState } from 'react'
import { TextField, Button, Card, CardContent, FormControlLabel, Switch } from '@mui/material'
import { createProject, getProjectById, updateProject } from '@/services/projects'
import { useRouter, useParams } from 'next/navigation'

const ProjectForm = ({ isEdit = false }) => {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
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
  })

  useEffect(() => {
    if (isEdit && id) {
      getProjectById(id).then(data => setFormData(data))
    }
  }, [isEdit, id])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) await updateProject(id, formData)
      else await createProject(formData)
      alert('Saved successfully!')
      router.push('/esse-panel/projects')
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='shadow'>
      <CardContent>
        <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <TextField
            size='small'
            name='title'
            label='Title'
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            size='small'
            name='location'
            label='Location'
            value={formData.location}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            size='small'
            name='slug'
            label='Slug'
            value={formData.slug}
            onChange={handleChange}
            fullWidth
            helperText='Unique slug for project URL'
          />
          <TextField
            size='small'
            name='image'
            label='Main Image URL'
            value={formData.image}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            size='small'
            name='description'
            label='Description'
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            size='small'
            name='meta_title'
            label='Meta Title'
            value={formData.meta_title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            size='small'
            name='meta_description'
            label='Meta Description'
            value={formData.meta_description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            size='small'
            name='meta_keywords'
            label='Meta Keywords'
            value={formData.meta_keywords}
            onChange={handleChange}
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={e => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              />
            }
            label='Active'
          />

          <div className='col-span-2 flex justify-end gap-3 mt-4'>
            <Button type='button' variant='outlined' onClick={() => router.push('/esse-panel/projects')}>
              Cancel
            </Button>
            <Button type='submit' variant='contained' disabled={loading}>
              {isEdit ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProjectForm
