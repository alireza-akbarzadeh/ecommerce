import { HBLink } from '@hasty-bazar/admin-shared/components'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils/convertDateToPersian'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import ReportDetailsDailySaleMessages from '../../ReportDailySale.messages'
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
        rowGroup: false,
        enableRowGroup: true,
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? convertDateToPersian(value) : '',
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
        field: 'newOrderQty',
        minWidth: 160,
        headerName: formatMessage(ReportDetailsDailySaleMessages.newOrderQty),
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'cancelledOrderQty',
        minWidth: 160,
        headerName: formatMessage(ReportDetailsDailySaleMessages.cancelledOrderQty),
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'finalOrderQty',
        minWidth: 160,
        headerName: formatMessage(ReportDetailsDailySaleMessages.finalOrderQty),
        filter: 'agNumberColumnFilter',
      },

      {
        field: 'totalOriginalPrice',
        minWidth: 160,
        headerName: formatMessage(ReportDetailsDailySaleMessages.totalOriginalPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'totalDiscountPrice',
        minWidth: 180,
        headerName: formatMessage(ReportDetailsDailySaleMessages.productDiscount),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'totalFinalPrice',
        minWidth: 160,
        headerName: formatMessage(ReportDetailsDailySaleMessages.reduceFinalPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'totalVATPrice',
        minWidth: 180,
        headerName: formatMessage(ReportDetailsDailySaleMessages.VTAPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'totalVendorShare',
        minWidth: 200,
        headerName: formatMessage(ReportDetailsDailySaleMessages.totalVendorShare),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'totalCommissionPrice',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.totalCommissionPrice),
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
        field: 'shippingShare',
        minWidth: 150,
        headerName: formatMessage(ReportDetailsDailySaleMessages.shipmentPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
    ],
    [],
  )

  return { columnDefs }
}

export default useReportDetailedDailySaleColumns
