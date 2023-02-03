import { GridActionColumn, GridActionMenuProps } from '@hasty-bazar/admin-shared/components'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { HBAgGridClasses, HBDataGrigToolbar, HBSwitch, MenuItemProps } from '@hasty-bazar/core'
import { Box, styled, Typography, useTheme } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import productGroupMessages from '../../ProductGroup.messages'
import { RelationCategoryRender, RelationValueCode } from './RelationGridCellRenders'
import useGridActions from './useGridActions'

export type RelationDataGridProps = {
  id: string
  categoryId: string
  categoryName?: string
  relatedCategoryId?: string
  relatedCategoryName?: string
  relationTypeEnum?: number
  relationTypeEnumTitle?: string
  isActive?: boolean
  isAdd?: boolean
}

interface RelationCategoryDataGridProps extends Partial<ICellRendererParams> {
  id?: string
  title?: string
}

const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

export const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))

const RelationBetweenGroups: FC<RelationCategoryDataGridProps> = ({ id, title, ...props }) => {
  const theme = useTheme()
  const [selectedRows, setSelectedRows] = useState<RelationDataGridProps[]>([])
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [totalRows, setTotalRows] = useState<number>()
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)
  const [relationId, setRelationId] = useState<number>()
  const [editId, setEditId] = useState('')

  const { formatMessage } = useIntl()

  const { showToast } = useToast()

  const {
    addRelation,
    categoriesData,
    removeRelation,
    reloadCategories,
    reloadFetchRelation,
    getAllRelations,
    reloadAllRelation,
    handleCreateRelation,
    handleUpdateRelation,
  } = useGridActions(id!, gridRef)

  useEffect(() => {
    if (id) {
      reloadCategories()
      reloadFetchRelation()
      reloadAllRelation()
    }
  }, [id])

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const getMenuItems = useCallback((props: ICellRendererParams) => {
    let items: GridActionMenuProps[] = [
      {
        label: formatMessage(phrasesMessages.public),
        children: [
          {
            icon: 'trashAlt',
            label: formatMessage(phrasesMessages.delete),
            onClick: () => {
              handleRemoveRelation(props.data)
            },
          },
        ],
      },
    ]
    return items
  }, [])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <GridActionColumn {...props} menuItems={getMenuItems(props)} />
    },
    [selectedRows],
  )

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 90,
        minWidth: 90,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        cellRenderer: GridActions,
        checkboxSelection,
        headerCheckboxSelection,
        editable: false,
      },
      {
        field: 'relatedCategoryId',
        headerName: formatMessage(productGroupMessages.categoryRelations),
        minWidth: 200,
        editable: false,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd ? (
            <RelationCategoryRender
              setValue={setValue!}
              categoriesData={categoriesData?.data?.items}
            />
          ) : (
            data.relatedCategoryName
          ),
      },
      {
        field: 'relationTypeEnum',
        headerName: formatMessage(productGroupMessages.categoryRelationsType),
        minWidth: 200,
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd || data.id === editId ? (
            <RelationValueCode
              setValue={setValue!}
              data={getAllRelations?.data?.items}
              valueCode={data.relationTypeEnum}
            />
          ) : (
            data?.relationTypeEnumTitle
          ),
      },
      {
        field: 'isActive',
        headerName: formatMessage(productGroupMessages.categoryRelationsStatus),
        filter: 'agTextColumnFilter',
        filterParams: {
          readOnly: true,
        },
        minWidth: 200,
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd || data.id === editId ? (
            <HBSwitch
              checked={data.isActive || data?.isAdd}
              onChange={(event) => setValue!(event.target.checked)}
            />
          ) : (
            <HBSwitch checked={data.isActive} disabled />
          ),
      },
    ],
    [categoriesData, relationId, getAllRelations],
  )

  const classes: HBAgGridClasses = {
    wrapper: {
      backgroundColor: `${theme.palette.common.white} !important`,
      height: 300,
      '& .ag-layout-normal .ag-header': {
        backgroundColor: `${theme.palette.grey[100]} !important`,
        border: 'unset',
      },
      '&>div:last-child': {
        padding: theme.spacing(3),
        borderRadius: 2,
        backgroundColor: theme.palette.grey[100],
      },
      '& div.ag-root-wrapper': {
        border: 'unset',
      },
    },
  }

  const handleAddRelation = useCallback(() => {
    addRelation(setIsAddOrEdit)
  }, [])

  const handleEditRelation = useCallback(() => {
    const selectedRow = selectedRows[0]
    setEditId(selectedRow?.id)
    setRelationId(selectedRow?.relationTypeEnum!)
    setIsAddOrEdit(true)
  }, [selectedRows])

  const handleRemoveRelation = (deleteRow?: RelationDataGridProps) => {
    if (!deleteRow?.id) {
      deleteRow = undefined
    }

    const row = deleteRow || selectedRows[0]
    gridLoading(true)
    removeRelation({
      'client-name': 'admin',
      'client-version': '0.0.1',
      unAssignCategoryRelationModel: {
        categoryId: id,
        relatedCategoryId: row?.relatedCategoryId,
        relationType: row?.relationTypeEnum!,
      },
    })
      .then(() => {
        refreshGridData()
        gridRef.current!.api.deselectAll()
        setSelectedRows([])
        showToast(formatMessage(phrasesMessages.successDelete), 'success')
      })
      .catch((error) => {
        showToast(errorsToString(error), 'error')
      })
      .finally(() => {
        gridLoading(false)
      })
  }

  const handleCancelSubmitRelation = useCallback(() => {
    let rowData = gridRef.current!.api.getModel().getRow(0)

    if (rowData?.data.isAdd) {
      gridRef.current!.api.applyTransaction({
        remove: [rowData?.data],
      })!
    } else {
      setRelationId(undefined)
      setEditId('')
    }
    setIsAddOrEdit(false)
    refreshGridData()
  }, [])

  const handleSubmitRelation = async () => {
    const newRow = !relationId
      ? gridRef.current!.api.getModel().getRow(0)?.data
      : gridRef.current!.api.getSelectedNodes()[0].data
    if (newRow?.isAdd) {
      handleCreateRelation(newRow, {
        onSuccess: () => {
          refreshGridData(true)
          setIsAddOrEdit(false)
          showToast(formatMessage(phrasesMessages.successAdd), 'success')
        },
      })
    } else {
      delete newRow.typeCode
      delete newRow._actions

      handleUpdateRelation(newRow, relationId!, {
        onSuccess: () => {
          refreshGridData(true)
          setIsAddOrEdit(false)
          setRelationId(undefined)
          setEditId('')
          showToast(formatMessage(phrasesMessages.successUpdate), 'success')
        },
      })
    }
  }

  const handleChangedSelectedRows = (selectedRows: RelationDataGridProps[]) => {
    setSelectedRows(selectedRows)
  }

  const isRowSelectable = useCallback((rowNode: any) => {
    return rowNode.data ? !rowNode.data.isAdd : true
  }, [])

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    const disabledOnNoSelected = selectedRows.length === 0

    return [
      {
        label: formatMessage(phrasesMessages.active),
        icon: 'toggleOn',
        disabled: disabledOnNoSelected,
      },
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'arrowDown',
        disabled: disabledOnNoSelected,
      },
    ]
  }, [selectedRows])

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? (value === 1 ? 'true' : 'false') : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'RelatedCategoryName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchRealtion',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchRealtion')
      }
    }
  }

  return (
    <Box sx={{ height: 362 }}>
      <HBDataGridClient
        actionUrl={`${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/categories/${id}/relations`}
        rightHeader={
          <Typography variant="h6" color="text.primary">
            {title}
          </Typography>
        }
        serverSideFilteringAlwaysResets
        columnDefs={columnDefs}
        isRowSelectable={isRowSelectable}
        rowModelType={'serverSide'}
        serverSideStoreType={'full'}
        rowSelection="single"
        ref={gridRef}
        enableRtl
        classes={classes}
        totalRows={totalRows}
        onSelectedChanged={handleChangedSelectedRows}
        suppressLoadingOverlay={!id}
        onDoubleClick={handleEditRelation}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            addProps={{
              disabled: toolbarStatus.disabledOnSelected || isAddOrEdit || !id,
              onClick: handleAddRelation,
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected || isAddOrEdit,
              onClick: handleRemoveRelation,
            }}
            editProps={{
              show: true,
              disabled: toolbarStatus.disabledOnNoSelected || isAddOrEdit,
              onClick: handleEditRelation,
            }}
            moreProps={{
              disabled: isAddOrEdit,
            }}
            searchProps={{ show: true, inputWidth: 114, disabled: isAddOrEdit }}
            items={toolbarMoreItems}
            refreshProps={{
              show: true,
              onClick: () => refreshGridData(true),
              disabled: isAddOrEdit,
            }}
            onChange={handleChangedGridActions}
            statusProps={{ show: true, disabled: isAddOrEdit }}
            {...props}
          >
            <HBGrigToolbarItem
              icon="times"
              tooltip={formatMessage(phrasesMessages.cancel)}
              disabled={!isAddOrEdit}
              show={isAddOrEdit}
              onClick={handleCancelSubmitRelation}
            />
            <HBGrigToolbarItem
              icon="check"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              onClick={handleSubmitRelation}
              show={isAddOrEdit}
            />
          </HBDataGrigToolbar>
        )}
      />
    </Box>
  )
}

export default RelationBetweenGroups
