import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import { Typography } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import vendorFinancialReportMessages from '../vendorFinancialReport.messages'

const useVendorProductItemsController = () => {
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  const { formatMessage } = useIntl()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 90,
        minWidth: 90,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        checkboxSelection,
        headerCheckboxSelection,
      },
      {
        field: 'productName',
        headerName: formatMessage(vendorFinancialReportMessages.productName),
        minWidth: 100,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'originalPrice',
        headerName: formatMessage(vendorFinancialReportMessages.originalPrice),
        minWidth: 100,
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value?.toLocaleString()}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
      {
        field: 'finalPrice',
        headerName: formatMessage(vendorFinancialReportMessages.finalPrice),
        minWidth: 100,
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value?.toLocaleString()}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
      {
        field: 'discountPrice',
        headerName: formatMessage(vendorFinancialReportMessages.totalVoucherFee),
        minWidth: 100,
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value?.toLocaleString()}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
      {
        field: 'voucherPrice',
        headerName: formatMessage(vendorFinancialReportMessages.discountPrice),
        minWidth: 100,
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value?.toLocaleString()}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
      {
        field: 'commissionAmount',
        headerName: formatMessage(vendorFinancialReportMessages.commissionAmount),
        minWidth: 100,
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value?.toLocaleString()}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
      {
        field: 'commissionPrice',
        headerName: formatMessage(vendorFinancialReportMessages.commissionPrice),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value?.toLocaleString()}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
      {
        field: 'shippingFee',
        headerName: formatMessage(vendorFinancialReportMessages.shippingFee),
        minWidth: 100,
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value?.toLocaleString()}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
      {
        field: 'paidPrice',
        headerName: formatMessage(vendorFinancialReportMessages.paidPrice),
        minWidth: 100,
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value?.toLocaleString()}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
    ],
    [],
  )
  return {
    columnDefs,
  }
}

export default useVendorProductItemsController
