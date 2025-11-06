import HeroSection from '@/components/section/home/HeroSection'

// import UsefulFeature from '@/components/section/home/UsefulFeature'
import CustomerReviews from '@/components/section/home/CustomerReviews'
import OurTeam from '@/components/section/home/OurTeam'
import PricingPlan from '@/components/section/home/Pricing'
import ProductStat from '@/components/section/home/ProductStat'
import Faqs from '@/components/section/home/Faqs'
import GetStarted from '@/components/section/home/GetStarted'
import ContactUs from '@/components/section/home/ContactUs'

import { getServerMode } from '@core/utils/serverHelpers'

import { useSettings } from '@core/hooks/useSettings'

const HomePage = () => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <HeroSection />
      {/* <UsefulFeature /> */}
      <CustomerReviews />
      {/* <OurTeam /> */}
      <PricingPlan />
      <ProductStat />
      {/* <Faqs /> */}
      <GetStarted />
      {/* <ContactUs /> */}
    </>
  )
}

export default HomePage
