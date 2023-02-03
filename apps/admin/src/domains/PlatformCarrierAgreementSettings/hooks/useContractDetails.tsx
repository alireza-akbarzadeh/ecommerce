import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  useDeleteAdminSaleApiPlatformShippingContractByContractIdExceptionMutation,
  usePostAdminSaleApiPlatformShippingContractByContractIdExceptionMutation,
  usePutAdminSaleApiPlatformShippingContractByContractIdExceptionAndExceptionIdMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { RefObject, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import PlatformCarrierAgrrementsMessages from '../PlatformCarrierAgreementSettings.message'
import { ExceptionDataGridProps } from '../types'

interface useContractDetailsProps {
  gridRef: RefObject<HBDataGridClientRef>
  selectedRows: ExceptionDataGridProps[]
  id: string
}

const useContractDetails = ({ gridRef, selectedRows, id }: useContractDetailsProps) => {
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)
  const [exceptionId, setExceptionId] = useState<string>('')
  const { showToast } = useToast()
  const { formatMessage } = useIntl()
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const [createException] =
    usePostAdminSaleApiPlatformShippingContractByContractIdExceptionMutation()
  const [editException] =
    usePutAdminSaleApiPlatformShippingContractByContractIdExceptionAndExceptionIdMutation()
  const [deleteCertificate] =
    useDeleteAdminSaleApiPlatformShippingContractByContractIdExceptionMutation()

  const handleEditException = (id: string) => {
    setIsAddOrEdit(true)
    setExceptionId(id)
  }

  const cancelEditPlatformSubmission = () => {
    setIsAddOrEdit(false)
    setExceptionId('')
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }

  const handleAddException = () => {
    try {
      const row = {
        isRequird: false,
        isActive: true,
        isAdd: true,
        exceptionId: 0,
      }
      gridRef.current!.api.applyTransactionAsync({
        add: [row],
        addIndex: 0,
      })
      setIsAddOrEdit(true)
      refreshGridData()
    } catch (e) {}
  }

  const editExceptionSubmission = () => {
    const selectedNode = gridRef.current!.api.getModel().getRow(0)
    gridLoading(true)
    editException({
      contractId: id!,
      exceptionId: selectedNode?.data.id,
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      updateShippingContractExceptionModel: {
        vendorId: selectedNode?.data.vendorName,
        productCategoryId: selectedNode?.data?.productCategoryTitle,
      },
    })
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          setIsAddOrEdit(false)
          refreshGridData()
          showToast(formatMessage(PlatformCarrierAgrrementsMessages.updateSuccess), 'success')
          setExceptionId('')
        }
      })
      .catch((e) => {})
      .finally(() => {
        gridLoading(false)
      })
  }

  const cancelAddPlatformSubmission = () => {
    let exceptionData = gridRef.current!.api.getModel().getRow(0)
    gridRef.current!.api.applyTransactionAsync({
      remove: [exceptionData?.data],
    })!
    setIsAddOrEdit(false)
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const addExceptionSubmission = async () => {
    const newRow = gridRef.current!.api.getModel().getRow(0)

    gridLoading(true)
    createException({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      contractId: id!,
      createShippingContractExceptionModel: {
        vendorId: newRow?.data.vendorName,
        productCategoryId: newRow?.data.productCategoryTitle,
      },
    })
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          showToast(formatMessage(PlatformCarrierAgrrementsMessages.addSuccess), 'success')
          refreshGridData()
          setIsAddOrEdit(false)
        }
      })
      .catch((e) => {})
      .finally(() => {
        gridLoading(false)
      })
  }

  const deletePlatformShippingAgreements = useCallback(async () => {
    const selectedRows = gridRef.current!.api.getSelectedRows()
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)

      gridLoading(true)

      return deleteCertificate({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        body: ids,
        contractId: id!,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(PlatformCarrierAgrrementsMessages.successDelete), 'success')
          refreshGridData()
          setIsAddOrEdit(false)
        }
        gridLoading(false)
        setDeleteDialogState({ show: false })
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  return {
    isAddOrEdit,
    handleAddException,
    handleEditException,
    setDeleteDialogState,
    deleteDialogState,
    cancelEditPlatformSubmission,
    editExceptionSubmission,
    cancelAddPlatformSubmission,
    addExceptionSubmission,
    deletePlatformShippingAgreements,
    exceptionId,
  }
}

export default useContractDetails
