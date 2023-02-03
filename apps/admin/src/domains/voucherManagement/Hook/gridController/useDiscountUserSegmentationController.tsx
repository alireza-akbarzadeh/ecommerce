import HBDataGridActionHeader from '@hasty-bazar/admin-shared/components/HBDataGridActionHeader'
import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { VoucherManagemendDataGridProps as VoucherManagementDataGridProps } from '@hasty-bazar-admin/domains/voucherManagement/types/VoucherManagemendDataGridProps'
import { usePostAdminSaleVoucherByIdVendorsDownloadExcelFileMutation } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBAgGridClasses, MenuItemProps } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import VoucherManagementPageMessages from '../../VoucherManagementPage.messages'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 550,
  },
}

const useDiscountUserSegmentationController = () => {
  const { formatMessage } = useIntl()
  const { query: { slug = [] } = {} } = useRouter()
  const [, id] = slug
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)
  const [selectedRows, setSelectedRows] = useState<VoucherManagementDataGridProps[]>([])
  const gridRef = useRef<HBDataGridClientRef>(null)
  const router = useRouter()
  const voucherId: string = router?.query?.id?.[0] as string
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/voucher/${voucherId}/vendors`

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
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

  const handleChangedSelectedRows = (selectedRows: VoucherManagementDataGridProps[]) => {
    setSelectedRows(selectedRows)
  }

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0
    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const [PostAdminSaleVoucherByIdVendorsDownload] =
    usePostAdminSaleVoucherByIdVendorsDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await PostAdminSaleVoucherByIdVendorsDownload({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      downloadVoucherVendorsExcel: {
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

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 110,
        minWidth: 110,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        checkboxSelection,
        headerCheckboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
        },
        headerComponent: HBDataGridActionHeader,
      },

      {
        field: 'code',
        maxWidth: 200,
        headerName: formatMessage(VoucherManagementPageMessages.userTypeCategories),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'code',
        maxWidth: 200,
        headerName: formatMessage(VoucherManagementPageMessages.userTypeCode),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'code',
        maxWidth: 200,
        headerName: formatMessage(VoucherManagementPageMessages.categoriesDesc),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'code',
        maxWidth: 200,
        headerName: formatMessage(VoucherManagementPageMessages.lastModifiedDate),
        filter: 'agTextColumnFilter',
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const handleChangedGridActions = (
    value: number | string | unknown,
    type: 'search' | 'status',
  ) => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'FullName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchSeller',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      }
    }
  }
  return {
    id,
    gridRef,
    columnDefs,
    formatMessage,
    actionUrl,
    classes,
    handleChangedGridActions,
    isAddOrEdit,
    toolbarStatus,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    selectedRows,
    refreshGridData,
    cancelAddVoucherSubmission,
    checkboxSelection,
    headerCheckboxSelection,
    toolbarMoreItems,
  }
}

export default useDiscountUserSegmentationController
