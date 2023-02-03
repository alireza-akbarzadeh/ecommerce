import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBAgGridClasses } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC, useRef, useState } from 'react'
import { ChangeRecordHistoryEnvironmentType, ChangeRecordHistoryRowsType } from '../../types'
import useGrid from './useGrid'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 300,
  },
}

type HBChangeRecordHistoryGridProps = {
  data: ChangeRecordHistoryRowsType
}

const ChangeRecordHistorySubGrid: FC<HBChangeRecordHistoryGridProps> = ({ data }) => {
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<ChangeRecordHistoryEnvironmentType[]>([])

  const handleChangedSelectedRows = (selectedRows: ChangeRecordHistoryEnvironmentType[]) => {
    setSelectedRows(selectedRows)
  }

  const { columnDefs } = useGrid({
    gridRef,
    selectedRows,
  })

  return (
    <Box mt={6}>
      <HBDataGridClient
        classes={classes}
        rowData={data?.changesItems || []}
        totalRows={data?.changesItems?.length || 0}
        actionUrl={''}
        rightHeader={<></>}
        pagination
        paginationPageSize={25}
        rowSelection="single"
        enableRtl
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        noToolbar
        {...{ columnDefs }}
      />
    </Box>
  )
}

export default ChangeRecordHistorySubGrid
