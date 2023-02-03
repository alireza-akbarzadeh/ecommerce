import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { useFormFieldController } from '@hasty-bazar-admin/domains/reasonManagement/hooks'
import { GetBusinessTypeValuesByBusinessTypeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { CreateReasonsSettingModel } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBAutocompleteController } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import ReasonManageMentMessages from '../../ReasonManageMent.messages'
import { switchClass } from './ReasonformConfig'

const ReasonFields = () => {
  const { formatMessage } = useIntl()
  const { UserTypeCodeItems } = useFormFieldController()

  return (
    <Grid container item xs={12} sm={12} spacing={8} mb={8}>
      <Grid item xs={12} sm={6}>
        <HBTextFieldController
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(phrasesMessages.title),
              }),
            },
          }}
          name={'title'}
          label={formatMessage(phrasesMessages.title)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <HBAutocompleteController<
          CreateReasonsSettingModel,
          GetBusinessTypeValuesByBusinessTypeQueryResult
        >
          label={formatMessage(ReasonManageMentMessages.use)}
          fieldName={'userTypeCode' as keyof CreateReasonsSettingModel}
          isOptionEqualToValue={(o, v) => o.id == v.id}
          getOptionLabel={(option) => option.title ?? ''}
          options={UserTypeCodeItems || []}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Box sx={switchClass}>
          <Typography variant={'body1'}>
            {formatMessage(ReasonManageMentMessages.NeedToRegisterDescription)}
          </Typography>
          <HBSwitchController
            formRules={{
              required: false,
            }}
            name={'isDescriptionMandatory' as keyof CreateReasonsSettingModel}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Box sx={switchClass}>
          <Typography variant={'body1'}>
            {formatMessage(ReasonManageMentMessages.NeedToPasteTheImage)}
          </Typography>
          <HBSwitchController
            formRules={{
              required: false,
            }}
            name={'isAttachmentMandatory' as keyof CreateReasonsSettingModel}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Box sx={switchClass}>
          <Typography variant={'body1'}>
            {formatMessage(ReasonManageMentMessages.ReduceSellerPoints)}
          </Typography>
          <HBSwitchController
            formRules={{
              required: false,
            }}
            name={'effectOnVendorGrade' as keyof CreateReasonsSettingModel}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Box sx={switchClass}>
          <Typography variant={'body1'}>
            {formatMessage(ReasonManageMentMessages.effectOnCustomerGrade)}
          </Typography>
          <HBSwitchController
            formRules={{
              required: false,
            }}
            name={'effectOnCustomerGrade' as keyof CreateReasonsSettingModel}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

export default ReasonFields
