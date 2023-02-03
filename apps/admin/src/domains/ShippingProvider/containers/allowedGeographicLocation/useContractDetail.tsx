import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import {
  useDeleteAdminSaleApiShippingProvidersByProviderIdMappingCitiesMutation,
  usePostAdminSaleApiShippingProvidersByProviderIdMappingCitiesMutation,
  usePutAdminSaleApiShippingProvidersByProviderIdMappingCitiesAndIdMutation,
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
  providerCityId: string
  platformCityId: string
  platformCityName: string
  createdOn: Date
}

const useContractDetail = (gridRef: RefObject<HBDataGridClientRef>, id: string) => {
  const [selectedRows, setSelectedRows] = useState<ExceptionDataGridModel[]>([])
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)
  const [geographicLocationId, setGeographicLocationId] = useState<string>('')
  const [editException] =
    usePutAdminSaleApiShippingProvidersByProviderIdMappingCitiesAndIdMutation()
  const [createException] = usePostAdminSaleApiShippingProvidersByProviderIdMappingCitiesMutation()
  const [deleteCertificate] =
    useDeleteAdminSaleApiShippingProvidersByProviderIdMappingCitiesMutation()
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

  const cancelEditGeographicLocationSubmission = () => {
    setIsAddOrEdit(false)
    setGeographicLocationId('')
  }

  const handleSetIsAddOrEdit = (value: boolean) => {
    setIsAddOrEdit(value)
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }, [])

  const editGeographicLocationSubmission = () => {
    const selectedNode = gridRef?.current?.api.getModel().getRow(0)
    gridLoading(true)
    editException({
      providerId: id!,
      id: selectedNode?.data.id,
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      updateProviderCityModel: {
        providerCityId: selectedNode?.data.providerCityId,
        platformCityId: selectedNode?.data.platformCityId,
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
        }
        setIsAddOrEdit(false)
        setGeographicLocationId('')
      })
      .catch((e) => {})
      .finally(() => {
        gridLoading(false)
      })
  }

  const cancelAddGeographicLocationSubmission = () => {
    let exceptionData = gridRef?.current?.api.getModel().getRow(0)
    gridRef?.current?.api.applyTransactionAsync({
      remove: [exceptionData?.data],
    })!
    setIsAddOrEdit(false)
  }

  const addGeographicLocationSubmission = async () => {
    const newRow = gridRef?.current?.api.getModel().getRow(0)

    gridLoading(true)
    createException({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      providerId: id!,
      createProviderCityModel: {
        providerCityId: newRow?.data.providerCityId,
        platformCityId: newRow?.data.platformCityId,
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

  const handleEditGeographicLocation = (id: string) => {
    setIsAddOrEdit(true)
    setGeographicLocationId(id)
  }

  const setSelectRow = (value: ExceptionDataGridModel[]) => {
    setSelectedRows(value)
  }

  const deleteGeographicLocation = useCallback(async () => {
    const selectedRows = gridRef?.current?.api.getSelectedRows()
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows?.map((row) => row.id)
      gridLoading(true)
      return deleteCertificate({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        providerId: id,
        body: ids!,
      }).then((res: any) => {
        if (res?.data?.success) {
          refreshGridData()
          openToast({
            message: formatMessage(ShippingProviderMessages.successDelete),
            type: 'success',
          })
        }
        handleSetDeleteDialogState({ show: false })
        gridLoading(false)
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const editShippingProvider = (id: string) => {
    setIsAddOrEdit(true)
    setGeographicLocationId(id)
  }

  return {
    selectedRows,
    checkboxSelection,
    headerCheckboxSelection,
    cancelEditGeographicLocationSubmission,
    toolbarStatus,
    getAllRows,
    gridLoading,
    editGeographicLocationSubmission,
    addGeographicLocationSubmission,
    setSelectRow,
    handleSetIsAddOrEdit,
    isAddOrEdit,
    handleEditGeographicLocation,
    handleSetDeleteDialogState,
    editShippingProvider,
    refreshGridData,
    geographicLocationId,
    cancelAddGeographicLocationSubmission,
    deleteDialogState,
    deleteGeographicLocation,
  }
}

export default useContractDetail
