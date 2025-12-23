'use client'

import { useEffect, useState, useCallback } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import useSnackbar from '@/@core/hooks/useSnackbar'

import { getArticleById, deleteArticle } from '@/services/article'

import { convertStringtoArray, formatDateToCustomStringNative } from '@/utils/helpers'

import DetailField from '@/components/DetailField'
import DetailActions from '@/components/DetailActions'
import BackdropLoading from '@/components/BackdropLoading'
import { ShowElse, ShowIf } from '@/components/ShowIf'

const ArticleDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await getArticleById(id)

        if (res?.data) {
          setArticle(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch article:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchArticle()
  }, [id])

  const handleDelete = useCallback(async () => {
    setLoading(true)

    try {
      await deleteArticle(id)

      success('Berhasil dihapus!')
      setTimeout(() => {
        router.push('/esse-panel/articles')
      }, 1000)
      router.push('/esse-panel/articles')
    } catch (err) {
      console.error('Delete failed:', err)
      error('Gagal menghapus: ' + (err.message || 'Terjadi kesalahan server.'))
      setLoading(false)
    }
  }, [id, success, error, router])

  if (!article) return <p className='p-6'>Article not found</p>

  return (
    <div className='p-6'>
      <Card className='shadow'>
        <CardHeader title='Article Detail' />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <DetailField label='Title' value={article.title} />
            <DetailField label='Slug' value={article.slug} />
            <DetailField label='Author' value={article.author} />
            <DetailField
              label='Status'
              value={
                article.is_active ? (
                  <Chip label='Active' size='small' color='success' variant='tonal' className='self-start rounded' />
                ) : (
                  <Chip label='Inactive' size='small' color='error' variant='tonal' className='self-start rounded' />
                )
              }
            />
            <DetailField label='Published At' value={formatDateToCustomStringNative(article.published_at)} />
            <DetailField label='Created At' value={formatDateToCustomStringNative(article.created_at)} />
            <DetailField label='Updated At' value={formatDateToCustomStringNative(article.updated_at)} />
            <DetailField label='Meta Title' value={article.meta_title} />
            <DetailField label='Meta Description' value={article.meta_description} xs={12} />
            <DetailField label='Meta Keywords' value={article.meta_keywords} xs={12} />
            <Grid item xs={12}>
              <Typography variant='subtitle2' className='mb-2'>
                Tags
              </Typography>
              {convertStringtoArray(article.tags)?.length ? (
                <Box className='flex gap-2 flex-wrap'>
                  {convertStringtoArray(article.tags).map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size='small'
                      color='info'
                      variant='tonal'
                      className='self-start rounded'
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant='body2' color='textSecondary'>
                  No tags
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle2' className='mb-2'>
                Thumbnail
              </Typography>
              {article.thumbnail ? (
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className='w-[240px] h-[140px] object-cover rounded border'
                />
              ) : (
                <Typography variant='body2' color='textSecondary'>
                  No thumbnail uploaded
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
                Gallery
              </Typography>
              <ShowIf when={article.gallery?.length > 0}>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {article.gallery?.map((img, i) => (
                    <Box
                      key={i}
                      component='img'
                      src={img}
                      alt={`Gallery ${i}`}
                      sx={{
                        width: 120,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid #ccc'
                      }}
                    />
                  ))}
                </Box>

                <ShowElse>-</ShowElse>
              </ShowIf>
            </Grid>

            {/* Content */}
            <Grid item xs={12}>
              <Typography variant='subtitle2' className='mb-2'>
                Content
              </Typography>
              {article.content ? (
                <Box
                  className='prose max-w-none border p-4 rounded'
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <Typography variant='body2' color='textSecondary'>
                  No content available
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <DetailActions id={id} href='articles' onConfirm={handleDelete} />
      </Card>
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </div>
  )
}

export default ArticleDetailPage
