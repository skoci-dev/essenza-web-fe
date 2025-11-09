'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { TextField, Button, Card, CardContent, CardHeader, Divider, FormControlLabel, Switch } from '@mui/material'
import { getPageById, updatePage, createPage } from '@/services/pages'

const PageForm = ({ isEdit = false }) => {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    is_active: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  })

  useEffect(() => {
    if (isEdit && id) {
      getPageById(id).then(data => {
        if (data) setFormData(data)
      })
    }
  }, [id, isEdit])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleToggleActive = e => {
    setFormData(prev => ({ ...prev, is_active: e.target.checked }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit) {
        await updatePage(id, formData)
        alert('Page updated successfully!')
      } else {
        await createPage({ ...formData, created_at: new Date().toISOString() })
        alert('Page added successfully!')
      }
      router.push('/esse-panel/pages')
    } catch (error) {
      console.error(error)
      alert('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='shadow'>
      <CardHeader title={isEdit ? 'Edit Page' : 'Add Page'} />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <TextField
            size='small'
            label='Title'
            name='title'
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            size='small'
            label='Slug'
            name='slug'
            value={formData.slug}
            onChange={handleChange}
            helperText='Example: about-us'
            fullWidth
          />
          <TextField
            size='small'
            label='Content'
            name='content'
            value={formData.content}
            onChange={handleChange}
            multiline
            rows={6}
            fullWidth
          />
          <FormControlLabel
            control={<Switch checked={formData.is_active} onChange={handleToggleActive} />}
            label='Active'
          />

          <Divider textAlign='left'>SEO Meta</Divider>

          <TextField
            size='small'
            label='Meta Title'
            name='meta_title'
            value={formData.meta_title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            size='small'
            label='Meta Description'
            name='meta_description'
            value={formData.meta_description}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
          />
          <TextField
            size='small'
            label='Meta Keywords'
            name='meta_keywords'
            value={formData.meta_keywords}
            onChange={handleChange}
            helperText='Comma separated keywords'
            fullWidth
          />

          <div className='flex justify-end gap-3 mt-4'>
            <Button type='button' variant='outlined' onClick={() => router.push('/esse-panel/pages')}>
              Cancel
            </Button>
            <Button type='submit' variant='contained' disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default PageForm
