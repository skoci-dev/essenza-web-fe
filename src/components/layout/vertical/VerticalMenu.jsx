// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import verticalMenuData from '@/data/navigation/verticalMenuData' // Pastikan ini sudah termasuk properti 'roles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { isBreakpointReached } = useVerticalNav()

  let role = null // Ubah dari '' menjadi null

  // Vars
  const { transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  if (typeof window !== 'undefined') {
    const userDataJSON = localStorage.getItem('dataUser')

    if (userDataJSON) {
      try {
        const userData = JSON.parse(userDataJSON)

        role = userData?.role?.name || null
      } catch (e) {
        console.error('Failed to parse userData from localStorage', e)
      }
    }
  }

  const filterMenuByRole = (menu, userRole) => {
    if (!menu || !userRole) return []

    const isAllowed = item => item.roles && item.roles.includes(userRole)

    const filteredMenu = menu
      .map(item => {
        if (!item.children) {
          return isAllowed(item) ? item : null
        }

        const filteredChildren = item.children.filter(child => isAllowed(child))

        if (filteredChildren.length > 0) {
          return { ...item, children: filteredChildren }
        } else if (isAllowed(item)) {
          return item
        }

        return null
      })
      .filter(Boolean)

    return filteredMenu
  }

  const filteredMenuData = role ? filterMenuByRole(verticalMenuData(), role) : []

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* Menggunakan data yang sudah difilter */}
        {filteredMenuData.map((menu, index) => {
          if (menu?.children?.length > 0) {
            return (
              <SubMenu key={index} label={menu.label} icon={<i className={menu.icon} />}>
                {/* Anak-anak sudah terfilter di filteredMenuData */}
                {menu.children.map((submenu, subindex) => (
                  <MenuItem key={subindex} index={subindex} href={submenu.href}>
                    {submenu.label}
                  </MenuItem>
                ))}
              </SubMenu>
            )
          } else {
            return (
              <MenuItem key={index} href={menu.href} icon={<i className={menu.icon} />}>
                {menu.label}
              </MenuItem>
            )
          }
        })}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
