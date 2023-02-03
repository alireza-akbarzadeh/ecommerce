import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { ProductGroupPage } from '../../domains/Product-Group'

const ProductGroup = () => {
  return <ProductGroupPage />
}

export default ProductGroup

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
