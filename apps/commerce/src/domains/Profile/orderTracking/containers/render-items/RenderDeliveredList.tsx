import { CommerceOrder } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBDivider } from '@hasty-bazar/core'
import { Hidden, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { ConsignmentCard, ConsignmentHeader, ConsignmentText } from '../../components'
import OrderTrackingMessages from '../../orderTracking.messages'
import { OrderTrackingConsignmentBodyStyles } from '../../OrderTracking.styles'

const ItemRender = ({ order }: { order: CommerceOrder }) => {
  const { formatMessage } = useIntl()
  const { push } = useRouter()

  return (
    <OrderTrackingConsignmentBodyStyles spacing={6}>
      <ConsignmentHeader
        key={order.id}
        status="Delivered"
        onClick={() => push(`/profile/order-tracking/deliveredDetail/${order.id}`)}
      >
        <Stack direction="row" flexWrap="wrap" gap={6}>
          {!!order.deliveryAddress?.title && (
            <ConsignmentText
              firstPart={formatMessage({ ...OrderTrackingMessages.adressTitle })}
              secondPart={order.deliveryAddress?.title}
            />
          )}

          {!!order.number && (
            <ConsignmentText
              firstPart={formatMessage({ ...OrderTrackingMessages.orderCode })}
              secondPart={order.number}
              sx={{ '& h6:last-child': { userSelect: 'text !important' } }}
            />
          )}

          {!!order.totalNetPrice && (
            <ConsignmentText
              firstPart={formatMessage({ ...OrderTrackingMessages.orderAmount })}
              secondPart={formatMessage(
                { ...OrderTrackingMessages.priceWithCurrency },
                {
                  price: order.totalNetPrice.toLocaleString(),
                  currency: order.currency,
                },
              )}
            />
          )}

          {!!order.totalDiscount && (
            <ConsignmentText
              firstPart={formatMessage({ ...OrderTrackingMessages.discount })}
              secondPart={formatMessage(
                { ...OrderTrackingMessages.priceWithCurrency },
                {
                  price: order.totalDiscount.toLocaleString(),
                  currency: order.currency,
                },
              )}
            />
          )}

          {order.paymentInfo?.paymentMethodName && (
            <ConsignmentText
              firstPart={formatMessage({ ...OrderTrackingMessages.paymentType })}
              secondPart={order.paymentInfo?.paymentMethodName}
            />
          )}

          {/* TODO: adds delivery date */}

          {/* <ConsignmentText
            firstPart={formatMessage({ ...OrderTrackingMessages.deliveredDate })}
            secondPart={`${formatDate()}${handleFromToTime(data.summaryCart.from as string, cargo.toHour as string)}`}
          /> */}
        </Stack>
      </ConsignmentHeader>
      <HBDivider />
      {order.bundleItems?.map((bundleItem, index) => (
        <>
          <ConsignmentCard
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
            hideHeader
          />
          {(index !== -1 || index === (order.bundleItems?.length ?? 0) - 1) && (
            <Hidden smDown>
              <HBDivider />
            </Hidden>
          )}
        </>
      ))}
    </OrderTrackingConsignmentBodyStyles>
  )
}

const RenderDeliveredList: FC<{ orders: CommerceOrder[] }> = ({ orders }) => {
  const renderItem = () => orders.map((order) => <ItemRender order={order} key={order.number} />)
  return <>{renderItem()}</>
}

export default RenderDeliveredList
