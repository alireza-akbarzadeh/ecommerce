import StaticPageLayout from '@hasty-bazar-commerce/layout/StaticPageLayout/StaticPageLayout'
import { Careers, Goals, IntroduceCompany, IntroduceUs } from './components'

const AboutUsPage = () => {
  return (
    <StaticPageLayout>
      <IntroduceCompany />
      <IntroduceUs />
      {/* <News /> */}
      <Goals />
      <Careers />
    </StaticPageLayout>
  )
}

export default AboutUsPage
