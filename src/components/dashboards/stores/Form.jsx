'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { TextField, Button, Card, CardContent, CardHeader, Divider } from '@mui/material'
import { getStoreById, updateStore, createStore } from '@/services/stores'

const StoreForm = ({ isEdit = false }) => {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: ''
  })

  useEffect(() => {
    if (isEdit && id) {
      getStoreById(id).then(data => {
        if (data) setFormData(data)
      })
    }
  }, [id, isEdit])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (isEdit) {
      await updateStore(id, formData)
      alert('Store updated successfully!')
    } else {
      await createStore({ ...formData, created_at: new Date().toISOString() })
      alert('Store added successfully!')
    }
    router.push('/esse-panel/stores')
  }

  return (
    <Card className='shadow'>
      <CardHeader title={isEdit ? 'Edit Store' : 'Add Store'} />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <TextField
            size='small'
            label='Store Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            size='small'
            label='Address'
            name='address'
            value={formData.address}
            onChange={handleChange}
            multiline
            rows={3}
          />
          <TextField size='small' label='Phone' name='phone' value={formData.phone} onChange={handleChange} />
          <TextField size='small' label='Email' name='email' value={formData.email} onChange={handleChange} />
          <div className='flex gap-4'>
            <TextField
              size='small'
              label='Latitude'
              name='latitude'
              value={formData.latitude}
              onChange={handleChange}
            />
            <TextField
              size='small'
              label='Longitude'
              name='longitude'
              value={formData.longitude}
              onChange={handleChange}
            />
          </div>
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

export default StoreForm
