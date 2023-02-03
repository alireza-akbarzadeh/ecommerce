import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminCatalogCategoriesByIdAttributesAndAttributeIdMutation,
  usePutAdminCatalogCategoriesByIdAttributesAndAttributeIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBAgGridClasses, HBDialog, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import CreateGridToolbar from './components/CreateGridToolbar'
import useRelatedAttributes from './hook/useRelatedAttributes'
import relatedAttributesMessage from './relatedAttributes.message'
import { SelectRowModelOne } from './types'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 600,
  },
}

const PeriodFilterOne: FC = () => {
  const { formatMessage } = useIntl()
  const { query: { slug = [] } = {}, push, pathname } = useRouter()
  const [, id] = slug

  useEffect(() => {
    refreshGridData()
  }, [slug])

  const [deleteAttribute] = useDeleteAdminCatalogCategoriesByIdAttributesAndAttributeIdMutation()
  const [updateAttribute] = usePutAdminCatalogCategoriesByIdAttributesAndAttributeIdMutation()

  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()

  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<SelectRowModelOne[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

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
          { field: 'Name', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchRelatedAttributes',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchRelatedAttributes')
      }
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api?.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: SelectRowModelOne[]) => {
    setSelectedRows(selectedRows)
  }

  const handleDelete = useCallback(async () => {
    try {
      const attributeIds = selectedRows.map((row) => row.attributeId)

      const requests = attributeIds.map((attributeId) => {
        return deleteAttribute({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          attributeId,
          id,
        })
      })

      const result = await Promise.all(requests)
      const isSuccess = result.every((res: any) => res?.data?.data?.success)
      if (isSuccess) {
        openToast({
          message: formatMessage(relatedAttributesMessage.deleteSuccess),
          type: 'success',
        })
      }
      setDeleteDialogState({ show: false, id: undefined })
      refreshGridData()
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: string) => {
    setDeleteDialogState({ show, id })
  }

  const handleEditItem = (attributeId: string) => {
    attributeId = typeof attributeId === 'string' ? attributeId : selectedRows[0]?.attributeId
    push({
      pathname,
      query: {
        slug,
        subRoute: 'assignAttribute',
        rowId: attributeId,
      },
    })
  }

  const handleChangeStatus = (status: boolean) => {
    setStatus(status)
    setOpenActive(true)
  }

  const { actionUrl, columnDefs, autoGroupColumnDef, toolbarMoreItems } = useRelatedAttributes({
    gridRef,
    selectedRows,
    onDelete,
    attributeId: id!,
    onEditClick: handleEditItem,
    changeState: handleChangeStatus,
  })

  const handleAddItem = () => {
    push({
      pathname,
      query: {
        slug,
        subRoute: 'assignAttribute',
      },
    })
  }

  const handleChangeActive = useCallback(async () => {
    try {
      const selectedRows = gridRef.current!.api.getSelectedRows()
      const requests = selectedRows.map(({ attributeId }) => {
        return updateAttribute({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          attributeId,
          id,
          updateAssignedCategoryAttributeModel: {
            arguments: {
              isActive: status,
            },
          },
        })
      })

      const result = await Promise.all(requests)
      const isSuccess = result.every((item: any) => item?.data?.data?.success)
      if (isSuccess) {
        openToast({
          message: formatMessage(relatedAttributesMessage.successfullyUpdatedStatus),
          type: 'success',
        })
      }
      refreshGridData(true)
      setStatus(undefined)
      setOpenActive(false)
    } catch (err) {}
  }, [status])

  return (
    <Box sx={{ height: 730 }}>
      <HBDataGridClient
        classes={classes}
        actionUrl={actionUrl}
        rightHeader={<></>}
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
        onDoubleClick={(props) => handleEditItem(props?.data?.attributeId)}
        GridToolbar={(props) => (
          <CreateGridToolbar<SelectRowModelOne>
            selectedRows={selectedRows}
            handleSetDeleteDialogState={onDelete}
            onGridActionsChange={handleChangedGridActions}
            onRefreshClick={() => refreshGridData(true)}
            gridRef={gridRef}
            onCancelClick={() => {}}
            onEditClick={handleEditItem}
            onAddClick={handleAddItem}
            menuItems={toolbarMoreItems || []}
            {...props}
          />
        )}
        {...{ columnDefs }}
        rowHeight={50}
      />
      <HBDialog
        content={formatMessage(relatedAttributesMessage.areYouSureAboutTheDelete, {
          count: selectedRows.length,
        })}
        title={formatMessage(relatedAttributesMessage.deleteAttribute)}
        onAccept={handleDelete}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(relatedAttributesMessage.changeStatusDialogContent, {
          count: selectedRows.length,
        })}
        title={formatMessage(relatedAttributesMessage.changeStatusDialogTitle)}
        onAccept={handleChangeActive}
        onReject={() => setOpenActive(false)}
        open={openActive}
        onClose={() => setOpenActive(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}

export default PeriodFilterOne
