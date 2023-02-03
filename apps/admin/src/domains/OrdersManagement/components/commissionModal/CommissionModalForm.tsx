import { useGetAdminCatalogCommissionByIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { Box, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessage from '../../ordersManagement.message'
import CreateCommissionType from './CreateCommissionType'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
interface CommissionModalFormProps {
  commissionId: string
}
const CommissionModalForm: FC<CommissionModalFormProps> = ({ commissionId }) => {
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)
  const { data: { data } = {} } = useGetAdminCatalogCommissionByIdQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.AdminApi',
    'client-version': '1.0.1.100',
    id: commissionId,
  })

  return (
    <Grid container spacing={6}>
      <Grid container item xs={12} sm={12} spacing={6}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.commissionCode,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{data?.number!}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(OrdersManagementMessage.status)}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{data?.stateName!}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.validityStartDate,
            )}`}</Typography>
            {data?.startDate && (
              <Typography sx={{ color: 'grey.500' }}>
                {new Date(data?.startDate!).toLocaleDateString('fa-IR', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.validityEndtDate,
            )}`}</Typography>
            {data?.endDate && (
              <Typography sx={{ color: 'grey.500' }}>
                {new Date(data?.endDate!).toLocaleDateString('fa-IR', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.typeOfCommissionCalculation,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{data?.calculationTypeTitle!}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          {<CreateCommissionType {...{ data }} />}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.calculationMethod,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{data?.calculationTypeTitle!}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.targetValue,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>
              {data?.targetValue?.toLocaleString()!}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.minimumCommission,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>
              {data?.minCommissionPrice?.toLocaleString()!}
            </Typography>
            <Typography pr={1} sx={{ color: 'grey.500' }}>{`${defaultCurrencyTitle}`}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItem: 'center' }}>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.maximumCommission,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>
              {data?.maxCommissionPrice?.toLocaleString()!}
            </Typography>
            <Typography pr={1} sx={{ color: 'grey.500' }}>{`${defaultCurrencyTitle}`}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CommissionModalForm
