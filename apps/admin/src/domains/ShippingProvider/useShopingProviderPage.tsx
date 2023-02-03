import HBLink from '@hasty-bazar/admin-shared/components/HBLink'
import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminSaleApiShippingProvidersGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Avatar } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  ColGroupDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import GridAction from './components/GridAction'
import ShippingProviderMessages from './shippingProvider.message'
import { SelectRowModel } from './types'

const useShopingProviderPage = (
  gridRef: RefObject<HBDataGridClientRef>,
  selectedRows: SelectRowModel[],
  onDelete: (show: boolean, id: number) => void,
  setRulIdAndShowItsModal: (ruleId: string, show: boolean) => void,
) => {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/api/ShippingProviders`
  const { formatMessage } = useIntl()
  const router = useRouter()
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const shippingProviderEdit = (id?: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/shippingProvider/edit/${id}`)
  }

  const onEdit = (id: string | number) => {
    shippingProviderEdit(id)
  }

  const columnDefs = useMemo(
    () =>
      [
        {
          field: '_actions',
          headerName: '',
          maxWidth: 110,
          minWidth: 110,
          resizable: false,
          sortable: false,
          filter: false,
          suppressAutoSize: true,
          suppressMenu: true,
          checkboxSelection,
          headerCheckboxSelection,
          showRowGroup: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {
            suppressCount: true,
            suppressDoubleClickExpand: true,
            innerRenderer: (params: ICellRendererParams) => (
              <GridAction {...params} {...{ onEdit, onDelete, gridRef }} />
            ),
          },
        },
        {
          field: 'id',
          headerName: formatMessage(phrasesMessages.id),
          hide: true,
          filter: 'agTextColumnFilter',
        },
        {
          field: 'providerShippingStateTitle',
          headerName: formatMessage(ShippingProviderMessages.currentState),
          minWidth: 150,
          filter: 'agTextColumnFilter',
          cellRenderer: ({ data }: ICellRendererParams) =>
            data?.providerShippingState && (
              <HBWorkflowState
                machineCode={StateMachineCode.ShippingProvider}
                {...{ useGetStateInfo }}
                stateCode={data?.providerShippingState}
                factor={'1'}
              />
            ),
        },
        {
          field: 'providerCode',
          headerName: formatMessage(ShippingProviderMessages.serviceCode),
          filter: 'agTextColumnFilter',
          minWidth: 190,
        },
        {
          field: 'providerName',
          headerName: formatMessage(ShippingProviderMessages.serviceName),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'providerTypeTitle',
          headerName: formatMessage(ShippingProviderMessages.serviceType),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'providerPriorityTitle',
          headerName: formatMessage(ShippingProviderMessages.priorityOfUsingTheServiceProvider),
          filter: 'agTextColumnFilter',
          minWidth: 220,
        },
        {
          field: 'collectionTypeTitle',
          headerName: formatMessage(ShippingProviderMessages.collectionTypeTitle),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'ruleId',
          headerName: formatMessage(ShippingProviderMessages.shipmentRule),
          filter: 'agTextColumnFilter',
          minWidth: 180,
          cellRenderer: ({ value }: ICellRendererParams) => (
            <HBLink onClick={() => setRulIdAndShowItsModal(value, true)}>
              {formatMessage(ShippingProviderMessages.shipmentRuleDetail)}
            </HBLink>
          ),
        },
        {
          field: 'costInquiryTypeTitle',
          headerName: formatMessage(ShippingProviderMessages.shippingCostInquiryType),
          filter: 'agTextColumnFilter',
          minWidth: 240,
        },
        {
          field: 'commissionAmountInPercent',
          headerName: formatMessage(ShippingProviderMessages.commissionPercentageOfTheAmont),
          filter: 'agTextColumnFilter',
          minWidth: 280,
          cellRenderer: (params: ICellRendererParams) => (params?.value ? `%${params?.value}` : ''),
        },
        {
          field: 'minimumCommissionAmount',
          headerName: formatMessage(ShippingProviderMessages.minimumCommissionAmount),
          filter: 'agTextColumnFilter',
          minWidth: 200,
          cellRenderer: (params: ICellRendererParams) => params?.value?.toLocaleString(),
        },
        {
          field: 'maximumCommissionAmount',
          headerName: formatMessage(ShippingProviderMessages.maximumCommissionAmount),
          filter: 'agTextColumnFilter',
          minWidth: 200,
          cellRenderer: (params: ICellRendererParams) => params?.value?.toLocaleString(),
        },
        {
          field: 'checkoutTypeTitle',
          headerName: formatMessage(ShippingProviderMessages.settlementType),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'checkoutDays',
          headerName: formatMessage(ShippingProviderMessages.settlementDay),
          filter: 'agTextColumnFilter',
          minWidth: 180,
        },
        {
          field: 'maxShippingValue',
          headerName: formatMessage(ShippingProviderMessages.ceilingOfTheValueOfTheShipment),
          filter: 'agTextColumnFilter',
          minWidth: 200,
          cellRenderer: (params: ICellRendererParams) => params?.value?.toLocaleString(),
        },
        {
          field: 'limitationTypeTitle',
          headerName: formatMessage(ShippingProviderMessages.exceptionOfTheCommodityGroup),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'onlineServiceURL',
          headerName: formatMessage(ShippingProviderMessages.address),
          filter: 'agTextColumnFilter',
          minWidth: 230,
        },
        {
          field: 'logo',
          headerName: formatMessage(ShippingProviderMessages.logo),
          minWidth: 130,
          cellRenderer: ({ data }: ICellRendererParams) => (
            <>
              {data.logo && (
                <Avatar
                  variant="rounded"
                  sx={{ height: '100%', maxWidth: 90 }}
                  src={process.env.NEXT_PUBLIC_CDN + String(data.logo)}
                  imgProps={{ sx: { objectFit: 'contain' } }}
                />
              )}
            </>
          ),
        },
        {
          field: 'email',
          headerName: formatMessage(ShippingProviderMessages.email),
          filter: 'agTextColumnFilter',
          minWidth: 260,
        },
      ] as (ColDef | ColGroupDef)[],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
  }
}

export default useShopingProviderPage
