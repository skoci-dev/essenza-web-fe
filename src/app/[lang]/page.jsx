import HeroSection from '@/components/section/home/HeroSection'

import CustomerReviews from '@/components/section/home/CustomerReviews'
import PricingPlan from '@/components/section/home/Pricing'
import ProductStat from '@/components/section/home/ProductStat'
import GetStarted from '@/components/section/home/GetStarted'

const HomePage = () => {
  // Hooks

  return (
    <>
      <HeroSection />
      <CustomerReviews />
      <PricingPlan />
      <ProductStat />
      <GetStarted />
    </>
  )
}

export default HomePage
