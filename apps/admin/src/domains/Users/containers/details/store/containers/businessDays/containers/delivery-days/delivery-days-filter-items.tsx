import { HBTimePickerController } from '@hasty-bazar/admin-shared/containers/HBTimePickerController'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { AssignWorkingDaysModel } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAutocompleteController, HBSelectProps } from '@hasty-bazar/core'
import { Checkbox, Grid } from '@mui/material'
import { useIntl } from 'react-intl'
import businessDaysMessages from '../../businessDays.messages'

export type SelectBoxOptionsType = HBSelectProps['menuItem']

type DeliveryDaysFilterItemsProps = {
  DayTypeData: GetBusinessTypeValuesQueryResult[] | null
  WeekDaysData: GetBusinessTypeValuesQueryResult[] | null
}
const DeliveryDaysFilterItems = ({ WeekDaysData, DayTypeData }: DeliveryDaysFilterItemsProps) => {
  const { formatMessage } = useIntl()

  return (
    <Grid container spacing={4} mt={4}>
      <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController<AssignWorkingDaysModel, GetBusinessTypeValuesQueryResult>
          label={formatMessage(businessDaysMessages.days)}
          fieldName="weekDays"
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => `${option.title}`}
          options={WeekDaysData || []}
          formRules={{ required: false }}
          autoCompleteProps={{
            //@ts-ignore
            multiple: true,
            disableCloseOnSelect: true,
            renderOption: (props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} />
                {option.title}
              </li>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController<AssignWorkingDaysModel, GetBusinessTypeValuesQueryResult>
          label={formatMessage(businessDaysMessages.kindOfDays)}
          fieldName="dayType"
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => `${option.title}`}
          options={DayTypeData || []}
          formRules={{ required: false }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBTimePickerController
          fieldName="deliveryFromHours"
          label={formatMessage(businessDaysMessages.deliveryFrom)}
          ampm={false}
          formRules={{ required: false }}
          textFiledProps={{ fullWidth: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBTimePickerController
          fieldName="deliveryToHours"
          ampm={false}
          label={formatMessage(businessDaysMessages.deliveryTo)}
          formRules={{ required: false }}
          textFiledProps={{ fullWidth: true }}
        />
      </Grid>
    </Grid>
  )
}

export default DeliveryDaysFilterItems
