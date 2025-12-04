'use client'

import { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { getBannerById, deleteBanner } from '@/services/banner'
import DetailField from '@/components/DetailField'
import DetailActions from '@/components/DetailActions'

const BannerDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [banner, setBanner] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await getBannerById(id)

        if (res?.data) {
          setBanner(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch banner:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBanner()
  }, [id])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBanner(id)
        alert('Banner deleted successfully!')
        router.push('/esse-panel/banner')
      } catch (err) {
        console.error('Delete failed:', err)
      }
    }
  }

  if (loading) return <p className='p-6'>Loading...</p>
  if (!banner) return <p className='p-6'>Banner not found.</p>

  return (
    <div className='p-6'>
      <Card className='w-full mx-auto shadow'>
        <CardHeader title={`Banner Detail - ${id}`} />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <DetailField label={'Title'} value={banner?.title} />
            <DetailField label={'Subtitle'} value={banner?.subtitle} />
            <DetailField label={'Link URL'} value={banner?.link_url} />
            <DetailField label={'Order No'} value={banner?.title} />
            <DetailField label={'Active'} value={banner.is_active ? 'Yes' : 'No'} />
            <Grid item xs={12}>
              <Typography variant='subtitle2' className='mb-2'>
                Banner Image
              </Typography>
              {banner.image ? (
                <img
                  src={banner.image}
                  alt={banner.title}
                  className='w-[220px] h-[120px] object-cover rounded border'
                />
              ) : (
                <Typography variant='body2' color='textSecondary'>
                  No image uploaded
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <DetailActions id={id} href='banners' />
      </Card>
    </div>
  )
}

export default BannerDetailPage
