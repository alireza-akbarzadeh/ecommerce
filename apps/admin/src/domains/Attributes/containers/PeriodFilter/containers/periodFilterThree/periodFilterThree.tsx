import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminCatalogApiAttributeFilterByAttributeFilterIdFilterValueAndIdMutation,
  usePostAdminCatalogApiAttributeFilterByAttributeFilterIdFilterValueMutation,
  usePutAdminCatalogApiAttributeFilterByAttributeFilterIdFilterValueAndIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBAgGridClasses, HBDialog, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { FC, useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import CreateGridToolbar from '../../components/CreateGridToolbar'
import periodFilter from '../../periodFilter.message'
import { SelectRowModel } from '../../types'
import usePeriodFilterThree from './usePeriodFilterThree'

const classes: HBAgGridClasses = {
  wrapper: {
    backgroundColor: ({ palette }) => `${palette.common.white} !important`,
    height: 315,
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

const PeriodFilterThree: FC = ({ data, node, api }: ICellRendererParams) => {
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

  const [addFilterItem, { isLoading }] =
    usePostAdminCatalogApiAttributeFilterByAttributeFilterIdFilterValueMutation()
  const [updateFilterItem, { isLoading: isLoadingUpdate }] =
    usePutAdminCatalogApiAttributeFilterByAttributeFilterIdFilterValueAndIdMutation()
  const [deleteFilterItem] =
    useDeleteAdminCatalogApiAttributeFilterByAttributeFilterIdFilterValueAndIdMutation()

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
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

  const handleDelete = useCallback(async () => {
    const ids = selectedRows.map((item) => item.id)
    for (const itemId of ids) {
      await deleteFilterItem({
        'client-name': 'catalogApi',
        'client-version': '1.0.0',
        id: itemId,
        attributeFilterId: String(data?.id),
        deleteAttributeFilterValueModel: {
          attributeId: id!,
        },
      })
        .then((res: any) => {
          if (res?.data?.success) {
            openToast({
              message: formatMessage(periodFilter.successfullyDeleted),
              type: 'success',
            })
          }
        })
        .catch(() => {})
    }
    refreshGridData()
    setDeleteDialogState({ show: false })
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: string) => {
    setDeleteDialogState({ show: true, id })
  }

  const handleEditItem = (id: string) => {
    setIsEditOrAdd(true)
    setEditId(id)
  }

  const { actionUrl, columnDefs, autoGroupColumnDef } = usePeriodFilterThree({
    gridRef,
    selectedRows,
    onDelete,
    editId,
    attributeId: data?.id!,
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
        attributeFilterId: String(data?.id),
        createAttributeFilterValueModel: {
          attributeId: id!,
          attributeValueId: row?.attributeValueId,
          isActive: row?.isActive,
        },
      }).then((res) => res)
    } else {
      result = await updateFilterItem({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: row.id,
        attributeFilterId: String(data?.id),
        updateAttributeFilterValueModel: {
          attributeId: id!,
          attributeValueId: row?.attributeValueId,
          isActive: row?.isActive,
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
    <Box height={400} px={10}>
      <HBDataGridClient
        id="period-filter-three-grid"
        classes={classes}
        actionUrl={actionUrl}
        rightHeader={<></>}
        rowSelection="multiple"
        enableRtl
        sideBar
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
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
        detailRowAutoHeight
        rowHeight={50}
        suppressRowClickSelection={isEditOrAdd}
      />
      <HBDialog
        content={formatMessage(periodFilter.areYouSureAboutTheDelete, {
          msg: String(selectedRows.length),
        })}
        title={formatMessage(periodFilter.deletePeriodFilterOne)}
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

export default PeriodFilterThree
