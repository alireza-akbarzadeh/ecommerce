import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminGeneralDataTaxTypesByIdMutation,
  usePutAdminGeneralDataTaxTypesByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBSwitch, openToast } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback } from 'react'
import { useIntl } from 'react-intl'
import taxesMessages from '../taxes.messages'

function useTaxesTypesGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const { formatMessage } = useIntl()

  const [editTaxType] = usePutAdminGeneralDataTaxTypesByIdMutation()
  const [deleteTaxesType] = useDeleteAdminGeneralDataTaxTypesByIdMutation()

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const getToolbarMoreItems = (handleChangeStatus: (status: boolean) => void) => {
    const selectedRows = gridRef.current?.api?.getSelectedRows()!
    const activeCount = selectedRows?.filter((row) => row.isActive)?.length || 0
    const unActiveCount = selectedRows?.filter((row) => !row.isActive)?.length || 0
    const disabledActive = unActiveCount === 0
    const disabledUnActive = activeCount === 0
    const disabledOnNoSelected = selectedRows?.length === 0

    return [
      {
        label: formatMessage(phrasesMessages.active),
        icon: 'toggleOn',
        disabled: disabledOnNoSelected || disabledActive,
        onClick: () => handleChangeStatus(true),
        show: !disabledActive,
      },
      {
        label: formatMessage(phrasesMessages.deActive),
        icon: 'toggleOff',
        disabled: disabledOnNoSelected || disabledUnActive,
        onClick: () => handleChangeStatus(false),
        show: !disabledUnActive,
      },
    ]
  }

  const changeStatus = async (status: boolean, callback?: () => void) => {
    try {
      const selectedRows = gridRef.current!.api.getSelectedRows()
      const requests = selectedRows.map(({ id, ...rest }) => {
        const { _actions, data, messages, success, ...prev } = rest
        const body = { ...prev, isActive: status }
        return editTaxType({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          id,
          updateTaxTypeModel: { ...body },
        }).then((res: any) => res)
      })

      gridLoading(true)
      const responses = await Promise.all(requests)
      const success = responses.filter((res) => res?.data?.success).length
      if (success > 0) {
        openToast({
          message: formatMessage(taxesMessages.taxesSuccessChangeStatus, {
            changeCount: success,
          }),
          type: 'success',
        })
      }
      callback?.()
    } catch (e) {
    } finally {
      gridLoading(false)
    }
  }

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const taxTypeGridColumns = () => {
    return [
      {
        field: 'rowIndex',
        headerName: formatMessage(taxesMessages.row),
        minWidth: 50,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams) => {
          return params.rowIndex + 1
        },
      },
      {
        field: 'code',
        headerName: formatMessage(taxesMessages.code),
        minWidth: 110,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: formatMessage(taxesMessages.title),
        minWidth: 150,
      },
      {
        field: 'isActive',
        headerName: formatMessage(taxesMessages.status),
        minWidth: 200,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => {
          return (
            <HBSwitch
              checked={data.isActive}
              onChange={(e) => changeStatus(e.target.checked, () => refreshGridData())}
            />
          )
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
          filter: value !== -1 ? (value == 1 ? 'true' : 'false') : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Name', operator: 'contains', value: String(value) },
          { field: 'Code', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchTaxType',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchTaxType')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

  const handleRemoveTaxType = async (
    taxTypeIds: string[],
    setLoading: (loading: boolean) => void,
    callback: () => void,
  ) => {
    const requests = taxTypeIds.map((id) => {
      return deleteTaxesType({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id,
      }).then((res) => {
        return res
      })
    })
    setLoading(true)
    let responses: any[] = []
    responses = await Promise.all(requests)
    const success = responses.filter((res) => res?.data?.success).length

    if (success > 0) {
      openToast({
        message: formatMessage(taxesMessages.taxesDeleteSuccessFully, { taxTypeCount: success }),
        type: 'success',
      })
    }
    setLoading(false)
    callback()
  }

  return {
    gridLoading,
    checkboxSelection,
    headerCheckboxSelection,
    taxTypeGridColumns,
    handleChangedGridActions,
    refreshGridData,
    getToolbarMoreItems,
    changeStatus,
    handleRemoveTaxType,
  }
}

export default useTaxesTypesGrid
