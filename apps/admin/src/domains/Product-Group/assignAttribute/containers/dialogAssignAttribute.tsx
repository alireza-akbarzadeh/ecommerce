import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBAgGridClasses, HBDataGrigToolbar, HBSelectProps } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import { CheckboxSelectionCallbackParams, ColDef, ICellRendererParams } from 'ag-grid-community'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupPageMessages from '../../ProductGroupPage.messages'
import { AssignAttributeAddEditFormType } from '../assignAttributePage'

const classesGrid: HBAgGridClasses = {
  wrapper: {
    height: 430,
  },
}
export interface AssignAttributesAddEditFormProps {
  toggleOpenDialog?: (value: boolean) => void
}

export type SelectBoxOptionsType = HBSelectProps['menuItem']

const DialogAssignAttribute: FC<AssignAttributesAddEditFormProps> = (props: any) => {
  const { toggleOpenDialog } = props
  const { formatMessage } = useIntl()
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/api/Attribute/GetAll?IsActive=true&Filter=IsActive_Equal_--IsActive`
  const gridRef = useRef<HBDataGridClientRef>(null)

  const { setValue } = useFormContext<AssignAttributeAddEditFormType>()

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <GridActionColumn {...props} menuItems={[]} />
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
      },
      {
        field: 'code',
        headerName: formatMessage(productGroupPageMessages.dataGridCode),
        minWidth: 110,
        maxWidth: 200,
        sortable: false,
        filter: false,
      },
      {
        field: 'name',
        headerName: formatMessage(productGroupPageMessages.dataGridName),
        minWidth: 130,
        sortable: false,
        filter: false,
      },
      {
        field: 'businessEntityTitle',
        headerName: formatMessage(productGroupPageMessages.dataGridRelatedEntityId),
        minWidth: 130,
        resizable: false,
        sortable: false,
        filter: false,
        hide: true,
      },
    ],
    [],
  )

  const handleSelect = (): void => {
    if (selectedRows.length) {
      toggleOpenDialog(false)
      setValue('attributeId', selectedRows[0].id)
      setValue('name', selectedRows[0].name)
      setValue('baseName', selectedRows[0].name)
      setValue('displaySortTypeCode', selectedRows[0].groupTypeCode)
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api?.deselectAll()
  }, [])

  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Code', operator: 'contains', value: String(value) },
          { field: 'Name', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchDialogAssignAttribute',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchDialogAssignAttribute')
      }
    }
  }

  const isRowSelectable = useCallback((rowNode: any) => {
    return rowNode.data ? rowNode.data.isActive : true
  }, [])

  return (
    <Box sx={{ maxHeight: 600 }}>
      <HBDataGridClient
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        onDoubleClick={() => handleSelect()}
        pagination
        paginationPageSize={25}
        rowSelection="single"
        enableRtl
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        classes={classesGrid}
        isRowSelectable={isRowSelectable}
        GridToolbar={() => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            editProps={{ show: false }}
            deleteProps={{ show: false }}
            statusProps={{ show: false }}
            moreProps={{ show: false }}
            addProps={{
              onClick: handleSelect,
              icon: 'check',
              disabled: selectedRows.length < 1,
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            searchProps={{ show: true, openPosition: 'right' }}
          />
        )}
      />
    </Box>
  )
}

export default DialogAssignAttribute
