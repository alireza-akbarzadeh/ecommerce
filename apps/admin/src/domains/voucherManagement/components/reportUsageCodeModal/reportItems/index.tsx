import { Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { IVocherUsageInfoQuery } from '../../../types/IVocherUsageInfoQuery'
import VoucherManagementPageMessages from '../../../VoucherManagementPage.messages'
import { BoxWrapper } from '../reportItems/ReportStyles'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'

const ReportItems: FC<IVocherUsageInfoQuery> = ({ data }) => {
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)
  return data?.data ? (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6}>
        <BoxWrapper>
          <Typography variant="subtitle1">
            {formatMessage(VoucherManagementPageMessages.providerVoucherCode)}
          </Typography>
          <Typography variant="subtitle1" color="primary">
            {data.data.providerTypeTitle}
          </Typography>
        </BoxWrapper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <BoxWrapper>
          <Typography variant="subtitle1">
            {formatMessage(VoucherManagementPageMessages.discountCode)}
          </Typography>
          <Typography variant="subtitle1" color="primary">
            {data.data.code}
          </Typography>
        </BoxWrapper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <BoxWrapper>
          <Typography variant="subtitle1">
            {formatMessage(VoucherManagementPageMessages.userCountUser)}
          </Typography>
          <Typography variant="subtitle1" color={'text.secondary'}>
            {data.data.usersCount}
            {formatMessage(VoucherManagementPageMessages.person)}
          </Typography>
        </BoxWrapper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <BoxWrapper>
          <Typography variant="subtitle1">
            {formatMessage(VoucherManagementPageMessages.totalUseableVoucherPrice)}
          </Typography>
          <Typography variant="subtitle1" color={'text.secondary'}>
            {data.data.totalUsedCount}
            {formatMessage(VoucherManagementPageMessages.bar)}
          </Typography>
        </BoxWrapper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <BoxWrapper>
          <Typography variant="subtitle1">
            {formatMessage(VoucherManagementPageMessages.registeredShoppingCartsCount)}
          </Typography>
          <Typography variant="subtitle2" color={'text.secondary'}>
            {data.data.registredShoppingCartsCount}
            {formatMessage(VoucherManagementPageMessages.order)}
          </Typography>
        </BoxWrapper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <BoxWrapper>
          <Typography variant="subtitle1">
            {formatMessage(VoucherManagementPageMessages.daysLeftUntilCreditedLeft)}
          </Typography>
          <Typography variant="subtitle2" color={'text.secondary'}>
            {data?.data?.remainedDaysToExpiration}
            {formatMessage(VoucherManagementPageMessages.day)}
          </Typography>
        </BoxWrapper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <BoxWrapper>
          <Typography variant="subtitle1">
            {formatMessage(VoucherManagementPageMessages.totalUsedVoucherPrice)}
          </Typography>
          <Typography variant="subtitle2" color={'text.secondary'}>
            {data.data.totalUsedVoucherPric?.toLocaleString()}
            {defaultCurrencyTitle}
          </Typography>
        </BoxWrapper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <BoxWrapper>
          <Typography variant="subtitle1">
            {formatMessage(VoucherManagementPageMessages.totalOrderPrice)}
          </Typography>
          <Typography variant="subtitle2" color={'text.secondary'}>
            {data.data.totalShoppingCartsPrice?.toLocaleString()}
            {defaultCurrencyTitle}
          </Typography>
        </BoxWrapper>
      </Grid>
    </Grid>
  ) : (
    <Typography variant="subtitle1">
      {formatMessage(VoucherManagementPageMessages.noData)}
    </Typography>
  )
}

export default ReportItems
