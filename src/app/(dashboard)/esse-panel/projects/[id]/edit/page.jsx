'use client'

import ProjectForm from '@/components/dashboards/projects/Form'

const BannersEditPage = ({ params }) => {
  const id = params?.id

  return <ProjectForm id={id} />
}

export default BannersEditPage
