import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { MenuItemProps } from '@hasty-bazar/core'
import { ColDef } from 'ag-grid-community'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useReportGridData from '../useReportGridData'

interface IUseReportVoucherCodeController {
  id: string
}

const useReportVoucherCodeController = ({ id }: IUseReportVoucherCodeController) => {
  const gridRef = useRef<HBDataGridClientRef>(null)

  const { formatMessage } = useIntl()

  const [openActive, setOpenActive] = useState(false)
  const [selectedRows, setSelectedRows] = useState<unknown[]>([])

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Sale/voucher/${id}/GetVoucherCustomerInfo`

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleDeleteOrder = () => {
    gridLoading(true)
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api?.deselectAll()
  }, [])

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: unknown[]) => {
    setSelectedRows(selectedRows)
  }

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? (value === 1 ? 'true' : 'false') : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'CustomerFirstName', operator: 'contains', value: String(value) },
          { field: 'CustomerLastName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchVoucherCode',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchVoucherCode')
      }
    }
  }

  const { columnDefs, userGridToolbarMenu } = useReportGridData({
    id,
    gridRef,
    selectedRows,
  })
  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return userGridToolbarMenu()
  }, [selectedRows])

  return {
    actionUrl,
    columnDefs,
    formatMessage,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    gridRef,
    handleChangedGridActions,
    toolbarStatus,
    selectedRows,
    refreshGridData,
    toolbarMoreItems,
    setOpenActive,
    openActive,
    handleDeleteOrder,
  }
}

export default useReportVoucherCodeController
