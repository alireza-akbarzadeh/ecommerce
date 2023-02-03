import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { ProductsPage } from '@hasty-bazar-admin/domains/Products'
import { GetServerSideProps } from 'next'
import React from 'react'
const Products = () => {
  return <ProductsPage />
}

export default Products

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
