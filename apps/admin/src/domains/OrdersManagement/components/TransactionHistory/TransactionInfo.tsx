import ordersManagementMessage from '@hasty-bazar-admin/domains/OrdersManagement/ordersManagement.message'
import { useGetAdminSaleOrderByOrderIdTransactionsQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { HBDialog } from '@hasty-bazar/core'
import { Box, Divider, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { inlineItem, Typo } from './Transaction.Styles'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
type TransactionInfoType = {
  openDialog: boolean
  setOpenDialog: (val: boolean) => void
}
const TransactionInfo = ({ setOpenDialog, openDialog }: TransactionInfoType) => {
  const { query } = useRouter()
  const id = query.id?.[0] as string
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  const { formatMessage } = useIntl()

  const { data } = useGetAdminSaleOrderByOrderIdTransactionsQuery(
    {
      'client-name': 'admin',
      'client-version': '',
      orderId: id,
    },
    { skip: !id },
  )

  return (
    <HBDialog
      onClose={() => setOpenDialog(false)}
      open={openDialog}
      title={formatMessage(ordersManagementMessage.transactionHistory)}
      onReject={() => setOpenDialog(false)}
      PaperProps={{
        sx: {
          width: 850,
        },
      }}
    >
      {data?.data?.transactions?.length === 0 ? (
        <Typography mb={6} sx={Typo}>
          {formatMessage(ordersManagementMessage.recordAlert)}
        </Typography>
      ) : (
        data?.data?.transactions?.map((transaction, i) => (
          <Box mb={3} key={transaction.transactionId}>
            <Grid container>
              <Grid item xs={12} sm={4}>
                <Box mt={4.5} sx={inlineItem}>
                  <Typography>{formatMessage(ordersManagementMessage.paymentMethod)}:</Typography>
                  <Typography sx={Typo}>{transaction.paymentMethodName}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box mt={4.5} sx={inlineItem}>
                  <Typography>{formatMessage(ordersManagementMessage.paymentDate)} :</Typography>
                  <Typography sx={Typo}>
                    {convertDateToPersian(transaction?.date as string)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box mt={4.5} sx={inlineItem}>
                  <Typography>{formatMessage(ordersManagementMessage.paymentAmount)}:</Typography>
                  <Typography>
                    {`${transaction?.amount?.toLocaleString()}   ${defaultCurrencyTitle}`}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box mt={4.5} sx={inlineItem}>
                  <Typography>{formatMessage(ordersManagementMessage.paymentStatus)}:</Typography>
                  <Typography sx={Typo}>
                    {String(transaction?.paymentStatus) === '0'
                      ? formatMessage(ordersManagementMessage.awaitingPayment)
                      : formatMessage(ordersManagementMessage.paid)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box mt={4.5} sx={inlineItem}>
                  <Typography>{formatMessage(ordersManagementMessage.paymentPortal)}:</Typography>
                  <Typography sx={Typo}>{transaction?.paymentProviderName}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box mt={4.5} sx={inlineItem}>
                  <Typography>{formatMessage(ordersManagementMessage.paymentReason)}:</Typography>
                  <Typography sx={Typo}>{transaction.reason ? transaction.reason : '-'}</Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={8}>
                <Box mt={4.5} sx={inlineItem}>
                  <Typography>{formatMessage(ordersManagementMessage.transactionId)}:</Typography>
                  <Typography>{transaction.transactionId}</Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={4}>
                <Box mt={4.5} sx={inlineItem}>
                  <Typography>{formatMessage(ordersManagementMessage.transactionType)}:</Typography>
                  <Typography>{'-'}</Typography>
                </Box>
              </Grid>
            </Grid>
            {i + 1 !== data?.data?.transactions?.length && (
              <Divider sx={{ borderColor: 'grey.200', py: 2 }} />
            )}
          </Box>
        ))
      )}
    </HBDialog>
  )
}

export default TransactionInfo
