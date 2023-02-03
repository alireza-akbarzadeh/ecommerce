import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import AddEditPage from '../../../domains/PlatformCarrierAgreementSettings/AddEditPage'

const PlatformShippingAgreementEdit = () => {
  return <AddEditPage />
}

export default PlatformShippingAgreementEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
