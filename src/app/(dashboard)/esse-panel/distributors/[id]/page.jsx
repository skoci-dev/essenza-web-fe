'use client'

import { useEffect, useState, useCallback } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import { getDistributorById, deleteDistributor } from '@/services/distributors'
import DetailField from '@/components/DetailField'
import DetailActions from '@/components/DetailActions'
import useSnackbar from '@/@core/hooks/useSnackbar'
import BackdropLoading from '@/components/BackdropLoading'
import { formatDateToCustomStringNative } from '@/utils/helpers'

const DistributorDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [distributor, setDistributor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDistributor = async () => {
      try {
        const res = await getDistributorById(id)

        if (res?.data) {
          setDistributor(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch distributor:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchDistributor()
  }, [id, error])

  const handleDelete = useCallback(async () => {
    setLoading(true)

    try {
      await deleteDistributor(id)

      success('Berhasil dihapus!')
      setTimeout(() => {
        router.push('/esse-panel/distributors')
      }, 1000)
      router.push('/esse-panel/distributors')
    } catch (err) {
      console.error('Delete failed:', err)
      error('Gagal menghapus: ' + (err.message || 'Terjadi kesalahan server.'))
      setLoading(false)
    }
  }, [id, success, error, router])

  if (!distributor) return <p className='p-6'>Distributor not found.</p>

  return (
    <div className='p-6'>
      <Card>
        <CardHeader title='Distributor Detail' />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <DetailField label='Name' value={distributor.name} />
            <DetailField label='Phone' value={distributor.phone} />
            <DetailField label='Email' value={distributor.email} />
            <DetailField label='City' value={distributor.city?.label || '-'} />
            <DetailField label='Address' value={distributor.address} xs={12} sm={12} />
            <DetailField label='Website' value={distributor.website} />
            <DetailField label='Gmaps URL' value={distributor.gmap_link} />
            <DetailField label='Latitude' value={distributor.latitude} />
            <DetailField label='Longitude' value={distributor.longitude} />
            <DetailField label='Created At' value={formatDateToCustomStringNative(distributor.created_at)} />
          </Grid>
        </CardContent>
        <Divider />
        <DetailActions id={id} href='distributors' onConfirm={handleDelete} />
      </Card>
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </div>
  )
}

export default DistributorDetailPage
