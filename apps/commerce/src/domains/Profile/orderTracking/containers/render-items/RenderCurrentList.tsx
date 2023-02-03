import { TimeLeft } from '@hasty-bazar-commerce/components'
import { HBMap } from '@hasty-bazar-commerce/containers/HBMap'
import usePay from '@hasty-bazar-commerce/core/hook/usePay'
import { CommerceOrder } from '@hasty-bazar-commerce/services/saleApi.generated'
import { handleFromToTime } from '@hasty-bazar-commerce/utils'
import { commafy, HBDivider } from '@hasty-bazar/core'
import { Box, Grid, Hidden, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ConsignmentCard, ConsignmentHeader } from '../../components'
import { OrdersStatus } from '../../OrderTracking'
import OrderTrackingMessages from '../../orderTracking.messages'
import {
  OrderTrackingConsignmentBodyStyles,
  OrderTrackingConsignmentHeaderSubText,
  OrderTrackingConsignmentHeaderTextWrapper,
} from '../../OrderTracking.styles'

const ItemRender = ({ order }: { order: CommerceOrder }) => {
  const { formatMessage, formatDate } = useIntl()
  const { push } = useRouter()
  const { orderRepayReq, paymentPayIsLoading } = usePay()

  return (
    <OrderTrackingConsignmentBodyStyles key={order.number}>
      <Stack spacing={6}>
        <ConsignmentHeader
          status={order.stateCode === OrdersStatus.paid ? 'paid' : 'await-payment'}
          onClick={() => push(`/profile/order-tracking/currentDetail/${order.id}`)}
        >
          <Grid container columnSpacing={1}>
            <Grid item xs={12} sm={8} mb={2} pr={1}>
              <Stack direction="row" sx={{ gap: 6 }} flexWrap="wrap">
                <OrderTrackingConsignmentHeaderTextWrapper
                  sx={{ display: 'contents' }}
                  variant="subtitle2"
                  color="grey.700"
                >
                  <FormattedMessage {...OrderTrackingMessages.orderDateTime} />
                  <OrderTrackingConsignmentHeaderSubText
                    sx={{ userSelect: 'text' }}
                    variant="subtitle2"
                    color="text.primary"
                  >
                    {formatDate(order.createDate)}
                  </OrderTrackingConsignmentHeaderSubText>
                </OrderTrackingConsignmentHeaderTextWrapper>
                <OrderTrackingConsignmentHeaderTextWrapper variant="subtitle2">
                  <FormattedMessage {...OrderTrackingMessages.adressTitle} />
                  <OrderTrackingConsignmentHeaderSubText
                    sx={{ userSelect: 'text' }}
                    variant="subtitle2"
                    color="text.primary"
                  >
                    {order.deliveryAddress?.title}
                  </OrderTrackingConsignmentHeaderSubText>
                </OrderTrackingConsignmentHeaderTextWrapper>
                <OrderTrackingConsignmentHeaderTextWrapper variant="subtitle2">
                  <FormattedMessage {...OrderTrackingMessages.orderCode} />
                  <OrderTrackingConsignmentHeaderSubText
                    sx={{ userSelect: 'text' }}
                    variant="subtitle2"
                    color="text.primary"
                  >
                    {order.number}
                  </OrderTrackingConsignmentHeaderSubText>
                </OrderTrackingConsignmentHeaderTextWrapper>
                <OrderTrackingConsignmentHeaderTextWrapper>
                  <FormattedMessage {...OrderTrackingMessages.ConsignmentCount} />
                  <OrderTrackingConsignmentHeaderSubText variant="subtitle2" color="text.primary">
                    <FormattedMessage
                      {...OrderTrackingMessages.ConsignmentCountText}
                      values={{
                        count: order.bundlesCount ? order.bundlesCount?.toString() : '',
                      }}
                    />
                  </OrderTrackingConsignmentHeaderSubText>
                </OrderTrackingConsignmentHeaderTextWrapper>
                <OrderTrackingConsignmentHeaderTextWrapper variant="subtitle2">
                  <FormattedMessage {...OrderTrackingMessages.paymentType} />
                  <OrderTrackingConsignmentHeaderSubText
                    sx={{ userSelect: 'text' }}
                    variant="subtitle2"
                    color="text.primary"
                  >
                    {order.paymentInfo?.paymentMethodName}
                  </OrderTrackingConsignmentHeaderSubText>
                </OrderTrackingConsignmentHeaderTextWrapper>
              </Stack>
            </Grid>
            {!!order.deliveryAddress?.geoCoordinate?.latitude &&
              !!order.deliveryAddress?.geoCoordinate?.longitude && (
                <Grid item xs={12} sm={4}>
                  <Box sx={{ overflow: 'hidden', borderRadius: 4, width: '100%', height: 120 }}>
                    <HBMap
                      sx={{ height: '100%', width: '100%' }}
                      hasZoomBox={false}
                      center={[
                        order.deliveryAddress?.geoCoordinate?.latitude,
                        order.deliveryAddress?.geoCoordinate?.longitude,
                      ]}
                    />
                  </Box>
                </Grid>
              )}
          </Grid>
        </ConsignmentHeader>
        <Hidden smDown>
          <HBDivider />
        </Hidden>
        {order.bundleItems?.map((bundleItem, index) => (
          <>
            <ConsignmentCard
              name={formatMessage(
                { ...OrderTrackingMessages.consignmentNumber },
                { number: index + 1 },
              )}
              texts={[
                ...(order.totalNetPrice
                  ? [
                      {
                        key: formatMessage({ ...OrderTrackingMessages.allConsignmentAmount }),
                        value: `${commafy(order.totalNetPrice)}${bundleItem.currency}`,
                      },
                    ]
                  : []),

                {
                  key: formatMessage({ ...OrderTrackingMessages.discount }),
                  value: order?.totalDiscount
                    ? `${order?.totalDiscount.toLocaleString()}${bundleItem.currency}`
                    : null,
                },

                ...(order.stateCode === OrdersStatus.awaitPayment
                  ? [
                      {
                        key: formatMessage({ ...OrderTrackingMessages.shippingCost }),
                        value: bundleItem.userPrice
                          ? formatMessage(
                              { ...OrderTrackingMessages.priceWithCurrency },
                              {
                                currency: bundleItem.currency,
                                price: commafy(bundleItem.userPrice),
                              },
                            )
                          : formatMessage({ ...OrderTrackingMessages.free }),
                      },
                    ]
                  : []),
                ...(order.stateCode === OrdersStatus.paid
                  ? [
                      ...(order.paymentInfo?.paymentMethodName
                        ? [
                            {
                              key: formatMessage({ ...OrderTrackingMessages.paymentType }),
                              value: order.paymentInfo?.paymentMethodName,
                            },
                          ]
                        : []),
                      ...(bundleItem.deliveryText
                        ? [
                            {
                              key: formatMessage({ ...OrderTrackingMessages.howToDelivery }),
                              value: bundleItem.deliveryText,
                            },
                          ]
                        : []),
                    ]
                  : []),
                ...(bundleItem.deliveryDate
                  ? [
                      {
                        key: formatMessage({ ...OrderTrackingMessages.deliveredDate }),
                        value: `${formatDate(bundleItem.deliveryDate, {
                          day: 'numeric',
                          month: 'short',
                        })} ,${handleFromToTime(
                          bundleItem.deliveryFromHour as string,
                          bundleItem.deliveryToHour as string,
                        )}`,
                      },
                    ]
                  : []),
              ]}
              products={
                bundleItem.orderItems
                  ? bundleItem.orderItems?.map((orderItem) => {
                      return {
                        count: orderItem.quantity,
                        src: orderItem.productDefaultImage,
                        productClassId: orderItem.productClassId,
                        productId: orderItem.productId,
                        productName: orderItem.productName,
                      }
                    })
                  : []
              }
              hideCommentButton
            />
            {(index !== -1 ||
              (index === (order.bundleItems?.length ?? 0) - 1 &&
                order.stateCode === OrdersStatus.awaitPayment &&
                !!order.reservationLeftMinutes)) && (
              <Hidden smDown>
                <HBDivider />
              </Hidden>
            )}
          </>
        ))}
        {order.stateCode === OrdersStatus.awaitPayment && (
          <TimeLeft
            payCallback={() => {
              orderRepayReq({
                orderId: order.id ?? '',
              })
            }}
            time={order?.reservationLeftMinutes ?? 0}
            loading={paymentPayIsLoading}
          />
        )}
      </Stack>
    </OrderTrackingConsignmentBodyStyles>
  )
}

const RenderCurrentList: FC<{ orders: CommerceOrder[] }> = ({ orders }) => {
  const renderItem = () => orders.map((order) => <ItemRender order={order} key={order.number} />)
  return <>{renderItem()}</>
}

export default RenderCurrentList
