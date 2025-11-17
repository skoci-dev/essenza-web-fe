'use client'

import StoresForm from '@/components/dashboards/stores/Form'

const StoresEditPage = ({ params }) => {
  const id = params?.id

  return <StoresForm id={id} />
}

export default StoresEditPage
