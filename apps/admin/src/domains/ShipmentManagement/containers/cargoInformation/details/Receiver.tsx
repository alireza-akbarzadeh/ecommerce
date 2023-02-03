import { GetShipmentOrderBundleByIdQueryResult } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../../messages'

interface ReceiverProps {
  bundleDetailsData: GetShipmentOrderBundleByIdQueryResult
}
const Receiver: FC<ReceiverProps> = ({ bundleDetailsData }) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.recieverName,
          )}:`}</Typography>
          <Typography sx={{ color: 'grey.500' }}>{`${bundleDetailsData?.recieverName}`}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={8} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.recieverPhoneNumber,
          )}:`}</Typography>
          <Typography
            sx={{ color: 'grey.500' }}
          >{`${bundleDetailsData?.recieverPhoneNumber}`}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={12} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.deliveryAddress,
          )}:`}</Typography>
          <Typography
            sx={{ color: 'grey.500' }}
          >{`${bundleDetailsData?.deliveryAddress}`}</Typography>
        </Box>
      </Grid>
    </>
  )
}

export default Receiver
