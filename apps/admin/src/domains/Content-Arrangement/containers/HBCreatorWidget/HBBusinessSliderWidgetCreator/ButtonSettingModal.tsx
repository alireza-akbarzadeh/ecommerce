import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBButton, HBClassesType, HBForm, HBIconButton } from '@hasty-bazar/core'
import { Box, Container, Grid, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import HBFormItemColorPicker from '../../HBFormItemColorPicker'
import HBBusinessSliderWidgetCreatorFormMessages from './HBBusinessSliderWidgetCreator.messages'

type HBPageClassnames = 'modalContainer' | 'modalHeader'

const classes: HBClassesType<HBPageClassnames> = {
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 6,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 8,
  },
}

export type ButtonSettingModalProps = {
  handleCloseSettings: (button?: object) => void
  value: object
}

export default function ButtonSettingModal({
  handleCloseSettings,
  value,
}: ButtonSettingModalProps) {
  const Form = useForm()
  const {
    formState: { isValid },
  } = Form
  const { formatMessage } = useIntl()
  const saveButtonText = formatMessage(HBBusinessSliderWidgetCreatorFormMessages.save)
  const cancelButtonText = formatMessage(HBBusinessSliderWidgetCreatorFormMessages.cancel)
  useEffect(() => {
    Form.reset(value)
  }, [])

  const { data: { data: { items: businessTypeData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessTypeCode: BusinessTypeEnums.LinkNavigationType,
      pageSize: 1000,
    })

  const { data: { data: { items: linkNavigationWebData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessTypeCode: BusinessTypeEnums.LinkNavigationWeb,
      pageSize: 1000,
    })

  const submitForm = async () => {
    try {
      const isValid = await Form.trigger(['name', 'text', 'link'])
      if (!isValid) return
      const [
        name,
        text,
        link,
        webLinkNavigationType,
        backgroundColor,
        fontColor,
        mobileUrl,
        linkNavigationType,
      ] = Form.getValues([
        'name',
        'text',
        'link',
        'webLinkNavigationType',
        'backgroundColor',
        'fontColor',
        'mobileUrl',
        'linkNavigationType',
      ])
      handleCloseSettings({
        name,
        text,
        link,
        webLinkNavigationType,
        backgroundColor,
        fontColor,
        mobileUrl,
        linkNavigationType,
      })
    } catch (error) {}
  }
  useEffect(() => {
    const link = Form.getValues('link')
    if (!link) {
      Form?.setValue('webLinkNavigationType', {})
    }
  }, [Form.watch('link')])

  useEffect(() => {
    const mobileLink = Form.getValues('mobileUrl')

    if (!mobileLink) {
      Form?.setValue('linkNavigationType', {})
    }
  }, [Form.watch('mobileUrl')])

  return (
    <HBForm
      sx={classes.modalContainer}
      formProviderProps={Form}
      onSubmit={(value) => {
        handleCloseSettings(value)
      }}
      id="buttonFormSection"
    >
      <Container fixed sx={{ width: 600 }}>
        <Box sx={classes.modalHeader}>
          <Typography variant="h5">
            {formatMessage(HBBusinessSliderWidgetCreatorFormMessages.modalTitle)}
          </Typography>
          <HBIconButton
            onClick={() => handleCloseSettings()}
            variant="text"
            icon="times"
            iconSize="medium"
          />
        </Box>

        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <HBTextFieldController
              label={formatMessage(HBBusinessSliderWidgetCreatorFormMessages.buttonName)}
              name="name"
              required
              formRules={{
                required: true,
                validate: (value) =>
                  !!value.trim() ||
                  `${formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(HBBusinessSliderWidgetCreatorFormMessages.buttonName),
                  })}`,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBTextFieldController
              label={formatMessage(HBBusinessSliderWidgetCreatorFormMessages.buttonTitle)}
              name="text"
              required
              formRules={{
                required: true,
                validate: (value) =>
                  !!value.trim() ||
                  `${formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(HBBusinessSliderWidgetCreatorFormMessages.buttonTitle),
                  })}`,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBFormItemColorPicker
              label={formatMessage(HBBusinessSliderWidgetCreatorFormMessages.backgroundColor) + '*'}
              formName="backgroundColor"
              saveButtonLabel={saveButtonText}
              cancelButtonLabel={cancelButtonText}
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBFormItemColorPicker
              label={formatMessage(HBBusinessSliderWidgetCreatorFormMessages.fontColor) + '*'}
              formName="fontColor"
              saveButtonLabel={saveButtonText}
              cancelButtonLabel={cancelButtonText}
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBTextFieldController
              label={formatMessage(HBBusinessSliderWidgetCreatorFormMessages.webRedirectLink)}
              name="link"
              formRules={{ required: false }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBSelectController
              sx={{
                width: {
                  md: '100%',
                  xs: '100%',
                },
                minWidth: 100,
              }}
              label={`${formatMessage(
                HBBusinessSliderWidgetCreatorFormMessages.webLinkNavigationMethod,
              )}${Form?.watch('link') ? '*' : ''}`}
              name={'webLinkNavigationType'}
              menuItem={
                linkNavigationWebData?.map((item) => ({
                  title: String(item.title),
                  value: item.id || 0,
                })) || []
              }
              formRules={{
                required: Form?.watch('link')
                  ? {
                      value: true,
                      message: `${formatMessage(validationsMessages.isRequired, {
                        msg: formatMessage(
                          HBBusinessSliderWidgetCreatorFormMessages.webLinkNavigationMethod,
                        ),
                      })}`,
                    }
                  : false,
              }}
              disabled={!Form?.watch('link')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBTextFieldController
              label={formatMessage(HBBusinessSliderWidgetCreatorFormMessages.mobileRedirectLink)}
              name="mobileUrl"
              formRules={{ required: false }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBSelectController
              sx={{
                width: {
                  md: '100%',
                  xs: '100%',
                },
                minWidth: 100,
              }}
              label={`${formatMessage(
                HBBusinessSliderWidgetCreatorFormMessages.mobileLinkNavigationMethod,
              )}${Form?.watch('mobileUrl') ? '*' : ''}`}
              name={'linkNavigationType'}
              menuItem={
                businessTypeData?.map((item) => ({
                  title: String(item.title),
                  value: item.id || 0,
                })) || []
              }
              formRules={{
                required: {
                  value: true,
                  message: `${formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(
                      HBBusinessSliderWidgetCreatorFormMessages.mobileLinkNavigationMethod,
                    ),
                  })}`,
                },
              }}
              disabled={!Form?.watch('mobileUrl')}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8 }}>
          <HBButton variant="outlined" sx={{ width: 140 }} onClick={() => handleCloseSettings()}>
            {formatMessage(phrasesMessages.cancel)}
          </HBButton>
          <HBButton
            sx={{ width: 140 }}
            form="buttonFormSection"
            onClick={submitForm}
            disabled={!isValid}
          >
            {formatMessage(HBBusinessSliderWidgetCreatorFormMessages.save)}
          </HBButton>
        </Box>
      </Container>
    </HBForm>
  )
}
