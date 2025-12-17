export const getActivityColor = action => {
  switch (action) {
    // Core CRUD operations
    case 'create':
      return 'success'
    case 'update':
      return 'warning'
    case 'delete':
      return 'error'
    case 'view':
    case 'no_change':
      return 'default'

    // Authentication actions
    case 'login':
      return 'info'
    case 'logout':
      return 'default'

    // File operations
    case 'upload':
    case 'import':
      return 'info'
    case 'download':
    case 'export':
      return 'primary'

    // Status changes
    case 'activate':
    case 'publish':
      return 'success'
    case 'deactivate':
    case 'unpublish':
      return 'warning'

    // Approval workflow
    case 'approve':
    case 'submit':
      return 'success'
    case 'reject':
      return 'error'

    // Communication
    case 'send':
      return 'info'
    case 'receive':
      return 'primary'

    // Other common actions
    case 'search':
    case 'filter':
      return 'default'

    default:
      return 'default'
  }
}
