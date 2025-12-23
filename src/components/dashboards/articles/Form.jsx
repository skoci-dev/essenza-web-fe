'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

import { getArticleById, createArticle, updateArticle } from '@/services/article'
import CustomTextField from '@/@core/components/custom-inputs/TextField'

import useSnackbar from '@/@core/hooks/useSnackbar'
import EditorToolbar from '@/@core/components/editor/EditorToolbar'

import '@/libs/styles/tiptapEditor.css'
import FormActions from '@/components/FormActions'
import BackdropLoading from '@/components/BackdropLoading'
import { handleApiResponse } from '@/utils/handleApiResponse'
import { slugify } from '@/utils/helpers'

const defaultData = {
  title: '',
  slug: '',
  tags: '',
  thumbnail: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  published_at: '',
  is_active: true,
  content: ''
}

const ImageUploader = ({ preview, onFileChange, onRemove }) => (
  <Grid item sm={6}>
    <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
      Thumbnail Article
    </Typography>

    {preview ? (
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Box
          component='img'
          src={preview}
          alt='Preview'
          sx={{ width: 220, height: 120, objectFit: 'cover', borderRadius: 1, border: '1px solid #ccc' }}
        />
        <IconButton
          color='error'
          size='small'
          onClick={onRemove}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: 'white',
            boxShadow: 1,
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          <i className='ri-delete-bin-line' style={{ color: '#f44336', fontSize: '18px' }} />
        </IconButton>
      </Box>
    ) : (
      <Button
        variant='outlined'
        component='label'
        sx={{ width: { xs: '100%', sm: 'auto' } }}
        size='small'
        startIcon={<i className='ri-upload-2-line' style={{ fontSize: '18px' }} />}
        color='primary'
      >
        Upload Image
        <input type='file' hidden accept='image/*' onChange={onFileChange} />
      </Button>
    )}
  </Grid>
)

const ArticleForm = ({ id }) => {
  const router = useRouter()
  const isEdit = !!id

  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const [galleryPreview, setGalleryPreview] = useState([])

  const { success, error, SnackbarComponent } = useSnackbar()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Write article content...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content: data.content,
    onUpdate({ editor }) {
      setData(prev => ({ ...prev, content: editor.getHTML() }))
    }
  })

  const fields = useMemo(
    () => [
      { name: 'title', label: 'Title', size: 6, required: true },
      { name: 'slug', label: 'Slug', size: 6, required: true },
      { name: 'tags', label: 'Tags', placeholder: 'tag1, tag2, tag3', size: 6 },
      { name: 'meta_title', label: 'Meta Title', size: 6 },
      {
        name: 'meta_description',
        label: 'Meta Description',
        size: 12,
        multiline: true,
        rows: 3
      },
      {
        name: 'meta_keywords',
        label: 'Meta Keywords',
        size: 12,
        multiline: true,
        rows: 2
      }
    ],
    []
  )

  const handleChange = useCallback(e => {
    const { name, value } = e.target

    setData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSwitchChange = useCallback(e => {
    setData(prev => ({ ...prev, is_active: e.target.checked }))
  }, [])

  const handleImageChange = useCallback(e => {
    const file = e.target.files[0]

    if (file) {
      const imageUrl = URL.createObjectURL(file)

      setPreview(imageUrl)

      setData(prev => ({ ...prev, thumbnail: file }))
    }
  }, [])

  const handleRemoveImage = useCallback(() => {
    setPreview('')

    setData(prev => ({ ...prev, thumbnail: '' }))
  }, [])

  const handleGalleryChange = useCallback(
    e => {
      const files = Array.from(e.target.files || [])

      if (files.length) {
        const urls = files.map(URL.createObjectURL)

        setGalleryPreview(prev => [...prev, ...urls])
        setData(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...files] }))
      }
    },
    [setGalleryPreview, setData]
  )

  const handleRemoveGalleryImage = useCallback(
    index => {
      setGalleryPreview(prev => prev.filter((_, i) => i !== index))
      setData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }))
    },
    [setGalleryPreview, setData]
  )

  const fetchArticle = useCallback(
    async id => {
      setLoading(true)

      try {
        const res = await getArticleById(id)

        setData(res.data)
        setGalleryPreview(res.data.gallery || [])

        if (res.data?.thumbnail) {
          setPreview(res.data.thumbnail)
        }
      } catch {
        error('Failed to load project details.')
      } finally {
        setLoading(false)
      }
    },
    [error]
  )

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    const dataToSubmit = { ...data }

    delete dataToSubmit.thumbnail
    delete dataToSubmit.gallery

    Object.keys(dataToSubmit).forEach(key => {
      formData.append(key, dataToSubmit[key] || '')
    })

    if (data.thumbnail instanceof File) {
      formData.append('thumbnail', data.thumbnail)
    }

    if (id && data.thumbnail === '' && preview.startsWith('http')) {
    }

    if (data.gallery && Array.isArray(data.gallery)) {
      data.gallery.forEach((item, index) => {
        if (item instanceof File || typeof item === 'string') {
          formData.append(`gallery`, item)
        }
      })
    }

    await handleApiResponse(() => (id ? updateArticle(id, formData) : createArticle(formData)), {
      success: msg => success(msg),
      error: msg => error(msg),
      onSuccess: () =>
        setTimeout(() => {
          router.push('/esse-panel/articles')
        }, 1000),
      onError: () => {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (isEdit && editor && data?.content) {
      const currentEditorContent = editor.getHTML()

      if (data.content !== currentEditorContent && data.content !== defaultData.content) {
        editor.commands.setContent(data.content, false)
      }
    }
  }, [editor, data.content, isEdit])

  useEffect(() => {
    setPreview('')
    if (id) fetchArticle(id)
  }, [id, fetchArticle])

  useEffect(() => {
    if (data?.title) {
      const newSlug = slugify(data?.title)

      setData(prevData => ({
        ...prevData,
        slug: newSlug
      }))
    } else {
      setData(prevData => ({
        ...prevData,
        slug: ''
      }))
    }
  }, [data?.title, setData])

  return (
    <>
      <Card className='shadow'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <CardHeader title={isEdit ? 'Edit Article' : 'Add Article'} />
          <Divider />
          <CardContent>
            <Grid container spacing={5}>
              {fields.map(field => (
                <CustomTextField
                  key={field.name}
                  {...field}
                  type={field.type || 'text'}
                  value={data[field.name] ?? ''}
                  onChange={handleChange}
                  select={field.type === 'select'}
                  options={field.options}
                />
              ))}
              <ImageUploader preview={preview} onFileChange={handleImageChange} onRemove={handleRemoveImage} />
              <Grid item sm={6}>
                <Typography variant='subtitle2' sx={{ mb: 1.5 }}>
                  Status
                </Typography>
                <FormControlLabel
                  control={<Switch checked={data.is_active} onChange={handleSwitchChange} />}
                  label={data?.is_active ? 'Active' : 'Inactive'}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle2' className='mb-2'>
                  Gallery Images
                </Typography>
                <Box className='flex flex-wrap gap-3'>
                  {galleryPreview.map((src, index) => (
                    <Box key={index} className='relative inline-block'>
                      <img
                        src={src}
                        alt={`Gallery ${index}`}
                        className='w-[120px] h-[80px] object-cover rounded border'
                      />
                      <IconButton
                        color='error'
                        size='small'
                        className='absolute top-1 right-1 bg-white shadow'
                        onClick={() => handleRemoveGalleryImage(index)}
                      >
                        <i className='ri-delete-bin-line text-red-500 text-lg' />
                      </IconButton>
                    </Box>
                  ))}
                  <Button variant='outlined' component='label' startIcon={<i className='ri-upload-2-line text-lg' />}>
                    Add Images
                    <input type='file' hidden accept='image/*' multiple onChange={handleGalleryChange} />
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Typography className='mt-6 mb-2'>Content</Typography>
            <Card className='p-0 border shadow-none'>
              <CardContent className='p-0'>
                <EditorToolbar editor={editor} />
                <Divider className='my-2' />
                <EditorContent editor={editor} className='min-h-[50vh]' />
              </CardContent>
            </Card>
          </CardContent>
          <Divider />
          <FormActions onCancel={() => router.push('/esse-panel/articles')} isEdit={isEdit} />
        </form>
      </Card>
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default ArticleForm
