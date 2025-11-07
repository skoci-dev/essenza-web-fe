'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material'

export default function Breadcrumbs() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  const labelMap = {
    'esse-panel': 'Dashboard',
    home: 'Home',
    users: 'Users',
    settings: 'Settings'
  }

  const formatLabel = segment =>
    segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  const crumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')

    let label = labelMap[segment] || segment

    if (index === 1 && !labelMap[segment]) {
      label = formatLabel(segment)
    }

    const isLast = index === pathSegments.length - 1

    return isLast ? (
      <Typography key={href} color='text.primary'>
        {label}
      </Typography>
    ) : (
      <Link key={href} href={href}>
        {label}
      </Link>
    )
  })

  return (
    <MUIBreadcrumbs aria-label='breadcrumb' className='mb-4'>
      {crumbs}
    </MUIBreadcrumbs>
  )
}
