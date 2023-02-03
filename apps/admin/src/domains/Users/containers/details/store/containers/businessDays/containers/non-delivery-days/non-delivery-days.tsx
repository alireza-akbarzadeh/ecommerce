import { GetVendorStoreResultApiResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { useCallback, useState } from 'react'
import NonDeliveryDaysFilter from './non-delivery-days-filter'
import NonDeliveryDaysGrid from './non-delivery-days-grid'

const NonDeliveryDays = ({ vendorData }: { vendorData: GetVendorStoreResultApiResult }) => {
  const [actionUrl, setActionUrl] = useState<string | undefined>('')

  const NonDeliveryDaysGridMemo = useCallback(
    () => <NonDeliveryDaysGrid actionUrl={actionUrl} vendorData={vendorData} />,
    [actionUrl],
  )

  return (
    <>
      <NonDeliveryDaysFilter
        changeFilter={(actionUrl) => setActionUrl(actionUrl)}
        vendorData={vendorData}
      />
      <NonDeliveryDaysGridMemo />
    </>
  )
}
export default NonDeliveryDays
