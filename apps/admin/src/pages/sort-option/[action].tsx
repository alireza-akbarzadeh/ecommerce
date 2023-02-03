import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import SortOptionAddEditPage from '@hasty-bazar-admin/domains/Sort-Option/sort-option-add-edit-page'
import { GetServerSideProps } from 'next'

const SortOptionAddEdit = () => {
  return <SortOptionAddEditPage />
}

export default SortOptionAddEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
