import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useDeleteWorkflowStateMachineByIdMutation } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBAgGridClasses, HBDialog, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import CreateGridToolbar from '../../components/CreateGridToolbar'
import statusMessage from '../../status.message'
import { SelectRowModelOne } from '../../types'
import { StatusTwo } from '../StatusTwo'
import { AddEditFormStatus } from './containers'
import useStatusOne from './useStatusOne'

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
      title: formatMessage(statusMessage.statusManagement),
    },
  ]

  const router = useRouter()
  const id = router.query.id?.[0]

  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<SelectRowModelOne[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const [addEditDialogState, setAddEditDialogState] = useState(false)

  const [isEditOrAdd, setIsEditOrAdd] = useState(false)
  const [editId, setEditId] = useState<string>()

  const [deleteFilterItem] = useDeleteWorkflowStateMachineByIdMutation()

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
          { field: 'Description', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchStatus',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchStatus')
      }
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: SelectRowModelOne[]) => {
    setSelectedRows(selectedRows)
  }

  const handleDelete = useCallback(async () => {
    const ids = selectedRows.map((item) => item.id)
    for (const id of ids) {
      await deleteFilterItem({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: String(id),
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(statusMessage.successfullyDeleted),
            type: 'success',
          })
        }
      })
    }
    refreshGridData()
    setDeleteDialogState({ show: false })
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: string) => {
    setDeleteDialogState({ show, id })
  }

  const handleEditItem = (id: string) => {
    setIsEditOrAdd(true)
    setEditId(id)
    setAddEditDialogState(true)
  }

  const { actionUrl, columnDefs, autoGroupColumnDef } = useStatusOne({
    gridRef,
    selectedRows,
    onDelete,
    editId,
    attributeId: id!,
    onEditClick: handleEditItem,
  })

  const handleAddItem = () => {
    setIsEditOrAdd(true)
    setEditId(undefined)
    setAddEditDialogState(true)
  }

  const handleCancelClick = () => {
    setAddEditDialogState(false)
    setIsEditOrAdd(false)
    setEditId(undefined)
  }

  const handleSave = () => {
    refreshGridData(!editId)
    handleCancelClick()
  }

  return (
    <Box>
      <HBDataGridClient
        classes={classes}
        actionUrl={actionUrl}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(statusMessage.statusManagement)}
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
        GridToolbar={(props) => (
          <CreateGridToolbar<SelectRowModelOne>
            selectedRows={selectedRows}
            handleSetDeleteDialogState={onDelete}
            onGridActionsChange={handleChangedGridActions}
            onRefreshClick={() => refreshGridData(true)}
            gridRef={gridRef}
            onCancelClick={handleCancelClick}
            onEditClick={handleEditItem}
            onAddClick={handleAddItem}
            isEditOrAdd={isEditOrAdd}
            {...props}
          />
        )}
        {...{ columnDefs }}
        masterDetail
        detailCellRenderer={StatusTwo}
        detailRowAutoHeight
        rowHeight={50}
        suppressRowClickSelection={isEditOrAdd}
      />
      <HBDialog
        content={formatMessage(statusMessage.areYouSureAboutTheDelete).replace(
          'count',
          String(deleteDialogState?.id ? 1 : selectedRows.length),
        )}
        title={formatMessage(statusMessage.deletePeriodFilterOne)}
        onAccept={handleDelete}
        onReject={() => setDeleteDialogState({ show: false })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      {addEditDialogState && (
        <AddEditFormStatus
          onClose={handleCancelClick}
          open={addEditDialogState}
          id={editId}
          onSave={handleSave}
        />
      )}
    </Box>
  )
}

export default PeriodFilterOne
