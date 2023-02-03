import { BusinessType } from '@hasty-bazar/admin-shared/core/enums'
import { useGetAdminCatalogCategoriesQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueGetAllQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useGetAdminIdrVendorsQuery } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { useGetAdminLocalityGeosQuery } from '@hasty-bazar/admin-shared/services/localityApi.generated'

const useDataItemsQuery = () => {
  const { data: { data: { items: vendors = [] } = {} } = {} } = useGetAdminIdrVendorsQuery({
    'client-name': '',
    'client-version': '',
    pageNumber: 0,
    pageSize: 10000,
    stateCode: 3,
    filter: ' StateCode==@StateCode',
  })
  const { data: { data: { items: shippingProviderType = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': '',
      'client-version': '',
      businessTypeId: BusinessType.ShippingProviderType,
      pageNumber: 0,
      pageSize: 10000,
    })
  const { data: { data: { items: selectionLimitationType = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': '',
      'client-version': '',
      businessTypeId: BusinessType.SelectionLimitationType,
      pageNumber: 0,
      pageSize: 10000,
    })
  const { data: { data: { items: shippingProviderPriority = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': '',
      'client-version': '',
      businessTypeId: BusinessType.ShippingProviderPriority,
      pageNumber: 0,
      pageSize: 10000,
    })
  const { data: { data: { items: productCollectionType = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': '',
      'client-version': '',
      businessTypeId: BusinessType.ProductCollectionType,
      pageNumber: 0,
      pageSize: 10000,
    })
  const { data: { data: { items: shippingCostInquiryType = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': '',
      'client-version': '',
      businessTypeId: BusinessType.ShippingCostInquiryType,
      pageNumber: 0,
      pageSize: 10000,
    })
  const { data: { data: { items: checkoutPeriodType = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': '',
      'client-version': '',
      businessTypeId: BusinessType.CheckoutPeriodType,
      pageNumber: 0,
      pageSize: 10000,
    })
  const { data: { data: { items: categories = [] } = {} } = {} } =
    useGetAdminCatalogCategoriesQuery({
      'client-name': '',
      'client-version': '',
      pageNumber: 0,
      pageSize: 10000,
      stateCode: '2',
      filter: ' StateCode==@StateCode',
    })
  const { data: { data: { items: geo = [] } = {} } = {} } = useGetAdminLocalityGeosQuery({
    'client-name': 'Swagger on HIT.Hastim.Locality.Endpoints.WebApi',
    'client-version': '1.0.1.101',
    pageSize: 1000,
    geoTypeValueCode: '3',
    filter: 'GeoTypeValueCode==@GeoTypeValueCode',
  })

  return {
    vendors,
    categories,
    geo,
    shippingProviderType,
    selectionLimitationType,
    shippingProviderPriority,
    productCollectionType,
    shippingCostInquiryType,
    checkoutPeriodType,
  }
}
export default useDataItemsQuery
