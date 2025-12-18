'use client'

import { useEffect, useState, useCallback } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { getStoreById, deleteStore } from '@/services/stores'
import DetailField from '@/components/DetailField'
import DetailActions from '@/components/DetailActions'

import useSnackbar from '@/@core/hooks/useSnackbar'
import BackdropLoading from '@/components/BackdropLoading'
import { formatDateToCustomStringNative } from '@/utils/helpers'

const StoreDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await getStoreById(id)

        if (res?.data) {
          setStore(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch store:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchStore()
  }, [id])

  const handleDelete = useCallback(async () => {
    setLoading(true)

    try {
      await deleteStore(id)

      success('Berhasil dihapus!')
      setTimeout(() => {
        router.push('/esse-panel/stores')
      }, 1000)
      router.push('/esse-panel/stores')
    } catch (err) {
      console.error('Delete failed:', err)
      error('Gagal menghapus: ' + (err.message || 'Terjadi kesalahan server.'))
      setLoading(false)
    }
  }, [id, success, error, router])

  if (!store) return <p className='p-6'>Store not found</p>

  return (
    <div className='p-6'>
      <Card className='shadow'>
        <CardHeader title='Store Detail' />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <DetailField label='Name' value={store.name} />
            <DetailField label='Phone' value={store.phone} />
            <DetailField label='Email' value={store.email} />
            <DetailField label='City' value={store.city?.label || '-'} />
            <DetailField label='Address' value={store.address} sx={12} sm={12} />
            <DetailField label='Gmap URL' value={store.gmap_link} sx={12} sm={12} />
            <DetailField label='Latitude' value={store.latitude} />
            <DetailField label='Longitude' value={store.longitude} />
          </Grid>
        </CardContent>
        <Divider />
        <DetailActions id={id} href='stores' onConfirm={handleDelete} />
      </Card>
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </div>
  )
}

export default StoreDetailPage
