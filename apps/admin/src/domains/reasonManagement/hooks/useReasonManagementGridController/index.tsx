import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import ReasonManageMentGridMessages from '@hasty-bazar-admin/domains/reasonManagement/ReasonManageMent.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import { useDeleteAdminGeneralDataReasonsSettingByIdMutation } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { GetAdminSaleReasonsSettingApiArg } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBAgGridClasses, MenuItemProps } from '@hasty-bazar/core'
import { ColDef } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useReasonGridColumns, useReasonGridColumnsController } from '../index'

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 220px)`,
  },
}
export default function useReasonManagementGridController() {
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [status, setStatus] = useState<string | number>('-1')
  const { showToast } = useToast()
  const router = useRouter()
  const gridRowsData = gridRef?.current?.api?.getSelectedRows()

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/admin/GeneralData/reasonsSetting`

  const { headerCheckboxSelection, checkboxSelection, ReasonGridColumns, reasonGridToolbarMenu } =
    useReasonGridColumns(gridRef)

  const handleChangedSelectedRows = (selectedRows: GetAdminSaleReasonsSettingApiArg[]) => {
    setSelectedRows(selectedRows)
  }

  const handleChangedGridActions = (
    value: number | string | unknown,
    type: 'search' | 'status',
  ) => {
    setStatus(value as string | number)
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('stateCode')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== '-1' ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Title', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchReason',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchReason')
      }
    }
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
    return reasonGridToolbarMenu()
  }, [selectedRows])

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const handleAddVoucher = () => {
    router.push('/reasonManagement/add')
  }

  const handleEditVoucher = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`reasonManagement/edit/${id}`)
  }

  const handleDeleteDialog = async () => {
    setOpenDialog(true)
  }

  const [deleteAdminGeneralDataReasonsSettingById, { isLoading }] =
    useDeleteAdminGeneralDataReasonsSettingByIdMutation()

  const handleDeleteReason = async () => {
    if (gridRowsData) {
      await deleteAdminGeneralDataReasonsSettingById({
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
      title: formatMessage(ReasonManageMentGridMessages.reasonsSettingsManagement),
    },
  ]
  const { columnDefs } = useReasonGridColumnsController({
    gridRef,
    handleEditVoucher,
    handleDeleteDialog,
    checkboxSelection,
    headerCheckboxSelection,
    selectedRows,
    refreshGridData,
  })

  return {
    formatMessage,
    gridRef,
    selectedRows,
    actionUrl,
    autoGroupColumnDef,
    toolbarMoreItems,
    classes,
    refreshGridData,
    checkboxSelection,
    ReasonGridColumns,
    breadcrumbs,
    openDialog,
    setOpenDialog,
    handleEditVoucher,
    handleDeleteDialog,
    handleChangedSelectedRows,
    handleChangedGridActions,
    headerCheckboxSelection,
    handleAddVoucher,
    handleDeleteReason,
    columnDefs,
    isLoading,
    status,
  }
}
