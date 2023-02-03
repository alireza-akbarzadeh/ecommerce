import { Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useLazyGetWebSaleOrdersOrderDetailByOrderIdQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBLoading } from '@hasty-bazar/core'
import { Stack } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
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

const OrderTrackingRefundDetail: FC = () => {
  const { data } = useSession()
  const { query } = useRouter()
  const { push } = useRouter()

  const shoppingCartId = query!.profile![2] as string
  const { formatMessage, formatDate } = useIntl()

  const [getDetils, { isFetching, data: deliveredDetailData, isError }] =
    useLazyGetWebSaleOrdersOrderDetailByOrderIdQuery()

  const order = useMemo(() => {
    return deliveredDetailData?.data?.order
  }, [deliveredDetailData])

  useEffect(() => {
    if (!!shoppingCartId && !!data?.user.partyId) {
      getDetils({
        ...ApiConstants,
        orderId: shoppingCartId,
        section: CommerceSection.refunded,
      })
    }
  }, [shoppingCartId, data?.user.partyId, getDetils])

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
          status="returned"
          onClick={() => push('/profile/order-tracking/returned')}
        >
          <Stack direction="row" flexWrap="wrap" alignItems="center" gap={6}>
            {order?.number && (
              <ConsignmentText
                firstPart={formatMessage({ ...OrderTrackingMessages.refundCode })}
                secondPart={order?.number}
              />
            )}
            {order?.createDate && (
              <ConsignmentText
                firstPart={formatMessage({ ...OrderTrackingMessages.refundDate })}
                secondPart={formatDate(order?.createDate)}
              />
            )}

            {order?.totalNetPrice && (
              <ConsignmentText
                firstPart={formatMessage({ ...OrderTrackingMessages.refundPrice })}
                secondPart={order?.totalNetPrice.toLocaleString()}
              />
            )}

            {order?.paymentInfo?.paymentMethodName && (
              <ConsignmentText
                firstPart={formatMessage({ ...OrderTrackingMessages.paymentType })}
                secondPart={order?.paymentInfo?.paymentMethodName}
              />
            )}
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
            products={bundleItem.orderItems ?? []}
            cargoId={bundleItem.bundleId ?? ''}
            partyId={data?.user.partyId ?? ''}
            shoppingCartId={shoppingCartId ?? ''}
          />
        ))}
      </OrderTrackingDetailBodyHOC>
    )
  else
    return (
      <OrderTrackingDetailWrappers spacing={6}>
        <Nothing />
      </OrderTrackingDetailWrappers>
    )
}

export default OrderTrackingRefundDetail
