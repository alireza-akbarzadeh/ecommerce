import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { BusinessTypeEnums, StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import {
  GetUnitOfMeasurementsQueryResultApiResult,
  useGetAdminCatalogApiUnitOfMeasurementGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminCatalogApiUnitOfMeasurementGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminCatalogApiUnitOfMeasurementChangeStateMutation as useChangeState,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { MeasurementUnitPageType } from '../measurement-unit'
import measurementUnitMessages from '../measurement-unitMessages.messages'
import MeasurementUnitAddEditFormItems from './form-items'

type MeasurementUnitFormType = {
  measurementUnit: GetUnitOfMeasurementsQueryResultApiResult
  getMeasurementUnit: () => void
}

const MeasurementUnitForm = (props: MeasurementUnitFormType) => {
  const { measurementUnit, getMeasurementUnit } = props
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router?.query?.id?.[0]
  const { getValues, reset } = useFormContext<MeasurementUnitPageType>()

  const { data: { data: { items: businessTypeData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessTypeCode: BusinessTypeEnums.MeasuringUnitType,
      pageSize: 1000,
    })

  useEffect(() => {
    if (!isEmpty(measurementUnit)) {
      const data =
        businessTypeData?.map((item) => ({
          title: String(item.title),
          value: item.id || 0,
        })) || []
      reset({
        ...measurementUnit.data,
        isBaseUnit: !!measurementUnit.data?.isBaseUnit,
        conversionFactor: measurementUnit.data?.conversionFactor || undefined,
        displaySort: measurementUnit.data?.displaySort || undefined,
        measuringUnitType:
          data?.find((item) => item.value == measurementUnit.data?.measuringUnitType) || [],
      })
    }
  }, [measurementUnit, businessTypeData])

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography color={'GrayText'}>
          {formatMessage(measurementUnitMessages.interInformationPlease)}
        </Typography>
        <HBWorkflow
          entityId={id!}
          machineCode={StateMachineCode.MeasuringUnit}
          useGetStateList={useGetStateList}
          useGetState={useGetStateInfo}
          useChangeState={useChangeState}
          stateCode={getValues('stateCode') || '1'}
          onChangeState={getMeasurementUnit}
          factor={'1'}
        />
      </Box>
      <MeasurementUnitAddEditFormItems measuringUnitTypeData={businessTypeData} />
    </>
  )
}
export default MeasurementUnitForm
