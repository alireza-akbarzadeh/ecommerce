import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useVoucherManagementGrid from '@hasty-bazar-admin/domains/voucherManagement/Hook/useVoucherManagementGrid'
import VoucherManagementPage from '@hasty-bazar-admin/domains/voucherManagement/VoucherManagementPage.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import { useDeleteAdminSaleVoucherByIdMutation } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBAgGridClasses, MenuItemProps } from '@hasty-bazar/core'
import { ColDef } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 220px)`,
  },
}

export default function useVoucherManagementController() {
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [status, setStatus] = useState<string | number>('-1')
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const { showToast } = useToast()
  const router = useRouter()

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/voucher/GetAll`

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  const handleChangedGridActions = (
    value: number | string | unknown,
    type: 'search' | 'status',
  ) => {
    setStatus(value as string | number)
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Code', operator: 'contains', value: String(value) },
          { field: 'Title', operator: 'contains', value: String(value) },
          { field: 'VendorFirstName', operator: 'contains', value: String(value) },
          { field: 'VendorLastName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchVoucher',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchVoucher')
      }
    } else if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('stateCode')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== '-1' ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    }
  }

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const handleAddVoucher = () => {
    router.push('/voucherManagement/add')
  }

  const handleEditVoucher = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`voucherManagement/edit/${id}`)
  }

  const gridRowsData = gridRef?.current?.api?.getSelectedRows()

  const handleDeleteDialog = () => {
    setOpenDialog(true)
  }

  const [deleteSaleVoucherById, { isLoading: deleteLoading }] =
    useDeleteAdminSaleVoucherByIdMutation()

  const handleDeleteVoucher = () => {
    if (gridRowsData) {
      deleteSaleVoucherById({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: gridRowsData[0]?.id,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(phrasesMessages.successDelete), 'success')
          setOpenDialog(false)
          refreshGridData()
        }
      })
    }
  }

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.admin),
    },
    {
      url: '#',
      title: formatMessage(VoucherManagementPage.VoucherTitle),
    },
  ]

  const { columnDefs, voucherGridToolbarMenu } = useVoucherManagementGrid({
    gridRef,
    handleDeleteDialog,
    handleEditVoucher,
    selectedRows,
    refreshGridData,
  })

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    const activeCount = selectedRows.filter((row) => row.isActive).length
    const unActiveCount = selectedRows.filter((row) => !row.isActive).length
    const disabledActive = unActiveCount === 0
    const disabledUnActive = activeCount === 0
    const disabledOnNoSelected = selectedRows.length === 0
    return voucherGridToolbarMenu()
  }, [selectedRows])

  return {
    columnDefs,
    formatMessage,
    gridRef,
    selectedRows,
    actionUrl,
    autoGroupColumnDef,
    toolbarMoreItems,
    classes,
    refreshGridData,
    breadcrumbs,
    openDialog,
    setOpenDialog,
    handleEditVoucher,
    handleDeleteDialog,
    handleChangedSelectedRows,
    handleChangedGridActions,
    handleAddVoucher,
    handleDeleteVoucher,
    deleteLoading,
    status,
  }
}
