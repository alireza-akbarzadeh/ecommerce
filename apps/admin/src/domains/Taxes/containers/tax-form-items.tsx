import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { FormPatternsEnums } from '@hasty-bazar/admin-shared/core/enums/FormPatterns'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { HBButton } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import taxesMessages from '../taxes.messages'

type TaxFormItemsProps = {
  isLoadingCreate?: boolean
  isLoadingEdit?: boolean
}

const TaxFormItems = ({ isLoadingCreate, isLoadingEdit }: TaxFormItemsProps) => {
  const { formatMessage } = useIntl()
  const {
    formState: { isValid, isDirty },
  } = useFormContext()

  return (
    <Grid container spacing={4} mt={2}>
      <Grid item xs={12} md={4}>
        <HBDatePickerController
          name="startDate"
          label={formatMessage(taxesMessages.startDate)}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(taxesMessages.startDate),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBDatePickerController
          name="expireDate"
          label={formatMessage(taxesMessages.expireDate)}
          formRules={{
            required: {
              value: false,
              message: '',
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <HBTextFieldController
          name="percent"
          label={formatMessage(taxesMessages.percent)}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(taxesMessages.percent),
              }),
            },
            pattern: new RegExp(FormPatternsEnums.OneDecimal),
            max: 100,
          }}
          type={'number'}
        />
      </Grid>
      <Grid
        item
        xs={12}
        mt={2}
        sx={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
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
export default TaxFormItems
