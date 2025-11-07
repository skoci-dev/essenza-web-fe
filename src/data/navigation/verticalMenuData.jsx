const verticalMenuData = () => [
  {
    label: 'Dashboard',
    href: '/esse-panel/dashboard',
    icon: 'ri-home-smile-line'
  },
  {
    label: 'Website Settings',
    icon: 'ri-settings-3-line',
    children: [
      { label: 'General Settings', href: '/esse-panel/settings' },
      { label: 'Social Media', href: '/esse-panel/social-media' },
      {
        label: 'Menus',
        children: [
          { label: 'Menus', href: '/esse-panel/menus' },
          { label: 'Menu Items', href: '/esse-panel/menu-items' }
        ]
      }
    ]
  },
  {
    label: 'Homepage',
    icon: 'ri-image-2-line',
    children: [
      { label: 'Banners', href: '/esse-panel/banners' },
      { label: 'Subscribers', href: '/esse-panel/subscribers' }
    ]
  },
  {
    label: 'Pages',
    icon: 'ri-file-text-line',
    children: [
      { label: 'All Pages', href: '/esse-panel/pages' },
      { label: 'Add New Page', href: '/esse-panel/pages/add' }
    ]
  },
  {
    label: 'Products',
    icon: 'ri-box-3-line',
    children: [
      { label: 'Product List', href: '/esse-panel/products' },
      { label: 'Add New Product', href: '/esse-panel/products/add' },
      { label: 'Brochures', href: '/esse-panel/brochures' }
    ]
  },
  {
    label: 'Projects',
    icon: 'ri-briefcase-line',
    children: [
      { label: 'Project List', href: '/esse-panel/projects' },
      { label: 'Add New Project', href: '/esse-panel/projects/add' }
    ]
  },
  {
    label: 'Articles / Blog',
    icon: 'ri-book-open-line',
    children: [
      { label: 'All Articles', href: '/esse-panel/articles' },
      { label: 'Add New Article', href: '/esse-panel/articles/add' }
    ]
  },
  {
    label: 'Distributors & Stores',
    icon: 'ri-map-pin-2-line',
    children: [
      { label: 'Distributors', href: '/esse-panel/distributors' },
      { label: 'Stores / Showrooms', href: '/esse-panel/stores' }
    ]
  },
  {
    label: 'Contact',
    icon: 'ri-inbox-line',
    children: [
      { label: 'Contact Messages', href: '/esse-panel/contact-messages' },
      { label: 'Contact Info', href: '/esse-panel/contact-infos' }
    ]
  },
  {
    label: 'Users & Roles',
    icon: 'ri-user-settings-line',
    children: [{ label: 'User Management', href: '/esse-panel/users' }]
  },
  {
    label: 'System Tools',
    icon: 'ri-tools-line',
    children: [
      { label: 'Backup Database', href: '/esse-panel/backup' },
      { label: 'Activity Logs', href: '/esse-panel/activity-logs' },
      {
        label: 'SEO Tools',
        children: [
          { label: 'Generate Sitemap', href: '/esse-panel/seo/sitemap' },
          { label: 'Redirect Manager', href: '/esse-panel/seo/redirects' }
        ]
      }
    ]
  }
]

export default verticalMenuData
