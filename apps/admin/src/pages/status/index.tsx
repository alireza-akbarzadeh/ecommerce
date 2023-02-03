import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { StatusPage } from '@hasty-bazar-admin/domains/Status'
import { GetServerSideProps } from 'next'

const Status = () => {
  return <StatusPage />
}

export default Status

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
