'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import {
  TextField,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

import { getPageById, updatePage, createPage } from '@/services/pages'

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
  content: '',
  is_active: true,
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  template: ''
}

const PageForm = ({ id }) => {
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(defaultData)
  const [editorView, setEditorView] = useState('visual') // 'visual' | 'html'
  const [previewOpen, setPreviewOpen] = useState(false)

  // -- Editor Setup --
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Write page content...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: data?.content,
    onUpdate({ editor }) {
      const html = editor.getHTML()

      setData(prev => ({ ...prev, content: html }))
    }
  })

  // -- Fetch Data --
  const fetchPage = useCallback(
    async id => {
      setLoading(true)

      try {
        const res = await getPageById(id)

        setData(res.data)

        if (editor && res.data?.content) {
          editor.commands.setContent(res.data.content)
        }
      } catch {
        error('Failed to load page details.')
      } finally {
        setLoading(false)
      }
    },
    [error, editor]
  )

  useEffect(() => {
    if (id) fetchPage(id)
  }, [id, fetchPage])

  // -- Slug Auto-generate --
  useEffect(() => {
    if (!id && data?.title) {
      setData(prev => ({ ...prev, slug: slugify(data.title) }))
    }
  }, [data?.title, id])

  // -- Handlers --
  const handleChange = e => {
    const { name, value } = e.target

    setData(prev => ({ ...prev, [name]: value }))

    // Sinkronisasi jika edit manual di mode HTML
    if (name === 'content' && editorView === 'html') {
      editor?.commands.setContent(value, false)
    }
  }

  const handleToggleActive = e => {
    setData(prev => ({ ...prev, is_active: e.target.checked }))
  }

  const handleEditorViewChange = (event, nextView) => {
    if (nextView !== null) setEditorView(nextView)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    await handleApiResponse(() => (id ? updatePage(id, data) : createPage(data)), {
      success: msg => success(msg),
      error: msg => error(msg),
      onSuccess: () => setTimeout(() => router.push('/esse-panel/pages'), 1000),
      onError: () => setLoading(false)
    })
  }

  return (
    <>
      <Card className='shadow'>
        <form onSubmit={handleSubmit}>
          <CardHeader
            title={id ? 'Edit Page' : 'Add Page'}
            action={
              <Button variant='outlined' startIcon={<i className='ri-eye-line' />} onClick={() => setPreviewOpen(true)}>
                Preview
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size='small'
                  label='Title'
                  name='title'
                  value={data?.title}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size='small'
                  label='Slug'
                  name='slug'
                  value={data?.slug}
                  onChange={handleChange}
                  helperText='Example: about-us'
                  fullWidth
                />
              </Grid>

              {/* EDITOR SECTION */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                    Page Content
                  </Typography>
                  <ToggleButtonGroup
                    value={editorView}
                    exclusive
                    onChange={handleEditorViewChange}
                    size='small'
                    color='primary'
                  >
                    <ToggleButton value='visual'>Visual</ToggleButton>
                    <ToggleButton value='html'>HTML Text</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Card className='p-0 border shadow-none'>
                  {editorView === 'visual' ? (
                    <CardContent className='p-0'>
                      <EditorToolbar editor={editor} />
                      <Divider />
                      <EditorContent editor={editor} className='min-h-[400px] p-4' />
                    </CardContent>
                  ) : (
                    <CardContent className='p-0'>
                      <Box sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                        <Typography variant='caption'>Raw HTML Editor</Typography>
                      </Box>
                      <Divider />
                      <TextField
                        multiline
                        rows={16}
                        fullWidth
                        name='content'
                        value={data?.content}
                        onChange={handleChange}
                        sx={{
                          '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '14px', borderRadius: 0 },
                          '& fieldset': { border: 'none' }
                        }}
                      />
                    </CardContent>
                  )}
                </Card>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch checked={data?.is_active} onChange={handleToggleActive} />}
                  label={data?.is_active ? 'Active' : 'Inactive'}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider textAlign='left'>
                  <Typography variant='caption' sx={{ fontWeight: 700 }}>
                    SEO META
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  size='small'
                  label='Meta Title'
                  name='meta_title'
                  value={data?.meta_title}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size='small'
                  label='Meta Keywords'
                  name='meta_keywords'
                  value={data?.meta_keywords}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size='small'
                  label='Meta Description'
                  name='meta_description'
                  value={data?.meta_description}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <FormActions onCancel={() => router.push('/esse-panel/pages')} isEdit={id} />
        </form>
      </Card>

      {/* MODAL PREVIEW */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth='lg' scroll='paper'>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Page Preview
          <IconButton onClick={() => setPreviewOpen(false)}>
            <i className='ri-close-line' />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ minHeight: '500px' }}>
          <Typography variant='h3' gutterBottom>
            {data?.title || 'Untitled Page'}
          </Typography>
          <Box
            className='preview-content-area'
            dangerouslySetInnerHTML={{ __html: data?.content || '<p>No content to preview.</p>' }}
            sx={{
              '& img': { maxWidth: '100%', height: 'auto' },
              '& ul, & ol': { pl: 4 }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <Button variant='contained' onClick={() => setPreviewOpen(false)}>
            Close Preview
          </Button>
        </DialogActions>
      </Dialog>

      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default PageForm
