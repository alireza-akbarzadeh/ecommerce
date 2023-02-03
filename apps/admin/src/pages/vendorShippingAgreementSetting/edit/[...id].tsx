import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import AddEditPage from '../../../domains/VendorShippingAgreementsSetting/AddEditPage'

const VendorShippingAgreementEdit = () => {
  return <AddEditPage />
}

export default VendorShippingAgreementEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
