'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

import { Box, Chip } from '@mui/material'

import { formatDateToCustomStringNative } from '@/utils/helpers'
import { changeAuthPassword } from '@/services/auth'
import useSnackbar from '@/@core/hooks/useSnackbar'

const DataBox = ({ children, title }) => (
  <Grid item xs={12}>
    <Typography variant='subtitle2' sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 600 }}>
      {title}
    </Typography>
    <Box
      sx={{
        p: 3,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        backgroundColor: '#fafafa'
      }}
    >
      <Grid container spacing={3}>
        {children}
      </Grid>
    </Box>
  </Grid>
)

const DetailItem = ({ label, value, render }) => (
  <Grid item xs={12} md={6}>
    <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
      {label}
    </Typography>
    {render ? (
      render()
    ) : (
      <Typography variant='body2' sx={{ color: '#757575' }}>
        {value || '-'}
      </Typography>
    )}
  </Grid>
)

const ChangePasswordForm = ({ open, handleClose, successSnackbar, errorSnackbar }) => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleClickShowPassword = setter => setter(show => !show)

  const resetForm = () => {
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setValidationError('')
    setLoading(false)
    setShowOldPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  const handleDialogClose = () => {
    resetForm()
    handleClose()
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setValidationError('')

    if (newPassword !== confirmPassword) {
      setValidationError('New password and confirmation do not match.')
      errorSnackbar('New password and confirmation do not match.')

      return
    }

    if (newPassword.length < 8) {
      setValidationError('New password must be at least 8 characters long.')
      errorSnackbar('New password must be at least 8 characters long.')

      return
    }

    setLoading(true)

    const payload = {
      current_password: oldPassword,
      new_password: newPassword
    }

    try {
      const res = await changeAuthPassword(payload)

      if (res?.success) {
        successSnackbar('Password change success!')
        handleDialogClose()
      } else {
        const errorMessage = res?.message || 'Failed to change password. Please check your current password.'

        errorSnackbar(errorMessage)
        setValidationError(errorMessage)
      }
    } catch (apiError) {
      console.error('API Error:', apiError)
      errorSnackbar('Failed to connect to the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth='xs' fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <Box component='form' onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                size='small'
                label='Old Password'
                type={showOldPassword ? 'text' : 'password'}
                fullWidth
                required
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => handleClickShowPassword(setShowOldPassword)}
                        onMouseDown={e => e.preventDefault()}
                        edge='end'
                      >
                        <i className={showOldPassword ? 'ri-eye-line' : 'ri-eye-off-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size='small'
                label='New Password'
                type={showNewPassword ? 'text' : 'password'}
                fullWidth
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                error={!!validationError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => handleClickShowPassword(setShowNewPassword)}
                        onMouseDown={e => e.preventDefault()}
                        edge='end'
                      >
                        <i className={showNewPassword ? 'ri-eye-line' : 'ri-eye-off-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size='small'
                label='Confirm New Password'
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                error={!!validationError}
                helperText={validationError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => handleClickShowPassword(setShowConfirmPassword)}
                        onMouseDown={e => e.preventDefault()}
                        edge='end'
                      >
                        <i className={showConfirmPassword ? 'ri-eye-line' : 'ri-eye-off-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3, pt: 1.5, mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant='contained'
            size='small'
            onClick={handleDialogClose}
            color='error'
            disabled={loading}
            sx={{ width: '30%' }}
          >
            Cancel
          </Button>
          <Button
            size='small'
            type='submit'
            variant='contained'
            color='success'
            disabled={loading}
            sx={{ width: '30%' }}
          >
            {loading ? <CircularProgress size={24} color='inherit' /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

const ProfilePage = () => {
  const { success: successSnackbar, error: errorSnackbar, SnackbarComponent } = useSnackbar()
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)

  let user = ''

  if (typeof window !== 'undefined') {
    const userDataJSON = localStorage.getItem('dataUser')

    if (userDataJSON) {
      user = JSON.parse(userDataJSON)
    }
  }

  const handleOpenPasswordDialog = () => setOpenPasswordDialog(true)
  const handleClosePasswordDialog = () => setOpenPasswordDialog(false)

  return (
    <>
      <div className='p-6'>
        <Card className='w-full mx-auto shadow'>
          <CardHeader title='My Profile' />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
              <DataBox title='User Profile Data'>
                <DetailItem label='ID' value={user?.id} />
                <DetailItem label='Full Name' value={user?.name} />
                <DetailItem label='Username' value={user?.username} />
                <DetailItem label='Email' value={user?.email} />
              </DataBox>
              <DataBox title='Security & Status'>
                <DetailItem label='Role Label' value={user?.role?.label} />
                <DetailItem
                  label='Last Login'
                  value={user?.last_login ? formatDateToCustomStringNative(user.last_login) : '-'}
                />
                <Grid item xs={12} md={6}>
                  <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                    Account Status
                  </Typography>
                  {user?.is_active ? (
                    <Chip label='Active' size='small' color='success' variant='tonal' sx={{ borderRadius: 1 }} />
                  ) : (
                    <Chip label='Inactive' size='small' color='error' variant='tonal' sx={{ borderRadius: 1 }} />
                  )}
                </Grid>
              </DataBox>
              <DataBox title='Timestamps & Audit'>
                <DetailItem
                  label='Created At'
                  value={user?.created_at ? formatDateToCustomStringNative(user.created_at) : '-'}
                />
                <DetailItem
                  label='Updated At'
                  value={user?.updated_at ? formatDateToCustomStringNative(user.updated_at) : '-'}
                />
              </DataBox>
            </Grid>
          </CardContent>
          <Divider />
          <Box className='flex justify-end gap-3 p-4'>
            <Button
              size='small'
              variant='contained'
              className='w-1/4'
              color='warning'
              startIcon={<i className='ri-lock-2-line text-lg' />}
              onClick={handleOpenPasswordDialog}
            >
              Change Password
            </Button>
          </Box>
        </Card>
      </div>
      <ChangePasswordForm open={openPasswordDialog} handleClose={handleClosePasswordDialog} />
      {SnackbarComponent}
      <ChangePasswordForm
        open={openPasswordDialog}
        handleClose={handleClosePasswordDialog}
        successSnackbar={successSnackbar}
        errorSnackbar={errorSnackbar}
      />
    </>
  )
}

export default ProfilePage
