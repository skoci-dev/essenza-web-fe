'use client'

import CustomIconButton from '@core/components/mui/IconButton'

import '@/libs/styles/tiptapEditor.css'

const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className='ri-bold text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className='ri-underline text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className='ri-italic text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className='ri-strikethrough text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i className='ri-align-left text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i className='ri-align-center text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i className='ri-align-right text-textSecondary' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i className='ri-align-justify text-textSecondary' />
      </CustomIconButton>
    </div>
  )
}

export default EditorToolbar
