'use client'

import DistributorsForm from '@/components/dashboards/distributors/Form'

const DistributorsEditPage = ({ params }) => {
  const id = params.id
  return <DistributorsForm id={id} />
}

export default DistributorsEditPage
