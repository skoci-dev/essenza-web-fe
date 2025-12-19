// Component Imports
import HeaderWrapper from './HeaderWrapper'
import FooterSocialWrapper from './FooterSocialWrapper'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

const FrontLayout = ({ children }) => {
  return (
    <div className={frontLayoutClasses.root}>
      <HeaderWrapper />
      {children}
      <FooterSocialWrapper />
    </div>
  )
}

export default FrontLayout
