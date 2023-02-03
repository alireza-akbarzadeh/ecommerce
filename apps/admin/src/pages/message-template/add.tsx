import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import MessageTemplateAddEditPage from '@hasty-bazar-admin/domains/Message-Template/MessageTemplateAddEditPage'
import { GetServerSideProps } from 'next'

const MessageTemplateAdd = () => {
  return <MessageTemplateAddEditPage />
}

export default MessageTemplateAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
