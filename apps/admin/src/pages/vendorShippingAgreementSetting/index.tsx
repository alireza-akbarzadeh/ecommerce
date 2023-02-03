import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { VendorShippingAgreementsPage } from '../../domains/VendorShippingAgreementsSetting'

const CommissioSetting = () => {
  return <VendorShippingAgreementsPage />
}

export default CommissioSetting

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
