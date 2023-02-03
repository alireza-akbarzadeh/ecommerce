import {
  ShippingProviderStateMachine,
  ShippingProviderType,
} from '@hasty-bazar/admin-shared/core/enums'
import { useGetAdminGeneralDataBusinessTypeValueGetAllQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  useGetAdminIdrCustomersQuery,
  useGetAdminIdrVendorsQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { useGetAdminSaleApiShippingProvidersQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'

const useDataItemsQuery = () => {
  const { data: { data: { items: vendors = [] } = {} } = {} } = useGetAdminIdrVendorsQuery({
    'client-name': '',
    'client-version': '',
    pageSize: 10000,
    stateCode: 1,
    filter: ' StateCode!=@StateCode',
  })
  const { data: { data: { items: customers = [] } = {} } = {} } = useGetAdminIdrCustomersQuery({
    'client-name': '',
    'client-version': '',
    pageSize: 10000,
    stateCode: 1,
    filter: ' StateCode!=@StateCode',
  })

  const { data: { data: { items: transactionTypes = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': '',
      'client-version': '',
      pageSize: 10000,
      filter: 'BusinessTypeId==1070',
    })

  const { data: { data: { items: providers = [] } = {} } = {} } =
    useGetAdminSaleApiShippingProvidersQuery({
      'client-name': '',
      'client-version': '',
      providerType: ShippingProviderType.ServiceProvider,
      providerShippingState: ShippingProviderStateMachine.Draft,
      filter: 'ProviderType==@ProviderType&&ProviderShippingState!=@ProviderShippingState',
      pageSize: 10000,
    })

  return {
    vendors,
    customers,
    providers,
    transactionTypes,
  }
}
export default useDataItemsQuery
