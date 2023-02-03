import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import HBTinyEditorController from '@hasty-bazar/admin-shared/containers/HBTinyEditorController'
import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar/admin-shared/core/translations/validations.messages'
import HBFormItemColorPicker from './HBFormItemColorPicker'
import { HBButton, HBClassesType, HBFormItemTextField } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import HBContentUploaderFormMessages from '../HBContentUploader.message'

type HBPageClassnames = 'hasButton'

const classes: HBClassesType<HBPageClassnames> = {
  hasButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
}

const PictureSettingModalItems = () => {
  const { formatMessage } = useIntl()
  const {
    formState: { isValid },
  } = useFormContext()

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6}>
          <HBTextFieldController
            label={formatMessage(HBContentUploaderFormMessages.pictureModalName)}
            fullWidth
            name="name"
            formRules={{
              required: {
                value: true,
                message: formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(HBContentUploaderFormMessages.pictureModalName),
                }),
              },
              validate: (value) =>
                !!value.trim() ||
                `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(HBContentUploaderFormMessages.pictureModalName),
                })}`,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={classes.hasButton}>
            <Typography>{formatMessage(HBContentUploaderFormMessages.hasButton)}</Typography>
            <HBSwitchController name="hasButton" disabled={false} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBFormItemTextField
            label={formatMessage(HBContentUploaderFormMessages.title)}
            formName="title"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBFormItemTextField
            label={formatMessage(HBContentUploaderFormMessages.buttonName)}
            formName="button.name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBFormItemTextField
            label={formatMessage(HBContentUploaderFormMessages.buttonLink)}
            formName="button.link"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBFormItemColorPicker
            label={formatMessage(HBContentUploaderFormMessages.buttonBackgroundColor)}
            formName="button.backgroundColor"
            saveButtonLabel={formatMessage(phrasesMessages.save)}
            cancelButtonLabel={formatMessage(phrasesMessages.cancel)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBTinyEditorController name={`description`} init={{ max_height: 200 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBFormItemColorPicker
            label={formatMessage(HBContentUploaderFormMessages.buttonFontColor)}
            formName="button.fontColor"
            saveButtonLabel={formatMessage(phrasesMessages.save)}
            cancelButtonLabel={formatMessage(phrasesMessages.cancel)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBFormItemColorPicker
            label={formatMessage(HBContentUploaderFormMessages.backgroundColor)}
            formName="backgroundColor"
            saveButtonLabel={formatMessage(phrasesMessages.save)}
            cancelButtonLabel={formatMessage(phrasesMessages.cancel)}
          />
        </Grid>
        <Grid item xs={12} sm={6}></Grid>
        <Grid item xs={12} sm={6}>
          <HBFormItemColorPicker
            label={formatMessage(HBContentUploaderFormMessages.fontColor)}
            formName="fontColor"
            saveButtonLabel={formatMessage(phrasesMessages.save)}
            cancelButtonLabel={formatMessage(phrasesMessages.cancel)}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <HBButton type="submit" disabled={!isValid}>
          {formatMessage(phrasesMessages.save)}
        </HBButton>
      </Box>
    </>
  )
}
export default PictureSettingModalItems
