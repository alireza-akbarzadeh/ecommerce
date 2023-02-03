import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { ShipmentHistory } from '@hasty-bazar-admin/domains/ShipmentManagement/components'
import {
  saleApi,
  useGetAdminSaleShipmentBundleGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  usePostAdminSaleShipmentBundleByShipmentOrderIdBundlesChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { Typography } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { CargoStatus } from '../../components/status'
import OrdersManagementMessage from '../../ordersManagement.message'
interface IUseOrderDetailsGridColumns {
  id: string
  gridRef: RefObject<HBDataGridClientRef>
}
export enum ShipmentWorkFlow {
  Shipment = 'ShipmentBundle',
}

const useOrderDetailsGridColumns = ({ gridRef, id }: IUseOrderDetailsGridColumns) => {
  const { formatMessage } = useIntl()

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])
  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const GridActions = useCallback((props: ICellRendererParams) => {
    const bodyWorkFlow = {
      shipmentOrderId: id,
    }
    return (
      <GridWorkflowActionColumn
        entityId={props?.data?.id}
        factor={String(ShipmentWorkFlow.Shipment)}
        stateMachineCode={String(StateMachineCode.Shipment)}
        body={bodyWorkFlow}
        useChangeState={usePostAdminSaleShipmentBundleByShipmentOrderIdBundlesChangeStateMutation}
        useLazyGetStateList={
          saleApi.useLazyGetAdminSaleShipmentBundleGetTransitionByEntityIdAndStateMachineCodeFactorQuery
        }
        menuItems={[]}
        onChangesState={refreshGridData}
        {...props}
      />
    )
  }, [])

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 120,
        minWidth: 120,
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

          innerRenderer: GridActions,
        },
      },
      {
        field: 'cargoStatusName',
        minWidth: 190,
        headerName: formatMessage(OrdersManagementMessage.shipmentStatus),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => {
          return (
            <HBWorkflowState
              machineCode={StateMachineCode.Shipment}
              useGetStateInfo={useGetStateInfo}
              stateCode={data?.cargoStatusId}
              factor={String(ShipmentWorkFlow.Shipment)}
            />
          )
        },
      },
      {
        field: 'agentStatus',
        minWidth: 220,
        headerName: formatMessage(OrdersManagementMessage.serverSendingStatus),
        filter: 'agTextColumnFilter',
        cellRenderer: CargoStatus,
      },
      {
        field: 'cargoNumber',
        headerName: formatMessage(OrdersManagementMessage.consignmentNumber),
        minWidth: 190,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'providerName',
        headerName: formatMessage(OrdersManagementMessage.consignmentCarrier),
        minWidth: 180,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'cargoReciveCode',
        minWidth: 310,
        headerName: formatMessage(OrdersManagementMessage.consignmentCarrierId),
        filter: false,
      },
      {
        field: 'reciverName',
        minWidth: 150,
        headerName: formatMessage(OrdersManagementMessage.transferee),
        filter: false,
      },
      {
        field: 'reciverMobile',
        minWidth: 210,
        headerName: formatMessage(OrdersManagementMessage.transfereeMobile),
        filter: false,
      },
      {
        field: 'reciverAddress',
        minWidth: 230,
        headerName: formatMessage(OrdersManagementMessage.receiveAddress),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'deliveryDate',
        minWidth: 150,
        headerName: formatMessage(OrdersManagementMessage.deliveryDateOrder),
        filter: false,
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? convertDateToPersian(value) : '-',
      },

      {
        field: 'qty',
        minWidth: 150,
        headerName: formatMessage(OrdersManagementMessage.numberOfProducts).replace(':', ''),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'vendorQty',
        minWidth: 150,
        headerName: formatMessage(OrdersManagementMessage.numberOfSeller),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'agentName',
        minWidth: 190,
        headerName: formatMessage(OrdersManagementMessage.ShippingService),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'trackingNumber',
        minWidth: 310,
        headerName: formatMessage(OrdersManagementMessage.shipmentPostalCode),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'shipmentTypesName',
        minWidth: 150,
        headerName: formatMessage(OrdersManagementMessage.shipmentTypesName).replace(':', ''),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'predictDeliveryDate',
        minWidth: 200,
        headerName: formatMessage(OrdersManagementMessage.estimatedDeliveryTime),
        filter: 'agDateColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? convertDateToPersian(value) : '-',
      },
      {
        field: 'deliveryOpenDate',
        minWidth: 200,
        headerName: formatMessage(OrdersManagementMessage.estimatedRealDeliveryTime),
        filter: 'agDateColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? convertDateToPersian(value) : '-',
      },
      {
        field: 'shippingFee',
        minWidth: 200,
        headerName: formatMessage(OrdersManagementMessage.shipMentAmount),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'sharePlatform',
        minWidth: 200,
        headerName: formatMessage(OrdersManagementMessage.sharePlatform).replace(':', ''),
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'shareVendor',
        minWidth: 200,
        headerName: formatMessage(OrdersManagementMessage.shareVendor).replace(':', ''),
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'shareCustomer',
        minWidth: 200,
        headerName: formatMessage(OrdersManagementMessage.shareCustomer).replace(':', ''),
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'shipmentHistory',
        minWidth: 200,
        headerName: formatMessage(OrdersManagementMessage.shippingHistory).replace(':', ''),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => {
          return (
            <ShipmentHistory
              renderTitle={
                <Typography>{formatMessage(OrdersManagementMessage.history)}</Typography>
              }
              id={data?.cargoNumber}
            />
          )
        },
      },
    ],
    [],
  )
  return { columnDefs }
}

export default useOrderDetailsGridColumns
