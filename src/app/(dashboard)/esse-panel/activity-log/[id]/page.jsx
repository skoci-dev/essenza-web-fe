'use client'

import { useState, useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import useSnackbar from '@/@core/hooks/useSnackbar'
import { ShowIf, ShowElse } from '@/components/ShowIf'
import BackdropLoading from '@/components/BackdropLoading'
import { getDetailActivityLog } from '@/services/system'
import { handleApiResponse } from '@/utils/handleApiResponse'
import { formatDateToCustomStringNative } from '@/utils/helpers'
import { getActivityColor } from '@/utils/colors'

const ActivityLogDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [activityLog, setActivityLog] = useState(null)

  const { error, SnackbarComponent } = useSnackbar()

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        await handleApiResponse(() => getDetailActivityLog(id), {
          error,
          onSuccess: ({ data }) => {
            setActivityLog(data)
          }
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchDetail()
  }, [id])

  if (loading) {
    return <BackdropLoading open={loading} />
  }

  if (!activityLog) {
    return (
      <div className='p-6'>
        <Card>
          <CardContent>
            <Typography variant='h6' className='text-center'>
              Activity log not found
            </Typography>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderChangedFields = () => {
    if (!activityLog.changed_fields || activityLog.changed_fields.length === 0) return null

    return (
      <Grid item xs={12}>
        <Typography variant='subtitle2' sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
          Changed Fields
        </Typography>
        <Box
          sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: '#fafafa'
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {activityLog.changed_fields.map((field, index) => (
              <Chip key={index} label={field} size='small' variant='outlined' sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        </Box>
      </Grid>
    )
  }

  const renderValueComparison = () => {
    if (!activityLog.old_values && !activityLog.new_values) return null

    const renderValueItem = (key, value, depth = 0) => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

      // Handle different value types
      let displayValue = value

      if (value === null || value === undefined || value === '') {
        displayValue = '-'
      } else if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No'
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // For nested objects, render recursively
        return (
          <Box key={key} sx={{ mb: 2, ml: depth * 2 }}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: '#616161', mb: 1 }}>
              {label}
            </Typography>
            <Box sx={{ ml: 2, borderLeft: '2px solid #e0e0e0', pl: 2 }}>
              {Object.entries(value).map(([k, v]) => renderValueItem(k, v, depth + 1))}
            </Box>
          </Box>
        )
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          displayValue = '-'
        } else {
          // Check if array contains image/file paths
          const isFileArray = value.every(
            item =>
              typeof item === 'string' &&
              (item.includes('/uploads/') ||
                item.includes('/media/') ||
                item.match(/\.(jpg|jpeg|png|gif|webp|svg|pdf|doc|docx)$/i))
          )

          if (isFileArray) {
            // Render as file list with bullets
            return (
              <Box key={key} sx={{ mb: 2, ml: depth * 2 }}>
                <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 1 }}>
                  {label} ({value.length} {value.length === 1 ? 'file' : 'files'})
                </Typography>
                <Box
                  component='ul'
                  sx={{
                    m: 0,
                    pl: 2.5,
                    '& li': {
                      mb: 0.5,
                      fontSize: '0.875rem',
                      color: '#757575',
                      wordBreak: 'break-all'
                    }
                  }}
                >
                  {value.map((file, idx) => (
                    <li key={idx}>{file}</li>
                  ))}
                </Box>
              </Box>
            )
          } else {
            // Regular array - display as comma separated list
            displayValue = value.join(', ')
          }
        }
      }

      return (
        <Box key={key} sx={{ mb: 1.5, ml: depth * 2 }}>
          <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.3 }}>
            {label}
          </Typography>
          <Typography variant='body2' sx={{ color: '#757575' }}>
            {String(displayValue)}
          </Typography>
        </Box>
      )
    }

    return (
      <Grid item xs={12}>
        <Typography variant='subtitle2' sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
          Value Changes
        </Typography>
        <Grid container spacing={2}>
          <ShowIf when={activityLog.old_values}>
            <Grid item xs={12} md={activityLog.new_values ? 6 : 12}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid #ffebee',
                  borderRadius: 2,
                  backgroundColor: '#fff5f5',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <i className='ri-arrow-left-circle-line' style={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, color: '#d32f2f' }}>
                    Previous Values
                  </Typography>
                </Box>
                {activityLog.old_values &&
                  Object.entries(activityLog.old_values).map(([key, value]) => renderValueItem(key, value))}
              </Box>
            </Grid>
          </ShowIf>

          <ShowIf when={activityLog.new_values}>
            <Grid item xs={12} md={activityLog.old_values ? 6 : 12}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid #e8f5e9',
                  borderRadius: 2,
                  backgroundColor: '#f1f8f4',
                  height: '100%'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <i className='ri-arrow-right-circle-line' style={{ color: '#2e7d32', fontSize: '1.2rem' }} />
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, color: '#2e7d32' }}>
                    New Values
                  </Typography>
                </Box>
                {activityLog.new_values &&
                  Object.entries(activityLog.new_values).map(([key, value]) => renderValueItem(key, value))}
              </Box>
            </Grid>
          </ShowIf>
        </Grid>
      </Grid>
    )
  }

  const renderActorMetadata = () => {
    if (!activityLog.actor_metadata || Object.keys(activityLog.actor_metadata).length === 0) return null

    return (
      <Grid item xs={12}>
        <Typography variant='subtitle2' sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
          Actor Metadata
        </Typography>
        <Box
          sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: '#fafafa'
          }}
        >
          <Grid container spacing={2}>
            {Object.entries(activityLog.actor_metadata).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 500, color: '#424242', mb: 0.5, textTransform: 'capitalize' }}
                >
                  {key.replace(/_/g, ' ')}
                </Typography>
                <Typography variant='body2' sx={{ color: '#757575' }}>
                  {typeof value === 'object' ? JSON.stringify(value) : value || '-'}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    )
  }

  const renderExtraData = () => {
    if (!activityLog.extra_data || Object.keys(activityLog.extra_data).length === 0) return null

    return (
      <Grid item xs={12}>
        <Typography variant='subtitle2' sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
          Additional Information
        </Typography>
        <Box
          sx={{
            p: 3,
            border: '1px solid #e3f2fd',
            borderRadius: 2,
            backgroundColor: '#f5f9ff'
          }}
        >
          <Grid container spacing={2}>
            {Object.entries(activityLog.extra_data).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 500, color: '#424242', mb: 0.5, textTransform: 'capitalize' }}
                >
                  {key.replace(/_/g, ' ')}
                </Typography>
                <Typography variant='body2' sx={{ color: '#757575' }}>
                  {typeof value === 'object' ? JSON.stringify(value) : value || '-'}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    )
  }

  return (
    <>
      <div className='p-6'>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => router.back()} size='small'>
            <i className='ri-arrow-left-line' />
          </IconButton>
          <Typography variant='h5' sx={{ fontWeight: 600 }}>
            Activity Log Detail
          </Typography>
        </Box>

        <Card className='w-full mx-auto shadow'>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant='h6'>Activity Information</Typography>
                <Chip
                  label={activityLog.action.toUpperCase()}
                  size='small'
                  color={getActivityColor(activityLog.action)}
                  variant='tonal'
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant='subtitle2' sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
                  Basic Information
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
                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Activity ID
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {activityLog.id}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Action Type
                      </Typography>
                      <Chip
                        label={activityLog.action.toUpperCase()}
                        size='small'
                        color={getActivityColor(activityLog.action)}
                        variant='tonal'
                        sx={{ borderRadius: 1 }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Description
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {activityLog.description}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Timestamp
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {formatDateToCustomStringNative(activityLog.created_at)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Actor Information */}
              <Grid item xs={12}>
                <Typography variant='subtitle2' sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
                  Actor Information
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
                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Actor Type
                      </Typography>
                      <Chip
                        label={activityLog.actor_type.toUpperCase()}
                        size='small'
                        color={activityLog.actor_type === 'user' ? 'primary' : 'default'}
                        variant='tonal'
                        sx={{ borderRadius: 1 }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Actor Name
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {activityLog.actor_name}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Actor Identifier
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575', fontFamily: 'monospace' }}>
                        {activityLog.actor_identifier}
                      </Typography>
                    </Grid>

                    <ShowIf when={activityLog.user?.username}>
                      <Grid item xs={12} md={6}>
                        <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                          User Account
                        </Typography>
                        <Typography variant='body2' sx={{ color: '#757575' }}>
                          {activityLog.user?.username} (ID: {activityLog.user?.id})
                        </Typography>
                      </Grid>
                    </ShowIf>

                    <ShowIf when={activityLog.user?.email}>
                      <Grid item xs={12}>
                        <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                          User Email
                        </Typography>
                        <Typography variant='body2' sx={{ color: '#757575' }}>
                          {activityLog.user?.email}
                        </Typography>
                      </Grid>
                    </ShowIf>
                  </Grid>
                </Box>
              </Grid>

              {/* Entity Information */}
              <ShowIf when={activityLog.entity}>
                <Grid item xs={12}>
                  <Typography variant='subtitle2' sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
                    Target Entity
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
                      <Grid item xs={12} md={4}>
                        <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                          Entity Type
                        </Typography>
                        <Chip
                          label={activityLog.entity.toUpperCase()}
                          size='small'
                          color='secondary'
                          variant='tonal'
                          sx={{ borderRadius: 1 }}
                        />
                      </Grid>

                      <ShowIf when={activityLog.entity_id}>
                        <Grid item xs={12} md={4}>
                          <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                            Entity ID
                          </Typography>
                          <Typography variant='body2' sx={{ color: '#757575', fontFamily: 'monospace' }}>
                            {activityLog.entity_id}
                          </Typography>
                        </Grid>
                      </ShowIf>

                      <ShowIf when={activityLog.entity_name}>
                        <Grid item xs={12} md={4}>
                          <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                            Entity Name
                          </Typography>
                          <Typography variant='body2' sx={{ color: '#757575' }}>
                            {activityLog.entity_name}
                          </Typography>
                        </Grid>
                      </ShowIf>
                    </Grid>
                  </Box>
                </Grid>
              </ShowIf>

              {/* Changed Fields */}
              {renderChangedFields()}

              {/* Value Changes */}
              {renderValueComparison()}

              {/* Actor Metadata */}
              {renderActorMetadata()}

              {/* Technical Information */}
              <Grid item xs={12}>
                <Typography variant='subtitle2' sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 600 }}>
                  Technical Information
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
                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        IP Address
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575', fontFamily: 'monospace' }}>
                        {activityLog.ip_address}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        User Agent
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{ color: '#757575', fontSize: '0.8rem', wordBreak: 'break-word' }}
                      >
                        {activityLog.user_agent}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Extra Data */}
              {renderExtraData()}
            </Grid>
          </CardContent>
          <Divider />
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' color='secondary' onClick={() => router.back()}>
              Back to List
            </Button>
          </Box>
        </Card>
      </div>
      {SnackbarComponent}
    </>
  )
}

export default ActivityLogDetailPage
