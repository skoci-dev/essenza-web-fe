'use client'

//MUI Imports
import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

//Component Imports
import StatisticsCard from '@views/dashboard/StatisticsCard'
import OverviewTable from '@views/dashboard/OverviewTable'
import SystemStatusCard from '@/components/dashboards/dashboard/SystemStatusCard'
import SystemMetricsCard from '@/components/dashboards/dashboard/SystemMetricsCard'
import { ShowIf } from '@/components/ShowIf'

const ALLOWED_SHOW_SYSTEM_INFO_ROLES = ['superadmin', 'admin']

//Data Imports
export const data = [
  {
    name: 'total_posts',
    stats: '-',
    title: 'Total Posts',
    color: 'primary',
    avatarIcon: 'ri-file-list-line text',
    subtitle: 'Jumlah semua posting yang telah dibuat'
  },
  {
    name: 'draft_posts',
    stats: '-',
    title: 'Draft Posts',
    color: 'secondary',
    avatarIcon: 'ri-draft-line',
    subtitle: 'Posting yang masih dalam bentuk draft'
  },
  {
    name: 'published_posts',
    stats: '-',
    title: 'Published Posts',
    color: 'success',
    avatarIcon: 'ri-send-plane-line',
    subtitle: 'Posting yang sudah dipublikasikan'
  },
  {
    name: 'monthly_posts',
    stats: '-',
    title: 'Monthly Posts',
    color: 'info',
    avatarIcon: 'ri-calendar-check-line',
    subtitle: 'Artikel yang dipublikasikan bulan ini'
  }
]

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const getUserData = () => {
      if (typeof window !== 'undefined') {
        const userDataJSON = localStorage.getItem('dataUser')

        if (userDataJSON) {
          try {
            const userData = JSON.parse(userDataJSON)

            setUserRole(userData?.role || null)
          } catch (e) {
            console.error('Failed to parse userData from localStorage', e)
          }
        }
      }
    }

    getUserData()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <StatisticsCard data={data} />
      </Grid>
      <Grid item xs={12}>
        <OverviewTable />
      </Grid>

      <ShowIf when={ALLOWED_SHOW_SYSTEM_INFO_ROLES.includes(userRole?.name || '')}>
        <Grid item xs={12} md={6}>
          <SystemStatusCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <SystemMetricsCard />
        </Grid>
      </ShowIf>
    </Grid>
  )
}

export default Dashboard
