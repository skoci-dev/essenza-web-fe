'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, Divider, Grid, Typography, Button, Box } from '@mui/material'

import { getDistributorById, deleteDistributor } from '@/services/distributors'
import DetailField from '@/components/DetailField' // Komponen reusable yg sudah kamu punya

const DistributorDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [distributor, setDistributor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getDistributorById(id)
        .then(data => setDistributor(data))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleDelete = async () => {
    if (confirm('Are you sure to delete this distributor?')) {
      await deleteDistributor(id)
      alert('Distributor deleted!')
      router.push('/esse-panel/distributors')
    }
  }

  if (loading) return <p className='p-6'>Loading...</p>
  if (!distributor) return <p className='p-6'>Distributor not found.</p>

  return (
    <div className='p-6'>
      <Card>
        <CardHeader title='Distributor Detail' />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <DetailField label='Name' value={distributor.name} />
            <DetailField label='Address' value={distributor.address} xs={12} />
            <DetailField label='Phone' value={distributor.phone} />
            <DetailField label='Email' value={distributor.email} />
            <DetailField label='Website' value={distributor.website} />
            <DetailField label='Latitude' value={distributor.latitude} />
            <DetailField label='Longitude' value={distributor.longitude} />
            <DetailField label='Created At' value={distributor.created_at} />
          </Grid>
        </CardContent>
        <Divider />
        <Box className='flex justify-between items-center p-4 gap-3'>
          <Button
            variant='outlined'
            color='secondary'
            className='w-1/6'
            startIcon={<i className='ri-arrow-left-line' />}
            onClick={() => router.push('/esse-panel/distributors')}
          >
            Back
          </Button>
          <Box className='w-1/2' />
          <Button
            variant='contained'
            color='error'
            className='w-1/6'
            startIcon={<i className='ri-delete-bin-line' />}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button
            variant='contained'
            color='warning'
            className='w-1/6'
            startIcon={<i className='ri-pencil-line' />}
            onClick={() => router.push(`/esse-panel/distributors/${id}/edit`)}
          >
            Edit
          </Button>
        </Box>
      </Card>
    </div>
  )
}

export default DistributorDetailPage
