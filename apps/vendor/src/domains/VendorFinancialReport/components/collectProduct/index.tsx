import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { HBDataGrigToolbar } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useVendorCollectProductColumnDef, useVendorCollectProductController } from '../../hooks'
import { CollectProductGridProps } from '../../vendorFinancialTypes'

const CollectProduct: FC<CollectProductGridProps> = ({ title, data, id = data?.id }) => {
  const { vendorId = '1035787876652023808', pickupDate } = data
  const { gridRef, refreshGridData, classes, toolbarMoreItems, handleChangedSelectedRows } =
    useVendorCollectProductController(pickupDate)
  const { columnDefs } = useVendorCollectProductColumnDef()

  return (
    <Box mt={data?.id ? 0 : 9} sx={{ height: 362 }}>
      <HBDataGridClient
        actionUrl={
          id
            ? `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/vendor/FinancialReportDetail?VendorId=${vendorId}&PickupDate=${pickupDate}`
            : ''
        }
        rightHeader={
          <Typography variant="h6" color="text.primary">
            {`${title}  ${convertDateToPersian(pickupDate)}`}
          </Typography>
        }
        columnDefs={columnDefs}
        rowSelection="single"
        ref={gridRef}
        onSelectedChanged={handleChangedSelectedRows}
        enableRtl
        classes={classes}
        suppressLoadingOverlay={!id}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            items={toolbarMoreItems}
            addProps={{
              show: false,
            }}
            deleteProps={{
              show: false,
            }}
            editProps={{ show: false }}
            refreshProps={{
              show: true,
              onClick: () => refreshGridData(true),
            }}
            statusProps={{ show: false }}
            searchProps={{ show: false }}
            {...props}
          />
        )}
      />
    </Box>
  )
}

export default CollectProduct
