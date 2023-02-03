import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { DocumentFileTypesEditAddPage } from '@hasty-bazar-admin/domains/Documents-file-types'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

const DocumentEdit = () => {
  const { query } = useRouter()
  return <DocumentFileTypesEditAddPage id={query.id?.[0]} />
}

export default DocumentEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)
  return { props: {}, redirect }
}
