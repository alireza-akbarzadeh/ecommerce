import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { CertificatesDataGridProps } from '@hasty-bazar-admin/domains/Product-Group/containers/Certificates'
import ProductGroupPageMessages from '@hasty-bazar-admin/domains/Product-Group/ProductGroupPage.messages'
import { VoucherManagemendDataGridProps } from '@hasty-bazar-admin/domains/voucherManagement/types/VoucherManagemendDataGridProps'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  useDeleteAdminSaleVoucherByIdProductsAndProductIdMutation,
  usePostAdminSaleVoucherByIdProductsDownloadExcelFileMutation,
  usePostAdminSaleVoucherByIdProductsMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { HBAgGridClasses, MenuItemProps } from '@hasty-bazar/core'
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
    height: 550,
  },
}

const useProductCodeGridController = () => {
  const { formatMessage } = useIntl()
  const { query: { slug = [] } = {} } = useRouter()
  const [, id] = slug
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)
  const [selectedRows, setSelectedRows] = useState<VoucherManagemendDataGridProps[]>([])

  const { showToast } = useToast()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const router = useRouter()
  const voucherId: string = router?.query?.id?.[0] as string
  const gridRowsData = gridRef?.current?.api?.getSelectedRows()
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/voucher/${voucherId}/products`

  const [deleteSaleVoucherByIdProductsAndProductId, { isLoading: productLoading }] =
    useDeleteAdminSaleVoucherByIdProductsAndProductIdMutation()

  const [postSaleVoucherByIdProducts] = usePostAdminSaleVoucherByIdProductsMutation()

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }
  const getAllRows = () => {
    let certificateData: CertificatesDataGridProps[] = []
    gridRef.current!.api.forEachNode((node) => certificateData.push(node.data))
    return certificateData
  }

  const cancelAddVoucherSubmission = () => {
    let certificateData = gridRef.current!.api.getModel().getRow(0)
    gridRef.current!.api.applyTransaction({
      remove: [certificateData?.data],
    })!
    setIsAddOrEdit(false)
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

  const handleChangedSelectedRows = (selectedRows: VoucherManagemendDataGridProps[]) => {
    setSelectedRows(selectedRows)
  }

  const addVoucherSubmission = async () => {
    const newRow = gridRef.current!.api.getModel().getRow(0)
    let voucherData = getAllRows()
    if (
      voucherData.filter((voucher) => voucher?.id === newRow?.data.name && voucher?.id).length > 0
    ) {
      showToast(formatMessage(ProductGroupPageMessages.certificateDuplicateLicense), 'error')
      return
    }
    const data = {
      productID: newRow?.data?.productName.id,
    }
    gridLoading(true)
    postSaleVoucherByIdProducts({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: voucherId,
      assignVoucherProductModel: data,
    })
      .unwrap()
      .then(() => {
        refreshGridData()
        setIsAddOrEdit(false)
        showToast(formatMessage(phrasesMessages.successAdd), 'success')
      })
      .catch((e) => {
        showToast(errorsToString(e), 'error')
      })
      .finally(() => {
        gridLoading(false)
      })
  }

  const handleAddVoucher = () => {
    try {
      const row = {
        isAdd: true,
      }
      gridRef.current!.api.applyTransaction({
        add: [row],
        addIndex: 0,
      })
      setIsAddOrEdit(true)
    } catch (e) {
      showToast(errorsToString(e), 'error')
    }
  }

  const handleDeleteVoucher = async () => {
    if (gridRowsData) {
      await deleteSaleVoucherByIdProductsAndProductId({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        productId: gridRowsData[0]?.productId,
        id: voucherId,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(phrasesMessages.successDelete), 'success')
          setDeleteDialogState((prev) => ({ ...prev, show: false }))
          refreshGridData()
        }
      })
    }
  }

  const handleChangedGridActions = (
    value: number | string | unknown,
    type: 'search' | 'status',
  ) => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'ProductName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchProduct',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchProduct')
      }
    } else if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('stateName')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== '-1' ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    }
  }

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0
    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const [postAdminSaleVoucherByIdProductsDownloadExcel] =
    usePostAdminSaleVoucherByIdProductsDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await postAdminSaleVoucherByIdProductsDownloadExcel({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      downloadVoucherProductsExcel: {
        ...res,
        ...filterFields,
      },
      id: voucherId,
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef?.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  const voucherGridToolbarMenu = (): MenuItemProps[] => {
    return [
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'fileDownload',
        onClick: handleDownloadPage,
      },
      {
        label: formatMessage(phrasesMessages.downloadAll),
        icon: 'fileDownloadAlt',
        onClick: () => handleDownloadPage(true),
      },
    ]
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return voucherGridToolbarMenu()
  }, [selectedRows])

  return {
    formatMessage,
    actionUrl,
    classes,
    handleChangedGridActions,
    isAddOrEdit,
    toolbarStatus,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    gridRef,
    handleAddVoucher,
    setDeleteDialogState,
    selectedRows,
    refreshGridData,
    cancelAddVoucherSubmission,
    addVoucherSubmission,
    deleteDialogState,
    handleDeleteVoucher,
    checkboxSelection,
    headerCheckboxSelection,
    id,
    productLoading,
    toolbarMoreItems,
  }
}

export default useProductCodeGridController
