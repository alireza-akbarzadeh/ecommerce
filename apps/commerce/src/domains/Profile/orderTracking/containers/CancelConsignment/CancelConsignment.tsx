import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  CommerceDetailOrderItem,
  usePostWebSaleOrderCancelMutation,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import OrderTrackingMessages from '../../orderTracking.messages'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import {
  useConsignmentCancelation,
  useConsignmentCancelationUpdater,
} from './cancel-actions/CancelationContext'
import CancelConsginmentBody from './CancelConsginmentBody'

export type CancelType = 'success' | 'waiting'
interface ICancelConsignmentProps {
  back: () => void
  gotoSuccessPage: () => void
  products: CommerceDetailOrderItem[]
  type: CancelType
}

enum cancelEnum {
  full = 1,
  partial = 2,
}

const CancelConsignment: FC<ICancelConsignmentProps> = (props) => {
  const { back, gotoSuccessPage, products, type } = props
  const { setProducts } = useConsignmentCancelationUpdater()
  const { allCancelation, productCancelations } = useConsignmentCancelation()

  const [cancelProducts, { isLoading: cancelAllProductsLoading, data: allProoductCancelationRes }] =
    usePostWebSaleOrderCancelMutation()

  useEffect(() => {
    if (products.length) {
      setProducts(products)
    }
  }, [products])

  const handleCancelReuests = () => {
    if (allCancelation) {
      cancelProducts({
        ...ApiConstants,
        cancelModel: {
          orderId: allCancelation.shoppingCartId,
          reason: allCancelation.cancelationReason,
          cancelType: cancelEnum.full,
          cancelItems: [],
        },
      })
    } else if (productCancelations) {
      cancelProducts({
        ...ApiConstants,
        cancelModel: {
          cancelItems: productCancelations.canceledProducts.map((p) => ({
            productId: p.productId,
            quantity: p.count,
            reason: p.cancelationReason,
          })),
          cancelType: cancelEnum.partial,
          orderId: productCancelations.shoppingCartId,
          reason: '',
        },
      })
    }
  }

  useEffect(() => {
    if (allProoductCancelationRes?.success) {
      gotoSuccessPage()
    }
  }, [allProoductCancelationRes])

  const handleDisable = useMemo(() => {
    if (allCancelation && !allCancelation.cancelationReason) return true
    if (
      !!productCancelations &&
      (!productCancelations.canceledProducts.some((i) => !!i) ||
        productCancelations.canceledProducts.some((i) => !i.formValidation))
    ) {
      return true
    }
  }, [allCancelation, productCancelations])

  return (
    <>
      <OrderTrackingDetailWrappers spacing={6}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" color="common.black">
            <FormattedMessage {...OrderTrackingMessages.cancelConsignment} />
          </Typography>
          <HBButton onClick={() => back()} variant="text" sx={{ gap: 3 }}>
            <Typography variant="button" color="grey.700">
              <FormattedMessage {...OrderTrackingMessages.back} />
            </Typography>
            <HBIcon sx={{ color: 'grey.700', lineHeight: 0 }} type="arrowLeft" />
          </HBButton>
        </Stack>
        <Typography variant="h6" color="warning.main">
          <FormattedMessage {...OrderTrackingMessages.cancelConsignmentAlert} />
        </Typography>
      </OrderTrackingDetailWrappers>
      <OrderTrackingDetailWrappers>
        <Stack spacing={6}>
          <CancelConsginmentBody />
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
              loading={
                // cancelByProductsLoading ||
                cancelAllProductsLoading
              }
              disabled={handleDisable}
              onClick={() => {
                handleCancelReuests()
              }}
            >
              <FormattedMessage {...OrderTrackingMessages.checkCancelOrder} />
            </HBButton>
          </Stack>
        </Stack>
      </OrderTrackingDetailWrappers>
    </>
  )
}

export default CancelConsignment
