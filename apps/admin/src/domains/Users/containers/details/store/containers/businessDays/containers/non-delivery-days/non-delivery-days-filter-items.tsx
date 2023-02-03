import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import { Grid } from '@mui/material'
import { useIntl } from 'react-intl'
import businessDaysMessages from '../../businessDays.messages'

const NonDeliveryDaysFilterItems = () => {
  const { formatMessage } = useIntl()

  return (
    <Grid container spacing={4} mt={4}>
      <Grid item xs={12} sm={3}>
        <HBDatePickerController
          name="fromDate"
          ampm={false}
          label={formatMessage(businessDaysMessages.fromDate)}
          formRules={{ required: false }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <HBDatePickerController
          name="toDate"
          ampm={false}
          label={formatMessage(businessDaysMessages.toDate)}
          formRules={{ required: false }}
        />
      </Grid>
    </Grid>
  )
}

export default NonDeliveryDaysFilterItems
