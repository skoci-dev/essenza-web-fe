'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import CustomTextField from '@/@core/components/custom-inputs/TextField'

import { getArticleById, createArticle, updateArticle } from '@/services/article'

// TIPTAP
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

import EditorToolbar from '@/@core/components/editor/EditorToolbar'

import '@/libs/styles/tiptapEditor.css'
import FormActions from '@/components/FormActions'

const defaultData = {
  title: '',
  slug: '',
  tags: '',
  thumbnail: '',
  author: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  published_at: '',
  is_active: true,
  content: ''
}

const ArticleForm = ({ id }) => {
  const router = useRouter()
  const isEdit = !!id
  const [data, setData] = useState(defaultData)

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
      { name: 'author', label: 'Author', size: 6 },

      { name: 'thumbnail', label: 'Thumbnail URL', size: 12 },

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
      },
      {
        name: 'published_at',
        label: 'Publish Date',
        type: 'datetime-local',
        size: 6
      },
      {
        name: 'is_active',
        label: 'Status',
        type: 'select',
        size: 6,
        options: [
          { label: 'Active', value: true },
          { label: 'Inactive', value: false }
        ]
      }
    ],
    []
  )

  useEffect(() => {
    if (isEdit) {
      getArticleById(id).then(article => {
        setData(article)
        editor?.commands.setContent(article.content || '')
      })
    }
  }, [id, editor])

  const handleChange = e => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (isEdit) {
        await updateArticle(id, data)
        alert('Article updated!')
      } else {
        await createArticle(data)
        alert('Article added!')
      }
      router.push('/esse-panel/articles')
    } catch (err) {
      console.error('❌ Error:', err)
    }
  }

  return (
    <Card className='shadow'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <CardHeader title={isEdit ? 'Edit Article' : 'Add Article'} />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
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
          </Grid>
          <Typography className='mt-6 mb-2'>Content</Typography>
          <Card className='p-0 border shadow-none'>
            <CardContent className='p-0'>
              <EditorToolbar editor={editor} />
              <Divider className='my-2' />
              <EditorContent editor={editor} className='min-h-[250px] p-3 border rounded' />
            </CardContent>
          </Card>
        </CardContent>
        <Divider />
        <FormActions onCancel={() => router.push('/esse-panel/articles')} isEdit={isEdit} />
      </form>
    </Card>
  )
}

export default ArticleForm
