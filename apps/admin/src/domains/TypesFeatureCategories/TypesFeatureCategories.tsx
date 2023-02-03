import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBAgGridClasses, HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC, useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import CreateGridToolbar from './components/CreateGridToolbar'
import { SelectRowModel } from './types'
import typesFeatureCategoriesMessage from './typesFeatureCategories.message'
import useTypesFeatureCategories from './useTypesFeatureCategories'

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

const PeriodFilterOne: FC = () => {
  const { formatMessage } = useIntl()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '#',
      title: formatMessage(typesFeatureCategoriesMessage.pageTitle),
    },
  ]

  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<SelectRowModel[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const [isEditOrAdd, setIsEditOrAdd] = useState(false)
  const [editId, setEditId] = useState<string>()

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? (value == 1 ? 'true' : 'false') : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Title', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchTypesFeatureCategories',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchTypesFeatureCategories')
      }
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: SelectRowModel[]) => {
    setSelectedRows(selectedRows)
  }

  const handleDelete = useCallback(async () => {
    await deleteRowItem()
    refreshGridData()
    setDeleteDialogState({ show: false })
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: string) => {
    setDeleteDialogState({ show, id })
  }

  const handleEditItem = (id: string) => {
    setIsEditOrAdd(true)
    setEditId(id)
  }

  const {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
    addRowItem,
    updateRowItem,
    deleteRowItem,
    isLoading,
  } = useTypesFeatureCategories({
    gridRef,
    selectedRows,
    onDelete,
    editId,
    onEditClick: handleEditItem,
  })

  const handleAddItem = () => {
    setIsEditOrAdd(true)
    setEditId(undefined)
    const row: SelectRowModel = {
      title: '',
      isActive: true,
      isAdd: true,
    }
    gridRef.current!.api.applyTransaction({
      add: [row],
      addIndex: 0,
    })
  }

  const handleCancelClick = () => {
    let docsData = gridRef.current!.api.getModel().getRow(0)
    gridRef.current!.api.applyTransaction({ remove: [docsData?.data] })!
    setIsEditOrAdd(false)
  }

  const handleSave = async () => {
    let success = false
    if (!editId) {
      success = await addRowItem()
    } else {
      success = await updateRowItem()
    }
    if (success) {
      refreshGridData(!editId)
      setIsEditOrAdd(false)
      setEditId(undefined)
    }
  }

  return (
    <Box>
      <HBDataGridClient
        classes={classes}
        actionUrl={actionUrl}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(typesFeatureCategoriesMessage.pageTitle)}
            breadItems={breadcrumbs}
          />
        }
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        serverSideSortingAlwaysResets
        serverSideFilteringAlwaysResets
        ref={gridRef}
        onDoubleClick={(props) => handleEditItem(props?.data?.id)}
        detailRowAutoHeight
        rowHeight={50}
        GridToolbar={(props) => (
          <CreateGridToolbar<SelectRowModel>
            selectedRows={selectedRows}
            handleSetDeleteDialogState={onDelete}
            onGridActionsChange={handleChangedGridActions}
            onRefreshClick={() => refreshGridData(true)}
            gridRef={gridRef}
            onCancelClick={handleCancelClick}
            onEditClick={handleEditItem}
            onAddClick={handleAddItem}
            isEditOrAdd={isEditOrAdd}
            onSubmit={handleSave}
            isLoading={isLoading}
            {...props}
          />
        )}
        {...{ columnDefs }}
        suppressRowClickSelection={isEditOrAdd}
      />
      <HBDialog
        content={formatMessage(typesFeatureCategoriesMessage.areYouSureAboutTheDelete, {
          count: selectedRows.length,
        })}
        title={formatMessage(typesFeatureCategoriesMessage.deleteRows)}
        onAccept={handleDelete}
        onReject={() => setDeleteDialogState({ show: false })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}

export default PeriodFilterOne
