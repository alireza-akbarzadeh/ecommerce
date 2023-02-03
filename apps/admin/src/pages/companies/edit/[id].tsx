import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { CompanyAddEditPage } from '@hasty-bazar-admin/domains/Companies'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

const CompanyEdit = () => {
  const { query } = useRouter()
  return <CompanyAddEditPage id={query.id as string} />
}

export default CompanyEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
