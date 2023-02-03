import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import AddEditPage from '../../domains/VendorShippingAgreementsSetting/AddEditPage'

const VendorShippingAgreementAdd = () => {
  return <AddEditPage />
}

export default VendorShippingAgreementAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
