import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { UserCategoriesAddEditPage } from '@hasty-bazar-admin/domains/UserSegmentation/containers'
import { GetServerSideProps } from 'next'

const UserCategoriesAdd = () => {
  return <UserCategoriesAddEditPage />
}

export default UserCategoriesAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
