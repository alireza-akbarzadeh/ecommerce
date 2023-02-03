import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import React from 'react'
import { DocumentsAttributesPage } from '../../domains/Documents-Attributes'

const Documents = () => {
  return <DocumentsAttributesPage />
}

export default Documents

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
