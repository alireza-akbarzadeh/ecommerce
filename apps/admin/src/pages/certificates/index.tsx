import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { CertificatesPage } from '@hasty-bazar-admin/domains/Certificates'
import { GetServerSideProps } from 'next'

const Certificates = () => {
  return <CertificatesPage />
}
export default Certificates

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
