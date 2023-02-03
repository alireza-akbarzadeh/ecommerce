import { ProviderType } from '@hasty-bazar/admin-shared/core/enums'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetCustomersLookupQueryResult,
  useGetAdminIdrCustomersQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { useGetAdminSaleApiShippingProvidersQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { useGetWorkflowStateMachineByStateMachineIdStateQuery } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { IShipmentState } from '../../enums'
import ShipmentManagementMessage from '../../messages'
const useShipmentFilterFiled = () => {
  const [searchText, setSearchText] = useState<string>()
  const [page, setPage] = useState<number>(1)
  const [partiesData, setPartiesData] = useState<GetCustomersLookupQueryResult[]>([])

  const { formatMessage } = useIntl()

  const { data: { data: { items: agents = [] } = {} } = {} } = useGetAdminIdrCustomersQuery({
    'client-name': '',
    'client-version': '',
    pageSize: 10000,
    firstName: searchText,
    lastName: searchText,
    filter: '(FirstName.Contains(@FirstName) || LastName.Contains(@LastName))',
  })

  useEffect(() => {
    agents && setPartiesData((prev) => [...prev, ...agents!])
  }, [agents])
  const agentColumn = [
    {
      field: 'fullName',
      width: 160,
      headerName: formatMessage(ShipmentManagementMessage.buyer),
      showInChip: true,
    },
    { field: 'id', width: 100, headerName: 'id', hidden: true, isIdField: true },
  ]

  const { data: { data: { items: filterDateTypeApi = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: IShipmentState.filterDateType,
    })

  const { data: { data: { items: ShipmentStatusApi = [] } = {} } = {} } =
    useGetWorkflowStateMachineByStateMachineIdStateQuery({
      'client-name': '',
      'client-version': '',
      stateMachineId: String(IShipmentState.code),
    })

  const { data: { data: { items: providerIdApi = [] } = {} } = {} } =
    useGetAdminSaleApiShippingProvidersQuery({
      'client-name': '',
      'client-version': '',
      providerType: ProviderType.Agent,
      filter: ' ProviderType==@ProviderType',
      pageSize: 10000,
    })
  const { data: { data: { items: shipmentOrderApi = [] } = {} } = {} } =
    useGetAdminSaleApiShippingProvidersQuery({
      'client-name': '',
      'client-version': '',
      providerType: ProviderType.Carrier,
      filter: ' ProviderType==@ProviderType',
      pageSize: 10000,
    })
  return {
    agentColumn,
    agents,
    formatMessage,
    ShipmentStatusApi,
    filterDateTypeApi,
    providerIdApi,
    shipmentOrderApi,
    setPartiesData,
    page,
    setSearchText,
    setPage,
    partiesData,
  }
}

export default useShipmentFilterFiled
