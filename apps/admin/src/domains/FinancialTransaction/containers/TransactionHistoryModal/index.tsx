import { useGetAdminSaleOrderByOrderIdTransactionsQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils/convertDateToPersian'
import { Box, CircularProgress, Divider, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import FinancialTransactionMessage from '../../financialTransaction.message'
import { inlineItem, Label, Typo } from './Transaction.Styles'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
interface TransactionHistoryProps {
  id?: string
}

const TransactionHistory: FC<TransactionHistoryProps> = ({ id }) => {
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)
  const { data, isLoading } = useGetAdminSaleOrderByOrderIdTransactionsQuery(
    {
      'client-name': 'admin',
      'client-version': '',
      orderId: id!,
    },
    { skip: !id },
  )
  const { formatMessage } = useIntl()

  return (
    <Grid container>
      {isLoading ? (
        <Grid item xs={12} display="flex" justifyContent="center">
          <CircularProgress color="secondary" size={20} />
        </Grid>
      ) : data?.data?.transactions?.length! > 0 ? (
        data?.data?.transactions?.map((transaction, index: number) => (
          <Box key={transaction?.transactionId}>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={4}>
                <Box sx={inlineItem}>
                  <Label>{formatMessage(FinancialTransactionMessage.transactionCode)}</Label>
                  <Label sx={Typo}>{transaction?.transactionId}</Label>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={inlineItem}>
                  <Label>{formatMessage(FinancialTransactionMessage.paymentMethod)}:</Label>
                  <Label sx={Typo}>{transaction?.paymentMethodName}</Label>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={inlineItem}>
                  <Label>{formatMessage(FinancialTransactionMessage.paymentDate)} :</Label>
                  <Label sx={Typo}>{convertDateToPersian(transaction?.date as string)}</Label>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={inlineItem}>
                  <Label>{formatMessage(FinancialTransactionMessage.paymentId)}</Label>
                  <Label>{transaction?.paymentMethodId?.toLocaleString()}</Label>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={inlineItem}>
                  <Label>{formatMessage(FinancialTransactionMessage.paymentAmount)}:</Label>
                  {`${transaction?.amount?.toLocaleString()} ${defaultCurrencyTitle}`}
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={inlineItem}>
                  <Label>{formatMessage(FinancialTransactionMessage.paymentStatus)}:</Label>
                  <Label sx={Typo}>
                    {String(transaction?.paymentStatus) === '0'
                      ? formatMessage(FinancialTransactionMessage.awaitingPayment)
                      : formatMessage(FinancialTransactionMessage.paid)}
                  </Label>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={inlineItem}>
                  <Label>{formatMessage(FinancialTransactionMessage.paymentPortal)}:</Label>
                  <Label sx={Typo}>{transaction?.paymentProviderName}</Label>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={inlineItem}>
                  <Label>{formatMessage(FinancialTransactionMessage.paymentAt)}:</Label>
                  <Label sx={Typo}>{'_'}</Label>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={inlineItem}>
                  <Label>{formatMessage(FinancialTransactionMessage.paymentReason)}:</Label>
                  <Label sx={Typo}>{transaction?.reason ? transaction?.reason : '-'}</Label>
                </Box>
              </Grid>
            </Grid>
            {index + 1 !== data?.data?.transactions?.length && (
              <Grid item xs={12} sm={4}>
                <Divider sx={{ borderColor: 'grey.200', mb: 4, mt: 4 }} />
              </Grid>
            )}
          </Box>
        ))
      ) : (
        <Typography mb={6} sx={Typo}>
          {formatMessage(FinancialTransactionMessage.noTransactionInfo)}
        </Typography>
      )}
    </Grid>
  )
}

export default TransactionHistory
