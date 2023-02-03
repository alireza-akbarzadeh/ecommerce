import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import { useGetAdminSaleVoucherByIdGetVocherUsageInfoQuery } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBDialog } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import VoucherManagementPageMessages from '../../VoucherManagementPage.messages'
import ChartReport from './ChartReport'
import ReportGrid from './reportGrid'
import ReportItems from './reportItems'

interface IModalShoppingCart {
  openDialog: boolean
  setOpenDialog: (val: boolean) => void
  id: string
}

const ReportUsageCodeModal: FC<IModalShoppingCart> = ({ openDialog, setOpenDialog, id }) => {
  const { formatMessage } = useIntl()
  const [expanded, setExpanded] = useState<boolean>(true)
  const { data } = useGetAdminSaleVoucherByIdGetVocherUsageInfoQuery(
    {
      'client-name': '',
      'client-version': '',
      id,
    },
    {
      skip: !id,
    },
  )

  return (
    <HBDialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      onReject={() => setOpenDialog(false)}
      fullScreen
      PaperProps={{
        sx: { width: 1300, height: 800 },
      }}
    >
      <Box>
        <HBExplanation
          elevation={2}
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          sx={{
            borderRadius: (theme) => theme.spacing(4),
          }}
          summary={
            <Box display={'flex'} alignItems="center" gap={1}>
              <Typography variant="h6">
                {formatMessage(VoucherManagementPageMessages.reportUsageCode)}
              </Typography>
            </Box>
          }
          detail={
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={7}>
                <ReportItems {...{ data }} />
              </Grid>
              <Grid item xs={12} sm={5} justifyContent="center" alignItems={'center'}>
                <ChartReport {...{ data }} />
              </Grid>
            </Grid>
          }
        />
        <ReportGrid {...{ id, expanded }} />
      </Box>
    </HBDialog>
  )
}

export default ReportUsageCodeModal
