import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import FaqPage from '@hasty-bazar-admin/domains/Faq/FaqPage'
import { GetServerSideProps } from 'next'

const Faq = () => {
  return <FaqPage />
}

export default Faq

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
