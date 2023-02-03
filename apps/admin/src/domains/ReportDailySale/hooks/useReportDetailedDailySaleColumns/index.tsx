import { HBLink } from '@hasty-bazar/admin-shared/components'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import ReportDetailsDailySaleMessages from '../../ReportDailySale.messages'
import { RelatedCommissionSetting } from '../../components'
import { IUseReportDetailedDailySaleColumns } from '../../types/IDailySaleReportFormModel'
import useGridActions from '../useGridActions'
const useReportDetailedDailySaleColumns = ({
  selectedRows,
}: IUseReportDetailedDailySaleColumns) => {
  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const { formatMessage } = useIntl()

  const { GridActions } = useGridActions({ selectedRows })

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 70,
        minWidth: 70,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        cellRenderer: GridActions,
        checkboxSelection,
        headerCheckboxSelection,
        pinned: 'right',
      },
      {
        field: 'vendorName',
        headerName: formatMessage(ReportDetailsDailySaleMessages.vendorPartyName),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
        minWidth: 150,
        pinned: 'right',
        cellRenderer: ({ value, data }: ICellRendererParams) => (
          <HBLink
            underline="none"
            target="_blank"
            sx={{ color: data?.vendorId ? 'primary' : 'grey.600' }}
            href={data?.vendorId && `users/detail/${data?.vendorId}`}
          >
            {value}
          </HBLink>
        ),
      },
      {
        field: 'orderDate',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.orderDate),
        filter: 'agDateColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? convertDateToPersian(value) : '',
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'orderNumber',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.orderNumber),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'orderId',
        minWidth: 180,
        headerName: formatMessage(ReportDetailsDailySaleMessages.shoppingCartId),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value, data }: ICellRendererParams) => (
          <HBLink
            underline="none"
            target="_blank"
            sx={{ color: 'info.main' }}
            href={`ordersManagement/orderDetails/${data?.orderId}`}
          >
            {value}
          </HBLink>
        ),
      },
      {
        field: 'cargoId',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.cargoId),
        filter: 'agTextColumnFilter',
      },

      {
        field: 'productName',
        minWidth: 140,
        headerName: formatMessage(ReportDetailsDailySaleMessages.productHSIN),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
        cellRenderer: ({ value, data }: ICellRendererParams) => (
          <HBLink
            underline="none"
            sx={{ color: 'info.main' }}
            target="_blank"
            href={`products/simple-product/edit/product-details/${data?.productId}`}
          >
            {value}
          </HBLink>
        ),
      },
      {
        field: 'productHSIN',
        minWidth: 180,
        headerName: formatMessage(ReportDetailsDailySaleMessages.HSIN),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value, data }: ICellRendererParams) => (
          <HBLink
            underline="none"
            sx={{ color: 'info.main' }}
            target="_blank"
            href={`products/simple-product/edit/product-details/${data?.productId}`}
          >
            {value}
          </HBLink>
        ),
      },
      {
        field: 'productQty',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.productQTY),
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'shippingProviderName',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.shippingProviderName),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'shippingCompanyName',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.shippingCompanyName),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'preparationDays',
        minWidth: 180,
        headerName: formatMessage(ReportDetailsDailySaleMessages.preparationDays),
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'duePickupDate',
        minWidth: 180,
        rowGroup: false,
        enableRowGroup: true,
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? convertDateToPersian(value) : '',
        headerName: formatMessage(ReportDetailsDailySaleMessages.productPikUpDate),
        filter: 'agDateColumnFilter',
      },
      {
        field: 'dueDeliveryDate',
        minWidth: 180,
        rowGroup: false,
        enableRowGroup: true,
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? convertDateToPersian(value) : '',
        headerName: formatMessage(ReportDetailsDailySaleMessages.duePickDeliveryDate),
        filter: 'agDateColumnFilter',
      },
      {
        field: 'vendorShippingShare',
        minWidth: 200,
        headerName: formatMessage(ReportDetailsDailySaleMessages.vendorShipmentShare),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'productOriginalPrice',
        minWidth: 160,
        headerName: formatMessage(ReportDetailsDailySaleMessages.productOriginalPrice),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'productDiscount',
        minWidth: 180,
        headerName: formatMessage(ReportDetailsDailySaleMessages.discountAmount),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'productFinalPrice',
        minWidth: 160,
        headerName: formatMessage(ReportDetailsDailySaleMessages.finalPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'productTotalPrice',
        minWidth: 180,
        headerName: formatMessage(ReportDetailsDailySaleMessages.totalFinalPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'vatPercent',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.VTAPercent),
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'vatPrice',
        minWidth: 180,
        headerName: formatMessage(ReportDetailsDailySaleMessages.VTAPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'commissionPrice',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.commissionPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'commissionAmount',
        minWidth: 180,
        headerName: formatMessage(ReportDetailsDailySaleMessages.commissionAmount),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'totalPayablePrice',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.totalPayablePrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'stateName',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.productStatusCode),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'storeName',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.storeName),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'customerName',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.customerName),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value, data }: ICellRendererParams) => (
          <HBLink underline="none" target="_blank" href={`users/detail/${data?.customerId}`}>
            {value}
          </HBLink>
        ),
      },
      {
        field: 'customerAddress',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.customerAddress),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'customerCellphone',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.customerCellPhone),
        filter: 'agTextColumnFilter',
      },

      {
        field: 'shippmentPrice',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.shipmentPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'relatedCommissionId',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.relatedCommissionId),
        filter: 'agNumberColumnFilter',
        cellRenderer: RelatedCommissionSetting,
      },
    ],
    [],
  )

  return { columnDefs }
}

export default useReportDetailedDailySaleColumns
