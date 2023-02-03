import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { CertificatesAddEditPage } from '@hasty-bazar-admin/domains/Certificates'
import { GetServerSideProps } from 'next'

const CertificatesAddEdit = () => {
  return <CertificatesAddEditPage />
}

export default CertificatesAddEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
