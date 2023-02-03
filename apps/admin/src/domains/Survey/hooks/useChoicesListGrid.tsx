import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
} from 'ag-grid-community'
import { RefObject, useCallback } from 'react'
import { useIntl } from 'react-intl'
import surveyMessages from '../survey.messages'

function useChoicesListGrid(gridRef: RefObject<HBDataGridClientRef>) {
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

  const choicesGridColumns = () => {
    return [
      {
        field: 'name',
        headerName: formatMessage(surveyMessages.choiceTitle),
        filter: 'agTextColumnFilter',
        maxWidth: 500,
      },
      {
        field: 'value',
        headerName: formatMessage(surveyMessages.choiceWorthiness),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'sortOrder',
        headerName: formatMessage(surveyMessages.choiceOrder),
        filter: 'agTextColumnFilter',
      },
    ]
  }

  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Name', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchChoicesList',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchChoicesList')
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
    choicesGridColumns,
    handleChangedGridActions,
    refreshGridData,
  }
}

export default useChoicesListGrid
