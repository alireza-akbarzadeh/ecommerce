import phrasesMessages from '@hasty-bazar-vendor/core/translations/phrases.messages'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import { usePostAdminSaleVendorFinancialReportExcelMutation } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { MenuItemProps } from '@hasty-bazar/core'
import { Typography } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import vendorFinancialReportMessages from '../vendorFinancialReport.messages'
import { useVendorOrderDetailsColumnDefs } from '../vendorFinancialTypes'

const useVendorFinancialReportColumnDefs = ({
  gridRef,
  selectedRows,
}: useVendorOrderDetailsColumnDefs) => {
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const columnDefs = useMemo(
    () => [
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
        },
      },
      {
        field: 'pickupDate',
        headerName: formatMessage(vendorFinancialReportMessages.pickUpDate),
        filter: 'agDateColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => convertDateToPersian(value),
      },
      {
        field: 'totalOriginalPrice',
        headerName: formatMessage(vendorFinancialReportMessages.totalOriginalPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value?.toLocaleString()}
            {value && defaultCurrencyTitle}
          </Typography>
        ),
      },
      {
        field: 'totalVoucherFee',
        headerName: formatMessage(vendorFinancialReportMessages.totalVoucherFee),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value?.toLocaleString()}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
      {
        headerName: formatMessage(vendorFinancialReportMessages.discountPrice),
        field: 'totalDiscountPrice',
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value > 0 ? value?.toLocaleString() : value}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
      {
        field: 'totalShippingFee',
        headerName: formatMessage(vendorFinancialReportMessages.totalShippingFee),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value > 0 ? value?.toLocaleString() : value}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
      {
        field: 'totalCommission',
        headerName: formatMessage(vendorFinancialReportMessages.totalCommission),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value > 0 ? value?.toLocaleString() : value}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
      {
        field: 'paidPrice',
        headerName: formatMessage(vendorFinancialReportMessages.paidPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (
          <Typography mt={2}>
            {value > 0 ? value?.toLocaleString() : value}
            {value ? defaultCurrencyTitle : null}
          </Typography>
        ),
      },
    ],
    [],
  )

  const [postAdminSaleVendorFinancialReport] = usePostAdminSaleVendorFinancialReportExcelMutation()

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef?.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props

    return await postAdminSaleVendorFinancialReport({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      financialReportQueryFilter: {
        ...res,
        ...filterFields,
        vendorId: '1035787876652023808',
      },
    })
  }

  const vendorReportMoreItems = (): MenuItemProps[] => {
    return [
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'fileDownload',
        onClick: handleDownloadPage,
      },
      {
        icon: 'fileDownloadAlt',
        onClick: () => handleDownloadPage(true),
        label: formatMessage(phrasesMessages.downloadAll),
      },
    ]
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return vendorReportMoreItems()
  }, [selectedRows])

  return {
    checkboxSelection,
    headerCheckboxSelection,
    toolbarMoreItems,
    columnDefs,
  }
}
export default useVendorFinancialReportColumnDefs
