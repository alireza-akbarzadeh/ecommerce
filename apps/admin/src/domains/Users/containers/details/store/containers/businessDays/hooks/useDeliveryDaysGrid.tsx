import { GridActionColumn, GridActionMenuProps } from '@hasty-bazar/admin-shared/components'
import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import banksMessages from '@hasty-bazar-admin/domains/Banks/Banks.messages'
import {
  GetVendorStoreResultApiResult,
  useDeleteAdminIdrVendorsByIdWorkingDaysAndWorkingDayIdMutation,
  usePutAdminIdrVendorsByIdWorkingDaysAndWorkingDayIdChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBIcon, HBSwitch, openToast } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { Dispatch, RefObject, SetStateAction, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import businessDaysMessages from '../businessDays.messages'
import { AddEditModalType } from '../containers/delivery-days/delivery-days-grid'

const useDeliveryDaysGrid = (
  gridRef: RefObject<HBDataGridClientRef>,
  setIsOpenAddEditDialog: Dispatch<SetStateAction<AddEditModalType>>,
  vendorData: GetVendorStoreResultApiResult,
  setDeleteDialogState: Dispatch<
    SetStateAction<{
      show: boolean
      id?: string | undefined
    }>
  >,
) => {
  const { formatMessage } = useIntl()

  const [deleteWorkingDay] = useDeleteAdminIdrVendorsByIdWorkingDaysAndWorkingDayIdMutation()
  const [changeStateWorkingDate] =
    usePutAdminIdrVendorsByIdWorkingDaysAndWorkingDayIdChangeStateMutation()

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const changeStatus = async (status: boolean, callback?: () => void) => {
    try {
      const selectedRows = gridRef.current!.api.getSelectedRows()
      const requests = selectedRows.map(({ workingDaysId, ...rest }) => {
        const { _actions, data, messages, success, ...prev } = rest
        return changeStateWorkingDate({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          changeStateWorkingDaysModel: {
            isActive: status,
          },
          workingDayId: workingDaysId,
          id: vendorData?.data?.id!,
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
          { field: 'CategoryName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchDeliveryDays',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchDeliveryDays')
      }
    }
  }

  const getMenuItems = useCallback((props: ICellRendererParams) => {
    let items: GridActionMenuProps[] = [
      {
        label: formatMessage(phrasesMessages.public),
        children: [
          {
            icon: 'pen',
            label: formatMessage(phrasesMessages.edit),
            onClick: () => setIsOpenAddEditDialog({ show: true, data: props?.data }),
          },
          {
            icon: 'trashAlt',
            label: formatMessage(phrasesMessages.delete),
            onClick: () => {
              setDeleteDialogState({ show: true })
            },
          },
        ],
      },
    ]
    return items
  }, [])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <GridActionColumn {...props} menuItems={getMenuItems(props)} />
    },
    [gridRef.current?.api?.getSelectedRows()],
  )

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 90,
        minWidth: 90,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        cellRenderer: GridActions,
        checkboxSelection,
        headerCheckboxSelection,
        editable: false,
      },
      {
        field: '',
        headerName: formatMessage(businessDaysMessages.row),
        filter: 'agTextColumnFilter',
        minWidth: 110,
        maxWidth: 110,
        hide: false,
        cellRenderer: (params: ICellRendererParams) => {
          return params.rowIndex + 1
        },
      },
      {
        field: 'weekDaysTitle',
        headerName: formatMessage(businessDaysMessages.days),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        hide: false,
        cellRenderer: ({ value }: ICellRendererParams) => {
          return value?.slice(0, -1)
        },
      },
      {
        field: 'dayType',
        headerName: formatMessage(businessDaysMessages.workDay),
        filter: 'agTextColumnFilter',
        hide: false,
        minWidth: 110,
        maxWidth: 110,
        cellRenderer: ({ value }: ICellRendererParams) => {
          return value === 1102001 ? (
            <HBIcon type="checkCircle" sx={{ color: 'success.main' }} />
          ) : (
            <HBIcon type="timesCircle" sx={{ color: 'error.dark' }} />
          )
        },
      },
      {
        field: 'dayType',
        headerName: formatMessage(businessDaysMessages.holiDay),
        filter: 'agTextColumnFilter',
        minWidth: 110,
        maxWidth: 110,
        hide: false,
        cellRenderer: ({ value }: ICellRendererParams) => {
          return value === 1102002 ? (
            <HBIcon type="checkCircle" sx={{ color: 'success.main' }} />
          ) : (
            <HBIcon type="timesCircle" sx={{ color: 'error.dark' }} />
          )
        },
      },
      {
        field: 'dayType',
        headerName: formatMessage(businessDaysMessages.partTime),
        filter: 'agTextColumnFilter',
        minWidth: 110,
        maxWidth: 110,
        hide: false,
        cellRenderer: ({ value }: ICellRendererParams) => {
          return value === 1102003 ? (
            <HBIcon type="checkCircle" sx={{ color: 'success.main' }} />
          ) : (
            <HBIcon type="timesCircle" sx={{ color: 'error.dark' }} />
          )
        },
      },
      {
        field: 'deliveryFromHours',
        headerName: formatMessage(businessDaysMessages.deliveryFrom),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        hide: false,
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.value) return '-'
          return (
            <Stack spacing={1} direction="row" mt={2}>
              <Typography variant="body2">
                {new Date(params.value).toLocaleTimeString('fa-IR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Stack>
          )
        },
      },
      {
        field: 'deliveryToHours',
        headerName: formatMessage(businessDaysMessages.deliveryTo),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        hide: false,
        cellRenderer: (params: ICellRendererParams) => {
          if (!params.value) return '-'
          return (
            <Stack spacing={1} direction="row" mt={2}>
              <Typography variant="body2">
                {new Date(params.value).toLocaleTimeString('fa-IR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Stack>
          )
        },
      },
      {
        field: 'isActive',
        headerName: formatMessage(businessDaysMessages.status),
        filter: 'agTextColumnFilter',
        minWidth: 110,
        maxWidth: 110,
        hide: false,
        cellRenderer: ({ data }: ICellRendererParams) => {
          return (
            <HBSwitch
              checked={data.isActive}
              onChange={(e) => changeStatus(e.target.checked, () => refreshGridData())}
            />
          )
        },
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

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

  const handleRemoveWorkingDay = async (
    workingDayIds: string[],
    setLoading: (loading: boolean) => void,
    callback: () => void,
  ) => {
    const requests = workingDayIds.map((id) => {
      return deleteWorkingDay({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: vendorData?.data?.id!,
        workingDayId: id,
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
        message: formatMessage(businessDaysMessages.workingDayDeleteSuccessFully, {
          count: success,
        }),
        type: 'success',
      })
    }
    setLoading(false)
    callback()
  }

  return {
    columnDefs,
    handleChangedGridActions,
    getToolbarMoreItems,
    refreshGridData,
    changeStatus,
    handleRemoveWorkingDay,
    gridLoading,
  }
}
export default useDeliveryDaysGrid
