import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import {
  useDeleteAdminSaleApiShippingProvidersByProviderIdOutOfServiceProgramsMutation,
  usePostAdminSaleApiShippingProvidersByProviderIdOutOfServiceProgramsMutation,
  usePutAdminSaleApiShippingProvidersByProviderIdOutOfServiceProgramsAndIdMutation,
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
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)
  const [workingDaysId, setWorkingDaysId] = useState<string>('')
  const [editException] =
    usePutAdminSaleApiShippingProvidersByProviderIdOutOfServiceProgramsAndIdMutation()
  const [createException] =
    usePostAdminSaleApiShippingProvidersByProviderIdOutOfServiceProgramsMutation()
  const [deleteCertificate] =
    useDeleteAdminSaleApiShippingProvidersByProviderIdOutOfServiceProgramsMutation()
  const { formatMessage } = useIntl()
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

  const cancelEditWorkingDaysSubmission = () => {
    setIsAddOrEdit(false)
    setWorkingDaysId('')
  }

  const handleSetIsAddOrEdit = (value: boolean) => {
    setIsAddOrEdit(value)
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }, [])

  const editWorkingDaysSubmission = () => {
    const selectedNode = gridRef?.current?.api.getModel().getRow(0)
    gridLoading(true)
    editException({
      providerId: id!,
      id: selectedNode?.data.id,
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      updateOutOfServiceProgramModel: {
        date: selectedNode?.data.date,
        fromHour: selectedNode?.data.fromHour,
        toHour: selectedNode?.data.toHour,
      },
    })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          refreshGridData()
          openToast({
            message: formatMessage(ShippingProviderMessages.updateSuccess),
            type: 'success',
          })
          setWorkingDaysId('')
        }
        setIsAddOrEdit(false)
      })
      .catch((e) => {})
      .finally(() => {
        gridLoading(false)
      })
  }

  const cancelAddWorkingDaysSubmission = () => {
    let exceptionData = gridRef?.current?.api.getModel().getRow(0)
    gridRef?.current?.api.applyTransactionAsync({
      remove: [exceptionData?.data],
    })!
    setIsAddOrEdit(false)
  }

  const addWorkingDaysSubmission = async () => {
    const newRow = gridRef?.current?.api.getModel().getRow(0)
    let exceptionData = getAllRows()

    gridLoading(true)
    createException({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      providerId: id!,
      createOutOfServiceProgramModel: {
        date: newRow?.data?.date,
        fromHour: newRow?.data?.fromHour,
        toHour: newRow?.data?.toHour,
      },
    })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          refreshGridData()
          openToast({
            message: formatMessage(ShippingProviderMessages.addSuccess),
            type: 'success',
          })
        }
        setIsAddOrEdit(false)
      })
      .catch((e) => {})
      .finally(() => {
        gridLoading(false)
      })
  }

  const handleEditWorkingDays = (id: string) => {
    setIsAddOrEdit(true)
    setWorkingDaysId(id)
  }

  const setSelectRow = (value: ExceptionDataGridModel[]) => {
    setSelectedRows(value)
  }

  const deleteWorkingDays = useCallback(async () => {
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

  return {
    selectedRows,
    checkboxSelection,
    headerCheckboxSelection,
    cancelEditWorkingDaysSubmission,
    toolbarStatus,
    getAllRows,
    gridLoading,
    editWorkingDaysSubmission,
    addWorkingDaysSubmission,
    setSelectRow,
    handleSetIsAddOrEdit,
    isAddOrEdit,
    handleEditWorkingDays,
    handleSetDeleteDialogState,
    refreshGridData,
    workingDaysId,
    cancelAddWorkingDaysSubmission,
    deleteDialogState,
    deleteWorkingDays,
  }
}

export default useContractDetail
