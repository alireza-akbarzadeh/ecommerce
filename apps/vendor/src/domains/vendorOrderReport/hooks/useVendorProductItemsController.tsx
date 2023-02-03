import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { useTheme } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useMemo, useRef } from 'react'
import { useIntl } from 'react-intl'
import vendorOrderReportMessages from '../vendorOrderReportMessages'
const useVendorProductItemsController = () => {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const { formatMessage } = useIntl()

  const theme = useTheme()
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
        field: 'defaultImage',
        headerName: formatMessage(vendorOrderReportMessages.productPic),
        minWidth: 100,
        filter: 'agTextColumnFilter',
        cellRendererParams: ({ value }: ICellRendererParams) => {
          return (
            <HBImg
              src={`${process.env.NEXT_PUBLIC_CDN}${value}`}
              sx={{ objectFit: 'contain', width: '100%', height: '100%' }}
              alt="shipmetProduct"
            />
          )
        },
      },
      {
        field: 'productName',
        headerName: formatMessage(vendorOrderReportMessages.productName),
        minWidth: 100,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'hsin',
        headerName: formatMessage(vendorOrderReportMessages.HSIN),
        minWidth: 100,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'pickupCode',
        headerName: formatMessage(vendorOrderReportMessages.deliveryCode),
        minWidth: 100,
        filter: 'agTextColumnFilter',
      },
    ],
    [],
  )
  const classes: HBAgGridClasses = {
    wrapper: {
      backgroundColor: `${theme.palette.common.white} !important`,
      height: 300,
      '& .ag-layout-normal .ag-header': {
        backgroundColor: `${theme.palette.grey[100]} !important`,
        border: 'unset',
      },
      '&>div:last-child': {
        padding: theme.spacing(3),
        borderRadius: 2,
        backgroundColor: theme.palette.grey[100],
      },
      '& div.ag-root-wrapper': {
        border: 'unset',
      },
    },
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  return {
    columnDefs,
    gridRef,
    refreshGridData,
    classes,
  }
}

export default useVendorProductItemsController
