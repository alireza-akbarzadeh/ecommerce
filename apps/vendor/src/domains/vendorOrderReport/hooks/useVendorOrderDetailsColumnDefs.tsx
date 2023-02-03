import phrasesMessages from '@hasty-bazar-vendor/core/translations/phrases.messages'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { usePostAdminSaleShipmentBundleGetDailyReportExcelMutation } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { MenuItemProps } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import vendorOrderReportMessages from '../vendorOrderReportMessages'
import { VendorOrderDetailsTypes } from '../vendorOrderReportTypes'

const useVendorOrderDetailsColumnDefs = ({ gridRef, selectedRows }: VendorOrderDetailsTypes) => {
  const { formatMessage } = useIntl()

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
        },
      },
      {
        field: 'pickupDate',
        headerName: formatMessage(vendorOrderReportMessages.pickUpDate),
        filter: 'agDateColumnFilter',
        minWidth: 260,
        cellRenderer: ({ value }: ICellRendererParams) => convertDateToPersian(value),
      },
      {
        field: 'fromHour',
        headerName: formatMessage(vendorOrderReportMessages.pickUpOurs),
        filter: 'agTextColumnFilter',
        minWidth: 260,
        cellRenderer: ({ value, data }: ICellRendererParams) => {
          return (
            <Box display={'inline-flex'} gap={3} alignItems={'center'}>
              <Typography>{value}</Typography>
              {formatMessage(vendorOrderReportMessages.at)}
              <Typography>{data?.toHour}</Typography>
            </Box>
          )
        },
      },
      {
        field: 'productCount',
        headerName: formatMessage(vendorOrderReportMessages.productQty),
        filter: 'agNumberColumnFilter',
        minWidth: 260,
        cellRenderer: ({ value, data }: ICellRendererParams) => {
          return (
            <Box display={'inline-flex'} gap={1} alignItems={'center'}>
              <Typography>{value}</Typography>
              {formatMessage(vendorOrderReportMessages.productType)}
              <Typography>{data?.itemCount}</Typography>
              {formatMessage(vendorOrderReportMessages.item)}
            </Box>
          )
        },
      },
    ],
    [],
  )

  const [postAdminSaleShipmentBundleGetDaily] =
    usePostAdminSaleShipmentBundleGetDailyReportExcelMutation()

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef?.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props

    const createData = res.headers && [
      ...res.headers,
      { faName: formatMessage(vendorOrderReportMessages.item), nativeName: 'itemCount' },
      { faName: formatMessage(vendorOrderReportMessages.productName), nativeName: 'productName' },
      { faName: formatMessage(vendorOrderReportMessages.deliveryCode), nativeName: 'pickupCode' },
      { faName: formatMessage(vendorOrderReportMessages.HSIN), nativeName: 'hsin' },
      { faName: formatMessage(vendorOrderReportMessages.inHour), nativeName: 'toHour' },
    ]
    return await postAdminSaleShipmentBundleGetDaily({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getDailyReportExcelAdminFilter: {
        ...res,
        ...filterFields,
        headers: createData,
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
export default useVendorOrderDetailsColumnDefs
