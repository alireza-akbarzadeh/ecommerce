import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminGeneralDataCurrencyByIdMutation,
  usePutAdminGeneralDataCurrencyByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { openToast } from '@hasty-bazar/core'
import { ColDef } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { currenciesMessage } from '../Currencies.message'
import { SelectRowModel } from '../types/types'
import useGridColumns from './useGridColumns'

const useCurrenciesGrid = () => {
  const { formatMessage } = useIntl()
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/Currency/GetAll`
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '#',
      title: formatMessage(currenciesMessage.currencies),
    },
  ]
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])
  const router = useRouter()
  const id = router.query.id?.[0]
  const gridRef = useRef<HBDataGridClientRef>(null)

  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()
  const [selectedRows, setSelectedRows] = useState<SelectRowModel[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const [addEditDialogState, setAddEditDialogState] = useState(false)
  const [isEditOrAdd, setIsEditOrAdd] = useState(false)
  const [editId, setEditId] = useState<string>()

  const [deleteFilterItem] = useDeleteAdminGeneralDataCurrencyByIdMutation()

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
          { field: 'LatinName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchCurrency',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchCurrency')
      }
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: SelectRowModel[]) => {
    setSelectedRows(selectedRows)
  }

  const handleDelete = useCallback(async () => {
    const ids = selectedRows.map((item) => item.id)
    for (const id of ids) {
      await deleteFilterItem({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: String(id),
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(currenciesMessage.successfullyDeleted),
            type: 'success',
          })
        }
      })
    }
    refreshGridData()
    setDeleteDialogState({ show: false })
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: string) => {
    setDeleteDialogState({ show, id })
  }

  const handleEditItem = (id: string) => {
    setIsEditOrAdd(true)
    setEditId(id)
    setAddEditDialogState(true)
  }

  const { columnDefs } = useGridColumns({
    gridRef,
    selectedRows,
    editId,
    attributeId: id!,
    onDelete,
    onEditClick: handleEditItem,
  })

  const handleAddItem = () => {
    setIsEditOrAdd(true)
    setEditId(undefined)
    setAddEditDialogState(true)
  }

  const handleCancelClick = () => {
    setAddEditDialogState(false)
    setIsEditOrAdd(false)
    setEditId(undefined)
  }

  const handleSave = () => {
    refreshGridData(!editId)
    handleCancelClick()
  }

  const handleChangeStatus = (status: boolean) => {
    setStatus(status)
    setOpenActive(true)
  }

  const [updateState] = usePutAdminGeneralDataCurrencyByIdMutation()

  const handleChangeActive = useCallback(async () => {
    selectedRows.forEach((selectedRow) => {
      updateState({
        'client-name': 'hasty-bazar',
        'client-version': '1.0.0',
        id: selectedRow.id,
        updateCurrencyModel: {
          code: String(selectedRow.code),
          isActive: status,
          latinName: String(selectedRow?.latinName),
          name: String(selectedRow?.name),
          symbol: String(selectedRow?.symbol),
        },
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(currenciesMessage.updateSuccess),
              type: 'success',
            })
            setOpenActive(false)
            refreshGridData()
          }
        })
    })
  }, [status])

  return {
    actionUrl,
    breadcrumbs,
    autoGroupColumnDef,
    gridRef,
    selectedRows,
    isEditOrAdd,
    columnDefs,
    addEditDialogState,
    openActive,
    editId,
    deleteDialogState,
    formatMessage,
    handleChangedSelectedRows,
    handleEditItem,
    onDelete,
    handleChangedGridActions,
    refreshGridData,
    handleCancelClick,
    handleAddItem,
    handleChangeStatus,
    handleSave,
    handleChangeActive,
    setOpenActive,
    setDeleteDialogState,
    handleDelete,
  }
}

export default useCurrenciesGrid
