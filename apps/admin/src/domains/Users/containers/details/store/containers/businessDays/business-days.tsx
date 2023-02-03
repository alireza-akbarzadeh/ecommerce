import { GetVendorStoreResultApiResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Divider, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import businessDaysMessages from './businessDays.messages'
import { DeliveryDays } from './containers/delivery-days'
import { NonDeliveryDays } from './containers/non-delivery-days'

const BusinessDays = ({ vendorData }: { vendorData: GetVendorStoreResultApiResult }) => {
  const { formatMessage } = useIntl()
  return (
    <Box px={5}>
      <Box>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HBIcon type="calendarAlt" size="small" />
          {formatMessage(businessDaysMessages.detailsOfDeliveryDays)}
        </Typography>
        <DeliveryDays vendorData={vendorData} />
      </Box>
      <Divider
        light
        sx={({ spacing }) => ({
          margin: spacing(8, 0),
          color: 'grey.300',
          borderBottomWidth: 'medium',
        })}
      />
      <Box>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HBIcon type="calendarAlt" size="small" />
          {formatMessage(businessDaysMessages.holidays)}
          <Typography variant="subtitle2">
            ({formatMessage(businessDaysMessages.notDelivery)})
          </Typography>
        </Typography>
        <NonDeliveryDays vendorData={vendorData} />
      </Box>
    </Box>
  )
}
export default BusinessDays
