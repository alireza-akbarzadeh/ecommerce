import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { ReasonManagementAddEdit } from '@hasty-bazar-admin/domains/reasonManagement/containers'
import { GetServerSideProps } from 'next'

const ReasonManagementEdit = () => {
  return <ReasonManagementAddEdit />
}

export default ReasonManagementEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
