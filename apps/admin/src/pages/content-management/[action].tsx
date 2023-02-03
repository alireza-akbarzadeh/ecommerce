import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { ContentManagementPage } from '@hasty-bazar-admin/domains/Content-Arrangement'
import { GetServerSideProps } from 'next'

const ProductGroup = () => {
  return <ContentManagementPage />
}

export default ProductGroup

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
