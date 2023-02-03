import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { CrmPage } from '@hasty-bazar-admin/domains/Crm'
import { GetServerSideProps } from 'next'

const Crm = () => {
  return <CrmPage />
}

export default Crm

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
