import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import VoucherManageMentAddEdit from '../../domains/voucherManagement/containers/VoucherManageMentAddEdit'
const VoucherManagementAdd = () => {
  return <VoucherManageMentAddEdit />
}

export default VoucherManagementAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
