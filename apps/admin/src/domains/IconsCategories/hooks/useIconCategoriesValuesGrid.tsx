import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { Avatar } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback } from 'react'
import { useIntl } from 'react-intl'
import iconsCategoriesMessages from '../iconsCategories.messages'

function useIconCategoriesValuesGrid(gridRef: RefObject<HBDataGridClientRef>) {
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

  const valuesGridColumns = () => {
    return [
      {
        field: 'rowIndex',
        headerName: formatMessage(iconsCategoriesMessages.valueRow),
        minWidth: 50,
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return params.rowIndex + 1
        },
      },
      {
        field: 'name',
        headerName: formatMessage(iconsCategoriesMessages.valueTitle),
        minWidth: 110,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'value',
        headerName: formatMessage(iconsCategoriesMessages.value),
        minWidth: 150,
      },
      {
        field: 'sortOrder',
        headerName: formatMessage(iconsCategoriesMessages.valueOrder),
        minWidth: 150,
      },
      {
        field: 'iconPath',
        headerName: formatMessage(iconsCategoriesMessages.valueIcon),
        minWidth: 150,
        sortable: false,
        filter: false,

        cellRenderer: (params: ICellRendererParams) => (
          <Avatar
            sizes="small"
            src={`${process.env.NEXT_PUBLIC_CDN}/${params.value}`}
            alt={params?.data?.name}
            variant="rounded"
          />
        ),
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
    valuesGridColumns,
    refreshGridData,
    gridLoading,
  }
}

export default useIconCategoriesValuesGrid
