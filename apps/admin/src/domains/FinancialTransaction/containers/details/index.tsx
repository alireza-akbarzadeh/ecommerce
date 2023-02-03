import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils/convertDateToPersian'
import { HBButton } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import FinancialTransactionMessage from '../../financialTransaction.message'
import useFinancialDetails from '../../hooks/useFinancialDetails'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'

const FinancialDetails = () => {
  const { breadcrumbs, data, handleBack, formatMessage } = useFinancialDetails()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  return (
    <Box mb={3}>
      <BreadCrumbSection
        title={formatMessage(FinancialTransactionMessage.financialManagement)}
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
          {formatMessage(FinancialTransactionMessage.financialManagementDetails)}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Stack gap={6}>
              <Box>
                <Typography variant="subtitle1">{data?.data?.transactionTypeName}</Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(FinancialTransactionMessage.referenceEntity)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.referenceTitle}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(FinancialTransactionMessage.partyRoleTypeTitle)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.roleAccountPartyTitle}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(FinancialTransactionMessage.amount)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {`${data?.data?.price?.toLocaleString()} ${defaultCurrencyTitle}`}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack gap={6}>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(FinancialTransactionMessage.mainReferenceEntity)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.mainReferenceTitle}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(FinancialTransactionMessage.mainReferenceDescription)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.mainReferenceDescription}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(FinancialTransactionMessage.partyFullName)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.partyName}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(FinancialTransactionMessage.effectiveDate)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {convertDateToPersian(data?.data?.effectiveDate as string)}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack gap={6}>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(FinancialTransactionMessage.transactionDate)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {convertDateToPersian(data?.data?.transactionDate as string)}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(FinancialTransactionMessage.referenceCode)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.referenceId}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(FinancialTransactionMessage.partyPaymentTypeTitle)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {formatMessage(
                    data?.data?.isReceivable
                      ? FinancialTransactionMessage.receiver
                      : FinancialTransactionMessage.payer,
                  )}
                </Typography>
              </Box>
              <Box display={'inline-flex'} gap={1} alignItems="center">
                <Typography variant="subtitle2">
                  {formatMessage(FinancialTransactionMessage.stateTitle)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {data?.data?.stateTitle}
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

export default FinancialDetails
