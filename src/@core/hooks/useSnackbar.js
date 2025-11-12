import React, { useCallback, useState } from 'react'

import MuiAlert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' // 'error', 'warning', 'info', 'success'
  })

  const showSnackbar = useCallback((severity = 'info', message) => {
    setSnackbar({ open: true, message, severity })
  }, [])

  const handleClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }, [])

  const SnackbarComponent = (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ zIndex: 100000 }}
    >
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert variant='filled' onClose={handleClose} severity={snackbar.severity} className='items-center'>
          <Box dangerouslySetInnerHTML={{ __html: snackbar.message }} />
        </Alert>
      </Stack>
    </Snackbar>
  )

  return { showSnackbar, SnackbarComponent }
}

export default useSnackbar
