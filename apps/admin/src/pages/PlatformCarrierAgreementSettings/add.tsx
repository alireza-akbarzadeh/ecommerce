import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import AddEditPage from '../../domains/PlatformCarrierAgreementSettings/AddEditPage'

const PlatformShippingAgreementAdd = () => {
  return <AddEditPage />
}

export default PlatformShippingAgreementAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
