import HBDateTimePickerController from '@hasty-bazar/admin-shared/containers/HBDateTimePickerController'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { HBSelectProps } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useIntl } from 'react-intl'
import MegaMenuPageMessages from '../../MegaMenu.messages'

type AddEditFormsItemsProps = {
  menuTypeCodes: HBSelectProps['menuItem']
  menuDirectionsCodes: HBSelectProps['menuItem']
  menuDisplayTypeCodes: HBSelectProps['menuItem']
  platformTypeCodes: HBSelectProps['menuItem']
}

const AddEditFormsItems = ({
  menuTypeCodes,
  menuDirectionsCodes,
  menuDisplayTypeCodes,
  platformTypeCodes,
}: AddEditFormsItemsProps) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <HBSelectController
          fullWidth
          label={formatMessage(MegaMenuPageMessages.menuType)}
          menuItem={menuTypeCodes}
          name={'menuType'}
          inputLabelProps={{ required: true }}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.menuType),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBTextFieldController
          id="input-menu-code"
          label={formatMessage(MegaMenuPageMessages.code)}
          fullWidth
          name="code"
          autoComplete={'off'}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.code),
              }),
            },
            validate: (value) =>
              !!value.trim() ||
              `${formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.code),
              })}`,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <HBTextFieldController
          id="input-menu-code"
          label={formatMessage(MegaMenuPageMessages.title)}
          fullWidth
          name="title"
          autoComplete={'off'}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.title),
              }),
            },
            validate: (value) =>
              !!value.trim() ||
              `${formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.title),
              })}`,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBSelectController
          label={formatMessage(MegaMenuPageMessages.menuDirection)}
          fullWidth
          menuItem={menuDirectionsCodes}
          name="menuDirection"
          inputLabelProps={{ required: true }}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.menuDirection),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBSelectController
          label={formatMessage(MegaMenuPageMessages.menuDisplayType)}
          fullWidth
          menuItem={menuDisplayTypeCodes}
          name="menuDisplayType"
          inputLabelProps={{ required: true }}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.menuDisplayType),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBSelectController
          label={formatMessage(MegaMenuPageMessages.platformType)}
          fullWidth
          menuItem={platformTypeCodes}
          name="platformType"
          inputLabelProps={{ required: true }}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.platformType),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <HBDateTimePickerController
          inputProps={{ sx: { width: '100%' } }}
          label={`${formatMessage(MegaMenuPageMessages.activeFromDate)} *`}
          name={'activeFromDate'}
          minDateTime={new Date()}
          InputProps={{ required: true }}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.activeFromDate),
              }),
            },
            validate: (value) => {
              return !!Date.parse(value) || `${formatMessage(validationsMessages.invalidDate)}`
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <HBTextFieldController
          id="input-description"
          label={formatMessage(MegaMenuPageMessages.description)}
          fullWidth
          name="description"
          autoComplete={'off'}
          multiline
          rows={3}
          maxRows={3}
          formRules={{ required: false }}
        />
      </Grid>
    </>
  )
}
export default AddEditFormsItems
