import HBBankCard from '@hasty-bazar/admin-shared/containers/HBBankCard'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { GetPartyDetailsQueryResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { useGetAdminPaymentWalletBalanceByMobileQuery } from '@hasty-bazar/admin-shared/services/paymentApi.generated'
import { HBChart } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useIntl } from 'react-intl'

type WalletChartType = {
  userId: string
  details: GetPartyDetailsQueryResult
}

const WalletChart = ({ userId, details }: WalletChartType) => {
  const { formatMessage } = useIntl()
  const { data: walletBalanceData, refetch: walletBalanceRefresh } =
    useGetAdminPaymentWalletBalanceByMobileQuery(
      {
        'client-name': 'add-content',
        'client-version': '1.0.0',
        mobile: details.mobile!,
      },
      { skip: !userId },
    )

  const groupData = {
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontFamily: 'Peyda',
      },
    },
    color: ['#FFB067', '#1C62A1'],
    legend: {
      orient: 'vertical',
      bottom: 'bottom',
      show: true,
      textStyle: {
        fontFamily: 'Peyda',
      },
    },
    label: {
      show: true,
      position: 'center',
      textStyle: {
        fontFamily: 'Peyda',
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['90%', '35%'],
        label: {
          normal: {
            show: true,
            position: 'inner',
            formatter: (params: any) => {
              return params.value?.toLocaleString()
            },
            fontSize: 12,
            fontFamily: 'Peyda',
          },
        },
        data: [
          {
            value: walletBalanceData?.data?.depositeTotalAmount || 0,
            name: formatMessage(userPageMessages.depositAmount),
          },
          {
            value: Math.abs(walletBalanceData?.data?.withdrawTotalAmount || 0),
            name: formatMessage(userPageMessages.withdrawAmount),
          },
        ],
      },
    ],
  }

  const walletRefetch = () => {
    walletBalanceRefresh()
  }

  return (
    <>
      <Box sx={({ palette }) => ({ background: palette.grey[100], borderRadius: 2 })} py={3} px={2}>
        <Typography variant="subtitle1">{formatMessage(userPageMessages.wallet)}</Typography>
      </Box>
      <Grid
        container
        sx={({ palette }) => ({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: `1px solid ${palette.grey[200]}`,
          borderRadius: 2,
          minHeight: 300,
        })}
        my={4}
        columnSpacing={8}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={(theme) => ({
            display: 'flex!important',
            justifyContent: 'end!important',
            [theme.breakpoints.down('md')]: {
              justifyContent: 'center!important',
            },
          })}
        >
          <HBBankCard
            balance={walletBalanceData?.data?.balance || 0}
            walletRefetch={walletRefetch}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={(theme) => ({
            height: '100%',
            display: 'flex!important',
            justifyContent: 'start!important',
            [theme.breakpoints.down('md')]: {
              justifyContent: 'center!important',
            },
          })}
        >
          <HBChart
            option={groupData}
            sx={{ height: 300, width: 250, justifyContent: 'center', display: 'flex' }}
          />
        </Grid>
      </Grid>
    </>
  )
}
export default WalletChart
