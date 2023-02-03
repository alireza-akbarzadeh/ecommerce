import { Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebSaleOrdersOrderListQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBLoading } from '@hasty-bazar/core'
import { FC } from 'react'
import { CommerceSection } from '../OrderTracking'
import { RenderRefundedList } from './render-items'

const OrderTrackingRefundedBody: FC = () => {
  const { data: deliveredData, isFetching: gettingLoading } = useGetWebSaleOrdersOrderListQuery({
    ...ApiConstants,
    section: CommerceSection.refunded,
  })

  if (gettingLoading) return <HBLoading />
  else if (!gettingLoading && deliveredData?.data?.orders?.length)
    return <RenderRefundedList orders={deliveredData.data.orders ?? []} />
  else return <Nothing />
}

export default OrderTrackingRefundedBody
