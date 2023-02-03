import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { FinancialDetails } from '@hasty-bazar-admin/domains/FinancialTransaction/containers'
import { GetServerSideProps } from 'next'

const FinancialTransactionDetails = () => {
  return <FinancialDetails />
}

export default FinancialTransactionDetails

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)
  return { props: {}, redirect }
}
