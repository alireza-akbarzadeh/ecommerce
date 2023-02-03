import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import CommissionAddEditPage from '../../domains/CommissionSetting/CommissionAddEditPage'

const CommissionAdd = () => {
  return <CommissionAddEditPage />
}

export default CommissionAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
