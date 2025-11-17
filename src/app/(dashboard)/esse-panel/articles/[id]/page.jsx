'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { getArticleById, deleteArticle } from '@/services/article'

import DetailField from '@/components/DetailField'

export const article = {
  id: 1,
  title: 'Meningkatkan Penjualan Online dengan Strategi Konten',
  slug: 'meningkatkan-penjualan-online-dengan-strategi-konten',
  tags: ['marketing', 'business', 'growth'], // maks 3
  excerpt: 'Pelajari bagaimana strategi konten yang tepat mampu meningkatkan penjualan online Anda secara signifikan.',
  author: 'Admin',
  created_at: '2025-01-14',
  published_at: '2025-01-14',
  banner: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200',
  readingTime: '6 min read',
  content: `
    <h2>Kenapa Strategi Konten Penting?</h2>
    <p>
      Dalam dunia digital, konten adalah jembatan antara bisnis dan pelanggan.
      Konten yang tepat dapat meningkatkan awareness, engagement, hingga konversi.
    </p>

    <h3>1. Riset Audiens</h3>
    <p>
      Langkah pertama adalah memahami siapa target audiens Anda. Pahami kebutuhan,
      masalah, dan perilaku mereka.
    </p>

    <h3>2. Gunakan Konten dengan Nilai Tinggi</h3>
    <p>
      Konten yang memberikan solusi nyata memiliki peluang lebih besar untuk disimpan,
      dibagikan, dan dikonsumsi kembali.
    </p>

    <blockquote>
      "Konten yang baik adalah konten yang membuat orang merasa lebih pintar setelah membacanya."
    </blockquote>

    <h3>3. Konsistensi adalah Kunci</h3>
    <p>
      Tidak peduli seberapa bagus konten Anda, jika tidak konsisten, audiens akan mudah melupakan brand Anda.
    </p>

    <h3>Kesimpulan</h3>
    <p>
      Dengan strategi konten yang tepat, bisnis online dapat berkembang lebih cepat dan stabil.
      Mulailah dari memahami audiens, membuat konten bernilai, dan jaga konsistensi.
    </p>
  `
}

const ArticleDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getArticleById(id)
        .then(data => setStore(data))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleDelete = async () => {
    if (confirm('Delete this Store?')) {
      await deleteArticle(id)
      alert('Deleted successfully!')
      router.push('/esse-panel/stores')
    }
  }

  if (loading) return <p className='p-6'>Loading...</p>
  if (!store) return <p className='p-6'>Store not found</p>

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
            <DetailField label='Status' value={article.is_active ? 'Active' : 'Inactive'} />
            <DetailField label='Published At' value={article.published_at} />
            <DetailField label='Created At' value={article.created_at} />
            <DetailField label='Updated At' value={article.updated_at} />
            <DetailField label='Meta Title' value={article.meta_title} />
            <DetailField label='Meta Description' value={article.meta_description} xs={12} />
            <DetailField label='Meta Keywords' value={article.meta_keywords} xs={12} />

            {/* Tags */}
            <Grid item xs={12}>
              <Typography variant='subtitle2' className='mb-2'>
                Tags
              </Typography>
              {article.tags?.length ? (
                <Box className='flex gap-2 flex-wrap'>
                  {article.tags.map((tag, index) => (
                    <span key={index} className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs border'>
                      {tag}
                    </span>
                  ))}
                </Box>
              ) : (
                <Typography variant='body2' color='textSecondary'>
                  No tags
                </Typography>
              )}
            </Grid>

            {/* Thumbnail */}
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
        <Box className='flex justify-between items-center p-4 gap-3'>
          <Button
            variant='outlined'
            color='secondary'
            className='w-1/6'
            startIcon={<i className='ri-arrow-left-line' />}
            onClick={() => router.push('/esse-panel/articles')}
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
            onClick={() => router.push(`/esse-panel/articles/${id}/edit`)}
          >
            Edit
          </Button>
        </Box>
      </Card>
    </div>
  )
}

export default ArticleDetailPage
