'use client'

import { Box, Button } from '@mui/material'

const FormActions = ({ onCancel, isEdit = false, cancelText = 'Cancel', saveText = 'Save', className = '' }) => {
  return (
    <Box className={`flex justify-between p-4 ${className}`}>
      <Button
        variant='contained'
        className='w-1/6'
        color='warning'
        startIcon={<i className='ri-close-line text-lg' />}
        onClick={onCancel}
      >
        {cancelText}
      </Button>

      <Button
        type='submit'
        variant='contained'
        className='w-1/6'
        color='success'
        startIcon={<i className='ri-save-3-line text-lg' />}
      >
        {isEdit ? 'Update' : saveText}
      </Button>
    </Box>
  )
}

export default FormActions
