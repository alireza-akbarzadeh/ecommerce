import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import UserCategoriesPage from '@hasty-bazar-admin/domains/UserSegmentation/UserCategoriesPage'
import { GetServerSideProps } from 'next'

const UserCategories = () => {
  return <UserCategoriesPage />
}
export default UserCategories

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
