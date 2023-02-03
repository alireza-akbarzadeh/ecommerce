import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useDeleteWorkflowStateMachineByStateMachineIdTransitionAndTransitionIdMutation } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBAgGridClasses, HBDialog, openToast } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { FC, useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import CreateGridToolbar from '../../components/CreateGridToolbar'
import statusMessage from '../../status.message'
import { SelectRowModelThree } from '../../types'
import { AddEditFormStatusThree } from './containers'
import useStatusThree from './useStatusThree'

const classes: HBAgGridClasses = {
  wrapper: {
    backgroundColor: ({ palette }) => `${palette.common.white} !important`,
    height: 345,
    '& .ag-layout-normal .ag-header': {
      backgroundColor: ({ palette }) => `${palette.grey[100]} !important`,
      border: 'unset',
    },
    '&>div:last-child': {
      padding: ({ spacing }) => spacing(3),
      borderRadius: 2,
      backgroundColor: ({ palette }) => palette.grey[100],
    },
    '& div.ag-root-wrapper': {
      border: 'unset',
    },
  },
}

type PeriodFilterThreeType = ICellRendererParams & {
  stateMachineId?: string
}

const PeriodFilterThree: FC<PeriodFilterThreeType> = (props) => {
  const { data, stateMachineId } = props

  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<SelectRowModelThree[]>([])
  const [addEditDialogState, setAddEditDialogState] = useState(false)

  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const [isEditOrAdd, setIsEditOrAdd] = useState(false)
  const [editId, setEditId] = useState<string>()

  const [deleteFilterItem] =
    useDeleteWorkflowStateMachineByStateMachineIdTransitionAndTransitionIdMutation()

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
          id: 'searchStatusThree',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchStatusThree')
      }
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: SelectRowModelThree[]) => {
    setSelectedRows(selectedRows)
  }

  const handleDelete = useCallback(async () => {
    deleteFilterItem({
      'client-name': 'admin',
      'client-version': '1.0.0',
      stateMachineId: stateMachineId!,
      transitionId: deleteDialogState.id!,
    })
      .then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(statusMessage.successfullyDeleted),
            type: 'success',
          })
          refreshGridData()
        }
      })
      .catch(() => {})
      .finally(() => {
        setDeleteDialogState({ show: false })
      })
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: string) => {
    setDeleteDialogState({ show, id })
  }

  const handleEditItem = (id: string) => {
    setIsEditOrAdd(true)
    setEditId(id)
    setAddEditDialogState(true)
  }

  const { actionUrl, columnDefs } = useStatusThree({
    gridRef,
    selectedRows,
    onDelete,
    editId,
    stateMachineId: stateMachineId!,
    onEditClick: handleEditItem,
    fromStateId: data?.id,
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
    refreshGridData()
    setAddEditDialogState(false)
    setIsEditOrAdd(false)
    setEditId(undefined)
  }

  return (
    <Box height={400} px={10}>
      <HBDataGridClient
        classes={classes}
        actionUrl={actionUrl}
        rightHeader={
          <Typography variant="h6" color="text.primary">
            {formatMessage(statusMessage.showMore)}
          </Typography>
        }
        rowSelection="multiple"
        enableRtl
        sideBar
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        onDoubleClick={(props) => handleEditItem(props?.data?.id)}
        GridToolbar={(props) => (
          <CreateGridToolbar
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
        <AddEditFormStatusThree
          onClose={handleCancelClick}
          open={addEditDialogState}
          id={editId}
          onSave={handleSave}
          stateMachineId={stateMachineId!}
          parentId={data?.id}
        />
      )}
    </Box>
  )
}

export default PeriodFilterThree
