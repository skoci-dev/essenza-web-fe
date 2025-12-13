'use client'

import { useMediaQuery } from '@mui/material'

import EndSection from '@/components/section/EndSection'
import HeaderPageSection from '@/components/section/HeaderPageSection'
import ProjectSection from '@/components/section/ProjectSection'

const ProjectPage = () => {
  const isMobile = useMediaQuery('(max-width:768px)')

  return (
    <>
      <HeaderPageSection height={isMobile ? '250px' : '360px'} bgImage={'/images/background/bg-header.png'} />
      <ProjectSection />
      <EndSection />
    </>
  )
}

export default ProjectPage
