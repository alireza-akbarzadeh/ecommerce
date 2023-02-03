import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import AddEditPage from '../../domains/OrdersManagement/AddEditPage'

const OrderManagementAdd = () => {
  return <AddEditPage />
}

export default OrderManagementAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
