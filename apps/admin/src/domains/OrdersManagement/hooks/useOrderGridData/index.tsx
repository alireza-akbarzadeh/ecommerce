import { HBLink } from '@hasty-bazar/admin-shared/components'
import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import OrderHyperLink from '@hasty-bazar-admin/domains/OrdersManagement/components/links/OrderHyperLink'
import {
  saleApi,
  useGetAdminSaleOrderGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  usePostAdminSaleOrderChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateTimeToPersian } from '@hasty-bazar/admin-shared/utils'
import { Typography } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { PaymentFilter, ViewItem } from '../../components'
import ViewShoppingCart from '../../components/links/ViewShoppingCart'
import { PaymentStatus } from '../../components/status'
import { OrderWorkFlow } from '../../enums/OrderWorkFlow'
import ordersManagementMessage from '../../ordersManagement.message'

type useOrderGridData = {
  selectedRows: unknown[]
  refreshGridData: (isClearSearch?: boolean) => void
}

function useOrderGridData({ selectedRows, refreshGridData }: useOrderGridData) {
  const { formatMessage } = useIntl()
  const router = useRouter()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const navigateToDetails = (id: string) => {
    router.push(`/ordersManagement/orderDetails/${id}`)
  }

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor={String(OrderWorkFlow.ShoppingCartFactor)}
          stateMachineCode={String(StateMachineCode.Order)}
          useChangeState={usePostAdminSaleOrderChangeStateMutation}
          useLazyGetStateList={
            saleApi.useLazyGetAdminSaleOrderGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.details),
                  onClick: () => navigateToDetails(props.data.id),
                },
              ],
            },
          ]}
          onChangesState={refreshGridData}
          {...props}
        />
      )
    },
    [selectedRows],
  )
  const columnDefs = useMemo(
    () => [
      {
        field: 'id',
        headerName: '',
        maxWidth: 120,
        minWidth: 120,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        pinned: 'right',
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
        field: 'orderNumber',
        minWidth: 190,
        headerName: formatMessage(ordersManagementMessage.orderNumber),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
        pinned: 'right',
      },
      {
        field: 'orderId',
        minWidth: 190,
        headerName: formatMessage(ordersManagementMessage.orderId),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'orderStatusName',
        minWidth: 190,
        headerName: formatMessage(ordersManagementMessage.orderStatus),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ ...params }: ICellRendererParams) => {
          const { data, value } = params
          return data && value ? (
            <HBWorkflowState
              factor={String(OrderWorkFlow.ShoppingCartFactor)}
              machineCode={StateMachineCode.Order}
              stateCode={data?.orderStatusId}
              useGetStateInfo={useGetStateInfo}
            />
          ) : (
            value
          )
        },
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'paymentStatusId',
        headerName: formatMessage(ordersManagementMessage.amountStatus),
        filter: PaymentFilter,
        minWidth: 190,
        cellRenderer: ({ data, value }: ICellRendererParams) =>
          data
            ? PaymentStatus({
                paymentStatusId: data?.paymentStatusId,
                paymentStatusName: data?.paymentStatusName,
              })
            : value,
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'orderTypesName',
        headerName: formatMessage(ordersManagementMessage.orderTypeSubmit),
        minWidth: 150,
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'date',
        minWidth: 150,
        headerName: formatMessage(ordersManagementMessage.orderTime),
        filter: 'agDateColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? convertDateTimeToPersian(value) : '',
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'partyName',
        minWidth: 180,
        headerName: formatMessage(ordersManagementMessage.customerName),
        filter: 'agTextColumnFilter',
        cellRenderer: OrderHyperLink,
        cellRendererParams: {
          cellType: 'partyName',
        },
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'partyMobile',
        headerName: formatMessage(ordersManagementMessage.phoneNumberBuyer),
        minWidth: 180,
        filter: 'agTextColumnFilter',
        cellRenderer: OrderHyperLink,
        cellRendererParams: {
          cellType: 'partyMobile',
        },
      },
      {
        field: 'cargoQty',
        minWidth: 170,
        headerName: formatMessage(ordersManagementMessage.numberOfShipment),
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'vendorQty',
        minWidth: 170,
        headerName: formatMessage(ordersManagementMessage.numberOfSeller),
        filter: 'agNumberColumnFilter',
        cellRenderer: ViewItem,
      },
      {
        field: 'refund',
        minWidth: 190,
        headerName: formatMessage(ordersManagementMessage.numberOfReturnItems),
        filter: 'agNumberColumnFilter',
        hide: true,
      },
      {
        field: 'sumOriginalPrice',
        minWidth: 190,
        headerName: formatMessage(ordersManagementMessage.totalPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
        hide: true,
      },
      {
        field: 'discountPrice',
        headerName: formatMessage(ordersManagementMessage.totalPriceDiscount),
        filter: 'agNumberColumnFilter',
        minWidth: 180,
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
        hide: true,
      },
      {
        field: 'shipmentFee',
        headerName: formatMessage(ordersManagementMessage.shipMentAmount),
        filter: 'agNumberColumnFilter',
        minWidth: 150,
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
        hide: true,
      },
      {
        field: 'paymentMethodName',
        headerName: formatMessage(ordersManagementMessage.paymentType),
        filter: 'agTextColumnFilter',
        minWidth: 180,
      },
      {
        field: 'finalPrice',
        headerName: formatMessage(ordersManagementMessage.finalPrice),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'refundPrice',
        headerName: formatMessage(ordersManagementMessage.totalRefundAmount),
        filter: 'agNumberColumnFilter',
        minWidth: 150,
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
        hide: true,
      },
      {
        field: 'voucherTotalFee',
        headerName: formatMessage(ordersManagementMessage.voucherTotalFee),
        filter: 'agNumberColumnFilter',
        minWidth: 150,
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'paidPrice',
        headerName: formatMessage(ordersManagementMessage.paidPrice),
        filter: 'agNumberColumnFilter',
        minWidth: 150,
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'commissionPrice',
        headerName: formatMessage(ordersManagementMessage.totalRefundCommission),
        filter: 'agNumberColumnFilter',
        minWidth: 150,
        cellRenderer: ({ data }: ICellRendererParams) =>
          data?.commissionPrice === 0 ? (
            <Typography color={'info.main'} display="flex" alignItems={'center'} height="100%">
              {data?.commissionPrice}
            </Typography>
          ) : (
            <HBLink
              underline={'none'}
              href={`/ordersManagement/commissionCalculations/${data?.id}`}
              target="_blank"
              variant={'subtitle2'}
              color={'info.main'}
            >
              {data?.commissionPrice?.toLocaleString()}
            </HBLink>
          ),
        hide: true,
      },
      {
        field: 'viewShoppingCart',
        headerName: formatMessage(ordersManagementMessage.viewShoppingCart),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: ViewShoppingCart,
      },
    ],
    [],
  )
  return {
    columnDefs,
  }
}

export default useOrderGridData
