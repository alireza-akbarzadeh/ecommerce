import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { TypesFeatureCategoriesPage } from '../../domains/TypesFeatureCategories'

const TypesFeatureCategories = () => {
  return <TypesFeatureCategoriesPage />
}

export default TypesFeatureCategories

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
