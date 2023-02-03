import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { ProviderType } from '@hasty-bazar/admin-shared/core/enums/ShippingOrderType'
import { useGetAdminCatalogProductsQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueGetAllQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useGetAdminSaleApiShippingProvidersQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { useGetWorkflowStateMachineByStateMachineIdStateQuery } from '@hasty-bazar/admin-shared/services/workflowApi.generated'

const useDataItemsQuery = () => {
  const { data: businessTypeValueData } = useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
    'client-name': '',
    'client-version': '',
    pageNumber: 0,
    pageSize: 10000,
    businessTypeId: BusinessTypeEnums.DateFilterTypeCode.toString(),
  })

  const { data: shippingStatusTypeData } = useGetWorkflowStateMachineByStateMachineIdStateQuery({
    'client-name': '',
    'client-version': '',
    stateMachineId: '1046371922717179904',
  })

  const { data: agentData } = useGetAdminSaleApiShippingProvidersQuery({
    'client-name': '',
    'client-version': '',
    providerType: ProviderType.Agent,
    filter: ' ProviderType==@ProviderType',
  })

  const { data: carrierData } = useGetAdminSaleApiShippingProvidersQuery({
    'client-name': '',
    'client-version': '',
    providerType: ProviderType.Carrier,
    filter: ' ProviderType==@ProviderType',
  })

  return {
    agents: agentData?.data?.items ?? [],
    carriers: carrierData?.data?.items ?? [],
    businessTypeValue: businessTypeValueData?.data?.items ?? [],
    shippingStatusType: shippingStatusTypeData?.data?.items ?? [],
  }
}

export default useDataItemsQuery
