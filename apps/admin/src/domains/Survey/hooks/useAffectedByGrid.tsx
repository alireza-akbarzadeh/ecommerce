import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback } from 'react'
import { useIntl } from 'react-intl'
import surveyMessages from '../survey.messages'

function useAffectedByGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const { formatMessage } = useIntl()

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const affectedByGridColumns = () => {
    return [
      {
        field: 'effectivedInTitle',
        headerName: formatMessage(surveyMessages.effectiveIn),
        filter: 'agTextColumnFilter',
        maxWidth: 500,
      },
      {
        field: 'impactRate',
        headerName: formatMessage(surveyMessages.effectRate),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => ' % ' + value,
      },
    ]
  }

  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'EffectivedInTitle', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchAffectedByIdsList',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchAffectedByIdsList')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

  return {
    gridLoading,
    checkboxSelection,
    headerCheckboxSelection,
    affectedByGridColumns,
    handleChangedGridActions,
    refreshGridData,
  }
}

export default useAffectedByGrid
