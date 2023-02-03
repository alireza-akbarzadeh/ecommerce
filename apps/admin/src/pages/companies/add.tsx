import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { CompanyAddEditPage } from '@hasty-bazar-admin/domains/Companies'
import { GetServerSideProps } from 'next'

const CompanyAdd = () => {
  return <CompanyAddEditPage />
}

export default CompanyAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
