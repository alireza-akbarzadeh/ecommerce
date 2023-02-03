import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { TypeOfFinancialEventsPage } from '../../domains/TypeOfFinancialEvents'

const TypeOfFinancialEvents = () => {
  return <TypeOfFinancialEventsPage />
}

export default TypeOfFinancialEvents

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
