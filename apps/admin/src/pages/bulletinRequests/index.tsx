import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { BulletinRequestsPage } from '@hasty-bazar-admin/domains/BulletinRequests'
import { GetServerSideProps } from 'next'

const BulletinRequests = () => {
  return <BulletinRequestsPage />
}

export default BulletinRequests

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
