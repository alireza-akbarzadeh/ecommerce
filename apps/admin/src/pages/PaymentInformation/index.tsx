import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { PaymentInformationPage } from '@hasty-bazar-admin/domains/PaymentInformation/containers'
import { GetServerSideProps } from 'next'

const PaymentInformation = () => {
  return <PaymentInformationPage />
}

export default PaymentInformation

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {}, redirect }
}
