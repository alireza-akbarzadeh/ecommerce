import CreateCommissionType from '@hasty-bazar-admin/domains/OrdersManagement/components/commissionModal/CreateCommissionType'
import OrdersManagementMessage from '@hasty-bazar-admin/domains/OrdersManagement/ordersManagement.message'
import { useGetAdminCatalogCommissionByIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { HBDialog } from '@hasty-bazar/core'
import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ICellRendererParams } from 'ag-grid-community'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import ReportDailySaleMessages from '../../ReportDailySale.messages'

const RelatedCommissionSetting = ({ data: commissionData }: ICellRendererParams) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const { formatMessage } = useIntl()

  const { data: { data } = {} } = useGetAdminCatalogCommissionByIdQuery(
    {
      'client-name': '',
      'client-version': '',
      id: commissionData?.relatedCommissionId,
    },
    {
      skip: !commissionData?.relatedCommissionId,
    },
  )

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }
  return commissionData?.relatedCommissionId ? (
    <>
      <Typography
        onClick={() => handleOpenDialog()}
        sx={{ color: 'info.main', cursor: 'pointer', mt: 2.3 }}
      >
        {commissionData?.relatedCommissionId}
      </Typography>
      <HBDialog
        title={formatMessage(ReportDailySaleMessages.relatedCommissionSetting)}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onReject={() => setOpenDialog(false)}
        PaperProps={{
          sx: { width: 650, height: 300 },
        }}
      >
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
                <Typography sx={{ color: 'grey.500' }}>
                  {convertDateToPersian(data?.startDate!)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItem: 'center' }}>
                <Typography pr={1}>{`${formatMessage(
                  OrdersManagementMessage.validityEndtDate,
                )}`}</Typography>
                <Typography sx={{ color: 'grey.500' }}>
                  {convertDateToPersian(data?.endDate!)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItem: 'center' }}>
                <Typography pr={1}>
                  {`${formatMessage(OrdersManagementMessage.typeOfCommissionCalculation)}`}
                </Typography>
                <Typography sx={{ color: 'grey.500' }}>{data?.commissionTypeTitle!}</Typography>
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
                <Typography sx={{ color: 'grey.500' }}>{data?.targetValue!}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItem: 'center' }}>
                <Typography pr={1}>{`${formatMessage(
                  OrdersManagementMessage.minimumCommission,
                )}`}</Typography>
                <Typography sx={{ color: 'grey.500' }}>{data?.minCommissionPrice!}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItem: 'center' }}>
                <Typography pr={1}>{`${formatMessage(
                  OrdersManagementMessage.maximumCommission,
                )}`}</Typography>
                <Typography sx={{ color: 'grey.500' }}>{data?.maxCommissionPrice!}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </HBDialog>
    </>
  ) : null
}

export default RelatedCommissionSetting
