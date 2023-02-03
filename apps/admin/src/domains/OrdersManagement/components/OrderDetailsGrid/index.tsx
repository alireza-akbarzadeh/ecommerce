import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Box, Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBDataGrigToolbar } from '@hasty-bazar/core'
import { useOrderDetailsGridColumns, useOrderDetailsGridController } from '../../hooks'
import OrdersManagementPage from '../../ordersManagement.message'
type IOrderDetailsGrid = Partial<ICellRendererParams>

const OrderDetailsGrid: FC<IOrderDetailsGrid> = (props) => {
  const { formatMessage } = useIntl()
  const { shipmentOrderId: id } = props.data

  const { isRowSelectable, gridRef, classes, handleChangedSelectedRows, toolbarMoreItems } =
    useOrderDetailsGridController(id)
  const { columnDefs } = useOrderDetailsGridColumns({ id, gridRef })
  return (
    <Box sx={{ height: 362 }}>
      <HBDataGridClient
        actionUrl={`${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Sale/ShipmentBundle/${id}/bundles`}
        rightHeader={
          <Typography variant="h5" color="text.primary">
            {formatMessage(OrdersManagementPage.viewRelatedShipment)}
          </Typography>
        }
        columnDefs={columnDefs}
        isRowSelectable={isRowSelectable}
        rowSelection="single"
        suppressLoadingOverlay={!id}
        ref={gridRef}
        onSelectedChanged={handleChangedSelectedRows}
        enableRtl
        classes={classes}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            addProps={{ show: false }}
            deleteProps={{ show: false }}
            editProps={{ show: false }}
            refreshProps={{ show: false }}
            statusProps={{ show: false }}
            items={toolbarMoreItems}
            searchProps={{ show: false }}
            {...props}
          ></HBDataGrigToolbar>
        )}
      />
    </Box>
  )
}

export default OrderDetailsGrid
