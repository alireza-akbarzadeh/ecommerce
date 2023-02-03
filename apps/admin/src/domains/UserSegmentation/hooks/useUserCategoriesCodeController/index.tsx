import { GridWorkflowActionColumn } from '@hasty-bazar/admin-shared/containers'
import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  generalDataApi,
  useDeleteAdminGeneralDataUserSegmentationByIdMutation,
  usePostAdminGeneralDataUserSegmentationChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { MenuItemProps } from '@hasty-bazar/core'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { UserCategoriesWorkFLow } from '../../enums/UserCategoriesWorkFLow'
import UserCategoriesMessage from '../../messages/UserCategoriesMessage'
import useUserCategoriesGridColumn from '../useUserCategoriesGridColumn'
const useReportVoucherCodeController = () => {
  const gridRef = useRef<HBDataGridClientRef>(null)

  const {
    checkboxSelection,
    headerCheckboxSelection,
    userGridToolbarMenu,
    userCategoriesGridColumnList,
  } = useUserCategoriesGridColumn(gridRef)

  const { formatMessage } = useIntl()
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [recordChangeHistory, setRecordChangeHistory] = useState({
    show: false,
    entityId: '',
  })
  const { showToast } = useToast()

  const router = useRouter()

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/UserSegmentation`

  const handleDeleteDialog = () => {
    setOpenDialog(true)
  }

  const handleAddUserCategories = () => {
    router.push('/userCategories/add')
  }

  const handleEditUserCategories = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/userCategories/edit/${id}`)
  }

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor={String(UserCategoriesWorkFLow.Factor)}
          stateMachineCode={String(StateMachineCode.MarketingList)}
          useChangeState={usePostAdminGeneralDataUserSegmentationChangeStateMutation}
          useLazyGetStateList={
            generalDataApi.useLazyGetAdminGeneralDataUserSegmentationGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          onChangesState={refreshGridData}
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => handleEditUserCategories(props?.data?.id),
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => handleDeleteDialog(),
                },
                {
                  icon: 'history',
                  label: formatMessage(phrasesMessages.recordHistory),
                  onClick: () => setRecordChangeHistory?.({ show: true, entityId: props.data.id }),
                },
              ],
            },
          ]}
        />
      )
    },
    [selectedRows],
  )

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleDeleteOrder = () => {
    gridLoading(true)
  }

  const columnDefs = useMemo(
    () => [
      {
        field: 'id',
        headerName: '',
        maxWidth: 120,
        minWidth: 120,
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
          innerRenderer: GridActions,
        },
      },
      ...userCategoriesGridColumnList(),
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )
  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return userGridToolbarMenu()
  }, [selectedRows])

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  const handleChangedGridActions = (
    value: number | string | unknown,
    type: 'search' | 'status',
  ) => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Name', operator: 'contains', value: String(value) },
          { field: 'Number', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchUserCategories',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchUserCategories')
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
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.admin),
    },
    {
      url: '#',
      title: formatMessage(UserCategoriesMessage.userCategories),
    },
  ]

  const [deleteAdminGeneralDataUserSegmentationById] =
    useDeleteAdminGeneralDataUserSegmentationByIdMutation()
  const gridRowsData = gridRef?.current?.api?.getSelectedRows()

  const handleDeleteUserCategories = async () => {
    if (gridRowsData) {
      deleteAdminGeneralDataUserSegmentationById({
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

  return {
    actionUrl,
    columnDefs,
    formatMessage,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    gridRef,
    handleChangedGridActions,
    toolbarStatus,
    selectedRows,
    refreshGridData,
    toolbarMoreItems,
    handleDeleteOrder,
    breadcrumbs,
    handleDeleteUserCategories,
    openDialog,
    setOpenDialog,
    handleAddUserCategories,
    handleDeleteDialog,
    handleEditUserCategories,
    recordChangeHistory,
    setRecordChangeHistory,
  }
}

export default useReportVoucherCodeController
