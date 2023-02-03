import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { persianNumber } from '@hasty-bazar-commerce/core/utils/persianConvert'
import { useLazyGetWebSaleOrdersByOrderIdCanceledProductsQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBButton, HBDivider, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, styled, Typography } from '@mui/material'
import { default as dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ConsignmentText } from '../../components'
import OrderTrackingMessages from '../../orderTracking.messages'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import CancelConsignmentCard from './CancelConsignmentCard'

dayjs.extend(utc)

interface ICanceledConsignmentListProps {
  back: () => void
}

export const EmptySpace = styled(Box)(({ theme }) => ({}))

const dateFormat = 'YYYY-MM-DDTHH:mm:ss'
const jalaliDateFormat = 'yyyy/MM/dd,HH:MM'

const CanceledConsignmentList: FC<ICanceledConsignmentListProps> = (props) => {
  const { back } = props
  const { formatMessage, formatDate } = useIntl()
  const { query, replace } = useRouter()
  const { data } = useSession()
  const shoppingCartId = query!.profile![2] as string

  const [getCanceleds, { data: canceledResult }] =
    useLazyGetWebSaleOrdersByOrderIdCanceledProductsQuery()

  useEffect(() => {
    if (!data?.user.partyId) return
    getCanceleds({
      ...ApiConstants,
      orderId: shoppingCartId,
    })
  }, [data])
  return (
    <>
      <OrderTrackingDetailWrappers spacing={7.5}>
        {/* <Stack alignItems="flex-end">
          <HBButton onClick={() => back()} variant="text" sx={{ gap: 3 }}>
            <Typography variant="button" color="grey.700">
              <FormattedMessage {...OrderTrackingMessages.back} />
            </Typography>
            <HBIcon sx={{ color: 'grey.700', lineHeight: 0 }} type="arrowLeft" />
          </HBButton>
        </Stack> */}
        <Stack spacing={2} alignItems="center">
          <HBIcon size="large" type="check" sx={{ color: 'success.main' }} />
          <EmptySpace />
          <Typography variant="h5" color="success.main">
            <FormattedMessage {...OrderTrackingMessages.orderCancelSuccess} />
          </Typography>
          <EmptySpace />
          <EmptySpace />
          <ConsignmentText
            firstPart={formatMessage({ ...OrderTrackingMessages.orderCancelSuccess })}
            secondPart={canceledResult?.data?.summaryCart?.shoppingCartId ?? ''}
          />
          <ConsignmentText
            sx={{ direction: 'ltr' }}
            firstPart={formatMessage({ ...OrderTrackingMessages.cancelDate })}
            secondPart={
              canceledResult?.data?.summaryCart?.canceleDate
                ? formatDate(canceledResult?.data?.summaryCart?.canceleDate, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''
            }
          />
          <ConsignmentText
            firstPart={formatMessage({ ...OrderTrackingMessages.canceledOrderPrice })}
            secondPart={formatMessage(
              { ...OrderTrackingMessages.priceWithCurrency },
              {
                price:
                  persianNumber(
                    canceledResult?.data?.summaryCart?.totalAmount?.toLocaleString() ?? '',
                  ) ?? '',
                currency: canceledResult?.data?.summaryCart?.currency,
              },
            )}
          />
          <ConsignmentText
            firstPart={formatMessage({ ...OrderTrackingMessages.paymentType })}
            secondPart={canceledResult?.data?.summaryCart?.paymentMethodTitle ?? ''}
          />
          <EmptySpace />
          <HBButton onClick={() => replace('/profile/order-tracking')}>
            <FormattedMessage {...OrderTrackingMessages.returnToOrder} />
          </HBButton>
        </Stack>
      </OrderTrackingDetailWrappers>
      <OrderTrackingDetailWrappers spacing={6}>
        <Typography variant="h6">
          <FormattedMessage {...OrderTrackingMessages.canceledProducts} />
        </Typography>
        {canceledResult?.data?.products?.map((item) => (
          <>
            <CancelConsignmentCard
              key={`canceled-c<CancelConsignmentCardonsignment-${item.productId}`}
              item={item}
              readOnly
              finalyReason={item.cancelReason ?? ''}
              finalyCanceledCount={item.quantity}
            />
            <HBDivider sx={{ borderColor: 'grey.200' }} />
          </>
        ))}
      </OrderTrackingDetailWrappers>
    </>
  )
}

export default CanceledConsignmentList
