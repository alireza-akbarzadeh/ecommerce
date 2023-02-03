import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { ProductRulesPage } from '@hasty-bazar-admin/domains/Product-Rules'
import { GetServerSideProps } from 'next'

const ProductRules = () => {
  return <ProductRulesPage />
}

export default ProductRules

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
