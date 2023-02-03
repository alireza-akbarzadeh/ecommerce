import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { ProductFormPage } from '@hasty-bazar-admin/domains/Products'
import { StepsEnum } from '@hasty-bazar-admin/domains/Products/containers/productForm/simpleProduct'
import { GetServerSideProps } from 'next'

const ProductForm = () => {
  return <ProductFormPage step={StepsEnum.ProductDetails} />
}

export default ProductForm

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {}, redirect }
}
