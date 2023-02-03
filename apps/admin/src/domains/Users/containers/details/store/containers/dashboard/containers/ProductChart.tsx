import { useGetAdminReportOrderInfoProductChartQuery } from '@hasty-bazar/admin-shared/services/reportApi.generated'
import { HBChart } from '@hasty-bazar/core'
import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { ChartGroup, MenuItemType } from '../components'
import dashboardMessages from '../Dashboard.messages'
import useChartData from './useChartData'

export type ProductChartType = {
  onClick?: (categoryIds: string) => void
  categories?: string[]
  limitedTime?: number
  onMenuClick?: (menuItem?: MenuItemType) => void
}

export default function ProductChart({
  onClick,
  categories = [],
  limitedTime,
  onMenuClick,
}: ProductChartType) {
  const { formatMessage } = useIntl()
  const { getProductData } = useChartData()
  const [limitedTimeP, setLimitedTimeP] = useState<number>()

  const { data: chartProductData } = useGetAdminReportOrderInfoProductChartQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      count: 9,
      other: false,
      categoriesId: categories.length > 0 ? categories.join('-') : undefined,
      limitedTime: limitedTimeP ?? undefined,
      limitedTimeCategory: limitedTime ?? undefined,
    },
    { refetchOnMountOrArgChange: true },
  )
  const { data: chartOtherProductData } = useGetAdminReportOrderInfoProductChartQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      count: 9,
      other: true,
      categoriesId: categories.length > 0 ? categories.join('-') : undefined,
      limitedTime: limitedTimeP ?? undefined,
      limitedTimeCategory: limitedTime ?? undefined,
    },
    { refetchOnMountOrArgChange: true },
  )

  const productData = useMemo(() => {
    return getProductData(chartProductData!, chartOtherProductData!)
  }, [chartProductData?.items, chartOtherProductData?.items, categories])

  const handleChartClick = async (params: any) => {
    const product = [...chartProductData?.items!, ...chartOtherProductData?.items!]?.find(
      (f) => f.title === params.name,
    )
    if (!product) return

    onClick?.(product.productsId!)
  }

  const productChart = useMemo(
    () => <HBChart option={productData} sx={{ height: 420 }} onCategoryClick={handleChartClick} />,
    [productData],
  )

  const handleMenuClick = (item?: MenuItemType) => {
    setLimitedTimeP(item?.id)
    onMenuClick?.(item)
  }

  return (
    <ChartGroup
      title={formatMessage(dashboardMessages.product)}
      icon="shoppingCartAlt"
      menuItemClick={handleMenuClick}
    >
      {productChart}
    </ChartGroup>
  )
}
