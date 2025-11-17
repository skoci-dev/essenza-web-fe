// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

const DialogBasic = props => {
  const { open, onClose, onSubmit, title, description, children, actions } = props
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      {/* Header */}
      <DialogTitle className='flex justify-between items-center'>
        <span>{title}</span>
        <IconButton onClick={onClose} size='small'>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent className='space-y-3'>
        {description && (
          <Typography variant='body1' color='text.secondary'>
            {description}
          </Typography>
        )}

        {/* Tempat isi custom */}
        {children}
      </DialogContent>

      {/* Action Buttons */}
      {actions ? (
        <DialogActions className='p-4'>{actions}</DialogActions>
      ) : (
        <Box className={`flex justify-between p-4`}>
          <Button
            variant='contained'
            className='w-1/3'
            color='warning'
            startIcon={<i className='ri-close-line text-lg' />}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            variant='contained'
            className='w-1/3'
            color='success'
            startIcon={<i className='ri-save-3-line text-lg' />}
          >
            Confirm
          </Button>
        </Box>
      )}
    </Dialog>
  )
}

export default DialogBasic
