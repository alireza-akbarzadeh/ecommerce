import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { EnumsPage } from '@hasty-bazar-admin/domains/Enums'
import { GetServerSideProps } from 'next'

const Enums = () => {
  return <EnumsPage />
}

export default Enums

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
