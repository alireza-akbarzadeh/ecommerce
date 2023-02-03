import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { ProcessPage } from '@hasty-bazar-admin/domains/Process'
import { GetServerSideProps } from 'next'
import React from 'react'

const Process = () => {
  return <ProcessPage />
}

export default Process

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {}, redirect }
}
