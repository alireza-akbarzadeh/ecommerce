import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { BasicSystemSettingPage } from '../../domains/basic-system-setting'

const BasicSystemSetting = () => {
  return <BasicSystemSettingPage />
}

export default BasicSystemSetting

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
