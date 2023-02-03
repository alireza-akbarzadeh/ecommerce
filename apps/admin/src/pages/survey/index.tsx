import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { GetServerSideProps } from 'next'
import { SurveyPage } from '@hasty-bazar-admin/domains/Survey'

const Survey = () => {
  return <SurveyPage />
}

export default Survey

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
