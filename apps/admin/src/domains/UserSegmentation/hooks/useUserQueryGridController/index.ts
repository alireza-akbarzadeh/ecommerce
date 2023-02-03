import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  GetUserSegmentationResultsQueryResult,
  useDeleteAdminGeneralDataUserSegmentationByIdResultsMutation,
  usePostAdminGeneralDataUserSegmentationByIdRenewResultsMutation,
  usePostAdminGeneralDataUserSegmentationByIdResultsMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { HBAgGridClasses } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 500,
  },
}

const useUserQueryGridController = () => {
  const { formatMessage } = useIntl()
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const [openActive, setOpenActive] = useState(false)
  const [isAddOrEditUser, setIsAddOrEditUser] = useState(false)
  const [isAddOrEditPhone, setIsAddOrEditPhone] = useState(false)
  const [selectedRows, setSelectedRows] = useState<GetUserSegmentationResultsQueryResult[]>([])
  const { showToast } = useToast()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const router = useRouter()
  const categoryId: string = router?.query?.id?.[0] as string

  const [deleteAdminGeneralDataUserSegmentationByIdResults, { isLoading: deleteLoading }] =
    useDeleteAdminGeneralDataUserSegmentationByIdResultsMutation()

  const [postAdminGeneralDataUserSegmentationByIdResults] =
    usePostAdminGeneralDataUserSegmentationByIdResultsMutation()
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/UserSegMentation/${categoryId}/Results`

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const toggleGridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const cancelAddVoucherSubmission = () => {
    let certificateData = gridRef.current!.api.getModel().getRow(0)
    gridRef.current!.api.applyTransactionAsync({
      remove: [certificateData?.data],
    })!
    setIsAddOrEditUser(false)
    setIsAddOrEditPhone(false)
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: any) => {
    setSelectedRows(selectedRows)
  }

  const userAddCategoriesSubmission = async () => {
    const newRow = gridRef.current!.api.getModel().getRow(0)
    toggleGridLoading(true)

    const data = {
      partyId: newRow?.data?.fullName?.partyId,
      partyRoleId: newRow?.data?.fullName?.id,
    }

    postAdminGeneralDataUserSegmentationByIdResults({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: categoryId,
      addUserSegmentaionResultModel: data,
    })
      .unwrap()
      .then(() => {
        refreshGridData()
        setIsAddOrEditUser(false)
        showToast(formatMessage(phrasesMessages.successAdd), 'success')
      })
      .catch((e) => {
        showToast(errorsToString(e), 'error')
      })
      .finally(() => {
        toggleGridLoading(false)
      })
  }
  const addPhoneCategoriesSubmission = async () => {
    const newRow = gridRef.current!.api.getModel().getRow(0)
    toggleGridLoading(true)
    const data = {
      cellPhoneNumber: newRow?.data?.mobile,
    }
    postAdminGeneralDataUserSegmentationByIdResults({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: categoryId,
      addUserSegmentaionResultModel: data,
    })
      .unwrap()
      .then(() => {
        refreshGridData()
        setIsAddOrEditPhone(false)
        showToast(formatMessage(phrasesMessages.successAdd), 'success')
      })
      .catch((e) => {
        showToast(errorsToString(e), 'error')
      })
      .finally(() => {
        toggleGridLoading(false)
      })
  }

  const handleAddUserNameCategories = () => {
    try {
      const row = {
        isAddUser: true,
      }
      gridRef.current!.api.applyTransactionAsync({
        add: [row],
        addIndex: 0,
      })
      setIsAddOrEditUser(true)
    } catch (e) {
      showToast(errorsToString(e), 'error')
    }
  }

  const handleAddUserPhone = () => {
    try {
      const row = {
        isAddPhone: true,
      }
      gridRef.current!.api.applyTransactionAsync({
        add: [row],
        addIndex: 0,
      })
      setIsAddOrEditPhone(true)
    } catch (e) {
      showToast(errorsToString(e), 'error')
    }
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
          { field: 'FullName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchUserQuery',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchUserQuery')
      }
    }
  }

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0
    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const handleDeleteUserCategories = async () => {
    let lookup = selectedRows?.map((rows) => rows.id)
    await deleteAdminGeneralDataUserSegmentationByIdResults({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      deleteUserSegmentationResultModel: {
        segmentationResultIds: lookup as string[],
      },
      id: categoryId,
    }).then((res: any) => {
      if (res?.data?.success) {
        showToast(formatMessage(phrasesMessages.successDelete), 'success')
        setDeleteDialogState((prev) => ({ ...prev, show: false }))
        refreshGridData()
      }
    })
  }
  const [postAdminGeneralDataUserSegmentationByIdRenewResults] =
    usePostAdminGeneralDataUserSegmentationByIdRenewResultsMutation()

  const handleCallQueryResult = () => {
    postAdminGeneralDataUserSegmentationByIdRenewResults({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: categoryId,
    }).then((res: any) => {
      if (res?.data?.success) {
        refreshGridData()
      }
    })
  }

  return {
    formatMessage,
    classes,
    handleChangedGridActions,
    isAddOrEditUser,
    isAddOrEditPhone,
    addPhoneCategoriesSubmission,
    toolbarStatus,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    gridRef,
    userAddCategoriesSubmission,
    setDeleteDialogState,
    selectedRows,
    refreshGridData,
    cancelAddVoucherSubmission,
    handleAddUserCategories: handleAddUserNameCategories,
    handleAddUserPhone,
    deleteDialogState,
    handleDeleteUserCategories,
    setOpenActive,
    openActive,
    checkboxSelection,
    headerCheckboxSelection,
    deleteLoading,
    actionUrl,
    handleCallQueryResult,
  }
}

export default useUserQueryGridController
