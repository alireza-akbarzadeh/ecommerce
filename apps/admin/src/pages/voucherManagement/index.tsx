import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { VoucherManagementPage } from '../../domains/voucherManagement'

const VoucherManagement = () => {
  return <VoucherManagementPage />
}

export default VoucherManagement

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
