import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import AddEditPage from '../../../domains/OrdersManagement/AddEditPage'

const OrderManagementEdit = () => {
  return <AddEditPage />
}

export default OrderManagementEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
