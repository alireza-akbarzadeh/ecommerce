import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { WithdrawalRequestsPage } from '@hasty-bazar-admin/domains/WithdrawalRequests'
import { GetServerSideProps } from 'next'

const WithdrawalRequests = () => {
  return <WithdrawalRequestsPage />
}

export default WithdrawalRequests

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
