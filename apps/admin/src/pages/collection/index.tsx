import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import React from 'react'
import { CollectionPage } from '../../domains/Collection'

const Collection = () => {
  return <CollectionPage />
}

export default Collection

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {}, redirect }
}
