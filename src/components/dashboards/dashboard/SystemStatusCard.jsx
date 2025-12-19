'use client'

// React Imports
import { useState, useEffect, useCallback, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import useSnackbar from '@/@core/hooks/useSnackbar'
import { handleApiResponse } from '@/utils/handleApiResponse'
import { getSystemStatus } from '@/services/system'
import { ShowElse, ShowIf } from '@/components/ShowIf'
import { formatReadableDate } from '@/utils/helpers'

const FETCH_STATUS_INTERVAL = 30000 // 30 seconds

const formatUptime = seconds => {
  if (!seconds) return '0s'

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts = []

  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

  return parts.join(' ')
}

const SystemStatusCard = () => {
  const { error, SnackbarComponent } = useSnackbar()
  const [systemStatus, setSystemStatus] = useState({})
  const [currentUptime, setCurrentUptime] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hasInitialData, setHasInitialData] = useState(false)

  const hasData = useMemo(() => Object.keys(systemStatus).length > 0, [systemStatus])
  const isOperational = useMemo(() => systemStatus?.status === 'operational', [systemStatus?.status])

  const formattedStartTime = useMemo(() => {
    if (!systemStatus?.app_start_time) return '-'

    return formatReadableDate(systemStatus.app_start_time)
  }, [systemStatus?.app_start_time])

  const fetchSystemStatus = useCallback(async () => {
    try {
      await handleApiResponse(getSystemStatus, {
        onError: errMsg => {
          error(`Failed to fetch system status: ${errMsg}`)
          setSystemStatus({})
        },
        onSuccess: ({ data }) => {
          setSystemStatus(data)
          setHasInitialData(true)
        }
      })
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => {
    fetchSystemStatus()
  }, [fetchSystemStatus])

  useEffect(() => {
    if (!hasInitialData) return

    const interval = setInterval(() => {
      fetchSystemStatus()
    }, FETCH_STATUS_INTERVAL)

    return () => clearInterval(interval)
  }, [hasInitialData, fetchSystemStatus])

  useEffect(() => {
    if (!hasData) {
      setCurrentUptime(0)

      return
    }

    // Set initial uptime
    setCurrentUptime(systemStatus?.uptime_seconds || 0)

    // Update uptime every second
    const interval = setInterval(() => {
      setCurrentUptime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [systemStatus?.uptime_seconds, hasData])

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1 }}>
          <ShowIf when={loading}>
            <Box className='flex items-center justify-center h-full min-h-[300px]'>
              <CircularProgress />
            </Box>

            <ShowElse>
              <Box className='flex items-center justify-between mb-1'>
                <Typography variant='h5' className='font-semibold'>
                  Backend System Status
                </Typography>
                {hasData && (
                  <Chip
                    label={isOperational ? 'Operational' : 'Unavailable'}
                    color={isOperational ? 'success' : 'warning'}
                    size='small'
                    icon={<i className={`ri-${isOperational ? 'checkbox-circle' : 'alert'}-line`} />}
                  />
                )}
              </Box>
              <Typography variant='caption' color='text.secondary' className='mb-4 block'>
                Real-time monitoring of backend server status and information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box className='flex flex-col gap-1'>
                    <Typography variant='body2' color='text.secondary' className='flex items-center gap-1'>
                      <i className='ri-time-line text-base' />
                      Uptime
                    </Typography>
                    <Typography variant='h6' className='font-semibold'>
                      {currentUptime > 0 ? formatUptime(currentUptime) : '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box className='flex flex-col gap-1'>
                    <Typography variant='body2' color='text.secondary' className='flex items-center gap-1'>
                      <i className='ri-calendar-event-line text-base' />
                      Uptime Since
                    </Typography>
                    <Typography variant='h6' className='font-semibold text-sm'>
                      {formattedStartTime}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box className='flex flex-col gap-1'>
                    <Typography variant='body2' color='text.secondary' className='flex items-center gap-1'>
                      <i className='ri-apps-line text-base' />
                      Version
                    </Typography>
                    <Typography variant='h6' className='font-semibold'>
                      {systemStatus?.version ? `v${systemStatus.version}` : '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box className='flex flex-col gap-1'>
                    <Typography variant='body2' color='text.secondary' className='flex items-center gap-1'>
                      <i className='ri-terminal-box-line text-base' />
                      Platform
                    </Typography>
                    <Typography variant='h6' className='font-semibold'>
                      {systemStatus?.platform || '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box className='flex flex-col gap-1'>
                    <Typography variant='body2' color='text.secondary' className='flex items-center gap-1'>
                      <i className='ri-code-s-slash-line text-base' />
                      Python
                    </Typography>
                    <Typography variant='h6' className='font-semibold'>
                      {systemStatus?.python_version || '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box className='flex flex-col gap-1'>
                    <Typography variant='body2' color='text.secondary' className='flex items-center gap-1'>
                      <i className='ri-server-line text-base' />
                      Hostname
                    </Typography>
                    <Typography variant='h6' className='font-semibold text-sm'>
                      {systemStatus?.hostname || '-'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </ShowElse>
          </ShowIf>
        </CardContent>
      </Card>
      {SnackbarComponent}
    </>
  )
}

export default SystemStatusCard
