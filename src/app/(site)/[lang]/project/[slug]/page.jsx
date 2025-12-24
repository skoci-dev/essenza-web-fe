'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useMediaQuery } from '@mui/material'

import { handleApiResponse } from '@/utils/handleApiResponse'

import { getPubProjectBySlug } from '@/services/projects'

import HeaderPageSection from '@/components/section/HeaderPageSection'
import ProjectDetailSection from '@/components/section/ProjectDetailSection'
import HeaderProjectDetailSection from '@/components/section/HeaderProjectDetailSection'
import NotFoundPage from '../../[...not-found]/page'

const ProjectDetailPage = () => {
  const params = useParams()
  const { slug } = params
  const isMobile = useMediaQuery('(max-width:768px)')

  const [dataDetail, setDataDetail] = useState(null)
  const [listImage, setListImage] = useState([])

  useEffect(() => {
    handleApiResponse(() => getPubProjectBySlug(slug), {
      onSuccess: ({ data }) => {
        setDataDetail(data)
        const gallery = data?.gallery?.length > 0 ? data?.gallery : []
        const getImage = [data?.thumbnail, ...gallery]

        setListImage(getImage)
      }
    })
  }, [slug])

  if (dataDetail) {
    return (
      <>
        <HeaderProjectDetailSection image={listImage} />
        <ProjectDetailSection dataDetail={dataDetail} />
      </>
    )
  } else {
    return <NotFoundPage />
  }
}

export default ProjectDetailPage
