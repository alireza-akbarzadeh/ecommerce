import { GridActionColumn, GridActionMenuProps } from '@hasty-bazar/admin-shared/components'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetVendorStoreResultApiResult,
  useDeleteAdminIdrVendorsByIdHolidayDateAndHolidayDateIdMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { openToast } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { Dispatch, RefObject, SetStateAction, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import businessDaysMessages from '../businessDays.messages'

const useNonDeliveryDaysGrid = (
  gridRef: RefObject<HBDataGridClientRef>,
  vendorData: GetVendorStoreResultApiResult,
  setDeleteDialogState: Dispatch<
    SetStateAction<{
      show: boolean
      id?: string | undefined
    }>
  >,
) => {
  const { formatMessage } = useIntl()

  const [deleteHolidayDay] = useDeleteAdminIdrVendorsByIdHolidayDateAndHolidayDateIdMutation()

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

  const getMenuItems = useCallback((props: ICellRendererParams) => {
    let items: GridActionMenuProps[] = [
      {
        label: formatMessage(phrasesMessages.public),
        children: [
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
        maxWidth: 130,
        hide: false,
        cellRenderer: (params: ICellRendererParams) => {
          return params.rowIndex + 1
        },
      },
      {
        field: 'date',
        headerName: formatMessage(businessDaysMessages.vocationDay),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        hide: false,
        cellRenderer: ({ value }: ICellRendererParams) => {
          return value
            ? new Date(value).toLocaleDateString('fa-IR', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })
            : '-'
        },
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

  const handleRemoveHolidayDay = async (
    holidayDayIds: string[],
    setLoading: (loading: boolean) => void,
    callback: () => void,
  ) => {
    const requests = holidayDayIds.map((id) => {
      return deleteHolidayDay({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        holidayDateId: id,
        id: vendorData?.data?.id!,
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
        message: formatMessage(businessDaysMessages.holidayDayDeleteSuccessFully, {
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
    refreshGridData,
    handleRemoveHolidayDay,
    gridLoading,
  }
}
export default useNonDeliveryDaysGrid
