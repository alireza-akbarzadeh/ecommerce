import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { ConfigurableProductFormPage } from '@hasty-bazar-admin/domains/Products'
import { StepsEnum } from '@hasty-bazar-admin/domains/Products/containers/productForm/configurableProduct'
import { GetServerSideProps } from 'next'

const ProductForm = () => {
  return <ConfigurableProductFormPage step={StepsEnum.duplicationSettings} />
}

export default ProductForm

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {}, redirect }
}
