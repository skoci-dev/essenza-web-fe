'use client'

import { useState, useEffect } from 'react'

import { useParams } from 'next/navigation'

import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

import CardProductCarousel from '@/components/CardProductCarousel'
import { handleApiResponse } from '@/utils/handleApiResponse'
import { getPubProducts } from '@/services/products'

const ProductSection = () => {
  const [products, setProducts] = useState([])

  const { lang: locale } = useParams()
  const isMobile = useMediaQuery('(max-width:768px)')

  useEffect(() => {
    handleApiResponse(() => getPubProducts({ size: 99 }), {
      onSuccess: ({ data }) => {
        const mappingData = data.map(item => {
          return {
            ...item,
            href: `/${locale}/product/${item?.slug}`
          }
        })

        setProducts(mappingData)
      }
    })
  }, [])

  return (
    <Box sx={{ marginTop: isMobile ? -35 : -60 }}>
      <CardProductCarousel
        data={products}
        title='Discover the other collection for you'
        bgColor='linear-gradient(180deg, #EDEDED, #F9F9F9)'
        duration={2500}
      />
    </Box>
  )
}

export default ProductSection
