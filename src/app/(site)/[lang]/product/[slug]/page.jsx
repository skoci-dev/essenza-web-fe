'use client'

import { useParams } from 'next/navigation'

import { useMediaQuery } from '@mui/material'

import HeaderPageSection from '@/components/section/HeaderPageSection'
import ProductDetailSection from '@/components/section/ProductDetailSection'

const ProductDetailPage = () => {
  const params = useParams()
  const { slug } = params
  const isMobile = useMediaQuery('(max-width:768px)')

  return (
    <>
      <HeaderPageSection height={isMobile ? '160px' : '160px'} bgImage={'/images/background/bg-header.png'} />
      <ProductDetailSection slug={slug} />
    </>
  )
}

export default ProductDetailPage
