'use client'

import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

import { createSocialMedia, deleteSocialMedia, updateSocialMedia, getSocialMedias } from '@/services/socialMedia'

import BackdropLoading from '@/components/BackdropLoading'
import useSnackbar from '@/@core/hooks/useSnackbar'
import DialogBasic from '@/components/DialogBasic'

const platforms = [
  { name: 'Facebook', icon: 'ri-facebook-fill' },
  { name: 'Instagram', icon: 'ri-instagram-line' },
  { name: 'Twitter', icon: 'ri-twitter-fill' },
  { name: 'LinkedIn', icon: 'ri-linkedin-fill' },
  { name: 'TikTok', icon: 'ri-tiktok-line' },
  { name: 'YouTube', icon: 'ri-youtube-fill' },
  { name: 'Pinterest', icon: 'ri-pinterest-fill' },
  { name: 'WhatsApp', icon: 'ri-whatsapp-fill' },
  { name: 'Telegram', icon: 'ri-telegram-fill' },
  { name: 'Discord', icon: 'ri-discord-fill' }
]

const ItemForm = ({ item, index, onEdit, onCancel, onSave, onDelete, socialMedia, handleChange, editingIndex }) => {
  const isEdit = editingIndex === index
  const usedPlatforms = socialMedia.map(i => i?.platform).filter(Boolean)

  return (
    <Grid container item spacing={3} alignItems='center'>
      <Grid item xs={2}>
        <FormControl fullWidth size='small' disabled={!isEdit}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={item?.platform}
            label='Platform'
            onChange={e => handleChange(index, 'platform', e.target.value)}
          >
            {platforms.map(p => (
              <MenuItem
                key={p.name}
                value={p.name}
                disabled={usedPlatforms.includes(p.name) && p.name !== item?.platform}
              >
                <i className={`${p.icon} text-lg mr-2`} /> {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          size='small'
          disabled={!isEdit}
          label='URL'
          placeholder='https://'
          value={item?.url}
          onChange={e => handleChange(index, 'url', e.target.value)}
        />
      </Grid>

      <Grid item xs={1}>
        <TextField
          fullWidth
          size='small'
          type='number'
          disabled={!isEdit}
          label='Order No'
          placeholder='0'
          value={item?.order_no}
          onChange={e => handleChange(index, 'order_no', e.target.value)}
        />
      </Grid>

      <Grid item xs={3} sx={{ display: 'flex', gap: 1 }}>
        {!isEdit ? (
          <IconButton sx={{ borderRadius: '6px', border: '1px solid blue' }} onClick={() => onEdit(index)}>
            <i className='ri-pencil-line text-blue-500 text-lg' />
          </IconButton>
        ) : (
          <>
            <IconButton sx={{ borderRadius: '6px', border: '1px solid orange' }} onClick={() => onCancel(index)}>
              <i className='ri-close-line text-orange-500 text-lg' />
            </IconButton>
            <IconButton
              sx={{ borderRadius: '6px', border: '1px solid green' }}
              onClick={() => onSave(index)}
              disabled={!item?.platform || !item?.url}
            >
              <i className='ri-check-line text-green-500 text-lg' />
            </IconButton>
          </>
        )}

        <IconButton sx={{ borderRadius: '6px', border: '1px solid red' }} color='error' onClick={() => onDelete(index)}>
          <i className='ri-delete-bin-line text-red-500 text-lg' />
        </IconButton>
      </Grid>
    </Grid>
  )
}

const SocialMediaForm = () => {
  const [socialMedia, setSocialMedia] = useState([])
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [backupItem, setBackupItem] = useState(null)
  const [loading, setLoading] = useState(false)

  const { success, error, SnackbarComponent } = useSnackbar()

  const fetchSocialMedia = async () => {
    try {
      const res = await getSocialMedias()

      setSocialMedia(res.data)
    } catch {
      error('Failed to load social media')
    }
  }

  useEffect(() => {
    fetchSocialMedia()
  }, [])

  const handleAdd = () => {
    const newItem = { id: null, platform: '', url: '', order_no: '' }
    const updated = [...socialMedia]

    updated[editingIndex] = backupItem

    setSocialMedia([...updated, newItem])

    const newIndex = socialMedia.length

    setEditingIndex(newIndex)
    setBackupItem(newItem)
  }

  const handleChange = (index, field, value) => {
    const updated = [...socialMedia]

    updated[index][field] = value
    setSocialMedia(updated)
  }

  const onEdit = index => {
    if (editingIndex !== null && editingIndex !== index) {
      onCancel(editingIndex)
    }

    setEditingIndex(index)
    setBackupItem({ ...socialMedia[index] })
  }

  const onCancel = index => {
    const item = socialMedia[index]

    if (!item.id) {
      setSocialMedia(prev => prev.filter((_, i) => i !== index))
    } else {
      const updated = [...socialMedia]

      updated[index] = backupItem
      setSocialMedia(updated)
    }

    setEditingIndex(null)
    setBackupItem(null)
  }

  const onDelete = index => {
    const item = socialMedia[index]

    if (!item.id) {
      setSocialMedia(prev => prev.filter((_, i) => i !== index))
    } else {
      setDeleteIndex(index)
    }

    setBackupItem(null)
    setEditingIndex(null)
  }

  const onSave = async index => {
    const item = {
      ...socialMedia[index],
      id: socialMedia[index]?.id || 0,
      order_no: socialMedia[index]?.order_no || 0,
      icon: socialMedia[index]?.platform.toLowerCase()
    }

    setLoading(true)

    try {
      if (item.id) {
        await updateSocialMedia(item.id, item)
      } else {
        await createSocialMedia(item)
      }

      success('Saved successfully!')
      setEditingIndex(null)
      setBackupItem(null)
      fetchSocialMedia()
    } catch {
      error('Save failed!')
    }

    setLoading(false)
  }

  const confirmDelete = async () => {
    const item = socialMedia[deleteIndex]

    setLoading(true)

    try {
      if (item?.id) await deleteSocialMedia(item.id)

      setSocialMedia(prev => prev.filter((_, i) => i !== deleteIndex))
      success('Deleted successfully!')
    } catch {
      error('Delete failed!')
    }

    setDeleteIndex(null)
    setLoading(false)
  }

  return (
    <>
      <Card>
        <CardHeader title='Social Media Settings' />
        <Divider />
        <CardContent>
          <Grid container spacing={5}>
            {socialMedia.map((item, index) => (
              <ItemForm
                key={index}
                index={index}
                item={item}
                socialMedia={socialMedia}
                handleChange={handleChange}
                onEdit={onEdit}
                onCancel={onCancel}
                onSave={onSave}
                onDelete={onDelete}
                editingIndex={editingIndex}
              />
            ))}
          </Grid>
        </CardContent>
        <Divider />
        <Box className='p-4'>
          <Button
            startIcon={<i className='ri-add-line' />}
            variant='contained'
            color='success'
            size='small'
            onClick={handleAdd}
          >
            Add Social Media
          </Button>
        </Box>
      </Card>
      <DialogBasic
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onSubmit={confirmDelete}
        title='Delete Social Media'
        description='Are you sure to delete this social media?'
      />
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default SocialMediaForm
