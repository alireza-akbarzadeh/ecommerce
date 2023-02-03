import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import HBDataGridActionHeader from '@hasty-bazar/admin-shared/components/HBDataGridActionHeader'
import { HBChangeRecordHistory } from '@hasty-bazar/admin-shared/containers/HBChangeRecordHistory'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, MenuItemProps } from '@hasty-bazar/core'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import documentsPageMessages from '../Documents-File-Types.messages'
import DocumentGridActionColumn from './DocumentFileTyprsGridActionColumn'
import useDocumentsAttributesGrid from './hooks/useDocumentsFileTypesGrid'

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

export default function DocumentsAttributesGrid() {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const gridRef = useRef<HBDataGridClientRef>(null)

  const breadcrumbs = useMemo(
    () => [
      {
        url: '/',
        title: formatMessage(documentsPageMessages.breadcrumbHome),
      },
      {
        url: '#',
        title: formatMessage(documentsPageMessages.documentFileTypesPageTitle),
      },
    ],
    [],
  )

  const [actionUrl, setActionUrl] = useState(
    `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/CMS/fileTypes`,
  )
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [status, setStatus] = useState<boolean>()
  const [openActive, setOpenActive] = useState(false)

  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })
  const [recordChangeHistory, setRecordChangeHistory] = useState({
    show: false,
    entityId: '',
  })

  const {
    handleRemoveFile,
    checkboxSelection,
    headerCheckboxSelection,
    documentGridColumns,
    documentGridToolbarMenu,
    gridLoading,
    changeActive,
  } = useDocumentsAttributesGrid(gridRef)

  const handleChangeStatus = (status: boolean) => {
    setStatus(status)
    setOpenActive(true)
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    const activeCount = selectedRows.filter((row) => row.isActive).length
    const unActiveCount = selectedRows.filter((row) => !row.isActive).length
    const disabledActive = unActiveCount === 0
    const disabledUnActive = activeCount === 0
    const disabledOnNoSelected = selectedRows.length === 0
    return documentGridToolbarMenu({
      disabledActive,
      disabledUnActive,
      disabledOnNoSelected,
      handleChangeStatus,
    })
  }, [selectedRows])

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <DocumentGridActionColumn
          {...props}
          editUser={handleEditDocumentFileTypes}
          showDeleteModal={setDeleteDialogState}
          setRecordChangeHistory={setRecordChangeHistory}
        />
      )
    },
    [selectedRows],
  )

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
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
      ...documentGridColumns(),
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

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value === 1 ? 'true' : value === 0 ? 'false' : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      let filterFirstComponent = gridRef.current!.api.getFilterInstance('name')
      filterFirstComponent &&
        filterFirstComponent.setModel({
          type: 'contains',
          filter: value ?? null,
        })
      gridRef.current!.api.onFilterChanged()
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  const handleEditDocumentFileTypes = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/documents-file-types/edit/${id}`)
  }

  const handleAddDocumentFileTypes = () => {
    router.push('/documents-file-types/add')
  }

  const handleDeleteFile = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      handleRemoveFile(ids, () => {
        setDeleteDialogState({ show: false, id: undefined })
        refreshGridData()
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const handleChangeActive = useCallback(async () => {
    changeActive(!!status, () => {
      refreshGridData()
      setStatus(undefined)
      setOpenActive(false)
    })
  }, [status])

  return (
    <>
      <HBDataGridClient
        id="documents-file-types-grid"
        actionUrl={actionUrl}
        editUrl="/documents-file-types/edit/"
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(documentsPageMessages.documentFileTypesPageTitle)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        GridToolbar={(props: any) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{
              disabled: toolbarStatus.disabledOnSelected,
              onClick: handleAddDocumentFileTypes,
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: handleEditDocumentFileTypes,
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            items={toolbarMoreItems}
            {...props}
          />
        )}
      />
      <HBDialog
        content={formatMessage(documentsPageMessages.deleteFileConfirm, {
          fileCount: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(documentsPageMessages.deleteDocument)}
        onAccept={handleDeleteFile}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(documentsPageMessages.changeStatusConfirm, {
          fileCount: selectedRows.length,
        })}
        title={formatMessage(documentsPageMessages.changeStatus)}
        onAccept={handleChangeActive}
        onReject={() => setOpenActive(false)}
        open={openActive}
        onClose={() => setOpenActive(false)}
        acceptBtn={formatMessage(phrasesMessages.edit)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBChangeRecordHistory
        open={recordChangeHistory.show}
        entityId={recordChangeHistory.entityId!}
        onClose={() => setRecordChangeHistory({ show: false, entityId: '' })}
        tableName="fileType"
      />
    </>
  )
}
