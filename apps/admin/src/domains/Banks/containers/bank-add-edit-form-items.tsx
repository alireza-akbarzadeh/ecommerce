import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { HBUploadImageController } from '@hasty-bazar/admin-shared/containers/HBUploadImageController'
import { FormPatternsEnums } from '@hasty-bazar/admin-shared/core/enums/FormPatterns'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { HBButton } from '@hasty-bazar/core'
import { Box, Grid, inputBaseClasses, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import banksMessages from '../Banks.messages'

type BankAddEditFormItemsProps = {
  isLoadingCreate?: boolean
  isLoadingEdit?: boolean
}

const BankAddEditFormItems = ({ isLoadingCreate, isLoadingEdit }: BankAddEditFormItemsProps) => {
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
          label={formatMessage(banksMessages.name)}
          formRules={{
            maxLength: 4000,
            required: true,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          required
          fullWidth
          name="latinName"
          label={formatMessage(banksMessages.latinName)}
          formRules={{
            maxLength: 4000,
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(banksMessages.latinName),
              }),
            },
            pattern: new RegExp(FormPatternsEnums.EnText),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          required
          fullWidth
          name="cardPrefix"
          label={formatMessage(banksMessages.preNumber)}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(banksMessages.preNumber),
              }),
            },
            maxLength: 6,
            minLength: 6,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          required={true}
          fullWidth
          name="iban"
          label={formatMessage(banksMessages.preIbanNumber)}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(banksMessages.preIbanNumber),
              }),
            },
            maxLength: 5,
            minLength: 5,
          }}
          InputProps={{
            endAdornment: (
              <Typography variant="subtitle2" mt={1}>
                IR
              </Typography>
            ),
          }}
          sx={{
            [`& .${inputBaseClasses.input}`]: {
              textAlign: 'right',
              direction: 'rtl',
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <HBTextFieldController
          required
          fullWidth
          name="latinSummaryName"
          label={formatMessage(banksMessages.latinSummaryName)}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(banksMessages.latinSummaryName),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} mt={6}>
        <Typography mb={3}>{formatMessage(banksMessages.uploadLogoPlease)}</Typography>
        <Box sx={{ maxWidth: 120 }}>
          <HBUploadImageController name={'path'} />
        </Box>
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
export default BankAddEditFormItems
