import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import ReasonManagementPage from '@hasty-bazar-admin/domains/reasonManagement'
import { GetServerSideProps } from 'next'

const ReasonManagement = () => {
  return <ReasonManagementPage />
}
export default ReasonManagement

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
