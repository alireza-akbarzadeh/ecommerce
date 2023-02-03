import { Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebSaleOrdersOrderListQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBLoading } from '@hasty-bazar/core'
import { FC } from 'react'
import { CommerceSection } from '../OrderTracking'
import { RenderCanceledList } from './render-items'

const OrderTrackingCanceledBody: FC = () => {
  const { isFetching: gettingLoading, data: cancelData } = useGetWebSaleOrdersOrderListQuery({
    ...ApiConstants,
    section: CommerceSection.canceled,
  })

  if (gettingLoading) return <HBLoading />
  else if (!gettingLoading && cancelData?.data?.orders?.length)
    return <RenderCanceledList orders={cancelData.data.orders ?? []} />
  else return <Nothing />
}

export default OrderTrackingCanceledBody
