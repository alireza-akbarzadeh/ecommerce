import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { DailySaleReportPage } from '@hasty-bazar-admin/domains/ReportDailySale/containers'
import { GetServerSideProps } from 'next'

const DailySaleReport = () => {
  return <DailySaleReportPage />
}

export default DailySaleReport

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
