'use client'

import { useEffect, useState, useCallback } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import { getPageById, deletePage } from '@/services/pages'
import DetailField from '@/components/DetailField'
import DetailActions from '@/components/DetailActions'
import { formatDateToCustomStringNative } from '@/utils/helpers'
import BackdropLoading from '@/components/BackdropLoading'

import useSnackbar from '@/@core/hooks/useSnackbar'

const PageDetail = () => {
  const { id } = useParams()
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleDelete = useCallback(async () => {
    setLoading(true)

    try {
      await deletePage(id)

      success('Deleted Success!')
      setTimeout(() => {
        router.push('/esse-panel/pages')
      }, 1000)
      router.push('/esse-panel/pages')
    } catch (err) {
      console.error('Delete failed:', err)
      error('Gagal menghapus: ' + (err.message || 'Terjadi kesalahan server.'))
      setLoading(false)
    }
  }, [id, success, error, router])

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await getPageById(id)

        if (res?.data) {
          setPage(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch Page:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchPage()
  }, [id])

  if (!page) return <p className='p-6'>Page not found</p>

  return (
    <>
      <div className='p-6'>
        <Card className='shadow'>
          <CardHeader title='Page Detail'></CardHeader>
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
              <DetailField label='Title' value={page?.title} />
              <DetailField label='Slug' value={page?.slug} />
              <DetailField label='Template' value={page?.template} />
              <DetailField label='Status' value={page?.is_active ? 'Active' : 'Inactive'} />
              <DetailField label='Meta Title' value={page?.meta_title} xs={12} />
              <DetailField label='Meta Description' value={page?.meta_description} xs={12} />
              <DetailField label='Meta Keywords' value={page?.meta_keywords} xs={12} />
              <DetailField label='Created At' value={formatDateToCustomStringNative(page?.created_at)} />
              <DetailField label='Updated At' value={formatDateToCustomStringNative(page?.updated_at)} />
            </Grid>
            <Divider sx={{ mt: 10 }} />
            <Grid container spacing={5}>
              <Grid item sm={12}>
                <Box
                  className='prose max-w-none border p-4 rounded'
                  dangerouslySetInnerHTML={{ __html: page.content }}
                  sx={{
                    p: 3,
                    mt: 5,
                    '& img': { width: '100%', height: 'auto' },
                    '& ul, & ol': { paddingLeft: 3 }
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <DetailActions id={id} href='pages' onConfirm={handleDelete} />
        </Card>
      </div>
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default PageDetail
