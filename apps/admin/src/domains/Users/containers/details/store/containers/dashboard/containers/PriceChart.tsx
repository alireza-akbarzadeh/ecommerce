import { useGetAdminReportOrderInfoPriceChartQuery } from '@hasty-bazar/admin-shared/services/reportApi.generated'
import { HBChart } from '@hasty-bazar/core'
import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { ChartGroup, MenuItemType } from '../components'
import dashboardMessages from '../Dashboard.messages'
import useChartData from './useChartData'

export type PriceChartType = {
  products?: string[]
  categories?: string[]
  limitedTime?: number
  limitedTimeProduct?: number
}

export default function PriceChart({
  products = [],
  categories = [],
  limitedTime,
  limitedTimeProduct,
}: PriceChartType) {
  const { formatMessage } = useIntl()
  const { getPriceData } = useChartData()
  const [limitedTimeP, setLimitedTimeP] = useState<number>()

  const { data: chartPriceData } = useGetAdminReportOrderInfoPriceChartQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      productsId: products.length > 0 ? products.join('-') : undefined,
      categoriesId: categories.length > 0 ? categories.join('-') : undefined,
      limitedTimeCategory: limitedTime ?? undefined,
      limitedTimeProduct: limitedTimeProduct ?? undefined,
      limitedTime: limitedTimeP ?? undefined,
    },
    { refetchOnMountOrArgChange: true },
  )

  const priceData = useMemo(() => {
    return getPriceData(chartPriceData!)
  }, [chartPriceData])

  const handleMenuClick = (item?: MenuItemType) => {
    setLimitedTimeP(item?.id)
  }

  return (
    <ChartGroup
      title={formatMessage(dashboardMessages.productAction)}
      icon="shoppingCartAlt"
      menuItemClick={handleMenuClick}
    >
      <HBChart option={priceData} sx={{ height: 420 }} />
    </ChartGroup>
  )
}
