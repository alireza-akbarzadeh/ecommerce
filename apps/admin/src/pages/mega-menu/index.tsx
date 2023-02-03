import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { MegaMenuPage } from '@hasty-bazar-admin/domains/Mega-Menu'
import { GetServerSideProps } from 'next'

const MegaMenu = () => {
  return <MegaMenuPage />
}
export default MegaMenu

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
