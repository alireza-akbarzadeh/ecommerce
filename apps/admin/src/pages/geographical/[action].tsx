import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { Geographical } from '@hasty-bazar-admin/domains/Geographical'
import { GetServerSideProps } from 'next'

const GeoGraphicalPage = () => {
  return <Geographical />
}

export default GeoGraphicalPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
