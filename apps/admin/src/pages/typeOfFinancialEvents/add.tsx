import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import AddEditPage from '../../domains/TypeOfFinancialEvents/containers/AddEditPage'

const TypeOfFinancialEventsAdd = () => {
  return <AddEditPage />
}

export default TypeOfFinancialEventsAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
