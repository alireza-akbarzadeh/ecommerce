import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminGeneralDataTaxTypesByIdValueAndValueIdMutation,
  usePutAdminGeneralDataTaxTypesByIdValueAndValueIdMutation,
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

function useTaxGrid(gridRef: RefObject<HBDataGridClientRef>, taxesTypeId: string) {
  const { formatMessage } = useIntl()

  const [editTax] = usePutAdminGeneralDataTaxTypesByIdValueAndValueIdMutation()
  const [deleteTaxes] = useDeleteAdminGeneralDataTaxTypesByIdValueAndValueIdMutation()

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
        return editTax({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          id: taxesTypeId,
          valueId: id,
          updateTaxTypeValueModel: { ...body },
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

  const taxGridColumns = () => {
    return [
      {
        field: 'rowIndex',
        headerName: formatMessage(taxesMessages.rowAmount),
        minWidth: 50,
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return params.rowIndex + 1
        },
      },
      {
        field: 'startDate',
        headerName: formatMessage(taxesMessages.startDate),
        minWidth: 110,
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(params.value).toLocaleDateString('fa-IR', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })
            : '-'
        },
      },
      {
        field: 'expireDate',
        headerName: formatMessage(taxesMessages.expireDate),
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(params.value).toLocaleDateString('fa-IR', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })
            : '-'
        },
      },
      {
        field: 'percent',
        headerName: formatMessage(taxesMessages.percent),
        minWidth: 150,
      },
      {
        field: 'isActive',
        headerName: formatMessage(taxesMessages.amountStatus),
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

  const handleChangedGridActions = (value: number | string, type: 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? (value == 1 ? 'true' : 'false') : null,
        })
      gridRef.current!.api.onFilterChanged()
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

  const handleRemoveTax = async (
    taxIds: string[],
    setLoading: (loading: boolean) => void,
    callback: () => void,
  ) => {
    const requests = taxIds.map((id) => {
      return deleteTaxes({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: taxesTypeId,
        valueId: id,
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
        message: formatMessage(taxesMessages.taxesDeleteSuccessFully, { taxCount: success }),
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
    taxGridColumns,
    handleChangedGridActions,
    refreshGridData,
    getToolbarMoreItems,
    changeStatus,
    handleRemoveTax,
  }
}

export default useTaxGrid
