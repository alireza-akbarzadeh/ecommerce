import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { OrdersManagementPage } from '../../domains/OrdersManagement'

const OrdersManagement = () => {
  return <OrdersManagementPage breadCrumpType="order" />
}

export default OrdersManagement

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
