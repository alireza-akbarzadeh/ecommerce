import { CommissionType } from '@hasty-bazar/admin-shared/core/enums'
import { useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { SelectDataType } from '../ProductFurtherDetails'

function useCommissionControls() {
  const {
    data: { data: { items: businessTypeCodeData = [] } = {} } = {},
    refetch: businessTypeCodeDataRefetch,
  } = useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    pageSize: 1000,
    pageNumber: 1,
  })

  const refetchAll = () => {
    businessTypeCodeDataRefetch()
  }

  const getEnumItems = (enumType: CommissionType): SelectDataType[] => {
    return (
      businessTypeCodeData
        ?.filter((item) => item.businessTypeCode === enumType)
        ?.map((i) => {
          return { title: i.title!, value: i.id! }
        }) || []
    )
  }

  return {
    refetchAll,
    getEnumItems,
  }
}
export default useCommissionControls
