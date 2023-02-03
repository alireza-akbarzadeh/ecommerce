import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { ProductReportPage } from '@hasty-bazar-admin/domains/Product-Report'
import { GetServerSideProps } from 'next'

const ProductReport = () => {
  return <ProductReportPage />
}

export default ProductReport

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
