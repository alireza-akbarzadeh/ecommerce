import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import SortOptionPage from '@hasty-bazar-admin/domains/Sort-Option/sort-option-page'
import { GetServerSideProps } from 'next'

const SortOption = () => {
  return <SortOptionPage />
}

export default SortOption

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
