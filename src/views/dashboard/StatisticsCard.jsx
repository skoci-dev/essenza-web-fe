'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

// Components Imports
import HorizontalWithBorder from '@components/card-statistics/HorizontalWithBorder'
import { handleApiResponse } from '@/utils/handleApiResponse'
import { getDashboardStatistics } from '@/services/dashboard'

const ShipmentStatistics = ({ data }) => {
  const [statsData, setStatsData] = useState(data)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      await handleApiResponse(getDashboardStatistics, {
        onSuccess: ({ data }) => {
          setStatsData(prev => {
            return prev.map(item => ({
              ...item,
              stats: data[item.name] !== undefined ? String(data[item.name]) : item.stats
            }))
          })
        }
      })
    }

    fetchDashboardStats()
  }, [])

  return (
    statsData && (
      <Grid container spacing={6}>
        {statsData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <HorizontalWithBorder {...item} />
          </Grid>
        ))}
      </Grid>
    )
  )
}

export default ShipmentStatistics
