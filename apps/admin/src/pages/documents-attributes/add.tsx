import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { DocumentEditAddPage } from '@hasty-bazar-admin/domains/Documents-Attributes'
import { GetServerSideProps } from 'next'

const DocumentAdd = () => {
  return <DocumentEditAddPage />
}

export default DocumentAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
