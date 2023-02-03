import { Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, ReactNode } from 'react'
import { OrderTrackingHeader } from './components'
import {
  OrderTrackingCanceledDetail,
  OrderTrackingCurrentDetail,
  OrderTrackingDeliveredDetail,
  OrderTrackingRefundDetail,
} from './containers/details'
import OrderTrackingCanceledBody from './containers/OrderTrackingCanceledBody'
import OrderTrackingCurrentBody from './containers/OrderTrackingCurrentBody'
import OrderTrackingDeliveredBody from './containers/OrderTrackingDeliveredBody'
import OrderTrackingRefundedBody from './containers/OrderTrackingRefundedBody'
import OrderTrackingSearch from './containers/OrderTrackingSearch'
import { OrderTRackingBody } from './OrderTracking.styles'

export type orderTrackingType =
  | 'current'
  | 'delivered'
  | 'returned'
  | 'canceled'
  | 'currentDetail'
  | 'canceledDetail'
  | 'deliveredDetail'
  | 'refundedDetail'
  | 'search'
  | ''

const orderTackingBody: Record<orderTrackingType, ReactNode> = {
  current: <OrderTrackingCurrentBody />,
  canceled: <OrderTrackingCanceledBody />,
  delivered: <OrderTrackingDeliveredBody />,
  returned: <OrderTrackingRefundedBody />,
  currentDetail: <OrderTrackingCurrentDetail />,
  canceledDetail: <OrderTrackingCanceledDetail />,
  deliveredDetail: <OrderTrackingDeliveredDetail />,
  refundedDetail: <OrderTrackingRefundDetail />,
  search: <OrderTrackingSearch />,
  '': <OrderTrackingCurrentBody />,
}

const dontShowHeader: orderTrackingType[] = [
  'currentDetail',
  'canceledDetail',
  'deliveredDetail',
  'refundedDetail',
  'search',
]

export enum OrdersStatus {
  paid = '4',
  awaitPayment = '1',
  canceledByUser = '6',
  canceledBySystem = '7',
  returned = '8',
}

export enum CommerceSection {
  current = 1,
  delivered = 2,
  refunded = 3,
  canceled = 4,
}

const OrderTracking: FC = () => {
  const { query } = useRouter()
  const orderTrackingQuery = (query?.profile?.[1] as orderTrackingType) ?? ''

  return !dontShowHeader.some((i) => i === orderTrackingQuery) ? (
    <OrderTRackingBody spacing={8}>
      {dontShowHeader.some((i) => i !== orderTrackingQuery) && <OrderTrackingHeader />}

      {orderTackingBody[orderTrackingQuery]}
    </OrderTRackingBody>
  ) : (
    <Stack
      spacing={8}
      sx={{
        width: '100%',
        bgcolor: { sm: 'transparent', xs: 'white' },
        borderRadius: { sm: 4, xs: 0 },
        px: { sm: 3, xs: 2.5 },
        py: { sm: 0, xs: 6 },
      }}
    >
      {orderTackingBody[orderTrackingQuery]}
    </Stack>
  )
}

export default OrderTracking
