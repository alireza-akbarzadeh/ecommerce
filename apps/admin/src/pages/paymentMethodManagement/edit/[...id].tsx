import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { PaymentMethodManagementPage } from '@hasty-bazar-admin/domains/PaymentMethodManagement'
import { GetServerSideProps } from 'next'

const PaymentMethodManagementEdit = () => {
  return <PaymentMethodManagementPage />
}

export default PaymentMethodManagementEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {}, redirect }
}
