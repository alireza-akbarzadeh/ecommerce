import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { FinancialTransactionPage } from '../../domains/FinancialTransaction'

const FinancialTransaction = () => {
  return <FinancialTransactionPage />
}

export default FinancialTransaction

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
