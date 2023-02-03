import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { GetVendorStoreResultApiResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { useCallback, useState } from 'react'
import DeliveryDaysFilter from './delivery-days-filter'
import DeliveryDaysGrid from './delivery-days-grid'

const DeliveryDays = ({ vendorData }: { vendorData: GetVendorStoreResultApiResult }) => {
  const [actionUrl, setActionUrl] = useState<string | undefined>('')

  const { data: { data: { items: WeekDaysData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessTypeCode: BusinessTypeEnums.WeekDays,
      pageSize: 1000,
    })

  const { data: { data: { items: DayTypeData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessTypeCode: BusinessTypeEnums.DayType,
      pageSize: 1000,
    })

  const DeliveryDaysGridMemo = useCallback(
    () => <DeliveryDaysGrid actionUrl={actionUrl} vendorData={vendorData} />,
    [actionUrl],
  )

  return (
    <>
      <DeliveryDaysFilter
        changeFilter={(actionUrl) => setActionUrl(actionUrl)}
        WeekDaysData={WeekDaysData}
        DayTypeData={DayTypeData}
        vendorData={vendorData}
      />
      <DeliveryDaysGridMemo />
    </>
  )
}
export default DeliveryDays
