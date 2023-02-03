import { Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebSaleOrdersOrderListQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBLoading } from '@hasty-bazar/core'
import { FC } from 'react'
import { CommerceSection } from '../OrderTracking'
import { RenderDeliveredList } from './render-items'

const OrderTrackingDeliveredBody: FC = () => {
  const { data: deliveredData, isFetching: gettingLoading } = useGetWebSaleOrdersOrderListQuery({
    ...ApiConstants,
    section: CommerceSection.delivered,
  })

  if (gettingLoading) return <HBLoading />
  else if (!gettingLoading && deliveredData?.data?.orders?.length)
    return <RenderDeliveredList orders={deliveredData.data.orders ?? []} />
  else return <Nothing />
}

export default OrderTrackingDeliveredBody
