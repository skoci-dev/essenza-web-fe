import { getPubSocialMedias } from '@/services/socialMedia'
import Footer from './Footer'
import { getPubMenus } from '@/services/menu'

const fetchSocialMedia = async () => {
  let socialMediaData = []

  try {
    const { success, message, data } = await getPubSocialMedias()

    if (!success) {
      throw new Error(message || 'Failed to fetch social media data')
    }

    if (data?.length > 0) {
      socialMediaData = data.map(item => ({
        ...item,
        icon: `/icons/${item.icon}.svg`,
        href: item.url || ''
      }))
    }
  } catch (error) {
    console.error('Error fetching social media data:', error)
  }

  return socialMediaData
}

const fetchFooterMenus = async () => {
  try {
    const { success, message, data } = await getPubMenus()

    if (!success) {
      throw new Error(message || 'Failed to fetch footer menus')
    }

    return data.filter(menu => menu.position === 'footer')
  } catch (error) {
    console.error('Error fetching footer menus:', error)
  }

  return []
}

const FooterSocialWrapper = async () => {
  const socialMediaData = await fetchSocialMedia()
  const footerMenus = await fetchFooterMenus()

  return <Footer initialSocialMedia={socialMediaData} footerMenus={footerMenus} />
}

export default FooterSocialWrapper
