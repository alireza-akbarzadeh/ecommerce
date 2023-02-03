import { Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import usePay from '@hasty-bazar-commerce/core/hook/usePay'
import useReshopping from '@hasty-bazar-commerce/hooks/useReshopping'
import useTimer from '@hasty-bazar-commerce/hooks/useTimer'
import {
  CommerceDetailOrderItem,
  useLazyGetWebSaleOrdersOrderDetailByOrderIdQuery,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { handleFromToTime } from '@hasty-bazar-commerce/utils'
import { commafy, HBButton, HBLoading } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { isValid } from 'date-fns'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  ConsignmentDetailAddress,
  ConsignmentDetailHeader,
  ConsignmentText,
  OrderTrackingDetailBodyHOC,
} from '../../components'
import { ConsignmentGroup } from '../../components/ConsignmentDetail'
import { CommerceSection, OrdersStatus } from '../../OrderTracking'
import OrderTrackingMessages from '../../orderTracking.messages'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import { CancelConsignment, CanceledConsignmentList } from '../CancelConsignment'
import { ConsignmentCancelationProvider } from '../CancelConsignment/cancel-actions/CancelationContext'

const OrderTrackingCurrentDetail: FC = () => {
  const { data } = useSession()
  const { query } = useRouter()
  const { push } = useRouter()

  const shoppingCartId = query!.profile![2] as string
  const { formatMessage, formatDate } = useIntl()
  const { orderRepayReq, paymentPayIsLoading } = usePay()
  const { addingToBasketLoading, reshoppingMutation } = useReshopping()

  const [getDetils, { isFetching, data: currentDetailData, isError }] =
    useLazyGetWebSaleOrdersOrderDetailByOrderIdQuery()
  const [variant, setVariant] = useState<'detail' | 'cancel-order' | 'cancel-order-success'>(
    'detail',
  )

  const timeLeft = useTimer(Math.abs(currentDetailData?.data?.order?.reservationLeftMinutes ?? 0))

  const [cancelableProducts, setCancelableProducts] = useState<CommerceDetailOrderItem[]>([])

  useEffect(() => {
    if (!!shoppingCartId && !!data?.user.partyId) {
      getDetils({
        ...ApiConstants,
        orderId: shoppingCartId,
        section: CommerceSection.current,
      })
    }
  }, [shoppingCartId, data?.user.partyId, getDetils])

  useEffect(() => {
    if (currentDetailData?.data?.order?.bundleItems) {
      const tempProducts = currentDetailData?.data.order?.bundleItems?.flatMap((bundleItem) => {
        return bundleItem.orderItems ?? []
      })
      setCancelableProducts([...tempProducts])
    }
  }, [currentDetailData])

  const handleShoppingButton = () => {
    if (currentDetailData?.data?.order?.stateCode === OrdersStatus.awaitPayment) {
      orderRepayReq({
        orderId: currentDetailData?.data.order.id ?? '',
      })
    } else {
      reshoppingMutation({
        ...ApiConstants,
        reshopRequest: {
          shoppingCartId: currentDetailData?.data?.order?.id ?? '',
        },
      })
    }
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
        {variant === 'detail' && (
          <>
            <ConsignmentDetailHeader
              transactions={currentDetailData?.data?.order?.transactions ?? []}
              shoppingCartId={currentDetailData?.data?.order?.id ?? ''}
              status={
                currentDetailData?.data?.order?.stateCode === OrdersStatus.paid
                  ? 'paid'
                  : 'await-payment'
              }
              onClick={() => push('/profile/order-tracking/current/')}
            >
              {currentDetailData?.data?.order?.stateCode === OrdersStatus.awaitPayment && (
                <Typography variant="subtitle1" color="primary.main" sx={{ mt: `0 !important` }}>
                  <FormattedMessage
                    {...OrderTrackingMessages.paymentAwaitingWithTime}
                    values={{ time: timeLeft }}
                  />
                </Typography>
              )}

              <Stack
                direction={{ sm: 'row', xs: 'column' }}
                alignItems={{ sm: 'center', xs: 'flex-start' }}
                gap={6}
                flexWrap="wrap"
              >
                {currentDetailData?.data?.order?.createDate && (
                  <ConsignmentText
                    firstPart={formatMessage({ ...OrderTrackingMessages.orderDateTime })}
                    secondPart={formatDate(currentDetailData.data.order.createDate)}
                  />
                )}

                {currentDetailData?.data?.order?.number && (
                  <ConsignmentText
                    firstPart={formatMessage({ ...OrderTrackingMessages.orderCode })}
                    secondPart={currentDetailData.data.order.number}
                  />
                )}
                {!!currentDetailData?.data?.order?.bundlesCount && (
                  <ConsignmentText
                    firstPart={formatMessage({ ...OrderTrackingMessages.ConsignmentCount })}
                    secondPart={currentDetailData.data.order.bundlesCount.toString()}
                  />
                )}

                {!!currentDetailData?.data?.order?.totalNetPrice && (
                  <ConsignmentText
                    firstPart={formatMessage({ ...OrderTrackingMessages.fullAmount })}
                    secondPart={`${commafy(currentDetailData.data.order.totalNetPrice)} ${
                      currentDetailData?.data.order.currency ?? ''
                    }`}
                  />
                )}

                {!!currentDetailData?.data?.order?.paymentInfo?.paymentMethodName && (
                  <ConsignmentText
                    firstPart={formatMessage({ ...OrderTrackingMessages.paymentType })}
                    secondPart={currentDetailData.data.order.paymentInfo.paymentMethodName}
                  />
                )}
                {currentDetailData?.data?.order?.voucherAmount ? (
                  <Typography variant="subtitle2" sx={{ color: 'success.main', width: '100%' }}>
                    <FormattedMessage
                      {...OrderTrackingMessages.discountCode}
                      values={{
                        price: currentDetailData.data.order.voucherAmount.toLocaleString(),
                        currency: currentDetailData?.data?.order?.currency,
                      }}
                    />
                  </Typography>
                ) : null}
              </Stack>
              <Stack
                spacing={4}
                direction="row"
                alignItems="center"
                justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
              >
                {currentDetailData?.data?.order?.isCancelable && (
                  <HBButton
                    sx={{ width: { sm: 146, xs: '50%' } }}
                    onClick={() => setVariant('cancel-order')}
                    variant="outlined"
                  >
                    <FormattedMessage {...OrderTrackingMessages.cancelOrder} />
                  </HBButton>
                )}

                <HBButton
                  sx={{ width: { sm: 146, xs: '50%' } }}
                  loading={addingToBasketLoading || paymentPayIsLoading}
                  onClick={() => handleShoppingButton()}
                  variant="contained"
                >
                  <FormattedMessage
                    {...OrderTrackingMessages[
                      currentDetailData?.data?.order?.stateCode === OrdersStatus.awaitPayment
                        ? 'orderPayment'
                        : 'buyAgain'
                    ]}
                  />
                </HBButton>
              </Stack>
            </ConsignmentDetailHeader>
            <ConsignmentDetailAddress
              address={currentDetailData?.data?.order?.deliveryAddress?.streetLine}
              lat={currentDetailData?.data?.order?.deliveryAddress?.geoCoordinate?.latitude}
              lng={currentDetailData?.data?.order?.deliveryAddress?.geoCoordinate?.longitude}
              mobileNumber={currentDetailData?.data?.order?.deliveryAddress?.recipientMobileNo}
              name={currentDetailData?.data?.order?.deliveryAddress?.title}
              postalCode={currentDetailData?.data?.order?.deliveryAddress?.postalCode}
              username={currentDetailData?.data?.order?.deliveryAddress?.recipientName}
              plaque={currentDetailData?.data?.order?.deliveryAddress?.plaque}
              unit={currentDetailData?.data?.order?.deliveryAddress?.unit}
              district={currentDetailData?.data?.order?.deliveryAddress?.district}
            />
            {currentDetailData?.data?.order?.bundleItems?.map((bundleItem, index) => (
              <ConsignmentGroup
                key={bundleItem.bundleId}
                name={formatMessage(
                  { ...OrderTrackingMessages.consignmentNumber },
                  { number: index + 1 },
                )}
                texts={[
                  {
                    key: formatMessage({ ...OrderTrackingMessages.allConsignmentAmount }),
                    value: bundleItem.totalPrice
                      ? `${bundleItem.totalPrice.toLocaleString()} ${bundleItem.currency ?? ''}`
                      : null,
                  },

                  {
                    key: formatMessage({ ...OrderTrackingMessages.discount }),
                    value: bundleItem.discount
                      ? `${bundleItem.discount?.toLocaleString()}${bundleItem.currency}`
                      : '',
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
                    key: formatMessage({ ...OrderTrackingMessages.deliveredDate }),
                    value:
                      !!bundleItem.deliveryDate && isValid(bundleItem.deliveryDate)
                        ? `${formatDate(bundleItem.deliveryDate, {
                            day: 'numeric',
                            month: 'long',
                          })}
                     ${handleFromToTime(
                       bundleItem.deliveryFromHour as string,
                       bundleItem.deliveryToHour as string,
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
        )}
        {variant === 'cancel-order' && (
          <ConsignmentCancelationProvider>
            <CancelConsignment
              type={
                currentDetailData?.data?.order?.stateCode === OrdersStatus.awaitPayment
                  ? 'waiting'
                  : 'success'
              }
              products={cancelableProducts}
              gotoSuccessPage={() => setVariant('cancel-order-success')}
              back={() => setVariant('detail')}
            />
          </ConsignmentCancelationProvider>
        )}
        {variant === 'cancel-order-success' && (
          <CanceledConsignmentList back={() => setVariant('detail')} />
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

export default OrderTrackingCurrentDetail
