import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { GetAllProductsQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminSaleShipmentBundleGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import {
  convertDateTimeToPersian,
  convertDateToPersian,
} from '@hasty-bazar/admin-shared/utils/convertDateToPersian'
import { HBIcon } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { ShipmentFilterStatus, ShipmentHistory } from '../../components'
import RelatedProducts from '../../containers/relatedProducts'
import { ShipmentWorkFlow } from '../../enums'
import ShipmentManagementMessage from '../../messages'
import { useShipmentGridAction } from '../index'

const useShipmentGridWithOutProductColumns = (
  selectedRows: GetAllProductsQueryResult[],
  refreshGridData: () => void,
) => {
  const { push } = useRouter()
  const { formatMessage } = useIntl()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const navigateToDetails = (id: string) => push(`shipmentManagement/details/${id}`)

  const { GridActions } = useShipmentGridAction({
    selectedRows,
    navigateToDetails,
    refreshGridData,
  })

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 80,
        minWidth: 80,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        cellRenderer: GridActions,
        checkboxSelection,
        headerCheckboxSelection,
      },
      {
        field: 'number',
        headerName: formatMessage(ShipmentManagementMessage.shipmentCode),
        filter: 'agTextColumnFilter',
        minWidth: 150,
      },
      {
        field: 'bundleDate',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.shipmentDate),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => {
          return value ? convertDateToPersian(value) : ''
        },
        enableRowGroup: true,
      },
      {
        field: 'orderDate',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.createDate),
        filter: 'agDateColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => {
          return value ? convertDateTimeToPersian(value) : ''
        },
        enableRowGroup: true,
      },
      {
        field: 'stateCode',
        minWidth: 150,
        filter: ShipmentFilterStatus,
        headerName: formatMessage(ShipmentManagementMessage.shipmentStatus),
        cellRenderer: ({ ...params }: ICellRendererParams) => {
          const { data, value } = params
          return data?.stateCode ? (
            <HBWorkflowState
              factor={ShipmentWorkFlow.Shipment}
              machineCode={StateMachineCode.Shipment}
              stateCode={data?.stateCode}
              useGetStateInfo={useGetStateInfo}
            />
          ) : (
            value
          )
        },
      },
      {
        field: 'providerStateTitle',
        minWidth: 175,
        headerName: formatMessage(ShipmentManagementMessage.shipmentStatusProvider),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'shipmentTypeName',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.shipmentResponsible),
        filter: 'agTextColumnFilter',
        enableRowGroup: true,
      },
      {
        field: 'providerName',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.serviceProvider),
        filter: 'agTextColumnFilter',
        enableRowGroup: true,
      },
      {
        field: 'agentName',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.shippingCoName),
        filter: 'agTextColumnFilter',
        enableRowGroup: true,
      },
      {
        field: 'senderAddress',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.gatheringLocation),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.addressLine,
      },
      {
        field: 'pickupDate',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.gatheringDate),
        filter: 'agDateColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => convertDateToPersian(value?.date),
        enableRowGroup: true,
      },

      {
        field: 'deliveryDateTime',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.deliveryDate),
        filter: 'agDateColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => convertDateToPersian(value),
        enableRowGroup: true,
      },
      {
        field: 'orderNumber',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.shoppingCartId),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'customerName',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.buyer),
        filter: 'agTextColumnFilter',
        enableRowGroup: true,
      },
      {
        field: 'recieverName',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.transferee),
        filter: 'agTextColumnFilter',
        enableRowGroup: true,
      },
      {
        field: 'deliveryAddress',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.deliveryAddress),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'shippingAmount',
        minWidth: 180,
        headerName: formatMessage(ShipmentManagementMessage.shipmentFee),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'packagingAmount',
        minWidth: 180,
        headerName: formatMessage(ShipmentManagementMessage.packagingCoast),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'customerShare',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.customerShare),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'platformShare',
        minWidth: 180,
        headerName: formatMessage(ShipmentManagementMessage.platformShare),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'vendorShare',
        minWidth: 180,
        headerName: formatMessage(ShipmentManagementMessage.vendorShare),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'vendorDemand',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.vendorDemand),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'settlementDate',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.settlementDate),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => convertDateToPersian(value),
      },
      {
        field: 'relatedProduct',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.relatedProduct),
        filter: 'agTextColumnFilter',
        cellRenderer: RelatedProducts,
      },
      {
        field: 'shipmentOrderBundleId',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.deliveryHistory),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) =>
          value && (
            <ShipmentHistory
              id={value}
              renderTitle={<HBIcon sx={{ color: 'info.main' }} type="clipboard" />}
            />
          ),
      },
    ],
    [],
  )

  return { columnDefs }
}

export default useShipmentGridWithOutProductColumns
