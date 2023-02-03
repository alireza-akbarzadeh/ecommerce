import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  CommerceDetailOrderItem,
  usePostWebSaleOrderRefundMutation,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import OrderTrackingMessages from '../../orderTracking.messages'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import RefundBody from './RefundBody'
import { useRefund, useRefundUpdater } from './RefundContext'

interface ICancelConsignmentProps {
  back: () => void
  gotoSuccessPage: () => void
  products: CommerceDetailOrderItem[]
}

enum refundType {
  full = 1,
  partial = 2,
}

const Refund: FC<ICancelConsignmentProps> = (props) => {
  const { back, gotoSuccessPage, products } = props
  const { setProducts } = useRefundUpdater()
  const { allRefundation, productRefundation } = useRefund()
  const [refundMutation, { isLoading, data: refundRes }] = usePostWebSaleOrderRefundMutation()

  useEffect(() => {
    if (products.length) {
      setProducts(products)
    }
  }, [products])

  const handleRefundReuests = () => {
    refundMutation({
      ...ApiConstants,
      refundOrderModel: {
        orderId: allRefundation?.orderId || productRefundation?.orderId,
        complaint: allRefundation ? allRefundation.complaint : '',
        reason: allRefundation ? allRefundation.refundReason : '',
        refundItems: allRefundation
          ? []
          : productRefundation?.refundedProducts.map(
              ({ complaint, productId, refundedCount, refundReason }) => {
                return {
                  complaint,
                  productId,
                  quantity: refundedCount,
                  reason: refundReason,
                }
              },
            ),
        refundType: allRefundation ? refundType.full : refundType.partial,
      },
    })
  }

  useEffect(() => {
    if (refundRes?.success) {
      gotoSuccessPage()
    }
  }, [refundRes, gotoSuccessPage])

  const handleDisable = useMemo(() => {
    if (allRefundation && !allRefundation.formValidation) return true
    if (
      !!productRefundation &&
      (!productRefundation.refundedProducts.some((i) => !!i) ||
        productRefundation.refundedProducts.some((i) => !i.formValidation))
    ) {
      return true
    }
  }, [allRefundation, productRefundation])

  return (
    <>
      <OrderTrackingDetailWrappers spacing={6}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" color="common.black">
            <FormattedMessage {...OrderTrackingMessages.refundOrder} />
          </Typography>
          <HBButton onClick={() => back()} variant="text" sx={{ gap: 3 }}>
            <Typography variant="button" color="grey.700">
              <FormattedMessage {...OrderTrackingMessages.back} />
            </Typography>
            <HBIcon sx={{ color: 'grey.700', lineHeight: 0 }} type="arrowLeft" />
          </HBButton>
        </Stack>
        <Typography variant="h6" color="warning.main">
          <FormattedMessage {...OrderTrackingMessages.refundCondition} />
        </Typography>
      </OrderTrackingDetailWrappers>
      <OrderTrackingDetailWrappers>
        <Stack spacing={6}>
          <RefundBody />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={{ xs: 'center', sm: 'flex-end' }}
            spacing={4}
          >
            <HBButton
              onClick={() => {
                back()
              }}
              variant="outlined"
            >
              <FormattedMessage {...OrderTrackingMessages.cancel} />
            </HBButton>
            <HBButton
              loading={isLoading}
              disabled={handleDisable}
              onClick={() => {
                handleRefundReuests()
              }}
            >
              <FormattedMessage {...OrderTrackingMessages.checkRefundOrder} />
            </HBButton>
          </Stack>
        </Stack>
      </OrderTrackingDetailWrappers>
    </>
  )
}

export default Refund
