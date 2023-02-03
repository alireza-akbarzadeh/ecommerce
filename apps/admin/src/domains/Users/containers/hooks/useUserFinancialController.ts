import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import {
  useDeleteAdminIdrRolesByIdBankAccountAndBankAccountIdMutation,
  useGetAdminIdrPartiesByPartyIdBankAccountsQuery,
  useGetAdminIdrRolesByPartyIdQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { MenuItemProps, openToast } from '@hasty-bazar/core'
import { useTheme } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useUserFinancialGrid from './useUserFinancialGrid'

function useUserFinancialController() {
  const { formatMessage } = useIntl()
  const { spacing } = useTheme()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [status, setStatus] = useState<boolean>()
  const [openActive, setOpenActive] = useState(false)
  const [stepDialog, setStepDialog] = useState<'one' | 'tow' | 'three' | null>(null)
  const [contentTypeModal, setContentTypeModal] = useState<
    'copy' | 'create' | 'edit' | 'delete' | null
  >('create')

  const router = useRouter()
  const partyId: string = router?.query?.id?.[0] as string
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/IDR/parties/${partyId}/bankAccounts`

  //@ts-ignore
  const { data } = useGetAdminIdrRolesByPartyIdQuery({ partyId })

  const createRoles: any = data?.data?.items?.map((role) => {
    return { title: role?.typeTitle, value: role?.id }
  })

  //@ts-ignore
  const { data: bankAccountData } = useGetAdminIdrPartiesByPartyIdBankAccountsQuery({
    partyId,
  })

  const { userGridToolbarMenu, checkboxSelection, headerCheckboxSelection, userGridColumns } =
    useUserFinancialGrid()

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
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
          { field: 'CardNumber', operator: 'contains', value: String(value) },
          { field: 'Iban', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchUserFinancial',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchUserFinancial')
      }
    }
  }

  const handleChangeStatus = (status: boolean) => {
    setStatus(status)
    setOpenActive(true)
  }
  const handleSelectRole = () => {
    gridRef.current!.api.setFilterModel('sad')
  }

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    const activeCount = selectedRows.filter((row) => row.isActive === 1).length
    const unActiveCount = selectedRows.filter((row) => row.isActive === 0).length
    const disabledActive = unActiveCount === 0
    const disabledUnActive = activeCount === 0
    const disabledOnNoSelected = selectedRows.length === 0
    return userGridToolbarMenu({
      disabledActive,
      disabledUnActive,
      disabledOnNoSelected,
      handleChangeStatus,
    })
  }, [selectedRows])

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const handleAddUser = () => {
    setContentTypeModal('create')
    setStepDialog('tow')
  }

  const handleEditUser = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    setContentTypeModal('edit')
    setStepDialog('tow')
  }
  const handleCopyAddress = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    setStepDialog('one')
    setContentTypeModal('copy')
  }
  const [deleteIdrRolesByIdBankAccountAndBankAccountId] =
    useDeleteAdminIdrRolesByIdBankAccountAndBankAccountIdMutation()

  const gridRowsData = gridRef?.current?.api?.getSelectedRows()

  const handleDeleteDialog = async () => {
    setContentTypeModal('delete')
    setStepDialog('one')
  }
  const handleDeleteAccount = async () => {
    setStepDialog('one')
    gridLoading(true)
    if (gridRowsData) {
      deleteIdrRolesByIdBankAccountAndBankAccountId({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: gridRowsData[0]?.partyRoleId,
        bankAccountId: gridRowsData[0]?.id,
      })
        .then((res: any) => {
          setStepDialog(null)
          if (res?.data?.success) {
            openToast({
              message: formatMessage(userPageMessages.deleteBankAccount),
              type: 'success',
            })
          }
        })
        .finally(() => {
          setContentTypeModal('delete')
          refreshGridData(true)
          gridLoading(false)
        })
    }
  }

  return {
    formatMessage,
    spacing,
    gridRef,
    selectedRows,
    setSelectedRows,
    status,
    setStatus,
    openActive,
    setOpenActive,
    stepDialog,
    setStepDialog,
    partyId,
    actionUrl,
    handleChangedSelectedRows,
    handleChangedGridActions,
    handleChangeStatus,
    handleSelectRole,
    autoGroupColumnDef,
    toolbarMoreItems,
    gridLoading,
    handleEditUser,
    handleDeleteDialog,
    handleAddUser,
    refreshGridData,
    checkboxSelection,
    headerCheckboxSelection,
    userGridColumns,
    contentTypeModal,
    setContentTypeModal,
    handleCopyAddress,
    createRoles,
    bankAccountData,
    handleDeleteAccount,
  }
}

export default useUserFinancialController
