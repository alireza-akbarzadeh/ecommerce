import { Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useReshopping from '@hasty-bazar-commerce/hooks/useReshopping'
import {
  CommerceDetailOrderItem,
  useLazyGetWebSaleOrdersOrderDetailByOrderIdQuery,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { handleFromToTime } from '@hasty-bazar-commerce/utils'
import { HBButton, HBLoading } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  ConsignmentDetailAddress,
  ConsignmentDetailHeader,
  ConsignmentText,
  OrderTrackingDetailBodyHOC,
} from '../../components'
import { ConsignmentGroup } from '../../components/ConsignmentDetail'
import { CommerceSection } from '../../OrderTracking'
import OrderTrackingMessages from '../../orderTracking.messages'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import { Refund, RefundProvider } from '../refund'
import RefundedList from '../refund/RefundedList'

const OrderTrackingDeliveredDetail: FC = () => {
  const { data } = useSession()
  const { query } = useRouter()
  const { push } = useRouter()
  const [variant, setVariant] = useState<'detail' | 'refund-order' | 'refund-order-success'>(
    'detail',
  )
  const shoppingCartId = query!.profile![2] as string
  const { formatMessage, formatDate } = useIntl()

  const [getDetils, { isFetching, data: deliveredDetailData, isError }] =
    useLazyGetWebSaleOrdersOrderDetailByOrderIdQuery()
  const [refundableProducts, setRefundableProducts] = useState<CommerceDetailOrderItem[]>([])

  const order = useMemo(() => {
    return deliveredDetailData?.data?.order
  }, [deliveredDetailData])

  useEffect(() => {
    if (deliveredDetailData?.data?.order?.bundleItems) {
      const tempProducts = deliveredDetailData?.data.order?.bundleItems?.flatMap((bundleItem) => {
        return bundleItem.orderItems ?? []
      })
      setRefundableProducts([...tempProducts])
    }
  }, [deliveredDetailData])

  useEffect(() => {
    if (!!shoppingCartId && !!data?.user.partyId) {
      getDetils({
        ...ApiConstants,
        orderId: shoppingCartId,
        section: CommerceSection.delivered,
      })
    }
  }, [shoppingCartId, data?.user.partyId, getDetils])

  const { addingToBasketLoading, reshoppingMutation } = useReshopping()

  const handleReshopping = () => {
    reshoppingMutation({
      ...ApiConstants,
      reshopRequest: {
        shoppingCartId: deliveredDetailData?.data?.order?.id,
      },
    })
  }

  if (isFetching)
    return (
      <OrderTrackingDetailWrappers spacing={6}>
        <HBLoading />
      </OrderTrackingDetailWrappers>
    )
  else if (!isFetching && !isError)
    return (
      <OrderTrackingDetailBodyHOC>
        {variant === 'detail' ? (
          <>
            <ConsignmentDetailHeader
              transactions={order?.transactions ?? []}
              shoppingCartId={order?.id ?? ''}
              status="Delivered"
              onClick={() => push('/profile/order-tracking/delivered')}
            >
              <Stack direction="row" flexWrap="wrap" alignItems="center" gap={6}>
                {order?.createDate && (
                  <ConsignmentText
                    firstPart={formatMessage({ ...OrderTrackingMessages.orderDateTime })}
                    secondPart={formatDate(order?.createDate)}
                  />
                )}
                {order?.number && (
                  <ConsignmentText
                    firstPart={formatMessage({ ...OrderTrackingMessages.orderCode })}
                    secondPart={order?.number}
                  />
                )}
                {order?.totalNetPrice && (
                  <ConsignmentText
                    firstPart={formatMessage({ ...OrderTrackingMessages.fullAmount })}
                    secondPart={`${order?.totalNetPrice.toLocaleString()} ${order.currency}`}
                  />
                )}
                {order?.paymentInfo?.paymentMethodName && (
                  <ConsignmentText
                    firstPart={formatMessage({ ...OrderTrackingMessages.paymentType })}
                    secondPart={order?.paymentInfo?.paymentMethodName}
                  />
                )}
                {order?.voucherAmount ? (
                  <Typography variant="subtitle2" sx={{ color: 'success.main', width: '100%' }}>
                    <FormattedMessage
                      {...OrderTrackingMessages.discountCode}
                      values={{
                        price: order.voucherAmount.toLocaleString(),
                        currency: order.currency,
                      }}
                    />
                  </Typography>
                ) : null}
              </Stack>
              <Stack
                spacing={4}
                direction="row"
                alignItems="center"
                justifyContent={{ sm: 'flex-end', xs: 'center' }}
              >
                {order?.canRefund ? (
                  <HBButton onClick={() => setVariant('refund-order')} variant="outlined">
                    <FormattedMessage {...OrderTrackingMessages.refundOrder} />
                  </HBButton>
                ) : (
                  <HBButton variant="outlined">
                    <FormattedMessage {...OrderTrackingMessages.seeOrderFactor} />
                  </HBButton>
                )}

                <HBButton
                  loading={addingToBasketLoading}
                  onClick={() => handleReshopping()}
                  variant="contained"
                >
                  <FormattedMessage {...OrderTrackingMessages.buyAgain} />
                </HBButton>
              </Stack>
            </ConsignmentDetailHeader>
            <ConsignmentDetailAddress
              address={order?.deliveryAddress?.streetLine}
              lat={order?.deliveryAddress?.geoCoordinate?.latitude}
              lng={order?.deliveryAddress?.geoCoordinate?.longitude}
              mobileNumber={order?.deliveryAddress?.recipientMobileNo}
              name={order?.deliveryAddress?.title}
              postalCode={order?.deliveryAddress?.postalCode}
              username={order?.deliveryAddress?.recipientName}
              plaque={order?.deliveryAddress?.plaque}
              unit={order?.deliveryAddress?.unit}
              district={order?.deliveryAddress?.district}
            />
            {order?.bundleItems?.map((bundleItem, index) => (
              <ConsignmentGroup
                key={bundleItem.bundleId}
                name={formatMessage(
                  { ...OrderTrackingMessages.consignmentNumber },
                  { number: index + 1 },
                )}
                texts={[
                  {
                    key: formatMessage({ ...OrderTrackingMessages.paidAmount }),
                    value: bundleItem.totalPrice
                      ? `${bundleItem.totalPrice.toLocaleString()} ${bundleItem.currency}`
                      : null,
                  },
                  {
                    key: formatMessage({ ...OrderTrackingMessages.discount }),
                    value: bundleItem.discount
                      ? `${bundleItem.discount.toLocaleString()} ${bundleItem.currency}`
                      : null,
                  },
                  {
                    key: formatMessage({ ...OrderTrackingMessages.shippingCost }),
                    value: bundleItem.userPrice
                      ? formatMessage(
                          { ...OrderTrackingMessages.priceWithCurrency },
                          {
                            currency: bundleItem.currency,
                            price: bundleItem.userPrice.toLocaleString(),
                          },
                        )
                      : formatMessage({ ...OrderTrackingMessages.free }),
                  },
                  {
                    key: formatMessage({ ...OrderTrackingMessages.howToDelivery }),
                    value: bundleItem.deliveryText,
                  },
                  {
                    key: formatMessage({ ...OrderTrackingMessages.deliveredDate }),
                    value:
                      !!bundleItem.deliveryDate &&
                      !!bundleItem.deliveryFromHour &&
                      !!bundleItem.deliveryToHour
                        ? `${formatDate(bundleItem.deliveryDate, {
                            day: 'numeric',
                            month: 'short',
                          })} , ${handleFromToTime(
                            bundleItem.deliveryFromHour,
                            bundleItem.deliveryToHour,
                          )}`
                        : null,
                  },
                ]}
                products={bundleItem.orderItems ?? []}
                cargoId={bundleItem.bundleId ?? ''}
                partyId={data?.user.partyId ?? ''}
                shoppingCartId={shoppingCartId ?? ''}
              />
            ))}
          </>
        ) : (
          <RefundProvider>
            {variant === 'refund-order' ? (
              <Refund
                products={refundableProducts}
                gotoSuccessPage={() => setVariant('refund-order-success')}
                back={() => setVariant('detail')}
              />
            ) : (
              <RefundedList back={() => setVariant('detail')} />
            )}
          </RefundProvider>
        )}
      </OrderTrackingDetailBodyHOC>
    )
  else
    return (
      <OrderTrackingDetailWrappers spacing={6}>
        <Nothing />
      </OrderTrackingDetailWrappers>
    )
}

export default OrderTrackingDeliveredDetail
