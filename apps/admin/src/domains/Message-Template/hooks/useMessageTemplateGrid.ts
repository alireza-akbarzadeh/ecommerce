import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { HBAgGridClasses } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
} from 'ag-grid-community'
import { RefObject, useCallback } from 'react'

function useMessageTemplateGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }
  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const classes: HBAgGridClasses = {
    wrapper: {
      height: `calc(100vh - 240px)`,
    },
  }

  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Subject', operator: 'contains', value: String(value) },
          { field: 'Name', operator: 'contains', value: String(value) },
          { field: 'MessageBody', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchMessageTemplate',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchMessageTemplate')
      }
    }
  }

  return {
    gridLoading,
    classes,
    handleChangedGridActions,
    checkboxSelection,
    headerCheckboxSelection,
    refreshGridData,
  }
}
export default useMessageTemplateGrid
