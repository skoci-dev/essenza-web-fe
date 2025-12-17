'use client'

import ActivityLogDataTable from '@/components/dashboards/activityLog/DataTable'
import { getAccountActivities } from '@/services/auth'

const MyActivityLogPage = () => {
  return <ActivityLogDataTable fetchActivityLogAction={getAccountActivities} />
}

export default MyActivityLogPage
