import Login from '@views/Login'

import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = () => {
  const mode = getServerMode()

  return <Login mode={mode} />
}

export default LoginPage
