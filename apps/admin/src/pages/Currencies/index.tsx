import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import CurrenciesPage from '@hasty-bazar-admin/domains/Currencies'
import { GetServerSideProps } from 'next'

const Currencies = () => {
  return <CurrenciesPage />
}

export default Currencies

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
