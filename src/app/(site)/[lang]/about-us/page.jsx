'use client'

import { useMediaQuery } from '@mui/material'

import AboutUsSection from '@/components/section/AboutUsSection'
import DiscoverSection from '@/components/section/DiscoverSection'
import EndSection from '@/components/section/EndSection'
import HeaderPageSection from '@/components/section/HeaderPageSection'
import AwardSection from '@/components/section/AwardSection'
import VisionSection from '@/components/section/VisionSection'

const AboutUsPage = () => {
  const isMobile = useMediaQuery('(max-width:768px)')

  return (
    <>
      <HeaderPageSection
        title={'World Class Porcelain Tile'}
        subTitle={'Since 1990’s'}
        bgImage={'/images/illustrations/photos/banner-1.png'}
        height={isMobile ? '50vh' : '100vh'}
      />
      <AboutUsSection />
      <AwardSection />
      <VisionSection />
      <DiscoverSection />
      <EndSection />
    </>
  )
}

export default AboutUsPage
