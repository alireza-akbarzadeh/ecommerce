import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { AttributesAddEditPage } from '@hasty-bazar-admin/domains'
import { GetServerSideProps } from 'next'

const AttributeAdd = () => {
  return <AttributesAddEditPage />
}

export default AttributeAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
