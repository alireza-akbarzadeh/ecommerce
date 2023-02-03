import { useGetAdminSaleOrderByOrderIdBasketQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, Grid, CircularProgress } from '@mui/material'
import Items from './Items'

interface ReturnedItemsModalProps {
  id: string
}

const ReturnedItemsModal = ({ id }: ReturnedItemsModalProps) => {
  const { data: shippingOrder, isLoading } = useGetAdminSaleOrderByOrderIdBasketQuery({
    'client-name': '',
    'client-version': '',
    orderId: id,
  })

  return (
    <Box width={900}>
      <Grid container>
        {isLoading ? (
          <Grid item xs={12} display="flex" justifyContent="center">
            <CircularProgress color="secondary" size={20} />
          </Grid>
        ) : (
          <Items {...{ shippingOrder }} />
        )}
      </Grid>
    </Box>
  )
}

export default ReturnedItemsModal
