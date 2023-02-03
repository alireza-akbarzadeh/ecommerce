import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { CommentPage } from '@hasty-bazar-admin/domains/CommentReview'
import { GetServerSideProps } from 'next'

const Comment = () => {
  return <CommentPage />
}

export default Comment

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
