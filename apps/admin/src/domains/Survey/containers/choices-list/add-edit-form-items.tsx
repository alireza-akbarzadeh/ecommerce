import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetAllSelectionsListQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { checkPositiveIntgerNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import { HBButton } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import surveyMessages from '../../survey.messages'

type AddEditFormItemsProps = {
  isLoadingCreate?: boolean
  isLoadingEdit?: boolean
  setIsOpenAddEditDialog: Dispatch<
    SetStateAction<{ show: boolean; data?: GetAllSelectionsListQueryResult }>
  >
}

const AddEditFormItems = ({
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
          name="name"
          label={formatMessage(surveyMessages.choiceTitle)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          required
          fullWidth
          name="value"
          label={formatMessage(surveyMessages.choiceWorthiness)}
          type="number"
          onInput={checkPositiveIntgerNumber}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          required
          fullWidth
          name="sortOrder"
          label={formatMessage(surveyMessages.choiceOrder)}
          type="number"
          onInput={checkPositiveIntgerNumber}
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
