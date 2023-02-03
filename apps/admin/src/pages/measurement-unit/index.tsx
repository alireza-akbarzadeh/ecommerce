import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { MeasurementUnitPage } from '@hasty-bazar-admin/domains/Measurement-unit'
import { GetServerSideProps } from 'next'

const MeasurementUnit = () => {
  return <MeasurementUnitPage />
}

export default MeasurementUnit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
