import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { ProductBulkEditPage } from '@hasty-bazar-admin/domains/ProductBulkEdit'
import { GetServerSideProps } from 'next'

const ProductBulkEdit = () => {
  return <ProductBulkEditPage />
}

export default ProductBulkEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
