import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useDeleteAdminCatalogApiUnitOfMeasurementByIdMutation } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback } from 'react'
import { useIntl } from 'react-intl'
import measurementUnitMessages from '../measurement-unitMessages.messages'
import { openToast } from './../../../../../../libs/core/src/components/HBToast/HBToast'

function useMeasurementUnitGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const { formatMessage } = useIntl()

  const [deleteMeasurement] = useDeleteAdminCatalogApiUnitOfMeasurementByIdMutation()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const gridColumns = () => {
    return [
      {
        field: 'measuringUnitTypeTitle',
        headerName: formatMessage(measurementUnitMessages.type),
        filter: 'agTextColumnFilter',
        minWidth: 110,
        cellRenderer: (params: ICellRendererParams) => params.value,
      },
      {
        field: 'name',
        headerName: formatMessage(measurementUnitMessages.title),
        filter: 'agTextColumnFilter',
        minWidth: 150,
      },
      {
        field: 'latinName',
        headerName: formatMessage(measurementUnitMessages.latinTitle),
        filter: 'agTextColumnFilter',
        minWidth: 150,
      },
      {
        field: 'code',
        headerName: formatMessage(measurementUnitMessages.code),
        filter: 'agTextColumnFilter',
        minWidth: 110,
      },
      {
        field: 'isBaseUnit',
        headerName: formatMessage(measurementUnitMessages.isBasis),
        filter: 'agTextColumnFilter',
        minWidth: 170,
        cellRenderer: (params: ICellRendererParams) =>
          params.value ? formatMessage(phrasesMessages.yes) : formatMessage(phrasesMessages.no),
      },
      {
        field: 'conversionFactor',
        headerName: formatMessage(measurementUnitMessages.factorToBase),
        filter: 'agTextColumnFilter',
        minWidth: 180,
      },
      {
        field: 'displaySort',
        headerName: formatMessage(measurementUnitMessages.sortOrder),
        filter: 'agTextColumnFilter',
        minWidth: 120,
      },
    ]
  }

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status' | 'role') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('stateCode')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Name', operator: 'contains', value: String(value) },
          { field: 'LatinName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchMeasurementUnit',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchMeasurementUnit')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api?.deselectAll()
  }, [])

  const handleRemoveMeasurement = async (
    measurementIds: string[],
    setLoading: (loading: boolean) => void,
    callback: () => void,
  ) => {
    const requests = measurementIds.map((id) => {
      return deleteMeasurement({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id,
      }).then((res: any) => {
        return res
      })
    })
    setLoading(true)
    let responses: any[] = []
    responses = await Promise.all(requests)
    const success = responses.filter((res) => res?.data?.success).length

    if (success > 0) {
      openToast({
        message: formatMessage(measurementUnitMessages.measurementDeleteSuccessFully, {
          measurementsCount: success,
        }),
        type: 'success',
      })
    }
    setLoading(false)
    callback()
  }

  return {
    checkboxSelection,
    headerCheckboxSelection,
    gridColumns,
    handleChangedGridActions,
    refreshGridData,
    gridLoading,
    handleRemoveMeasurement,
  }
}

export default useMeasurementUnitGrid
