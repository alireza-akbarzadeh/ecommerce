import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { MessagesPage } from '@hasty-bazar-admin/domains/Messages'
import { GetServerSideProps } from 'next'

const Messages = () => {
  return <MessagesPage />
}

export default Messages

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
