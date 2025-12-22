'use client'

import { useState, useEffect } from 'react'

import { useParams } from 'next/navigation'

import Box from '@mui/material/Box'

import useMediaQuery from '@/@menu/hooks/useMediaQuery'

import { getPubProjects } from '@/services/projects'
import CardProjectCarousel from '../CardProjectCarousel'

const ProjectSection = () => {
  const { lang: locale } = useParams()
  const isMobile = useMediaQuery('(max-width:768px)')

  const [projects, setProjects] = useState([])

  const fetchProjects = async () => {
    const res = await getPubProjects()

    if (res?.data?.length > 0) {
      const mappingData = res.data.map(item => {
        return {
          ...item,
          id: item?.slug,
          name: item?.title,
          href: `/${locale}/project/${item?.slug}`,
          src: item?.image
        }
      })

      setProjects(mappingData)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <Box sx={{ marginTop: { xs: '-115px', sm: '-250px' } }}>
      <CardProjectCarousel
        data={projects}
        title='Showcase of our completed collaborations'
        bgColor={'linear-gradient(180deg, #EDEDED, #F9F9F9)'}
        duration={2500}
      />
    </Box>
  )
}

export default ProjectSection
