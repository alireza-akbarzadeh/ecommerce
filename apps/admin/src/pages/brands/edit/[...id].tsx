import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { BrandsAddEditPage } from '@hasty-bazar-admin/domains'
import { GetServerSideProps } from 'next'

const BrandAdd = () => {
  return <BrandsAddEditPage />
}

export default BrandAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
