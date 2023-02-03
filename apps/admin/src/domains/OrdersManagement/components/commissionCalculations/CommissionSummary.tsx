import { GetOrderCommissionResult } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessage from '../../ordersManagement.message'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
interface CommissionSummaryProps {
  data: GetOrderCommissionResult
}

const CommissionSummary: FC<CommissionSummaryProps> = ({ data }) => {
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  return (
    <Grid container spacing={6} mt={4}>
      <Grid item xs={12} sm={12} spacing={6}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HBIcon type="fileAlt" />
          <Typography variant="h5" ml={2}>
            {formatMessage(OrdersManagementMessage.commissionCalculation)}
          </Typography>
        </Box>
      </Grid>
      <Grid container item xs={12} sm={12} spacing={6}>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.purchaseOrderCode,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{data?.orderCode!}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.customersName,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{data?.customerName}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.orderStatus,
            )}:`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{data?.orderStatusName}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.totalAmountOfOrder,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>
              {data?.orderTotalPrice
                ? `${data?.orderTotalPrice?.toLocaleString()} ${defaultCurrencyTitle}`
                : ''}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container item xs={12} sm={12} spacing={6}>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.orderTotalRefurbishedPrice,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>
              {data?.orderTotalRefurbishedPrice
                ? `${data?.orderTotalRefurbishedPrice?.toLocaleString()} ${defaultCurrencyTitle}`
                : ''}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.finalPrice,
            )}:`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>
              {data?.orderFinalPrice
                ? `${data?.orderFinalPrice?.toLocaleString()} ${defaultCurrencyTitle}`
                : ''}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.actualCommissionPrice,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>
              {data?.actualCommissionPrice
                ? `${data?.actualCommissionPrice?.toLocaleString()} ${defaultCurrencyTitle}`
                : ''}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.inProggressCommissionPrice,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>
              {data?.inProggressCommissionPrice
                ? `${data?.inProggressCommissionPrice?.toLocaleString()} ${defaultCurrencyTitle}`
                : ''}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CommissionSummary
