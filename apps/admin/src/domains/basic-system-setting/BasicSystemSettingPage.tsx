import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { HBChangeRecordHistory } from '@hasty-bazar/admin-shared/containers/HBChangeRecordHistory'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useDeleteAdminGeneralDataSystemSettingByIdMutation } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  HBAgGridClasses,
  HBDataGrigToolbar,
  HBDialog,
  MenuItemProps,
  openToast,
} from '@hasty-bazar/core'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import basicSystemSettingMessages from './BasicSystemSetting.messages'
import useSystemSettingGrid from './hooks/useBasicSystemGrid'
export const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

export default function BasicSystemSettingPage() {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/SystemSetting`
  const { formatMessage } = useIntl()
  const router = useRouter()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()
  const {
    handleChangedGridActions,
    gridLoading,
    getToolbarMoreItems,
    headerCheckboxSelection,
    checkboxSelection,
    changeStatus,
  } = useSystemSettingGrid(gridRef)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })
  const [recordChangeHistory, setRecordChangeHistory] = useState({
    show: false,
    entityId: '',
  })

  const handleChangeStatus = (status: boolean) => {
    setStatus(status)
    setOpenActive(true)
  }
  //@ts-ignore
  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return getToolbarMoreItems(handleChangeStatus)
  }, [selectedRows])

  const handleAddBasicSystem = () => router.push('/basic-system-setting/add')
  const handleEditBasicSystem = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/basic-system-setting/edit/${id}`)
  }
  const GridActions = useCallback((props: ICellRendererParams) => {
    return (
      <GridActionColumn
        {...props}
        menuItems={[
          {
            label: formatMessage(phrasesMessages.public),
            children: [
              {
                icon: 'pen',
                label: formatMessage(phrasesMessages.edit),
                onClick: () => handleEditBasicSystem(props.data.id),
              },
              {
                icon: 'trashAlt',
                label: formatMessage(phrasesMessages.delete),
                onClick: () => setDeleteDialogState({ show: true, id: props.data.id }),
              },
              {
                icon: 'historyAlt',
                label: formatMessage(phrasesMessages.recordHistory),
                onClick: () => setRecordChangeHistory({ show: true, entityId: props.data.id }),
              },
            ],
          },
        ]}
      />
    )
  }, [])

  const [deleteBasicSystem] = useDeleteAdminGeneralDataSystemSettingByIdMutation()
  const handleDelteBasicSystem = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      let responses: any[] = []
      const requests = ids.map((id) => {
        return deleteBasicSystem({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          id,
        }).then((res: any) => res)
      })
      gridLoading(true)
      setDeleteDialogState({ show: false, id: undefined })
      refreshGridData()
      gridLoading(false)
      responses = await Promise.all(requests)
      const success = responses.filter((res) => res?.data?.success).length
      if (success > 0) {
        openToast({
          message: formatMessage(basicSystemSettingMessages.successDelete, {
            count: success,
          }),
          type: 'success',
        })
      }
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0
    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const handleChangeActive = useCallback(async () => {
    changeStatus(status!, () => {
      refreshGridData()
      setStatus(undefined)
      setOpenActive(false)
    })
  }, [status])
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
          innerRenderer: GridActions,
        },
      },
      {
        field: 'name',
        headerName: formatMessage(basicSystemSettingMessages.name),
        minWidth: 180,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'value',
        headerName: formatMessage(basicSystemSettingMessages.controlValue),
        minWidth: 110,
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return params.value ? params.value : '-'
        },
      },
      {
        field: 'category',
        headerName: formatMessage(basicSystemSettingMessages.category),
        minWidth: 150,
      },
      {
        field: 'description',
        headerName: formatMessage(basicSystemSettingMessages.description),
        minWidth: 200,
        filter: 'agTextColumnFilter',
        tooltipField: 'description',
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(basicSystemSettingMessages.dashboard),
    },
    {
      url: '/basic-system-setting',
      title: formatMessage(basicSystemSettingMessages.basicSystemSetting),
    },
  ]

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api?.deselectAll()
  }, [])

  return (
    <>
      <HBDataGridClient
        id="basic-system-setting-grid"
        actionUrl={actionUrl}
        editUrl="/basic-system-setting/edit/"
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(basicSystemSettingMessages.basicSystemSetting)}
            breadItems={breadcrumbs}
          />
        }
        columnDefs={columnDefs}
        classes={classes}
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        detailRowAutoHeight
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ disabled: toolbarStatus.disabledOnSelected, onClick: handleAddBasicSystem }}
            statusProps={{ show: false }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: handleEditBasicSystem,
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => {
                setDeleteDialogState({ show: true })
              },
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            items={toolbarMoreItems}
            {...props}
          />
        )}
      />
      <HBDialog
        content={formatMessage(basicSystemSettingMessages.dialogConfirmationContent, {
          count: String(deleteDialogState?.id ? 1 : selectedRows.length),
        })}
        title={formatMessage(basicSystemSettingMessages.deleteSystem)}
        onAccept={handleDelteBasicSystem}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(basicSystemSettingMessages.dialogConfirmationStatus, {
          changeCount: selectedRows.length,
        })}
        title={formatMessage(basicSystemSettingMessages.changeStatus)}
        onAccept={handleChangeActive}
        onReject={() => setOpenActive(false)}
        open={openActive}
        onClose={() => setOpenActive(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBChangeRecordHistory
        open={recordChangeHistory.show}
        entityId={recordChangeHistory.entityId!}
        onClose={() => setRecordChangeHistory({ show: false, entityId: '' })}
        tableName="systemSetting"
      />
    </>
  )
}
