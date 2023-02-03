import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
} from 'ag-grid-community'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { GetAdminSaleReasonsSettingApiArg } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBAgGridClasses } from '@hasty-bazar/core'
import OrdersManagementMessage from '../../ordersManagement.message'

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 520px)`,
  },
}
const useShippingHistoryGridController = () => {
  const [selectedRows, setSelectedRows] = useState<unknown[]>([])
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/admin/GeneralData/reasonsSetting`

  const handleChangedSelectedRows = (selectedRows: GetAdminSaleReasonsSettingApiArg[]) => {
    setSelectedRows(selectedRows)
  }

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

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
  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 50,
        minWidth: 50,
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
        field: 'isAttachmentMandatory',
        headerName: formatMessage(OrdersManagementMessage.shippingHistoryStatus),
        filter: 'agTextColumnFilter',
      },
    ],
    [selectedRows],
  )

  return {
    gridRef,
    actionUrl,
    autoGroupColumnDef,
    classes,
    refreshGridData,
    handleChangedSelectedRows,
    columnDefs,
  }
}

export default useShippingHistoryGridController
