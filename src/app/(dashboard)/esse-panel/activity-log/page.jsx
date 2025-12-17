'use client'

import ActivityLogDataTable from '@/components/dashboards/activityLog/DataTable'
import { getActivityLogs } from '@/services/system'

const ActivityLogPage = () => {
  return <ActivityLogDataTable fetchActivityLogAction={getActivityLogs} />
}

export default ActivityLogPage
