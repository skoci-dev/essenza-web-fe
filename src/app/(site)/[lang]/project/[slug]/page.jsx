'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useMediaQuery } from '@mui/material'

import { handleApiResponse } from '@/utils/handleApiResponse'

import { getPubProjectBySlug } from '@/services/projects'

import HeaderPageSection from '@/components/section/HeaderPageSection'
import ProjectDetailSection from '@/components/section/ProjectDetailSection'

const ProjectDetailPage = () => {
  const params = useParams()
  const { slug } = params
  const isMobile = useMediaQuery('(max-width:768px)')

  const [dataDetail, setDataDetail] = useState(null)

  useEffect(() => {
    handleApiResponse(() => getPubProjectBySlug(slug), {
      onSuccess: ({ data }) => {
        setDataDetail(data)
      }
    })
  }, [slug])

  return (
    <>
      <HeaderPageSection height={isMobile ? '160px' : '90vh'} bgImage={dataDetail?.image} />
      <ProjectDetailSection dataDetail={dataDetail} />
    </>
  )
}

export default ProjectDetailPage
