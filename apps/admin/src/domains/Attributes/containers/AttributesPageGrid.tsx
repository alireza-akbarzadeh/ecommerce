import { GridActionColumn, Status } from '@hasty-bazar/admin-shared/components'
import { HBChangeRecordHistory } from '@hasty-bazar/admin-shared/containers/HBChangeRecordHistory'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  HBAgGridClasses,
  HBDataGrigToolbar,
  HBDialog,
  HBIcon,
  MenuItemProps,
} from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import attributesPageMessages from '../Attributes.messages'
import useAttributesGrid from './hooks/useAttributesGrid'
import useAttributesGridColumns from './hooks/useAttributesGridColumns'

const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

export interface IStatusRow {
  id: string
  value: string
  sortOrder: string
  isActive: string
  iconPath: string
}

export type WorkFlow = {
  attributeId?: string
  displayOrder: string
  attributeValue: string
  attributeStatus: string
  attributeIcon: string
}

export default function AttributesPageGrid() {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const router = useRouter()
  const { formatMessage } = useIntl()
  const {
    deleteAttributes,
    gridLoading,
    changeStatus,
    getToolbarMoreItems,
    handleChangedGridActions,
  } = useAttributesGrid(gridRef)
  const { attributesGridColumns } = useAttributesGridColumns()

  const [recordChangeHistory, setRecordChangeHistory] = useState({
    show: false,
    entityId: '',
  })

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '#',
      title: formatMessage(attributesPageMessages.attributesFeatureSpecifications),
    },
  ]

  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })
  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()

  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const actionUrl = useMemo(
    () => `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/api/Attribute/GetAll`,
    [],
  )

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const handleEditAttribute = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/attributes/edit/${id}`)
  }

  const handleDeleteAttribute = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)

      gridLoading(true)
      deleteAttributes(ids, () => {
        setDeleteDialogState({ show: false, id: undefined })
        refreshGridData()
      })
    } catch (e) {
    } finally {
      gridLoading(false)
    }
  }, [selectedRows, deleteDialogState])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
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
                  onClick: () => handleEditAttribute(props.data.id),
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
    },
    [selectedRows],
  )

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
        pinned: 'right',
        lockPinned: true,
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },
      ...attributesGridColumns,
      {
        field: 'canBeAddedByVendor',
        headerName: formatMessage(attributesPageMessages.attributeColumnCanBeAddedByVendor),
        filter: 'agTextColumnFilter',
        minWidth: 170,
        hide: true,
        cellRenderer: ({ value }: { value: any }) => {
          return value ? (
            <HBIcon type="check" size="medium" />
          ) : (
            <HBIcon type="minus" size="medium" />
          )
        },
      },
      {
        field: 'defultTag',
        headerName: formatMessage(attributesPageMessages.attributeColumnDefaultTags),
        filter: 'agTextColumnFilter',
        minWidth: 160,
        hide: true,
      },
      {
        field: 'isActive',
        headerName: formatMessage(attributesPageMessages.attributeColumnIsActive),
        filter: 'agTextColumnFilter',
        maxWidth: 100,
        cellRenderer: Status,
        cellRendererParams: {
          active: formatMessage(phrasesMessages.active),
          inActive: formatMessage(phrasesMessages.deActive),
        },
      },
    ],
    [],
  )

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current!.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const handleChangeStatus = (status: boolean) => {
    setStatus(status)
    setOpenActive(true)
  }

  const handleChangeActive = useCallback(async () => {
    changeStatus(status!, () => {
      refreshGridData()
      setStatus(undefined)
      setOpenActive(false)
    })
  }, [status])

  const toolbarMoreItems = useMemo<MenuItemProps[]>(
    //@ts-ignore
    () => getToolbarMoreItems(handleChangeStatus),
    [selectedRows],
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

  const handleAddAttribute = () => {
    router.push('/attributes/add')
  }

  return (
    <>
      <HBDataGridClient
        id="attributes-grid"
        actionUrl={actionUrl}
        editUrl="/attributes/edit/"
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        cacheBlockSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(attributesPageMessages.attributesFeatureSpecifications)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        detailRowAutoHeight
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ disabled: toolbarStatus.disabledOnSelected, onClick: handleAddAttribute }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            editProps={{ disabled: selectedRows.length !== 1, onClick: handleEditAttribute }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            items={toolbarMoreItems}
            {...props}
          />
        )}
      />
      <HBDialog
        content={formatMessage(attributesPageMessages.attributeDeleteConfirm, {
          deleteCount: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(attributesPageMessages.attributeDelete)}
        onAccept={handleDeleteAttribute}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(attributesPageMessages.attributeChangeStateConfirm, {
          changeCount: selectedRows.length,
        })}
        title={formatMessage(attributesPageMessages.attributeChangeState)}
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
        tableName="attribute"
      />
    </>
  )
}
