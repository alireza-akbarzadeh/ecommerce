import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { UserAddEditPage } from '@hasty-bazar-admin/domains'
import { GetServerSideProps } from 'next'

const UserAdd = () => {
  // const {} = useGetAdminIdrRoleQuery({ 'client-name': 'getRole', 'client-version': '0' })
  return <UserAddEditPage />
}

export default UserAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
