import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import ShipmentManagementPage from '@hasty-bazar-admin/domains/ShipmentManagement'
import { GetServerSideProps } from 'next'

const ShipmentManagement = () => {
  return <ShipmentManagementPage />
}

export default ShipmentManagement

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
