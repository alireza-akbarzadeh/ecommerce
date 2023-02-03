import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { VoucherManageMentAdd } from '@hasty-bazar-admin/domains/voucherManagement/containers'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

const VoucherManagementEdit = () => {
  const { query } = useRouter()
  return <VoucherManageMentAdd id={query.id?.[0]} />
}

export default VoucherManagementEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
