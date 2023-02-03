import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { CollectionAddEditPage } from '@hasty-bazar-admin/domains'
import { GetServerSideProps } from 'next'

const CollectionAdd = () => {
  return <CollectionAddEditPage />
}

export default CollectionAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {} }
}
