import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { IconsCategoriesPage } from '@hasty-bazar-admin/domains/IconsCategories'
import { GetServerSideProps } from 'next'

const IconsCategories = () => {
  return <IconsCategoriesPage />
}

export default IconsCategories

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
