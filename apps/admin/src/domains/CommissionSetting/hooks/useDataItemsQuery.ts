import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  useGetAdminCatalogBrandsQuery,
  useGetAdminCatalogCategoriesQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
  useGetAdminGeneralDataSystemSettingQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'

const useDataItemsQuery = () => {
  const { data: commissionTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: BusinessTypeEnums.CommissionType,
    })
  const { data: systemSettingData } = useGetAdminGeneralDataSystemSettingQuery({
    'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
    'client-version': '1.0.1.100',
    pageNumber: 0,
    pageSize: 10000,
  })
  const { data: valueTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: BusinessTypeEnums.ValueType,
    })
  const { data: brandsData } = useGetAdminCatalogBrandsQuery({
    'client-name': '',
    'client-version': '',
    pageNumber: 0,
    pageSize: 10000,
    stateCode: 2,
    filter: ' StateCode==@StateCode&&IsActive==true',
  })
  const { data: categoriesData } = useGetAdminCatalogCategoriesQuery({
    'client-name': '',
    'client-version': '',
    pageNumber: 0,
    pageSize: 10000,
    stateCode: '2',
    filter: ' StateCode==@StateCode',
  })

  return {
    commissionType: commissionTypeData?.data?.items ?? [],
    valueType: valueTypeData?.data?.items ?? [],
    brands: brandsData?.data?.items ?? [],
    categories: categoriesData?.data?.items ?? [],
    systemSetting: systemSettingData?.data?.items ?? [],
  }
}
export default useDataItemsQuery
