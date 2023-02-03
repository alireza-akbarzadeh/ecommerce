import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import {
  useDeleteAdminSaleApiShippingProvidersByProviderIdCategoryExceptionsMutation,
  usePostAdminSaleApiShippingProvidersByProviderIdCategoryExceptionsMutation,
  usePutAdminSaleApiShippingProvidersByProviderIdCategoryExceptionsAndIdMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { openToast } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
} from 'ag-grid-community'
import { RefObject, useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import ShippingProviderMessages from '../../shippingProvider.message'

interface ExceptionDataGridModel {
  id: string
  shippingProviderId: string
  productCategoryId: string
  productCategoryTitle: string
  createdOn: Date
}

const useContractDetail = (gridRef: RefObject<HBDataGridClientRef>, id: string) => {
  const [selectedRows, setSelectedRows] = useState<ExceptionDataGridModel[]>([])
  const { formatMessage } = useIntl()
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)
  const [CategoryGroupId, setCategoryGroupId] = useState<string>('')
  const [editException] =
    usePutAdminSaleApiShippingProvidersByProviderIdCategoryExceptionsAndIdMutation()
  const [createException] =
    usePostAdminSaleApiShippingProvidersByProviderIdCategoryExceptionsMutation()
  const [deleteCertificate] =
    useDeleteAdminSaleApiShippingProvidersByProviderIdCategoryExceptionsMutation()
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const handleSetDeleteDialogState = ({
    show,
    id = undefined,
  }: {
    show: boolean
    id?: string | undefined
  }) => {
    setDeleteDialogState({ show, id })
  }

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const getAllRows = () => {
    let exceptionData: ExceptionDataGridModel[] = []
    gridRef?.current?.api.forEachNode((node) => exceptionData.push(node.data))
    return exceptionData
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef?.current?.api.showLoadingOverlay()
    } else {
      gridRef?.current?.api.hideOverlay()
    }
  }

  const cancelEditCategoryGroupSubmission = () => {
    setIsAddOrEdit(false)
    setCategoryGroupId('')
  }

  const handleSetIsAddOrEdit = (value: boolean) => {
    setIsAddOrEdit(value)
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }, [])

  const editExceptionSubmission = () => {
    const selectedNode = gridRef?.current?.api.getModel().getRow(0)

    gridLoading(true)
    editException({
      providerId: id!,
      id: selectedNode?.data.id,
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      updateCategoryExceptionModel: {
        productCategoryId: selectedNode?.data?.productCategoryTitle,
      },
    })
      .unwrap()
      .then(() => {
        refreshGridData()
        setIsAddOrEdit(false)
        setCategoryGroupId('')
        openToast({
          message: formatMessage(ShippingProviderMessages.updateSuccess),
          type: 'success',
        })
      })
      .catch((e) => {})
      .finally(() => {
        gridLoading(false)
      })
  }

  const cancelAddCategoryGroupSubmission = () => {
    let exceptionData = gridRef?.current?.api.getModel().getRow(0)
    gridRef?.current?.api.applyTransactionAsync({
      remove: [exceptionData?.data],
    })!
    setIsAddOrEdit(false)
  }

  const addCategoryGroupSubmission = async () => {
    const newRow = gridRef?.current?.api.getModel().getRow(0)

    gridLoading(true)
    createException({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      providerId: id!,
      createCategoryExceptionModel: {
        productCategoryId: newRow?.data?.productCategoryTitle,
      },
    })
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          refreshGridData()
          openToast({
            message: formatMessage(ShippingProviderMessages.addSuccess),
            type: 'success',
          })
        }
      })
      .catch((e) => {})
      .finally(() => {
        setIsAddOrEdit(false)
        gridLoading(false)
      })
  }

  const handleEditCategoryGroup = (id: string) => {
    setIsAddOrEdit(true)
    setCategoryGroupId(id)
  }

  const setSelectRow = (value: ExceptionDataGridModel[]) => {
    setSelectedRows(value)
  }

  const deleteShippingProvider = useCallback(async () => {
    const selectedRows = gridRef?.current?.api.getSelectedRows()
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows?.map((row) => row.id)

      gridLoading(true)

      deleteCertificate({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        providerId: id,
        body: ids!,
      }).then((res: any) => {
        if (res?.data?.success) {
          gridLoading(false)
          openToast({
            message: formatMessage(ShippingProviderMessages.successDelete),
            type: 'success',
          })
        }
        handleSetDeleteDialogState({ show: false })
        refreshGridData()
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const editShippingProvider = (id: string) => {
    setIsAddOrEdit(true)
    setCategoryGroupId(id)
  }

  return {
    selectedRows,
    checkboxSelection,
    headerCheckboxSelection,
    cancelEditCategoryGroupSubmission,
    toolbarStatus,
    getAllRows,
    gridLoading,
    editExceptionSubmission,
    addCategoryGroupSubmission,
    setSelectRow,
    handleSetIsAddOrEdit,
    isAddOrEdit,
    handleEditCategoryGroup,
    handleSetDeleteDialogState,
    editShippingProvider,
    refreshGridData,
    CategoryGroupId,
    cancelAddCategoryGroupSubmission,
    deleteDialogState,
    deleteShippingProvider,
  }
}

export default useContractDetail
