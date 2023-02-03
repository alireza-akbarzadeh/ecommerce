import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC, useRef, useState } from 'react'
import { gridType } from '../../HBChangeRecordHistory'
import { ChangeRecordHistoryRowsType } from '../../types'
import { ChangeRecordHistorySubGrid } from '../ChangeRecordHistorySubGrid'
import useGrid from './useGrid'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 500,
  },
}

type HBChangeRecordHistoryGridProps = {
  data: ChangeRecordHistoryRowsType[]
  onGridReady: (params?: gridType) => void
  totalRows: number
}

const ChangeRecordHistoryGrid: FC<HBChangeRecordHistoryGridProps> = ({
  data = [],
  onGridReady,
  totalRows = 0,
}) => {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<ChangeRecordHistoryRowsType[]>([])

  const handleChangedSelectedRows = (selectedRows: ChangeRecordHistoryRowsType[]) => {
    setSelectedRows(selectedRows)
  }

  const { columnDefs, autoGroupColumnDef } = useGrid({
    gridRef,
    selectedRows,
  })

  return (
    <Box mt={6}>
      <HBDataGridClient
        classes={classes}
        rowData={data}
        onGridReady={onGridReady}
        totalRows={totalRows}
        actionUrl={''}
        rightHeader={<></>}
        pagination
        paginationPageSize={25}
        rowSelection="single"
        enableRtl
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        noToolbar
        masterDetail
        detailRowAutoHeight
        detailCellRenderer={ChangeRecordHistorySubGrid}
        {...{ columnDefs }}
      />
    </Box>
  )
}

export default ChangeRecordHistoryGrid
