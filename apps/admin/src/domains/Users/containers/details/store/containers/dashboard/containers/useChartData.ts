import {
  CategoryChartQueryResult,
  CategoryChartQueryResultPagedCollectionQueryResult,
  PriceChartQueryResultPagedCollectionQueryResult,
  ProductChartQueryResultPagedCollectionQueryResult,
} from '@hasty-bazar/admin-shared/services/reportApi.generated'

export type FlattenType = {
  date: string
  price: number
}

export default function useChartData() {
  const options = {
    title: {},
    tooltip: {
      trigger: 'axis',
      textStyle: {
        fontFamily: 'Peyda',
      },
    },
    legend: {
      data: [],
      bottom: 0,
      icon: 'circle',
      textStyle: {
        fontFamily: 'Peyda',
      },
      type: 'scroll',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
    },
    series: [],
  }

  const getDates = (chartCategoryDataItems: CategoryChartQueryResult[]) => {
    if (!chartCategoryDataItems) return []
    let dates: { date: string; id: number }[] = []
    chartCategoryDataItems.forEach((item) => {
      item!.chart?.forEach((chart) => {
        const d = +chart?.date!.split('/').join('')
        if (!dates || !dates.find((d1) => d1.id === d)) {
          dates = [...dates, { date: chart?.date!, id: d }]
        }
      })
    })
    return (dates! || []).sort((a, b) => a.id - b.id)
  }

  const flatten = (chart: FlattenType[], dates: { date: string; id: number }[]) => {
    let chartDate: FlattenType[] = []
    dates.forEach((date) => {
      chartDate = [...chartDate, { date: date.date, price: 0 }]
    })
    chart.forEach((item) => {
      chartDate = chartDate.map((item2) => {
        if (item2.date === item.date) {
          return { ...item2, price: item.price }
        }
        return item2
      })
    })
    const result =
      chartDate?.map((item) => {
        return [item.date, item.price]
      }) || []

    return result
  }

  const getPriceData = (chartPriceData: PriceChartQueryResultPagedCollectionQueryResult) => {
    let optionsChart = JSON.parse(JSON.stringify(options))
    const legendData = ['فروش', 'کمیسیون', 'حمل']
    const dates =
      chartPriceData?.items
        ?.map((item) => {
          return {
            date: item.date!,
            id: +item.date!.split('/')?.join('')!,
          }
        })
        .sort((a, b) => a.id - b.id) || []
    const netPrices =
      chartPriceData?.items?.map((item) => {
        return {
          date: item.date!,
          price: item.netPrice!,
        }
      }) || []
    const commissionPrices =
      chartPriceData?.items?.map((item) => {
        return {
          date: item.date!,
          price: item.commissionPrice!,
        }
      }) || []
    const deliveryPrices =
      chartPriceData?.items?.map((item) => {
        return {
          date: item.date!,
          price: item.deliveryVendorPrice!,
        }
      }) || []

    const seriesData = [
      {
        name: legendData[0],
        type: 'line',
        data: flatten(netPrices as FlattenType[], dates),
      },
      {
        name: legendData[1],
        type: 'line',
        data: flatten(commissionPrices as FlattenType[], dates),
      },
      {
        name: legendData[2],
        type: 'line',
        symbol: 'none',
        data: flatten(deliveryPrices as FlattenType[], dates),
      },
    ]

    // @ts-ignore
    optionsChart.legend.data = legendData
    // @ts-ignore
    optionsChart.series = seriesData
    return optionsChart
  }

  const getProductData = (
    chartProductData: ProductChartQueryResultPagedCollectionQueryResult,
    chartOtherProductData: ProductChartQueryResultPagedCollectionQueryResult,
  ) => {
    let optionsChart = JSON.parse(JSON.stringify(options))
    let legendData = chartProductData?.items?.map((item) => item.title) || []
    legendData = [...legendData, ...(chartOtherProductData?.items?.map((item) => item.title) || [])]

    const dates = getDates([
      ...(chartProductData?.items || []),
      ...(chartOtherProductData?.items || []),
    ])
    let seriesData =
      chartProductData?.items?.map((item) => {
        return {
          name: item.title,
          type: 'line',
          data: flatten(item.chart! as FlattenType[], dates),
          smooth: true,
        }
      }) || []

    seriesData = [
      ...seriesData,
      ...(chartOtherProductData?.items?.map((item) => {
        return {
          name: item.title,
          type: 'line',
          data: flatten(item.chart! as FlattenType[], dates),
          smooth: true,
        }
      }) || []),
    ]

    // @ts-ignore
    optionsChart.legend.data = legendData
    // @ts-ignore
    optionsChart.series = seriesData
    return optionsChart
  }

  const getGroupData = (
    chartCategoryData: CategoryChartQueryResultPagedCollectionQueryResult,
    chartOtherCategoryData: CategoryChartQueryResultPagedCollectionQueryResult,
  ) => {
    let optionsChart = JSON.parse(JSON.stringify(options))
    let legendData = chartCategoryData?.items?.map((item) => item.title) || []
    legendData = [
      ...legendData,
      ...(chartOtherCategoryData?.items?.map((item) => item.title) || []),
    ]
    const dates = getDates([
      ...(chartCategoryData?.items! ?? []),
      ...(chartOtherCategoryData?.items! ?? []),
    ])
    let seriesData =
      chartCategoryData?.items?.map((item) => {
        return {
          name: item.title,
          type: 'line',
          data: flatten(item.chart! as FlattenType[], dates),
          smooth: true,
        }
      }) || []

    seriesData = [
      ...seriesData,
      ...(chartOtherCategoryData?.items?.map((item) => {
        return {
          name: item.title,
          type: 'line',
          data: flatten(item.chart! as FlattenType[], dates),
          smooth: true,
        }
      }) || []),
    ]
    // @ts-ignore
    optionsChart.legend.data = legendData
    // @ts-ignore
    optionsChart.series = seriesData
    return optionsChart
  }

  return { flatten, getDates, options, getPriceData, getProductData, getGroupData }
}
