import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import PlatformCarrierAgrrementsMessages from '@hasty-bazar-admin/domains/PlatformCarrierAgreementSettings/PlatformCarrierAgreementSettings.message'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { useTheme } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
} from 'ag-grid-community'
import { useMemo, useRef } from 'react'
import { useIntl } from 'react-intl'

const usePlatformDetailsGrid = () => {
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const gridRef = useRef<HBDataGridClientRef>(null)

  const classes: HBAgGridClasses = {
    wrapper: {
      backgroundColor: `${theme.palette.common.white}`,
      height: 300,
      '& .ag-layout-normal .ag-header': {
        backgroundColor: `${theme.palette.grey[100]}`,
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

  const isRowSelectable = (rowNode: any) => {
    return rowNode.data ? !rowNode.data.isAdd : true
  }

  const checkboxSelection = (params: CheckboxSelectionCallbackParams) => {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = (params: HeaderCheckboxSelectionCallbackParams) => {
    return params.columnApi.getRowGroupColumns().length === 0
  }

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
          innerRenderer: [],
        },
      },
      {
        field: 'id',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.code),
        hide: true,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'vendorName',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.vendorName),
        minWidth: 180,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'productCategoryTitle',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.categoryTitle),
        minWidth: 180,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'vendorNationalCode',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.vendorNationalCode),
        minWidth: 180,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'vendorMobileNo',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.vendorMobileNo),
        minWidth: 180,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'vendorAddress',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.vendorAddress),
        minWidth: 180,
        filter: 'agTextColumnFilter',
      },
    ],
    [],
  )

  return {
    columnDefs,
    isRowSelectable,
    gridRef,
    classes,
  }
}

export default usePlatformDetailsGrid
