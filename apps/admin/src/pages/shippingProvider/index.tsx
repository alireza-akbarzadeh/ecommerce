import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { ShippingProviderPage } from '../../domains/ShippingProvider'

const ShippingProvider = () => {
  return <ShippingProviderPage />
}

export default ShippingProvider

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
