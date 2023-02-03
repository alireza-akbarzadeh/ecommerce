import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetVendorStoreResultApiResult,
  GetWorkingDaysQueryResult,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { pascalCase } from '@hasty-bazar/admin-shared/utils/util'
import { HBButton, HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import businessDaysMessages from '../../businessDays.messages'
import DeliveryDaysFilterItems from './delivery-days-filter-items'

export const stableDate = '2022-11-23'

type DeliveryDaysFilterProps = {
  changeFilter: (actionUrl?: string) => void
  DayTypeData: GetBusinessTypeValuesQueryResult[] | null
  WeekDaysData: GetBusinessTypeValuesQueryResult[] | null
  vendorData: GetVendorStoreResultApiResult
}

export type WorkingDayType = Omit<GetWorkingDaysQueryResult, 'dayType' | 'weekDays'> & {
  dayType?: any
  weekDays?: any
}

const DeliveryDaysFilter = (props: DeliveryDaysFilterProps) => {
  const { changeFilter, WeekDaysData, DayTypeData, vendorData } = props
  const { formatMessage } = useIntl()
  const formProviderProps = useForm<WorkingDayType>({
    mode: 'all',
    defaultValues: {
      deliveryFromHours: null,
      deliveryToHours: null,
      isActive: true,
    },
  })

  const handleSubmit = (values: WorkingDayType) => {
    if (vendorData?.data?.id) {
      let filter = ''
      Object.keys(values).forEach((key) => {
        if (key === 'dayType') {
          if (values[key]?.fullCode) {
            filter += `${pascalCase(key)}_Equal_--${pascalCase(key)} And `
          }
        }
      })

      filter = filter.slice(0, -4).trim() + '&'
      Object.keys(values).forEach((key) => {
        if (key === 'dayType') {
          const value = values[key]?.fullCode
          if (value) {
            filter += `${pascalCase(key)}=${value}&`
          }
        } else if (key === 'weekDays') {
          if (values[key]?.length) {
            const a = values[key].map((item: any) => item.fullCode)
            filter += `${pascalCase(key)}=${a.join(',')}&`
          }
        } else if (key.includes('Hour')) {
          //@ts-ignore
          const value = values[key]
          if (value instanceof Date && !isNaN(value.valueOf())) {
            filter += `${pascalCase(key)}=${
              new Date(`2022-11-23 ${value.getHours()}:${value.getMinutes()}`)
                .toISOString()
                .split('.')[0]
            }&`
          }
        }
      })
      filter = filter.slice(0, -1)
      const actionUrl =
        process.env.NEXT_PUBLIC_GATEWAY +
        `/Admin/IDR/vendors/${vendorData?.data?.id}/workingDays` +
        (filter?.length
          ? `?Filter=${filter}&ver=${new Date().getTime()}`
          : `?ver=${new Date().getTime()}`)
      changeFilter(actionUrl)
    }
  }

  useEffect(() => {
    handleSubmit(formProviderProps.control._defaultValues)
  }, [vendorData?.data?.id])

  return (
    <HBForm<WorkingDayType> formProviderProps={formProviderProps} onSubmit={handleSubmit}>
      <DeliveryDaysFilterItems WeekDaysData={WeekDaysData} DayTypeData={DayTypeData} />
      <Box mt={6} display="flex" justifyContent="right" gap={1}>
        <HBButton sx={{ display: 'flex' }} type="submit">
          {formatMessage(businessDaysMessages.submitFilter)}
        </HBButton>
      </Box>
    </HBForm>
  )
}

export default DeliveryDaysFilter
