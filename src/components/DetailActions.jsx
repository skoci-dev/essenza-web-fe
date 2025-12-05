'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import DialogBasic from './DialogBasic'

const DetailActions = ({ id, href, onConfirm }) => {
  const [openDelete, setOpenDelete] = useState(false)
  const router = useRouter()

  return (
    <>
      <Box className='flex justify-between items-center p-4 gap-3'>
        <Button
          variant='outlined'
          color='secondary'
          className='w-1/6'
          startIcon={<i className='ri-arrow-left-line' />}
          onClick={() => router.push(`/esse-panel/${href}`)}
        >
          Back
        </Button>
        <Box className='w-1/2' />
        <Button
          variant='contained'
          color='error'
          className='w-1/6'
          startIcon={<i className='ri-delete-bin-line' />}
          onClick={() => setOpenDelete(true)}
        >
          Delete
        </Button>
        <Button
          variant='contained'
          color='warning'
          className='w-1/6'
          startIcon={<i className='ri-pencil-line' />}
          onClick={() => router.push(`/esse-panel/${href}/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>
      <DialogBasic
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onSubmit={() => {
          onConfirm()
        }}
        title={`Delete ${href}`}
        description={`Are you sure you want to delete this ${href}? This action is permanent and cannot be undone.`}
        colorConfirm='error'
      />
    </>
  )
}

export default DetailActions
