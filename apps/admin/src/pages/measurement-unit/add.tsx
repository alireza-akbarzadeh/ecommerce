import { serverSideRequests } from '@hasty-bazar-admin/core/utils'
import { MeasurementUnitAddEditPage } from '@hasty-bazar-admin/domains/Measurement-unit'
import { GetServerSideProps } from 'next'

const MeasurementUnitAddEdit = () => {
  return <MeasurementUnitAddEditPage />
}

export default MeasurementUnitAddEdit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}
