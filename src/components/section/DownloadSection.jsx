'use client'

import { useState, useEffect } from 'react'

import { useParams } from 'next/navigation'

import Box from '@mui/material/Box'

import CardDownloadCarousel from '../CardDownloadCarousel'
import { getPubBrochures } from '@/services/brochures'

const DownloadSection = props => {
  const { mt = '-115px', titleColor } = props
  const { lang: locale } = useParams()

  const [projects, setBrochures] = useState([])

  const fetchDownload = async () => {
    const res = await getPubBrochures()

    if (res?.data?.length > 0) {
      const mappingData = res.data.map(item => {
        return {
          ...item,
          id: item?.slug,
          name: item?.title,
          href: `/${locale}/download/${item?.slug}`,
          src: item?.image
        }
      })

      setBrochures(mappingData)
    }
  }

  useEffect(() => {
    fetchDownload()
  }, [])

  return (
    <Box sx={{ marginTop: { xs: '-115px', sm: '-250px' } }}>
      <CardDownloadCarousel
        data={projects}
        title='Unleash your creativity for interior design'
        bgColor={'linear-gradient(180deg, #EDEDED, #F9F9F9)'}
        duration={2500}
        titleColor={titleColor || '#F9F9F9'}
      />
    </Box>
  )
}

export default DownloadSection
