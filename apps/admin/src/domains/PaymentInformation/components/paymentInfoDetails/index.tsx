import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminPaymentPaymentResultByPaymentIdQuery } from '@hasty-bazar/admin-shared/services/paymentApi.generated'
import { convertDateTimeToPersian } from '@hasty-bazar/admin-shared/utils/convertDateToPersian'
import { persianNumber } from '@hasty-bazar/admin-shared/utils/convertToPersianNumber'
import { dotfy } from '@hasty-bazar/admin-shared/utils/dotfy'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import paymentInfoMessage from '../../paymentInfo.message'

const PaymentInfoDetails = () => {
  const { formatMessage } = useIntl()
  const { query, push } = useRouter()
  const id = query?.id?.[0] ?? ('' as string)

  const handleBack = () => {
    push('/PaymentInformation')
  }

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.home),
    },
    {
      url: '#',
      title: formatMessage(paymentInfoMessage.paymentMangeInfo),
    },
  ]

  const { data } = useGetAdminPaymentPaymentResultByPaymentIdQuery(
    {
      'client-name': '',
      'client-version': '',
      paymentId: id,
    },
    {
      skip: !id,
    },
  )

  return (
    <Box mb={3}>
      <BreadCrumbSection
        title={formatMessage(paymentInfoMessage.paymentMangeInfo)}
        breadItems={breadcrumbs}
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: (theme) => theme.spacing(4),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Typography mb={8} variant="h4">
          {formatMessage(paymentInfoMessage.paymentTransactionInformation)}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Stack gap={6}>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.transactionCode)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.paymentId}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">{formatMessage(paymentInfoMessage.for)}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.paymentBusinessTitle}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.theAccountSide)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.partyName}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.paymentMethod)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.paymentMethodName}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack gap={6}>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.transactionTime)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {convertDateTimeToPersian(data?.data?.createdDate as string)}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.transactionReference)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.paymentBusinessId}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.paymentId)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.refNo}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.transactionStatus)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.paymentStatusTitle}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack gap={6}>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.cardNumber)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.pan}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.refNo)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.refNo}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">{formatMessage(paymentInfoMessage.rrn)}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.rrn}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.paymentGetWay)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.paymentProviderName}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack gap={6}>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.receivedPlatform)}
                </Typography>
                <Typography variant="subtitle2" color="success.main">
                  {data?.data?.amount ? (
                    <>
                      <HBIcon type="arrowUp" size="small" sx={{ color: 'success.main' }} />
                      {persianNumber(dotfy(data?.data?.amount!))}
                    </>
                  ) : (
                    '--'
                  )}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.start)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {convertDateTimeToPersian(data?.data?.startDate as string)}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">{formatMessage(paymentInfoMessage.end)}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {convertDateTimeToPersian(data?.data?.endDate as string)}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(paymentInfoMessage.reason)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.statusReason}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <HBButton onClick={() => handleBack()} variant="outlined" sx={{ mt: 7 }}>
          {formatMessage(phrasesMessages.back)}
        </HBButton>
      </Box>
    </Box>
  )
}

export default PaymentInfoDetails
