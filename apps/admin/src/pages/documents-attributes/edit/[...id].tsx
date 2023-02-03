import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { DocumentEditAddPage } from '@hasty-bazar-admin/domains/Documents-Attributes'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

const DocumentEdit = () => {
  const { query } = useRouter()
  return <DocumentEditAddPage id={query.id?.[0]} />
}

export default DocumentEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
