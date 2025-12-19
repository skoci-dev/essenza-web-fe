import { getServerMode } from '@core/utils/serverHelpers'

import Header from './Header'
import { getPubMenus } from '@/services/menu'

const getHeaderMenus = async () => {
  try {
    const { success, message, data } = await getPubMenus()

    if (!success) {
      throw new Error(message || 'Failed to fetch header menus')
    }

    const menuData = data.filter(menu => menu.position === 'header')

    if (menuData.length > 0) {
      return menuData[0].items || []
    }
  } catch (error) {
    console.error('Error fetching header menus:', error)
  }

  return []
}

const HeaderWrapper = async () => {
  const mode = getServerMode()
  const headerMenus = await getHeaderMenus()

  return <Header mode={mode} headerMenus={headerMenus} />
}

export default HeaderWrapper
