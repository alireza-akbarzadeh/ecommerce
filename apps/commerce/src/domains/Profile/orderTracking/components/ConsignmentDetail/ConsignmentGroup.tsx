import { CargoProductItem } from '@hasty-bazar-commerce/components'
import {
  CancelType,
  CommerceDetailOrderItem,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { Box, Grid, Stack } from '@mui/material'
import { FC } from 'react'
import CancelConsignmentCard from '../../containers/CancelConsignment/CancelConsignmentCard'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import ConsignmentCardHeader, {
  IConsignmentCardHeaderProps,
} from '../ConsignmentCard/ConsginmentCardHeader'

interface IConsignmentGroupProps extends IConsignmentCardHeaderProps {
  products: CommerceDetailOrderItem[]
  isCanceled?: boolean
  canceledReason?: string
  cancelType?: CancelType
}

const ConsignmentGroup: FC<IConsignmentGroupProps> = (props) => {
  const { products, isCanceled = false, canceledReason, cancelType, ...rest } = props
  return (
    <OrderTrackingDetailWrappers sx={{ p: 6 }}>
      <Stack
        spacing={6}
        sx={(theme) => ({
          border: `1px solid ${theme.palette.grey[100]}`,
          [theme.breakpoints.down('sm')]: { p: 2 },
          [theme.breakpoints.up('sm')]: { p: 4 },
          p: 6,
          borderRadius: 2,
        })}
      >
        <ConsignmentCardHeader spacing={8} hideCargoName={isCanceled ? true : false} {...rest} />
        <Grid container rowSpacing={6}>
          {products.map((product, index) => (
            <Grid key={product.productId} item xs={12} sm={isCanceled ? 12 : 6}>
              {!isCanceled && (
                <Box sx={{ pr: index % 2 !== 0 ? 4 : 0 }}>
                  <CargoProductItem
                    productCartItem={{
                      ...product,
                      shoppingCartQuantity: product.quantity,
                      imageUrl: product.productDefaultImage,
                      vendor: { storeName: product.storeName },
                      finalPrice: product.totalFinalPrice,
                      originalPrice: product.totalOriginalPrice,
                    }}
                    withAttributes
                  />
                </Box>
              )}
              {isCanceled && (
                <CancelConsignmentCard
                  key={`canceled-CancelConsignmentCardonsignment-${index}`}
                  item={product}
                  readOnly
                  finalyReason={product.cancelReason ?? ''}
                  finalyCanceledCount={product.quantity ?? 0}
                  vendorName={product.storeName ?? ''}
                  cancelType={cancelType}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Stack>
    </OrderTrackingDetailWrappers>
  )
}

export default ConsignmentGroup
