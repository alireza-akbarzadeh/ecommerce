import { ProviderType } from '@hasty-bazar/admin-shared/core/enums'
import { useGetAdminCatalogCategoriesQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminIdrVendorsQuery } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { useGetAdminSaleApiShippingProvidersQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'

const useDataItemsQuery = () => {
  const { data: { data: { items: vendors = [] } = {} } = {} } = useGetAdminIdrVendorsQuery({
    'client-name': '',
    'client-version': '',
    pageSize: 10000,
    stateCode: 3,
    filter: ' StateCode==@StateCode',
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
  const { data: agentData } = useGetAdminSaleApiShippingProvidersQuery({
    'client-name': '',
    'client-version': '',
    providerType: ProviderType.Agent,
    filter: ' ProviderType==@ProviderType',
    pageSize: 10000,
  })
  const { data: carrierData } = useGetAdminSaleApiShippingProvidersQuery({
    'client-name': '',
    'client-version': '',
    providerType: ProviderType.Carrier,
    filter: ' ProviderType==@ProviderType',
    pageSize: 10000,
  })
  return {
    vendors,
    categories,
    agents: agentData?.data?.items ?? [],
    carriers: carrierData?.data?.items ?? [],
  }
}
export default useDataItemsQuery
