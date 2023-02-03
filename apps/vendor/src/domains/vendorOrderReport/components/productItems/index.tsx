import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBDataGrigToolbar } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useVendorProductItemsController } from '../../hooks'
import { ProductItemsDataGridProps } from '../../vendorOrderReportTypes'

const ProductItems: FC<ProductItemsDataGridProps> = ({ title, data, id = data?.id }) => {
  const { vendorId = '1035787876652023808', pickupDate, fromHour, toHour } = data
  const { columnDefs, gridRef, refreshGridData, classes } = useVendorProductItemsController()

  return (
    <Box mt={data?.id ? 0 : 9} sx={{ height: 362 }}>
      <HBDataGridClient
        actionUrl={
          id
            ? `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/ShipmentBundle/get-items-daily-report?VendorId=${vendorId}&PickupDate=${pickupDate}&FromHour=${fromHour}&ToHour=${toHour}`
            : ''
        }
        rightHeader={
          <Typography variant="h6" color="text.primary">
            {title}
          </Typography>
        }
        columnDefs={columnDefs}
        rowSelection="single"
        ref={gridRef}
        enableRtl
        classes={classes}
        suppressLoadingOverlay={!id}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            addProps={{
              show: false,
            }}
            deleteProps={{
              show: false,
            }}
            editProps={{ show: false }}
            moreProps={{
              show: false,
            }}
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

export default ProductItems
