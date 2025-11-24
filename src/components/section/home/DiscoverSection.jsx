'use client'

import CardCarousel from '@/components/CardCarousel'

const DiscoverSection = () => {
  const data = [
    { id: 1, src: '/images/illustrations/photos/banner-1.png', title: 'Banner 1' },
    { id: 2, src: '/images/illustrations/photos/banner-2.png', title: 'Banner 2' },
    { id: 3, src: '/images/illustrations/photos/banner-3.png', title: 'Banner 3' },
    { id: 4, src: '/images/illustrations/photos/banner-4.jpg', title: 'Banner 4' },
    { id: 5, src: '/images/illustrations/photos/banner-5.jpg', title: 'Banner 5' }
  ]

  return (
    <CardCarousel
      data={data}
      title='Discover the other collection for you'
      bgColor={'linear-gradient(180deg, #EDEDED, #F9F9F9)'}
      duration={2000}
    />
  )
}

export default DiscoverSection
