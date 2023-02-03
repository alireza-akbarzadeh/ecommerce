import { StaticPageLayout } from '@hasty-bazar-commerce/layout/StaticPageLayout'
import { AbsorptionProcess, WorkConditions } from './components'

const CareersPage = () => {
  return (
    <StaticPageLayout>
      <WorkConditions />
      <AbsorptionProcess />
      {/* <CareersSearch /> */}
      {/* <JobList /> */}
    </StaticPageLayout>
  )
}

export default CareersPage
