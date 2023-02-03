import { HBDivider, HBRadioButton } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import OrderTrackingMessages from '../../orderTracking.messages'
import RefundCard from './RefundCard'
import { IRefundedProduct, useRefund, useRefundUpdater } from './RefundContext'

interface IProductRefundProps {
  checked: boolean
}

export interface IProductRefunds {
  id: string
  canceledCount: number
  reason: string
}

const ProductRefund: FC<IProductRefundProps> = (props) => {
  const { checked } = props
  const { products, productRefundation } = useRefund()
  const { setProductRefundation } = useRefundUpdater()

  const handleCheckBox = (lastSelectedValue: boolean, item: IRefundedProduct) => {
    if (lastSelectedValue) {
      setProductRefundation({
        orderId: productRefundation!.orderId!,
        refundedProducts: [
          ...productRefundation!.refundedProducts!.filter((i) => i.productId !== item.productId),
        ],
      })
    } else {
      setProductRefundation({
        orderId: productRefundation!.orderId!,
        refundedProducts: [...productRefundation!.refundedProducts!, item],
      })
    }
  }

  const handleSelectedChanged = (item: IRefundedProduct) => {
    const tempSelecteds = [...(productRefundation?.refundedProducts ?? [])]
    tempSelecteds[tempSelecteds.findIndex((i) => i.productId === item.productId)] = { ...item }
    setProductRefundation({
      orderId: productRefundation!.orderId!,
      refundedProducts: [...tempSelecteds],
    })
  }

  return (
    <Stack spacing={6} sx={{ width: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={4}>
        <HBRadioButton value="some" checked={checked} sx={{ height: 'fit-content', p: 0 }} />

        <Typography variant="h6" color="text.primary">
          <FormattedMessage {...OrderTrackingMessages.refundSomeProducts} />
        </Typography>
      </Stack>
      <Box />
      {checked && (
        <>
          {products.map((item) => (
            <>
              <RefundCard
                key={`some-refund-product-${item.productId}`}
                item={item}
                checkedCallBack={handleCheckBox}
                isSelected={productRefundation?.refundedProducts.some(
                  (i) => i.productId === item.productId,
                )}
                updateItem={handleSelectedChanged}
              />
              <HBDivider sx={{ borderColor: 'grey.200' }} />
            </>
          ))}
        </>
      )}
    </Stack>
  )
}

export default ProductRefund
