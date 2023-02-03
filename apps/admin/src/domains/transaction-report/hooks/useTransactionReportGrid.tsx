import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { RefObject, useCallback } from 'react'

function useTransactionReportGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'SystematicDescription', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchTransactionReport',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchTransactionReport')
      }
    }
  }

  return { refreshGridData, handleChangedGridActions }
}
export default useTransactionReportGrid
