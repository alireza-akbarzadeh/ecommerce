import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { Status } from '@hasty-bazar/admin-shared/components'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback } from 'react'
import { useIntl } from 'react-intl'
import iconsCategoriesMessages from '../iconsCategories.messages'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'

function useIconCategoriesGrid(gridRef: RefObject<HBDataGridClientRef>) {
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

  const iconCategoriesGridColumns = () => {
    return [
      {
        field: 'rowIndex',
        headerName: formatMessage(iconsCategoriesMessages.row),
        maxWidth: 100,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams) => {
          return params.rowIndex + 1
        },
      },
      {
        field: 'name',
        headerName: formatMessage(iconsCategoriesMessages.title),
        minWidth: 150,
      },
      {
        field: 'isActive',
        headerName: formatMessage(iconsCategoriesMessages.isActive),
        filter: 'agTextColumnFilter',
        cellRenderer: Status,
        cellRendererParams: {
          active: formatMessage(phrasesMessages.active),
          inActive: formatMessage(phrasesMessages.deActive),
        },
      },
    ]
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
          { field: 'Name', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchIconCategories',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchIconCategories')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

  return {
    checkboxSelection,
    headerCheckboxSelection,
    handleChangedGridActions,
    iconCategoriesGridColumns,
    refreshGridData,
    gridLoading,
  }
}

export default useIconCategoriesGrid
