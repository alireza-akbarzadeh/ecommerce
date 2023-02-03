import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { TaxesTypePage } from '@hasty-bazar-admin/domains/Taxes'
import { GetServerSideProps } from 'next'

const Taxes = () => {
  return <TaxesTypePage />
}

export default Taxes

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
