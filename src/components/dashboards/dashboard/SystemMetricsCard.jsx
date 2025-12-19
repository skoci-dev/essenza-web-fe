'use client'

// React Imports
import { useCallback, useState, useEffect, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import useSnackbar from '@/@core/hooks/useSnackbar'
import { handleApiResponse } from '@/utils/handleApiResponse'
import { getSystemMetrics } from '@/services/system'
import { ShowElse, ShowIf } from '@/components/ShowIf'

const FETCH_METRICS_INTERVAL = 30000 // 30 seconds

const SystemMetricsCard = () => {
  const { error, SnackbarComponent } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [systemMetrics, setSystemMetrics] = useState({})

  const fetchSystemMetrics = useCallback(async () => {
    try {
      await handleApiResponse(() => getSystemMetrics(), {
        onError: errMsg => {
          error(`Failed to fetch system metrics: ${errMsg}`)
          setSystemMetrics({})
        },
        onSuccess: ({ data }) => {
          setSystemMetrics(data)
        }
      })
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => {
    fetchSystemMetrics()

    const interval = setInterval(() => {
      fetchSystemMetrics()
    }, FETCH_METRICS_INTERVAL)

    return () => clearInterval(interval)
  }, [fetchSystemMetrics])

  // Memoize disk calculations to avoid redundant computations
  const diskMetrics = useMemo(() => {
    const totalBytes = systemMetrics?.disk?.total_bytes || 0
    const freeBytes = systemMetrics?.disk?.free_bytes || 0
    const usedBytes = totalBytes - freeBytes
    const usedGB = (usedBytes / 1024 ** 3).toFixed(2)
    const usagePercent = totalBytes > 0 ? ((totalBytes - freeBytes) / totalBytes) * 100 : 0
    const color = usagePercent >= 90 ? 'error' : usagePercent >= 75 ? 'warning' : 'success'

    return { usedGB, usagePercent, color }
  }, [systemMetrics?.disk?.total_bytes, systemMetrics?.disk?.free_bytes])

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1 }}>
          <ShowIf when={loading}>
            <Box className='flex items-center justify-center h-full min-h-[300px]'>
              <CircularProgress />
            </Box>

            <ShowElse>
              <Typography variant='h5' className='font-semibold mb-1'>
                Backend System Metrics
              </Typography>
              <Typography variant='caption' color='text.secondary' className='mb-4 block'>
                Resource usage and performance metrics of backend server
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box className='flex flex-col gap-2'>
                    <Box className='flex items-center justify-between'>
                      <Typography variant='body2' color='text.secondary' className='flex items-center gap-1'>
                        <i className='ri-cpu-line text-base' />
                        CPU Usage
                      </Typography>
                      <Typography variant='body2' className='font-semibold'>
                        {systemMetrics?.cpu?.usage_percent}%
                      </Typography>
                    </Box>
                    <Box className='flex items-center gap-2'>
                      <Box className='flex-1'>
                        <LinearProgress
                          variant='determinate'
                          value={systemMetrics?.cpu?.usage_percent || 0}
                          color={
                            (systemMetrics?.cpu?.usage_percent || 0) >= 90
                              ? 'error'
                              : (systemMetrics?.cpu?.usage_percent || 0) >= 75
                                ? 'warning'
                                : 'info'
                          }
                          className='h-2 rounded'
                        />
                      </Box>
                      <Typography variant='caption' color='text.secondary' className='min-w-[45px] text-right'>
                        {(systemMetrics?.cpu?.usage_percent || 0).toFixed(1)}%
                      </Typography>
                    </Box>
                    <Box className='flex items-center justify-between mt-1 pl-3'>
                      <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                        <i className='ri-file-list-3-line text-xs' /> Cores
                      </Typography>
                      <Typography variant='caption' className='font-medium'>
                        {systemMetrics?.cpu?.count} cores @ {systemMetrics?.cpu?.frequency_mhz} MHz
                      </Typography>
                    </Box>
                    {systemMetrics?.cpu?.load_average && (
                      <Box className='flex items-center justify-between pl-3'>
                        <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                          <i className='ri-line-chart-line text-xs' /> Load Avg
                        </Typography>
                        <Typography variant='caption' className='font-medium'>
                          {systemMetrics?.cpu?.load_average['1min']?.toFixed(2)} /{' '}
                          {systemMetrics?.cpu?.load_average['5min']?.toFixed(2)} /{' '}
                          {systemMetrics?.cpu?.load_average['15min']?.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box className='flex flex-col gap-2'>
                    <Box className='flex items-center justify-between'>
                      <Typography variant='body2' color='text.secondary' className='flex items-center gap-1'>
                        <i className='ri-database-2-line text-base' />
                        Memory Usage
                      </Typography>
                      <Typography variant='body2' className='font-semibold'>
                        {systemMetrics?.memory?.used_by_os} / {systemMetrics?.memory?.total}
                      </Typography>
                    </Box>
                    <Box className='flex items-center gap-2'>
                      <Box className='flex-1'>
                        <LinearProgress
                          variant='determinate'
                          value={systemMetrics?.memory?.usage_percent || 0}
                          color={
                            (systemMetrics?.memory?.usage_percent || 0) >= 90
                              ? 'error'
                              : (systemMetrics?.memory?.usage_percent || 0) >= 75
                                ? 'warning'
                                : 'primary'
                          }
                          className='h-2 rounded'
                        />
                      </Box>
                      <Typography variant='caption' color='text.secondary' className='min-w-[45px] text-right'>
                        {(systemMetrics?.memory?.usage_percent || 0).toFixed(1)}%
                      </Typography>
                    </Box>
                    <Box className='flex items-center justify-between mt-1 pl-3'>
                      <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                        <i className='ri-checkbox-circle-line text-xs' /> Active Used
                      </Typography>
                      <Typography variant='caption' className='font-medium'>
                        {systemMetrics?.memory?.used}
                      </Typography>
                    </Box>
                    <Box className='flex items-center justify-between pl-3'>
                      <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                        <i className='ri-inbox-archive-line text-xs' /> Cached
                      </Typography>
                      <Typography variant='caption' className='font-medium'>
                        {systemMetrics?.memory?.cached}
                      </Typography>
                    </Box>
                    <Box className='flex items-center justify-between pl-3'>
                      <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                        <i className='ri-check-line text-xs' /> Available
                      </Typography>
                      <Typography variant='caption' className='font-medium'>
                        {systemMetrics?.memory?.available}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box className='flex flex-col gap-2'>
                    <Box className='flex items-center justify-between'>
                      <Typography variant='body2' color='text.secondary' className='flex items-center gap-1'>
                        <i className='ri-hard-drive-2-line text-base' />
                        Disk Usage
                      </Typography>
                      <Typography variant='body2' className='font-semibold'>
                        {diskMetrics.usedGB} GB / {systemMetrics?.disk?.total}
                      </Typography>
                    </Box>
                    <Box className='flex items-center gap-2'>
                      <Box className='flex-1'>
                        <LinearProgress
                          variant='determinate'
                          value={diskMetrics.usagePercent}
                          color={diskMetrics.color}
                          className='h-2 rounded'
                        />
                      </Box>
                      <Typography variant='caption' color='text.secondary' className='min-w-[45px] text-right'>
                        {diskMetrics.usagePercent.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Box className='flex items-center justify-between mt-1 pl-3'>
                      <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                        <i className='ri-check-double-line text-xs' /> Free
                      </Typography>
                      <Typography variant='caption' className='font-medium'>
                        {systemMetrics?.disk?.free}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box className='flex flex-col gap-2'>
                    <Typography variant='body2' color='text.secondary' className='flex items-center gap-1 mb-1'>
                      <i className='ri-wifi-line text-base' />
                      Network Traffic
                    </Typography>
                    <Box className='flex flex-col gap-2 pl-3'>
                      <Box className='flex items-center justify-between'>
                        <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                          <i className='ri-upload-line text-xs' /> Sent
                        </Typography>
                        <Typography variant='body2' className='font-semibold'>
                          {systemMetrics?.network?.bytes_sent}
                        </Typography>
                      </Box>
                      <Box className='flex items-center justify-between'>
                        <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                          <i className='ri-download-line text-xs' /> Received
                        </Typography>
                        <Typography variant='body2' className='font-semibold'>
                          {systemMetrics?.network?.bytes_received}
                        </Typography>
                      </Box>
                      <Box className='flex items-center justify-between'>
                        <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                          <i className='ri-share-line text-xs' /> Packets
                        </Typography>
                        <Typography variant='caption' className='font-medium'>
                          ↑ {systemMetrics?.network?.packets_sent?.toLocaleString()} / ↓{' '}
                          {systemMetrics?.network?.packets_received?.toLocaleString()}
                        </Typography>
                      </Box>
                      {(systemMetrics?.network?.errors_in > 0 || systemMetrics?.network?.errors_out > 0) && (
                        <Box className='flex items-center justify-between'>
                          <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                            <i className='ri-error-warning-line text-xs' /> Errors
                          </Typography>
                          <Typography variant='caption' className='font-medium'>
                            ↑ {systemMetrics?.network?.errors_out} / ↓ {systemMetrics?.network?.errors_in}
                          </Typography>
                        </Box>
                      )}
                      {(systemMetrics?.network?.drops_in !== null || systemMetrics?.network?.drops_out !== null) && (
                        <Box className='flex items-center justify-between'>
                          <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                            <i className='ri-close-circle-line text-xs' /> Drops
                          </Typography>
                          <Typography variant='caption' className='font-medium'>
                            ↑ {systemMetrics?.network?.drops_out ?? 'N/A'} / ↓{' '}
                            {systemMetrics?.network?.drops_in ?? 'N/A'}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box className='mt-4 pt-3 border-t border-divider'>
                <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
                  <i className='ri-refresh-line text-xs' />
                  Last updated: {new Date(systemMetrics?.timestamp).toLocaleString('id-ID')}
                </Typography>
              </Box>
            </ShowElse>
          </ShowIf>
        </CardContent>
      </Card>
      {SnackbarComponent}
    </>
  )
}

export default SystemMetricsCard
