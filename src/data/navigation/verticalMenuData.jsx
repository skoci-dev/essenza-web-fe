const verticalMenuData = () => [
  {
    label: 'Dashboard',
    href: '/esse-panel/dashboard',
    icon: 'ri-home-smile-line',

    roles: ['superadmin', 'admin', 'editor']
  },
  {
    label: 'Website Settings',
    icon: 'ri-settings-3-line',
    roles: ['superadmin', 'admin'],
    children: [
      { label: 'General Settings', href: '/esse-panel/settings', roles: ['superadmin', 'admin'] },
      { label: 'Menus', href: '/esse-panel/menus', roles: ['superadmin', 'admin'] },
      { label: 'Social Media', href: '/esse-panel/social-media', roles: ['superadmin', 'admin'] }
    ]
  },
  {
    label: 'Homepage',
    icon: 'ri-image-2-line',
    roles: ['superadmin', 'admin'],
    children: [
      { label: 'Banners', href: '/esse-panel/banners', roles: ['superadmin', 'admin'] },
      { label: 'Subscribers', href: '/esse-panel/subscribers', roles: ['superadmin', 'admin'] }
    ]
  },
  {
    label: 'Pages',
    icon: 'ri-file-text-line',
    roles: ['superadmin', 'admin'],
    children: [
      { label: 'All Pages', href: '/esse-panel/pages', roles: ['superadmin', 'admin'] },
      { label: 'Add New Page', href: '/esse-panel/pages/add', roles: ['superadmin', 'admin'] }
    ]
  },
  {
    label: 'Products',
    icon: 'ri-box-3-line',
    roles: ['superadmin', 'admin', 'editor'],
    children: [
      { label: 'Product List', href: '/esse-panel/products', roles: ['superadmin', 'admin', 'editor'] },
      { label: 'Add New Product', href: '/esse-panel/products/add', roles: ['superadmin', 'admin', 'editor'] },
      { label: 'Brochures', href: '/esse-panel/brochures', roles: ['superadmin', 'admin', 'editor'] }
    ]
  },
  {
    label: 'Projects',
    icon: 'ri-briefcase-line',
    roles: ['superadmin', 'admin', 'editor'],
    children: [
      { label: 'Project List', href: '/esse-panel/projects', roles: ['superadmin', 'admin', 'editor'] },
      { label: 'Add New Project', href: '/esse-panel/projects/add', roles: ['superadmin', 'admin', 'editor'] }
    ]
  },
  {
    label: 'Articles / Blog',
    icon: 'ri-book-open-line',
    roles: ['superadmin', 'admin', 'editor'],
    children: [
      { label: 'All Articles', href: '/esse-panel/articles', roles: ['superadmin', 'admin', 'editor'] },
      { label: 'Add New Article', href: '/esse-panel/articles/add', roles: ['superadmin', 'admin', 'editor'] }
    ]
  },
  {
    label: 'Distributors & Stores',
    icon: 'ri-map-pin-2-line',
    roles: ['superadmin', 'admin', 'editor'],
    children: [
      { label: 'Distributors', href: '/esse-panel/distributors', roles: ['superadmin', 'admin', 'editor'] },
      { label: 'Stores / Showrooms', href: '/esse-panel/stores', roles: ['superadmin', 'admin', 'editor'] }
    ]
  },
  {
    label: 'Contact',
    icon: 'ri-inbox-line',
    roles: ['superadmin', 'admin'],
    children: [{ label: 'Contact Messages', href: '/esse-panel/contact-messages', roles: ['superadmin', 'admin'] }]
  },
  {
    label: 'Users & Roles',
    icon: 'ri-user-settings-line',
    roles: ['superadmin'],
    children: [{ label: 'User Management', href: '/esse-panel/users', roles: ['superadmin'] }]
  },
  {
    label: 'Activity Logs',
    icon: 'ri-history-line',
    href: '/esse-panel/activity-log',
    roles: ['superadmin']
  }
]

export default verticalMenuData
