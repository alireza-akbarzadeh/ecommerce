import StaticPageLayout from '@hasty-bazar-commerce/layout/StaticPageLayout/StaticPageLayout'
import { ContactUsInformation } from './components'
import { ContactUsFormContainer } from './containers'

const ContactUsPage = () => {
  return (
    <StaticPageLayout>
      <ContactUsInformation />
      <ContactUsFormContainer />
    </StaticPageLayout>
  )
}

export default ContactUsPage
