'use client'

import { useEffect, useState, useCallback } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import useSnackbar from '@/@core/hooks/useSnackbar'
import { getProjectById, deleteProject } from '@/services/projects'
import DetailField from '@/components/DetailField'
import BackdropLoading from '@/components/BackdropLoading'
import DetailActions from '@/components/DetailActions'
import { formatDateToCustomStringNative } from '@/utils/helpers'

const ProjectDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProjectById(id)

        if (res?.data) {
          setProject(res.data)
        } else {
          setProject(null)
        }
      } catch (err) {
        console.error('Failed to fetch project:', err)
        error('Gagal memuat detail proyek.')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProject()
  }, [id, error])

  const handleDelete = useCallback(async () => {
    setLoading(true)

    try {
      await deleteProject(id)

      success('Berhasil dihapus!')
      router.push('/esse-panel/projects')
    } catch (err) {
      console.error('Delete failed:', err)
      error('Gagal menghapus: ' + (err.message || 'Terjadi kesalahan server.'))
      setLoading(false)
    }
  }, [id, success, error, router])

  if (loading) return <BackdropLoading open={loading} />
  if (!project) return <Typography sx={{ p: 3 }}>Project tidak ditemukan</Typography>

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader title='Project Detail' />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <DetailField label='Title' value={project.title} />
            <DetailField label='Location' value={project.location} />
            <DetailField label='Slug' value={project.slug} />

            <DetailField
              label={'Status'}
              value={
                project.is_active ? (
                  <Chip label='Active' size='small' color='success' variant='tonal' sx={{ borderRadius: 1 }} />
                ) : (
                  <Chip label='Inactive' size='small' color='error' variant='tonal' sx={{ borderRadius: 1 }} />
                )
              }
            />
            <DetailField label='Description' value={project.description} xs={12} />
            <DetailField label='Meta Title' value={project.meta_title} />
            <DetailField label='Meta Description' value={project.meta_description} xs={12} />
            <DetailField label='Meta Keywords' value={project.meta_keywords} xs={12} />
            <DetailField label='Created At' value={formatDateToCustomStringNative(project.created_at)} />
            <DetailField label='Published At' value={formatDateToCustomStringNative(project.published_at)} />

            <Grid item xs={12}>
              <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
                Main Image
              </Typography>
              {project.image ? (
                <Box
                  component='img'
                  src={project.image}
                  alt={project.title}
                  sx={{
                    width: 240,
                    height: 140,
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid #ccc'
                  }}
                />
              ) : (
                <Typography variant='body2' color='textSecondary'>
                  No image uploaded
                </Typography>
              )}
            </Grid>

            {project.gallery?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
                  Gallery
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {project.gallery.map((img, i) => (
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
              </Grid>
            )}
          </Grid>
        </CardContent>
        <Divider />

        <DetailActions
          id={id}
          href='projects'
          onConfirm={() => {
            handleDelete()
          }}
        />
      </Card>
      {SnackbarComponent}
    </Box>
  )
}

export default ProjectDetailPage
