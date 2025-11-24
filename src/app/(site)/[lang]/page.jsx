import BannerSection from '@/components/section/home/BannerSection'
import CategorySection from '@/components/section/home/CategorySection'
import DiscoverSection from '@/components/section/home/DiscoverSection'
import EndSection from '@/components/section/home/EndSection'
import NewsSection from '@/components/section/home/NewsSection'
import ProjectSection from '@/components/section/home/ProjectSection'

const HomePage = () => {
  // Hooks

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
