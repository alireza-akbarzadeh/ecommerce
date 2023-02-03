import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminGeneralDataBankByIdMutation,
  usePutAdminGeneralDataBankByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBSwitch, openToast } from '@hasty-bazar/core'
import { Avatar } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback } from 'react'
import { useIntl } from 'react-intl'
import banksMessages from '../Banks.messages'

function useBankGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const { formatMessage } = useIntl()

  const [deleteBank] = useDeleteAdminGeneralDataBankByIdMutation()
  const [editBank] = usePutAdminGeneralDataBankByIdMutation()

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const getToolbarMoreItems = (handleChangeStatus: (status: boolean) => void) => {
    const selectedRows = gridRef.current?.api?.getSelectedRows()
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
        return editBank({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          updateBankMdoel: body,
          id,
        }).then((res: any) => res)
      })

      gridLoading(true)
      const responses = await Promise.all(requests)
      const success = responses.filter((res) => res?.data?.success).length
      if (success > 0) {
        openToast({
          message: formatMessage(banksMessages.banksSuccessChangeStatus, {
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

  const bankGridColumns = () => {
    return [
      {
        field: 'rowIndex',
        headerName: formatMessage(banksMessages.row),
        minWidth: 50,
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return params.rowIndex + 1
        },
      },
      {
        field: 'name',
        headerName: formatMessage(banksMessages.name),
        minWidth: 110,
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return params.value ? params.value : '-'
        },
      },
      {
        field: 'latinName',
        headerName: formatMessage(banksMessages.latinName),
        minWidth: 150,
      },
      {
        field: 'latinSummaryName',
        headerName: formatMessage(banksMessages.latinSummaryName),
        minWidth: 150,
      },
      {
        field: 'cardPrefix',
        headerName: formatMessage(banksMessages.preNumber),
        minWidth: 200,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'iban',
        headerName: formatMessage(banksMessages.preIbanNumber),
        minWidth: 200,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'path',
        headerName: formatMessage(banksMessages.logo),
        minWidth: 100,
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <Avatar
              sizes="small"
              src={`${process.env.NEXT_PUBLIC_CDN}/${params.value}`}
              alt={params?.data?.name}
              variant="rounded"
            />
          )
        },
      },
      {
        field: 'isActive',
        headerName: formatMessage(banksMessages.status),
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
      const filterComponent = gridRef.current!.api.getFilterInstance('isActive')
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
          { field: 'LatinName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchBank',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchBank')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

  const handleRemoveBank = async (
    bankIds: string[],
    setLoading: (loading: boolean) => void,
    callback: () => void,
  ) => {
    const requests = bankIds.map((id) => {
      return deleteBank({
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
        message: formatMessage(banksMessages.banksDeleteSuccessFully, { bankCount: success }),
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
    bankGridColumns,
    handleChangedGridActions,
    refreshGridData,
    getToolbarMoreItems,
    changeStatus,
    handleRemoveBank,
  }
}

export default useBankGrid
