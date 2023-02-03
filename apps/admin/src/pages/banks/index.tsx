import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { BanksPage } from '@hasty-bazar-admin/domains/Banks'
import { GetServerSideProps } from 'next'

const Banks = () => {
  return <BanksPage />
}

export default Banks

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
