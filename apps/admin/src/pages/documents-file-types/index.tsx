import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import React from 'react'
import { DocumentsFileTypesPage } from '../../domains/Documents-file-types'

const Documents = () => {
  return <DocumentsFileTypesPage />
}

export default Documents

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {}, redirect }
}
