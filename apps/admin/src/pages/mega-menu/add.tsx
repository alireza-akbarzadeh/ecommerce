import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import MegaMenuAddEditPage from '@hasty-bazar-admin/domains/Mega-Menu/MegaMenuAddEditPage'
import { GetServerSideProps } from 'next'

const MegaMenuAddEdit = () => {
  return <MegaMenuAddEditPage />
}

export default MegaMenuAddEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
