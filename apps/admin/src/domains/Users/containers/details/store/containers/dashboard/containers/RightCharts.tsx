import {
  useGetAdminReportOrderInfoGetCircleChartByCategoryIdQuery,
  useGetAdminReportOrderInfoGetCircleChartByStateQuery,
  useGetAdminReportProductCountsByStateQuery,
} from '@hasty-bazar/admin-shared/services/reportApi.generated'
import { HBChart } from '@hasty-bazar/core'
import { Stack } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import ChartDataList from '../components/ChartDataList'
import ChartGroup, { MenuItemType } from '../components/ChartGroup'
import dashboardMessages from '../Dashboard.messages'

const data = [
  { value: 450, name: 'Search Engine' },
  { value: 280, name: 'Direct' },
  { value: 580, name: 'Email' },
  { value: 484, name: 'Union Ads' },
]

const groupData = {
  color: ['#2780D2', '#2EBB66', '#D56C0C', '#EAAE54', '#F9D9A5'],
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    show: false,
  },
  series: {
    name: 'Access From',
    type: 'pie',
    radius: '90%',
    label: {
      normal: {
        show: true,
        position: 'inner',
        formatter: '{d}%',
        fontSize: 14,
      },
    },
    data: [],
  },
}

export default function RightCharts() {
  const { formatMessage } = useIntl()
  const [orderStateType, setOrderStateType] = useState<number>()
  const [orderGroupType, setOrderGroupType] = useState<number>()
  const [productStateType, setProductStateType] = useState<number>()

  const { data: groupChartData } = useGetAdminReportOrderInfoGetCircleChartByCategoryIdQuery({
    'client-name': 'admin',
    'client-version': '1.0.0',
    limitedTime: orderGroupType ?? undefined,
  })

  const { data: stateChartData } = useGetAdminReportOrderInfoGetCircleChartByStateQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      limitedTime: orderStateType ?? undefined,
    },
    { refetchOnMountOrArgChange: true },
  )

  const { data: productDataList } = useGetAdminReportProductCountsByStateQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      limitedTime: productStateType ?? undefined,
    },
    { refetchOnMountOrArgChange: true },
  )

  const getGroupChartData = useMemo(() => {
    const chartOptions = JSON.parse(JSON.stringify(groupData))
    chartOptions!.series!.data = groupChartData?.items?.map(({ count, title }) => {
      return { value: count, name: title }
    })
    return chartOptions
  }, [groupChartData?.items])

  const getStateChartData = useMemo(() => {
    const chartOptions = JSON.parse(JSON.stringify(groupData))
    //@ts-ignore
    chartOptions!.series!.data = stateChartData?.items?.map(({ count, title }) => {
      return { value: count, name: title }
    })
    return chartOptions
  }, [stateChartData?.items])

  const handleOrderStateChangeType = (type?: MenuItemType) => {
    setOrderStateType(type?.id)
  }

  const handleProductGroupChangeType = (type?: MenuItemType) => {
    setOrderGroupType(type?.id)
  }
  const handleProductStateChangeType = (type?: MenuItemType) => {
    setProductStateType(type?.id)
  }

  const OrderStateTypeChart = useMemo(
    () => (
      <ChartGroup
        title={formatMessage(dashboardMessages.productStates)}
        icon="shoppingCartAlt"
        menuItemClick={handleOrderStateChangeType}
      >
        <Stack spacing={6} direction="row" alignItems="center">
          <HBChart option={getStateChartData} sx={{ height: 240, flex: 1 }} />
          <ChartDataList data={stateChartData?.items!} sx={{ flex: 1 }} />
        </Stack>
      </ChartGroup>
    ),
    [stateChartData?.items],
  )

  const OrderGroupChart = useMemo(
    () => (
      <ChartGroup
        title={formatMessage(dashboardMessages.productGroupChart)}
        icon="labelAlt"
        menuItemClick={handleProductGroupChangeType}
      >
        <Stack spacing={6} direction="row" alignItems="center">
          <HBChart option={getGroupChartData} sx={{ height: 240, flex: 1 }} />
          <ChartDataList data={groupChartData?.items!} sx={{ flex: 1 }} />
        </Stack>
      </ChartGroup>
    ),
    [groupChartData?.items],
  )

  return (
    <Stack spacing={6}>
      {OrderStateTypeChart}
      {OrderGroupChart}
      <ChartGroup
        title={formatMessage(dashboardMessages.productTitle)}
        icon="shoppingBasket"
        menuItemClick={handleProductStateChangeType}
      >
        <ChartDataList data={productDataList?.items!} />
      </ChartGroup>
      <Stack spacing={6} direction="row">
        <ChartGroup
          title={formatMessage(dashboardMessages.contentCount)}
          icon="commentLines"
          sx={{ flex: 1 }}
        >
          <ChartDataList data={groupChartData?.items!} />
        </ChartGroup>
        <ChartGroup
          title={formatMessage(dashboardMessages.messageCount)}
          icon="envelope"
          sx={{ flex: 1 }}
        >
          <ChartDataList data={groupChartData?.items!} />
        </ChartGroup>
      </Stack>
    </Stack>
  )
}
