import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { PreviewPage } from '@hasty-bazar-admin/domains/Products/preview'
import { GetServerSideProps } from 'next'

const ProductPreview = () => {
  return <PreviewPage />
}

ProductPreview.layout = ({ children }: any) => <>{children}</>
export default ProductPreview

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
