import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { CargoInformation } from '@hasty-bazar-admin/domains/ShipmentManagement/containers'
import { GetServerSideProps } from 'next'

const ShipmentDetails = () => {
  return <CargoInformation />
}

export default ShipmentDetails

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
