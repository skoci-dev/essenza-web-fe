'use client'

import { useEffect, useState } from 'react'
import { TextField, Button, Card, CardContent, CardHeader, Divider, Grid } from '@mui/material'
import { useRouter } from 'next/navigation'

import { createDistributor, updateDistributor, getDistributorById } from '@/services/distributors'

const DistributorForm = ({ id }) => {
  const router = useRouter()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    latitude: '',
    longitude: ''
  })

  useEffect(() => {
    if (isEdit) {
      getDistributorById(id).then(data => setFormData(data))
    }
  }, [id])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (isEdit) {
        await updateDistributor(id, formData)
        alert('Distributor updated successfully!')
      } else {
        await createDistributor(formData)
        alert('Distributor added successfully!')
      }
      router.push('/esse-panel/distributors')
    } catch (err) {
      console.error('❌ Error saving distributor:', err)
    }
  }

  return (
    <Card className='shadow'>
      <CardHeader title={isEdit ? 'Edit Distributor' : 'Add Distributor'} />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                size='small'
                label='Name'
                name='name'
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size='small'
                label='Phone'
                name='phone'
                fullWidth
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size='small'
                label='Address'
                name='address'
                fullWidth
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size='small'
                label='Email'
                name='email'
                type='email'
                fullWidth
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size='small'
                label='Website'
                name='website'
                fullWidth
                value={formData.website}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size='small'
                label='Latitude'
                name='latitude'
                fullWidth
                value={formData.latitude}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size='small'
                label='Longitude'
                name='longitude'
                fullWidth
                value={formData.longitude}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <div className='flex justify-end gap-4 mt-6'>
            <Button variant='outlined' color='secondary' onClick={() => router.push('/esse-panel/distributors')}>
              Cancel
            </Button>
            <Button variant='contained' color='primary' type='submit'>
              {isEdit ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default DistributorForm
