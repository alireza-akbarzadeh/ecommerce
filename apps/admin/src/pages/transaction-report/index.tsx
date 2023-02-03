import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { TransactionReportPage } from '@hasty-bazar-admin/domains/transaction-report'
import { GetServerSideProps } from 'next'

const TransactionReport = () => {
  return <TransactionReportPage />
}

export default TransactionReport

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
