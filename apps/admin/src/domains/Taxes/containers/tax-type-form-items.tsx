import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBButton } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import taxesMessages from '../taxes.messages'

type TaxTypeAddEditFormItemsProps = {
  isLoadingCreate?: boolean
  isLoadingEdit?: boolean
}

const TaxTypeFormItems = ({ isLoadingCreate, isLoadingEdit }: TaxTypeAddEditFormItemsProps) => {
  const { formatMessage } = useIntl()
  const {
    formState: { isValid, isDirty },
  } = useFormContext()

  return (
    <Grid container spacing={4} mt={2}>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          required
          fullWidth
          name="code"
          label={formatMessage(taxesMessages.code)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          required
          fullWidth
          name="name"
          label={formatMessage(taxesMessages.title)}
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
export default TaxTypeFormItems
