import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import TreeStructurePage from '@hasty-bazar-admin/domains/Mega-Menu/TreeStructurePage'
import { GetServerSideProps } from 'next'

const TreeStructure = () => {
  return <TreeStructurePage />
}

export default TreeStructure

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
