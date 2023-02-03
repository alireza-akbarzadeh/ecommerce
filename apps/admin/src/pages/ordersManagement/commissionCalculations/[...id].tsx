import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { CommissionCalculations } from '../../../domains/OrdersManagement/components/commissionCalculations'

const CommissionCalculation = () => {
  return <CommissionCalculations />
}

export default CommissionCalculation

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
