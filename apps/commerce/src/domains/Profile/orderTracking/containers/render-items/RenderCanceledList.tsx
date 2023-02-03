import { CommerceOrder } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBDivider } from '@hasty-bazar/core'
import { Hidden, Stack } from '@mui/material'
import { isValid } from 'date-fns'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { ConsignmentCard, ConsignmentHeader, ConsignmentText } from '../../components'
import { OrdersStatus } from '../../OrderTracking'
import OrderTrackingMessages from '../../orderTracking.messages'
import { OrderTrackingConsignmentBodyStyles } from '../../OrderTracking.styles'

const ItemRender = ({ order }: { order: CommerceOrder }) => {
  const { formatMessage, formatDate } = useIntl()
  const { push } = useRouter()

  return (
    <OrderTrackingConsignmentBodyStyles spacing={6}>
      <ConsignmentHeader
        status={order.stateCode === OrdersStatus.canceledByUser ? 'canceled' : 'system-cancel'}
        onClick={() => push(`/profile/order-tracking/canceledDetail/${order.id}`)}
      >
        <Stack direction="row" flexWrap="wrap" gap={6}>
          {order.number && (
            <ConsignmentText
              firstPart={formatMessage({ ...OrderTrackingMessages.orderCode })}
              secondPart={order.number ?? ''}
              sx={{ '& h6:last-child': { userSelect: 'text !important' } }}
            />
          )}

          {!!order.totalNetPrice && (
            <ConsignmentText
              firstPart={formatMessage({ ...OrderTrackingMessages.canceledAmount })}
              secondPart={formatMessage(
                { ...OrderTrackingMessages.priceWithCurrency },
                { price: order.totalNetPrice.toLocaleString(), currency: order.currency },
              )}
            />
          )}

          {isValid(new Date(order.cancelDate ?? '')) && (
            <ConsignmentText
              firstPart={formatMessage({ ...OrderTrackingMessages.canceleDate })}
              secondPart={formatDate(order.cancelDate!)}
            />
          )}
        </Stack>
      </ConsignmentHeader>
      <HBDivider />
      {order.bundleItems?.map((bundleItem, index) => (
        <>
          <ConsignmentCard
            key={bundleItem.bundleId}
            products={
              bundleItem.orderItems
                ? bundleItem.orderItems?.map((orderItem) => {
                    return {
                      count: orderItem.quantity,
                      src: orderItem.productDefaultImage,
                      productClassId: orderItem.productClassId,
                      productId: orderItem.productId,
                      productName: orderItem.productName,
                      hsin: orderItem.hsin,
                      slug: orderItem.slug,
                    }
                  })
                : []
            }
            hideCommentButton
            hideHeader
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
    </OrderTrackingConsignmentBodyStyles>
  )
}

const RenderCanceledList: FC<{ orders: CommerceOrder[] }> = ({ orders }) => {
  const renderItem = () => orders.map((order) => <ItemRender order={order} key={order.number} />)
  return <>{renderItem()}</>
}

export default RenderCanceledList
