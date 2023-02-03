import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminCatalogApiAttributeFilterByIdMutation,
  usePostAdminCatalogApiAttributeFilterMutation,
  usePutAdminCatalogApiAttributeFilterByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBAgGridClasses, HBDialog, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import CreateGridToolbar from '../../components/CreateGridToolbar'
import periodFilter from '../../periodFilter.message'
import { SelectRowModel } from '../../types'
import { PeriodFilterTwo } from '../periodFilterTwo'
import usePeriodFilterOne from './usePeriodFilterOne'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 390,
  },
}

const PeriodFilterOne: FC = () => {
  const router = useRouter()
  const id = router.query.id?.[0]

  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<SelectRowModel[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const [isEditOrAdd, setIsEditOrAdd] = useState(false)
  const [editId, setEditId] = useState<string>()

  const [addFilterItem, { isLoading }] = usePostAdminCatalogApiAttributeFilterMutation()
  const [updateFilterItem, { isLoading: isLoadingUpdate }] =
    usePutAdminCatalogApiAttributeFilterByIdMutation()
  const [deleteFilterItem] = useDeleteAdminCatalogApiAttributeFilterByIdMutation()

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
      let filterFirstComponent = gridRef?.current?.api.getFilterInstance('name')
      filterFirstComponent &&
        filterFirstComponent.setModel({
          type: 'contains',
          filter: value ?? null,
        })
      gridRef?.current?.api.onFilterChanged()
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: SelectRowModel[]) => {
    setSelectedRows(selectedRows)
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleDelete = async (id1?: string) => {
    const ids = selectedRows.map((row) => row.id)
    gridLoading(true)
    for (const selectedId of ids) {
      await deleteFilterItem({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: selectedId || '',
        deleteAttributeFilterModel: {
          attributeId: id,
        },
      })
        .then((res: any) => {
          if (res?.data?.success) {
            openToast({
              message: formatMessage(periodFilter.successfullyDeleted),
              type: 'success',
            })
          }
          refreshGridData()
        })
        .finally(() => {
          setDeleteDialogState({ show: false, id: undefined })
        })
    }
    gridLoading(false)
  }

  const onDelete = () => {
    setDeleteDialogState({ show: true })
  }

  const handleEditItem = (id: string) => {
    setIsEditOrAdd(true)
    setEditId(id)
  }

  const { actionUrl, columnDefs, autoGroupColumnDef } = usePeriodFilterOne({
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
  }

  const handleCancelClick = () => {
    if (!editId) {
      let row = gridRef.current!.api.getModel().getRow(0)
      gridRef.current!.api.applyTransaction({
        remove: [row?.data],
      })!
    }
    setIsEditOrAdd(false)
    setEditId(undefined)
  }

  const handleSubmitClick = async () => {
    const row = editId
      ? gridRef.current?.api.getSelectedNodes()[0].data
      : gridRef.current!.api.getModel().getRow(0)?.data
    let result: any = {}

    if (!editId) {
      result = await addFilterItem({
        'client-name': 'admin',
        'client-version': '1.0.0',
        createAttributeFilterModel: {
          attributeId: id,
          isActive: true,
          name: row?.name,
        },
      }).then((res) => res)
    } else {
      result = await updateFilterItem({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: row.id,
        updateAttributeFilterModel: {
          attributeId: id,
          isActive: row?.isActive!,
          name: row?.name,
        },
      }).then((res) => res)
    }

    if (result?.data?.success) {
      openToast({
        message: formatMessage(periodFilter.successfullySaved),
        type: 'success',
      })
      setIsEditOrAdd(false)
      setEditId(undefined)
      refreshGridData()
    }
  }

  return (
    <Box height={500}>
      <HBDataGridClient
        id="period-filter-one-grid"
        classes={classes}
        actionUrl={id ? actionUrl : ''}
        rightHeader={<></>}
        pagination
        paginationPageSize={5}
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
            onSubmit={handleSubmitClick}
            isLoading={isLoading || isLoadingUpdate}
            {...props}
          />
        )}
        {...{ columnDefs }}
        masterDetail
        detailCellRenderer={PeriodFilterTwo}
        detailRowAutoHeight
        rowHeight={50}
        suppressRowClickSelection={isEditOrAdd}
      />
      <HBDialog
        content={formatMessage(periodFilter.areYouSureAboutTheDelete, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(periodFilter.deletePeriodFilterOne)}
        onAccept={handleDelete}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}

export default PeriodFilterOne
