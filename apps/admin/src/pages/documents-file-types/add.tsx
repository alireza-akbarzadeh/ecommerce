import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { DocumentFileTypesEditAddPage } from '@hasty-bazar-admin/domains/Documents-file-types'
import { GetServerSideProps } from 'next'

const DocumentAdd = () => {
  return <DocumentFileTypesEditAddPage />
}

export default DocumentAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {}, redirect }
}
