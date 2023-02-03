import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { ProcessPage } from '@hasty-bazar-admin/domains'
import { GetServerSideProps } from 'next'

const ProcessEdit = () => {
  return <ProcessPage />
}

export default ProcessEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {} }
}
