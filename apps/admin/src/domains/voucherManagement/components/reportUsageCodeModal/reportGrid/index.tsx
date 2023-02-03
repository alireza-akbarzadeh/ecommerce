import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBAgGridClasses, HBDataGrigToolbar } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC } from 'react'
import useReportVoucherCodeController from '../../../Hook/useReportVoucherCodeController'
interface IReportGrid {
  id: string
  expanded: boolean
}

const ReportGrid: FC<IReportGrid> = ({ id, expanded }) => {
  const {
    columnDefs,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    gridRef,
    handleChangedGridActions,
    toolbarMoreItems,
    refreshGridData,
    actionUrl,
  } = useReportVoucherCodeController({ id })
  const classes: HBAgGridClasses = {
    wrapper: {
      height: expanded ? 400 : 500,
    },
  }

  return (
    <Box mt={10} height={500}>
      <HBDataGridClient
        actionUrl={actionUrl}
        serverSideFilteringAlwaysResets
        rowHeight={45}
        serverSideSortingAlwaysResets
        columnDefs={columnDefs}
        pagination
        classes={classes}
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ show: false }}
            deleteProps={{ show: false }}
            editProps={{ show: false }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            statusProps={{ show: false }}
            items={toolbarMoreItems}
            searchProps={{ openPosition: 'right', show: true, inputWidth: 161 }}
            {...props}
          ></HBDataGrigToolbar>
        )}
      />
    </Box>
  )
}

export default ReportGrid
