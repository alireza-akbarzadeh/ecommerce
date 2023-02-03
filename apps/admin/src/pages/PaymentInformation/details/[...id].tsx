import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { PaymentInformationDetailsPage } from '@hasty-bazar-admin/domains/PaymentInformation/containers'
import { GetServerSideProps } from 'next'

const PaymentInformationDetails = () => {
  return <PaymentInformationDetailsPage />
}

export default PaymentInformationDetails

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {}, redirect }
}
