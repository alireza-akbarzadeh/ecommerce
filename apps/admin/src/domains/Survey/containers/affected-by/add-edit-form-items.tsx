import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { GetAllInfluensesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { checkPositiveIntgerNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import { HBAutocompleteController, HBButton, HBIcon } from '@hasty-bazar/core'
import { Grid, InputAdornment } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import surveyMessages from '../../survey.messages'
import { SelectBoxOptionsType } from '../../surveyAddEdit'

type AddEditFormItemsProps = {
  effectivedInCodes: SelectBoxOptionsType
  isLoadingCreate?: boolean
  isLoadingEdit?: boolean
  setIsOpenAddEditDialog: Dispatch<
    SetStateAction<{ show: boolean; data?: GetAllInfluensesQueryResult }>
  >
}

const AddEditFormItems = ({
  effectivedInCodes,
  isLoadingCreate,
  isLoadingEdit,
  setIsOpenAddEditDialog,
}: AddEditFormItemsProps) => {
  const { formatMessage } = useIntl()
  const {
    formState: { isValid, isDirty },
  } = useFormContext()

  return (
    <Grid container spacing={4} mt={4}>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          required
          fullWidth
          name="impactRate"
          label={formatMessage(surveyMessages.effectRate)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <HBIcon type="percentage" size="small" sx={{ width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
          type="number"
          onInput={checkPositiveIntgerNumber}
          formRules={{
            required: true,
            max: {
              value: 100,
              message: formatMessage(validationsMessages.maxValue, { maxValue: 100 }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBAutocompleteController
          label={formatMessage(surveyMessages.effectiveIn)}
          fieldName="effectivedIn"
          isOptionEqualToValue={(o, v) => o.value == v}
          getOptionLabel={(option) => `${option.title}`}
          options={effectivedInCodes}
          formRules={{ required: true }}
          required
          autoCompleteProps={{
            fullWidth: true,
          }}
        />
      </Grid>
      <Grid item xs={12} mt={4} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <HBButton variant="outlined" onClick={() => setIsOpenAddEditDialog({ show: false })}>
          {formatMessage(phrasesMessages.back)}
        </HBButton>
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
export default AddEditFormItems
