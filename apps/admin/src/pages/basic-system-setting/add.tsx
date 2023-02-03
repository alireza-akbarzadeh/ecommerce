import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { AddEditPage } from '../../domains/basic-system-setting'

const BasicSystemSettingsAdd = () => {
  return <AddEditPage />
}

export default BasicSystemSettingsAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
