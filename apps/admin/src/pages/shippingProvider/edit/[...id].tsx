import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import AddEditPage from '../../../domains/ShippingProvider/AddEditPage'

const ShippingProviderEdit = () => {
  return <AddEditPage />
}

export default ShippingProviderEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
