import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import CommissionAddEditPage from '@hasty-bazar-admin/domains/CommissionSetting/CommissionAddEditPage'
import { GetServerSideProps } from 'next'
const Edit = () => {
  return <CommissionAddEditPage />
}

export default Edit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
