import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import AddEditPage from '@hasty-bazar-admin/domains/OrdersManagement/AddEditPage'
import { GetServerSideProps } from 'next'

const OrderDetails = () => {
  return <AddEditPage />
}

export default OrderDetails

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
