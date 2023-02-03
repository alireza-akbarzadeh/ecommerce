import { Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useReshopping from '@hasty-bazar-commerce/hooks/useReshopping'
import { useLazyGetWebSaleOrdersOrderDetailByOrderIdQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBButton, HBLoading } from '@hasty-bazar/core'
import { Stack } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  ConsignmentDetailHeader,
  ConsignmentText,
  OrderTrackingDetailBodyHOC,
} from '../../components'
import { ConsignmentGroup } from '../../components/ConsignmentDetail'
import { CommerceSection } from '../../OrderTracking'
import OrderTrackingMessages from '../../orderTracking.messages'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import CancelConsignmentReasonSelect from '../CancelConsignment/CancelConsignmentReasonSelect'

export enum CancelTypeEnum {
  Full = 1,
  Partial = 2,
}

const OrderTrackingCanceledDetail: FC = () => {
  const { data } = useSession()
  const { query } = useRouter()
  const { push } = useRouter()
  const shoppingCartId = query!.profile![2] as string
  const { formatMessage, formatDate } = useIntl()
  const { addingToBasketLoading, reshoppingMutation } = useReshopping()

  const [getDetails, { isFetching, data: canceledDetailData, isError }] =
    useLazyGetWebSaleOrdersOrderDetailByOrderIdQuery()

  const order = useMemo(() => {
    return canceledDetailData?.data?.order
  }, [canceledDetailData])

  useEffect(() => {
    if (!!shoppingCartId && !!data?.user.partyId) {
      getDetails({
        ...ApiConstants,
        orderId: shoppingCartId,
        section: CommerceSection.canceled,
      })
    }
  }, [shoppingCartId, data?.user.partyId, getDetails])

  if (isFetching)
    return (
      <OrderTrackingDetailWrappers spacing={6}>
        <HBLoading />
      </OrderTrackingDetailWrappers>
    )
  else if (!isFetching && !isError)
    return (
      <OrderTrackingDetailBodyHOC>
        <ConsignmentDetailHeader
          transactions={order?.transactions ?? []}
          shoppingCartId={order?.id ?? ''}
          status="system-cancel"
          onClick={() => push('/profile/order-tracking/canceled/')}
        >
          {order?.cancelType === CancelTypeEnum.Full && (
            <CancelConsignmentReasonSelect
              cancelReason={order?.cancelReason ?? ''}
              systemCancelReason={order?.systemCancelReason}
              readOnly
            />
          )}
          <Stack
            flexWrap="wrap"
            direction={{ sm: 'row', xs: 'column' }}
            alignItems={{ sm: 'center', xs: 'flex-start' }}
            gap={6}
          >
            {order?.number && (
              <ConsignmentText
                firstPart={formatMessage({ ...OrderTrackingMessages.orderCode })}
                secondPart={order?.number}
              />
            )}

            {order?.totalNetPrice && (
              <ConsignmentText
                firstPart={formatMessage({ ...OrderTrackingMessages.canceledAmount })}
                secondPart={formatMessage(
                  { ...OrderTrackingMessages.priceWithCurrency },
                  {
                    price: order?.totalNetPrice.toLocaleString(),
                    currency: order.currency ?? '',
                  },
                )}
              />
            )}

            {!!order?.cancelDate && (
              <ConsignmentText
                firstPart={formatMessage({ ...OrderTrackingMessages.cancelDate })}
                secondPart={formatDate(order?.cancelDate)}
              />
            )}

            {order?.paymentInfo?.paymentMethodName && (
              <ConsignmentText
                firstPart={formatMessage({ ...OrderTrackingMessages.paymentType })}
                secondPart={order?.paymentInfo?.paymentMethodName}
              />
            )}
          </Stack>
          <Stack spacing={4} direction="row" alignItems="center" justifyContent="flex-end">
            <HBButton
              loading={addingToBasketLoading}
              onClick={() =>
                reshoppingMutation({
                  ...ApiConstants,
                  reshopRequest: {
                    shoppingCartId: order?.id ?? '',
                  },
                })
              }
              variant="contained"
              sx={(theme) => ({
                boxShadow: 'none',
                [theme.breakpoints.down('sm')]: {
                  flex: 1,
                },
              })}
            >
              <FormattedMessage {...OrderTrackingMessages.buyOrder} />
            </HBButton>
          </Stack>
        </ConsignmentDetailHeader>
        <OrderTrackingDetailWrappers sx={{ padding: 0 }}>
          {order?.bundleItems?.map((bundleItem, index) => (
            <ConsignmentGroup
              key={bundleItem.bundleId}
              isCanceled
              name={formatMessage(
                { ...OrderTrackingMessages.consignmentNumber },
                { number: index + 1 },
              )}
              texts={[
                {
                  key: formatMessage({ ...OrderTrackingMessages.allConsignmentAmount }),
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
                  key: formatMessage({ ...OrderTrackingMessages.howToDelivery }),
                  value: bundleItem.deliveryText,
                },
              ]}
              products={bundleItem.orderItems ?? []}
              canceledReason={order.cancelReason ?? ''}
              cargoId={bundleItem.bundleId}
              partyId={data?.user.partyId ?? ''}
              shoppingCartId={shoppingCartId ?? ''}
              cancelType={order?.cancelType}
            />
          ))}
        </OrderTrackingDetailWrappers>
      </OrderTrackingDetailBodyHOC>
    )
  else
    return (
      <OrderTrackingDetailWrappers spacing={6}>
        <Nothing />
      </OrderTrackingDetailWrappers>
    )
}

export default OrderTrackingCanceledDetail
