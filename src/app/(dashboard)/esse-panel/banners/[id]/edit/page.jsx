'use client'

import BannersForm from '@/components/dashboards/banners/Form'

const BannersEditPage = ({ params }) => {
  const id = params?.id

  return <BannersForm id={id} />
}

export default BannersEditPage
