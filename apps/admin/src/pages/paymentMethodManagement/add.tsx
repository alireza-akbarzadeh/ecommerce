import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { PaymentMethodManagementPage } from '@hasty-bazar-admin/domains/PaymentMethodManagement'
import { GetServerSideProps } from 'next'

const PaymentMethodManagementAdd = () => {
  return <PaymentMethodManagementPage />
}

export default PaymentMethodManagementAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {}, redirect }
}
