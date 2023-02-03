import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { CompaniesPage } from '@hasty-bazar-admin/domains/Companies'
import { GetServerSideProps } from 'next'

const Companies = () => {
  return <CompaniesPage />
}

export default Companies

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
