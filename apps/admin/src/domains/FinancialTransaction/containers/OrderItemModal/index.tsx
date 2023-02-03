import { useGetAdminSaleOrderByOrderIdItemsAndOrderItemIdQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { CircularProgress, Grid } from '@mui/material'
import { FC } from 'react'
import ShipmentItems from './ShipmentItems'

interface OrderItemModalProps {
  orderItemId: string
  orderId: string
}

const OrderItemModal: FC<OrderItemModalProps> = ({ orderItemId, orderId }) => {
  const { data: { data: { item: shoppingCartItem = {} } = {} } = {}, isLoading } =
    useGetAdminSaleOrderByOrderIdItemsAndOrderItemIdQuery(
      {
        'client-name': 'admin',
        'client-version': '1.0.0',
        orderItemId: orderItemId!,
        orderId: orderId!,
      },
      { skip: !orderItemId },
    )

  return (
    <Grid container>
      {isLoading ? (
        <Grid item xs={12} display="flex" justifyContent="center">
          <CircularProgress color="secondary" size={20} />
        </Grid>
      ) : (
        <ShipmentItems shoppingCartItem={shoppingCartItem!} />
      )}
    </Grid>
  )
}

export default OrderItemModal
