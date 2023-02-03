import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import React from 'react'
import { AttributesPage } from '../../domains/Attributes'

const Attributes = () => {
  return <AttributesPage />
}

export default Attributes

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
