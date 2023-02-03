import { HBTimePickerController } from '@hasty-bazar/admin-shared/containers/HBTimePickerController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { AssignWorkingDaysModel } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAutocompleteController, HBButton } from '@hasty-bazar/core'
import { Checkbox, Grid } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import businessDaysMessages from '../../businessDays.messages'

type BankAddEditFormItemsProps = {
  WeekDaysData: GetBusinessTypeValuesQueryResult[] | null
  DayTypeData: GetBusinessTypeValuesQueryResult[] | null
  isLoadingCreate?: boolean
  isLoadingEdit?: boolean
}

const AddEditFormItemsDialog = ({
  WeekDaysData,
  DayTypeData,
  isLoadingCreate,
  isLoadingEdit,
}: BankAddEditFormItemsProps) => {
  const { formatMessage } = useIntl()
  const {
    formState: { isValid, isDirty },
  } = useFormContext()

  return (
    <Grid container spacing={6} mt={4}>
      <Grid item xs={12} md={6}>
        <HBAutocompleteController<AssignWorkingDaysModel, GetBusinessTypeValuesQueryResult>
          label={formatMessage(businessDaysMessages.days)}
          fieldName="weekDays"
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => `${option.title}`}
          options={WeekDaysData || []}
          required
          formRules={{ required: true }}
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
      <Grid item xs={12} md={6}>
        <HBAutocompleteController<AssignWorkingDaysModel, GetBusinessTypeValuesQueryResult>
          label={formatMessage(businessDaysMessages.kindOfDays)}
          fieldName="dayType"
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => `${option.title}`}
          options={DayTypeData || []}
          required
          formRules={{ required: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTimePickerController
          fieldName="deliveryFromHours"
          label={formatMessage(businessDaysMessages.deliveryFrom)}
          ampm={false}
          formRules={{ required: false }}
          textFiledProps={{ fullWidth: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTimePickerController
          fieldName="deliveryToHours"
          ampm={false}
          label={formatMessage(businessDaysMessages.deliveryTo)}
          formRules={{ required: false }}
          textFiledProps={{ fullWidth: true }}
        />
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
        <HBButton
          variant="contained"
          type="submit"
          color="primary"
          disabled={!isValid || !isDirty || isLoadingCreate || isLoadingEdit}
        >
          {formatMessage(phrasesMessages.save)}
        </HBButton>
      </Grid>
    </Grid>
  )
}
export default AddEditFormItemsDialog
