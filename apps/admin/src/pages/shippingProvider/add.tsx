import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import AddEditPage from '../../domains/ShippingProvider/AddEditPage'

const ShippingProviderAdd = () => {
  return <AddEditPage />
}

export default ShippingProviderAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
