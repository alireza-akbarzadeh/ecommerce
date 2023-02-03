import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBDataGrigToolbar, HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useDiscountUserSegmentationController } from '../../Hook'
import VoucherManagementPageMessages from '../../VoucherManagementPage.messages'
const DiscountUserSegmentation = () => {
  const {
    gridRef,
    formatMessage,
    actionUrl,
    handleChangedGridActions,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    refreshGridData,
    classes,
    toolbarMoreItems,
  } = useDiscountUserSegmentationController()
  return (
    <Box
      bgcolor="common.white"
      sx={{
        pb: 8,
        pt: 6,
        px: 8,
        height: 700,
        border: (theme) => `1px solid ${theme.palette.grey[200]}`,
      }}
    >
      <HBDataGridClient
        rightHeader={
          <Box sx={{ display: 'flex', alignItem: 'center', gap: 2 }}>
            <HBIcon type={'historyAlt'} />
            <Typography variant={'h4'}>
              {formatMessage(VoucherManagementPageMessages.sellerCodeDiscount)}
            </Typography>
          </Box>
        }
        serverSideFilteringAlwaysResets
        rowHeight={55}
        serverSideSortingAlwaysResets
        actionUrl={actionUrl}
        columnDefs={[]}
        pagination
        classes={classes}
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        detailRowAutoHeight
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{
              show: false,
            }}
            deleteProps={{
              show: false,
            }}
            editProps={{
              show: false,
            }}
            items={toolbarMoreItems}
            statusProps={{ show: false }}
            searchProps={{ openPosition: 'right', inputWidth: 200, show: true }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            {...props}
          />
        )}
      />
    </Box>
  )
}

export default DiscountUserSegmentation
