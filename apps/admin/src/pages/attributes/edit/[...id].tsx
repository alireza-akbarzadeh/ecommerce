import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { AttributesAddEditPage } from '@hasty-bazar-admin/domains'
import { GetServerSideProps } from 'next'

const AttributeEdit = () => {
  return <AttributesAddEditPage />
}

export default AttributeEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
