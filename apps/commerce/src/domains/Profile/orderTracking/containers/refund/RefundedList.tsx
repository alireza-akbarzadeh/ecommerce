import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { persianNumber } from '@hasty-bazar-commerce/core/utils/persianConvert'
import { useGetWebSaleOrdersByOrderIdRefundedProductsQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBButton, HBDivider, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, styled, Typography } from '@mui/material'
import { format } from 'date-fns-jalali'
import { default as dayJs, default as dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ConsignmentText } from '../../components'
import OrderTrackingMessages from '../../orderTracking.messages'
import { OrderTrackingDetailWrappers } from '../../OrderTracking.styles'
import RefundCard from './RefundCard'

dayjs.extend(utc)

interface ICanceledConsignmentListProps {
  back: () => void
}

export const EmptySpace = styled(Box)(({ theme }) => ({}))

const dateFormat = 'YYYY-MM-DDTHH:mm:ss'
const jalaliDateFormat = 'yyyy/MM/dd,HH:MM'

const RefundedList: FC<ICanceledConsignmentListProps> = (props) => {
  const { back } = props
  const { formatMessage } = useIntl()
  const { query, replace } = useRouter()
  const orderId = query!.profile![2] as string

  const { data: refundResult } = useGetWebSaleOrdersByOrderIdRefundedProductsQuery({
    ...ApiConstants,
    orderId,
  })

  return (
    <>
      <OrderTrackingDetailWrappers spacing={7.5}>
        <Stack alignItems="flex-end">
          <HBButton onClick={() => back()} variant="text" sx={{ gap: 3 }}>
            <Typography variant="button" color="grey.700">
              <FormattedMessage {...OrderTrackingMessages.back} />
            </Typography>
            <HBIcon sx={{ color: 'grey.700', lineHeight: 0 }} type="arrowLeft" />
          </HBButton>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <HBIcon size="large" type="check" sx={{ color: 'success.main' }} />
          <EmptySpace />
          <Typography variant="h5" color="success.main">
            <FormattedMessage {...OrderTrackingMessages.orderRefundSuccess} />
          </Typography>
          <EmptySpace />
          <EmptySpace />
          <ConsignmentText
            firstPart={formatMessage({ ...OrderTrackingMessages.orderCode })}
            secondPart={refundResult?.data?.summaryCart?.shoppingCartId ?? ''}
          />
          <ConsignmentText
            firstPart={formatMessage({ ...OrderTrackingMessages.refundedDate })}
            secondPart={
              refundResult?.data?.summaryCart?.canceleDate
                ? format(
                    dayJs(
                      dayJs(refundResult?.data?.summaryCart?.canceleDate).format(dateFormat),
                      dateFormat,
                    ).toDate(),
                    jalaliDateFormat,
                  )
                : ''
            }
          />
          <ConsignmentText
            firstPart={formatMessage({ ...OrderTrackingMessages.refundOrderPrice })}
            secondPart={formatMessage(
              { ...OrderTrackingMessages.priceWithCurrency },
              {
                price:
                  persianNumber(
                    refundResult?.data?.summaryCart?.totalAmount?.toLocaleString() ?? '',
                  ) ?? '',
                currency: refundResult?.data?.summaryCart?.currency,
              },
            )}
          />
          <ConsignmentText
            firstPart={formatMessage({ ...OrderTrackingMessages.paymentType })}
            secondPart={refundResult?.data?.summaryCart?.paymentMethodTitle ?? ''}
          />
          <EmptySpace />
          <HBButton onClick={() => replace('/profile/order-tracking')}>
            <FormattedMessage {...OrderTrackingMessages.returnToOrder} />
          </HBButton>
        </Stack>
      </OrderTrackingDetailWrappers>
      <OrderTrackingDetailWrappers spacing={6}>
        <Typography variant="h6">
          <FormattedMessage {...OrderTrackingMessages.refundedProducts} />
        </Typography>
        {refundResult?.data?.products?.map((item) => (
          <>
            <RefundCard key={item.productId} item={item} readOnly />
            <HBDivider sx={{ borderColor: 'grey.200' }} />
          </>
        ))}
      </OrderTrackingDetailWrappers>
    </>
  )
}

export default RefundedList
