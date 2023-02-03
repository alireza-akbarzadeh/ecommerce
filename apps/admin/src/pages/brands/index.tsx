import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import React from 'react'
import { BrandPage } from '../../domains/Brands'

const Brand = () => {
  return <BrandPage />
}

export default Brand

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
