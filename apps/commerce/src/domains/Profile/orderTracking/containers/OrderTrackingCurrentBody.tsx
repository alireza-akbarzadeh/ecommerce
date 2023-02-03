import { Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebSaleOrdersOrderListQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBLoading } from '@hasty-bazar/core'
import { FC } from 'react'
import { CommerceSection } from '../OrderTracking'
import { RenderCurrentList } from './render-items'

const OrderTrackingCurrentBody: FC = () => {
  const { data: currentData, isFetching: gettingLoading } = useGetWebSaleOrdersOrderListQuery({
    ...ApiConstants,
    section: CommerceSection.current,
  })

  if (gettingLoading) return <HBLoading />
  else if (!gettingLoading && currentData?.data?.orders?.length)
    return <RenderCurrentList orders={currentData?.data?.orders ?? []} />
  else return <Nothing />
}

export default OrderTrackingCurrentBody
