import { GetShipmentOrderBundleByIdQueryResult } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { Box, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../../messages'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
interface BundleProps {
  bundleDetailsData: GetShipmentOrderBundleByIdQueryResult
}

const Bundle: FC<BundleProps> = ({ bundleDetailsData }) => {
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  return (
    <>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.shipmentResponsible,
          )}:`}</Typography>
          <Typography
            sx={{ color: 'grey.500' }}
          >{`${bundleDetailsData?.shipmentTypeName}`}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.providerName,
          )}:`}</Typography>
          <Typography sx={{ color: 'grey.500' }}>{`${bundleDetailsData?.providerName}`}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.shippingCoName,
          )}:`}</Typography>
          <Typography sx={{ color: 'grey.500' }}>{`${bundleDetailsData?.agentName}`}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.postalTrackingCode,
          )}:`}</Typography>
          {bundleDetailsData?.trackingNumber ? (
            <Typography
              sx={{ color: 'grey.500' }}
            >{`${bundleDetailsData?.trackingNumber}`}</Typography>
          ) : (
            ''
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.deliveryDate,
          )}:`}</Typography>
          <Typography sx={{ color: 'grey.500' }}>{`${convertDateToPersian(
            bundleDetailsData?.deliveryDate?.date!,
          )}`}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.deliveryHours,
          )}:`}</Typography>
          <Typography
            sx={{ color: 'grey.500' }}
          >{`${bundleDetailsData?.deliveryHours}`}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.shipmentFee,
          )}:`}</Typography>
          <Typography sx={{ color: 'grey.500' }}>
            {`${bundleDetailsData?.shippingAmount?.toLocaleString()} ${defaultCurrencyTitle}`}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.platformShare,
          )}:`}</Typography>
          <Typography sx={{ color: 'grey.500' }}>
            {`${bundleDetailsData?.platformShare?.toLocaleString()} ${defaultCurrencyTitle}`}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.vendorShare,
          )}:`}</Typography>
          <Typography sx={{ color: 'grey.500' }}>
            {`${bundleDetailsData?.vendorShare?.toLocaleString()} ${defaultCurrencyTitle}`}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.customerShare,
          )}:`}</Typography>
          <Typography sx={{ color: 'grey.500' }}>
            {`${bundleDetailsData?.customerShare?.toLocaleString()} ${defaultCurrencyTitle}`}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.deliveryAuthenticateCode,
          )}:`}</Typography>
          <Typography
            sx={{ color: 'grey.500' }}
          >{`${bundleDetailsData?.deliveryAuthenticateCode}`}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.stateTitle,
          )}:`}</Typography>
          <Typography sx={{ color: 'grey.500' }}>{`${bundleDetailsData?.stateTitle}`}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4} mb={4}>
        <Box display="flex">
          <Typography pr={1}>{`${formatMessage(
            ShipmentManagementMessage.providerStateTitle,
          )}:`}</Typography>
          {bundleDetailsData?.providerStateTitle ? (
            <Typography
              sx={{ color: 'grey.500' }}
            >{`${bundleDetailsData?.providerStateTitle}`}</Typography>
          ) : (
            ''
          )}
        </Box>
      </Grid>
    </>
  )
}

export default Bundle
