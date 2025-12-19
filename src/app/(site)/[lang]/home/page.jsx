import BannerSection from '@/components/section/BannerSection'
import CategorySection from '@/components/section/CategorySection'
import DiscoverSection from '@/components/section/DiscoverSection'
import EndSection from '@/components/section/EndSection'
import NewsSection from '@/components/section/NewsSection'
import ProjectSection from '@/components/section/ProjectSection'

const HomePage = () => {
  return (
    <>
      <BannerSection />
      <CategorySection />
      <ProjectSection />
      <NewsSection />
      <DiscoverSection />
      <EndSection />
    </>
  )
}

export default HomePage
