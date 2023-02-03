import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { PaymentMethodManagementPage } from '@hasty-bazar-admin/domains/PaymentMethodManagement'
import { GetServerSideProps } from 'next'
import React from 'react'

const PaymentMethodManagement = () => {
  return <PaymentMethodManagementPage />
}

export default PaymentMethodManagement

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirect } = await serverSideRequests(ctx)

  return { props: {}, redirect }
}
