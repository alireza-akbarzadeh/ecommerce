import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { ProductRulesAddEditPage } from '@hasty-bazar-admin/domains/Product-Rules'
import { GetServerSideProps } from 'next'

const ProductRulesAddEdit = () => {
  return <ProductRulesAddEditPage />
}

export default ProductRulesAddEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
