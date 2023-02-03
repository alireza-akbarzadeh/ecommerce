import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { PlatformCarrierAgreementSettingsPage } from '../../domains/PlatformCarrierAgreementSettings'

const CommissioSetting = () => {
  return <PlatformCarrierAgreementSettingsPage />
}

export default CommissioSetting

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
