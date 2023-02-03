import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { SurveyAddEditPage } from '@hasty-bazar-admin/domains/Survey'
import { GetServerSideProps } from 'next'

const SurveyAdd = () => {
  return <SurveyAddEditPage />
}

export default SurveyAdd

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
