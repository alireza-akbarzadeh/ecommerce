import { useGetAdminSaleShipmentBundleBundlesByBundleIdProductsQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, Grid } from '@mui/material'
import { FC } from 'react'
import Products from '../product'
import { ICellRendererParams } from 'ag-grid-community'

interface DialogContentProps {
  params: ICellRendererParams
}

const DialogContent: FC<DialogContentProps> = ({ params }) => {
  const { data: { data: products = [] } = {} } =
    useGetAdminSaleShipmentBundleBundlesByBundleIdProductsQuery({
      'client-name': '',
      'client-version': '',
      bundleId: params?.data?.id,
    })

  return (
    <Box width={900}>
      <Grid container spacing={4}>
        <Products
          productsData={products}
          deliveryDateTime={params?.data?.deliveryDateTime}
          deliveryHours={params?.data?.deliveryHours}
        />
      </Grid>
    </Box>
  )
}

export default DialogContent
