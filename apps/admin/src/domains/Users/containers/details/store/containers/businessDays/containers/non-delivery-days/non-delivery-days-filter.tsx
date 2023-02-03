import {
  GetHolidayDatesQueryResult,
  GetVendorStoreResultApiResult,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { pascalCase } from '@hasty-bazar/admin-shared/utils/util'
import { HBButton, HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import businessDaysMessages from '../../businessDays.messages'
import NonDeliveryDaysFilterItems from './non-delivery-days-filter-items'

type NonDeliveryDaysFilterProps = {
  changeFilter: (actionUrl?: string) => void
  vendorData: GetVendorStoreResultApiResult
}
interface HolidayDatesType extends GetHolidayDatesQueryResult {
  fromDate?: string | null
  toDate?: string | null
}
const NonDeliveryDaysFilter = (props: NonDeliveryDaysFilterProps) => {
  const { changeFilter, vendorData } = props
  const { formatMessage } = useIntl()
  const formProviderProps = useForm<HolidayDatesType>({
    mode: 'all',
    defaultValues: {
      fromDate: null,
      toDate: null,
    },
  })

  const handleSubmit = (values: HolidayDatesType) => {
    if (vendorData?.data?.id) {
      let filter = '&'
      Object.keys(values).forEach((key) => {
        if (key.includes('Date')) {
          //@ts-ignore
          const value = values[key]
          if (value) {
            filter += `${pascalCase(key)}=${new Date(value)?.toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}&`
          }
        }
      })
      filter = filter.slice(0, -1)
      const actionUrl =
        process.env.NEXT_PUBLIC_GATEWAY +
        `/Admin/IDR/vendors/${vendorData?.data?.id}/holidayDate` +
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
    <HBForm formProviderProps={formProviderProps} onSubmit={handleSubmit}>
      <NonDeliveryDaysFilterItems />
      <Box mt={6} display="flex" justifyContent="right" gap={1}>
        <HBButton sx={{ display: 'flex' }} type="submit">
          {formatMessage(businessDaysMessages.submitFilter)}
        </HBButton>
      </Box>
    </HBForm>
  )
}

export default NonDeliveryDaysFilter
