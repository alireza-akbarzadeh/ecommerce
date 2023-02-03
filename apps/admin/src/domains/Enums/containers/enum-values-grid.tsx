import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { FC, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import enumsMessage from '../enums.message'
import useEnumValueGrid from '../hooks/useEnumValuesGrid'
import EnumValueEditForm from './enum-value-edit-form'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 310,
  },
}

export type EnumValuesGridProps = {
  enumTypeId?: string | null
}

const EnumValuesGrid: FC<EnumValuesGridProps> = ({ enumTypeId }) => {
  const { formatMessage } = useIntl()

  const gridRef = useRef<HBDataGridClientRef>(null)

  const [selectedRows, setSelectedRows] = useState<GetBusinessTypeValuesQueryResult[]>([])

  const handleEdit = (props: GetBusinessTypeValuesQueryResult) => {
    setIsOpenEditDialog({ show: true, data: props })
  }

  const { actionUrl, columnDefs, autoGroupColumnDef } = useEnumValueGrid({
    gridRef,
    enumTypeId,
    handleEdit,
  })

  const [isOpenEditDialog, setIsOpenEditDialog] = useState<{
    show: boolean
    data?: GetBusinessTypeValuesQueryResult
  }>({
    show: false,
  })

  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Title', operator: 'contains', value: String(value) },
          { field: 'Name', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchEnumValue',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchEnumValue')
      }
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api?.deselectAll()
  }

  return (
    <Box sx={{ height: 390 }}>
      <HBDataGridClient
        id="enum-values-grid"
        classes={classes}
        actionUrl={enumTypeId ? actionUrl : ''}
        onDoubleClick={(props) => handleEdit(props?.data)}
        rightHeader={
          <Typography variant="h6">{formatMessage(enumsMessage.enumValuesTitle)}</Typography>
        }
        pagination
        paginationPageSize={6}
        onSelectedChanged={(chosenRows) => setSelectedRows(chosenRows)}
        rowSelection="single"
        enableRtl
        sideBar
        autoGroupColumnDef={autoGroupColumnDef}
        serverSideSortingAlwaysResets
        serverSideFilteringAlwaysResets
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ show: false }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: () => handleEdit(selectedRows[0]),
            }}
            deleteProps={{ show: false }}
            refreshProps={{
              onClick: refreshGridData,
            }}
            searchProps={{ show: true, openPosition: 'right' }}
            moreProps={{ show: true }}
            statusProps={{ show: false }}
            {...props}
          />
        )}
        {...{ columnDefs }}
      />
      <HBDialog
        content={
          <EnumValueEditForm
            data={isOpenEditDialog?.data}
            setIsOpenEditDialog={setIsOpenEditDialog}
            refreshGridData={refreshGridData}
          />
        }
        open={isOpenEditDialog.show}
        onClose={() => setIsOpenEditDialog({ show: false })}
        title={formatMessage(enumsMessage.enumValuesTitle)}
      />
    </Box>
  )
}
export default EnumValuesGrid
