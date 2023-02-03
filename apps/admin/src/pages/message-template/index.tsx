import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { MessageTemplatePage } from '@hasty-bazar-admin/domains/Message-Template'
import { GetServerSideProps } from 'next'

const BasicSystemSetting = () => {
  return <MessageTemplatePage />
}

export default BasicSystemSetting

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
