'use client'

import CardCarousel from '@/components/CardCarousel'

const NewsSection = ({ articles }) => {
  return <CardCarousel data={articles} title='News & Event' duration={1500} slidesPerView={4} />
}

export default NewsSection
