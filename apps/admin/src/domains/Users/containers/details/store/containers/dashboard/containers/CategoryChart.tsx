import { useGetAdminReportOrderInfoCategoryChartQuery } from '@hasty-bazar/admin-shared/services/reportApi.generated'
import { HBChart } from '@hasty-bazar/core'
import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { ChartGroup, MenuItemType } from '../components'
import dashboardMessages from '../Dashboard.messages'
import useChartData from './useChartData'

export type CategoryChartType = {
  onClick?: (categoryIds: string) => void
  onMenuClick?: (menuItem?: MenuItemType) => void
}

export default function CategoryChart({ onClick, onMenuClick }: CategoryChartType) {
  const { formatMessage } = useIntl()
  const { getGroupData } = useChartData()
  const [limitedTime, setLimitedTime] = useState<number>()

  const { data: chartCategoryData } = useGetAdminReportOrderInfoCategoryChartQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      count: 9,
      other: false,
      limitedTime: limitedTime ?? undefined,
    },
    { refetchOnMountOrArgChange: true },
  )
  const { data: chartOtherCategoryData } = useGetAdminReportOrderInfoCategoryChartQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      count: 9,
      other: true,
      limitedTime: limitedTime ?? undefined,
    },
    { refetchOnMountOrArgChange: true },
  )

  const groupData = useMemo(() => {
    return getGroupData(chartCategoryData!, chartOtherCategoryData!)
  }, [chartCategoryData?.items, chartOtherCategoryData?.items])

  const handleCategoryClick = async (params: any) => {
    const cat = [...chartCategoryData?.items!, ...chartOtherCategoryData?.items!]?.find(
      (f) => f.title === params.name,
    )
    if (!cat) return

    onClick?.(cat.categoriesId!)
  }

  const handleMenuClick = (item?: MenuItemType) => {
    setLimitedTime(item?.id)
    onMenuClick?.(item)
  }

  return (
    <ChartGroup
      title={formatMessage(dashboardMessages.productGroup)}
      icon="shoppingCartAlt"
      menuItemClick={handleMenuClick}
    >
      <HBChart option={groupData} sx={{ height: 420 }} onCategoryClick={handleCategoryClick} />
    </ChartGroup>
  )
}
