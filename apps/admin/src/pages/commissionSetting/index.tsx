import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { CommissionSettingPage } from '../../domains/CommissionSetting'

const CommissioSetting = () => {
  return <CommissionSettingPage />
}

export default CommissioSetting

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
