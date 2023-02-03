import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import { useGetAdminReportOrderInfoDashboardCountsQuery } from '@hasty-bazar/admin-shared/services/reportApi.generated'
import { Grid } from '@mui/material'
import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { SummaryItem } from '../components'
import dashboardMessages from '../Dashboard.messages'

export default function TopSummary() {
  const { formatMessage } = useIntl()

  const defaultCurrency = useAppSelector((state) => String(String(state.app.defaultCurrencyTitle)))

  const { data: topSummaryData } = useGetAdminReportOrderInfoDashboardCountsQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
  })
  const summaryData = useMemo(
    () => [
      {
        title: formatMessage(dashboardMessages.totalSell),
        value: topSummaryData?.saledTotal!,
        suffix: defaultCurrency,
      },
      {
        title: formatMessage(dashboardMessages.averagePurchasePerMonth),
        value: topSummaryData?.averageCostInMonth!,
      },
      {
        title: formatMessage(dashboardMessages.totalCommission),
        value: topSummaryData?.commissionPriceTotal!,
      },
      {
        title: formatMessage(dashboardMessages.uniqueBuyersCount),
        value: topSummaryData?.uniqeBuyersCount!,
      },
      { title: formatMessage(dashboardMessages.totalOrder), value: topSummaryData?.ordersCount! },
      {
        title: formatMessage(dashboardMessages.numberOfProducts),
        value: topSummaryData?.shipMentCount!,
      },
    ],
    [topSummaryData, defaultCurrency],
  )

  return (
    <Grid container spacing={4} mb={6}>
      {summaryData.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <SummaryItem {...item} />
        </Grid>
      ))}
    </Grid>
  )
}
