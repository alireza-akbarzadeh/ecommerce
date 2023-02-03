import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTinyEditorController from '@hasty-bazar/admin-shared/containers/HBTinyEditorController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar/admin-shared/core/translations/validations.messages'
import { usePutAdminCmsContentsByIdMutation } from './cmsApi.generated.enhanced'
import { GetContentsByEntityTypeQueryResult } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import {
  HBButton,
  HBClassesType,
  HBForm,
  HBFormItemTextField,
  HBIconButton,
  openToast,
} from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import HBFormItemColorPicker from './HBFormItemColorPicker'
import HBContentUploaderFormMessages from '../HBContentUploader.message'

type HBPageClassnames = 'modalContainer' | 'modalHeader' | 'modalSubTitle' | 'hasButton'

export type updateVideosInputType = {
  name: string
  title: string
  description: string
  hasButton: boolean
  backgroundColor: string
  fontColor: string
  button: {
    backgroundColor: string
    fontColor: string
    link: string
    name: string
  }
}

const classes: HBClassesType<HBPageClassnames> = {
  modalContainer: ({ spacing }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    backgroundColor: 'background.paper',
    borderRadius: spacing(1),
    p: 6,
  }),
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalSubTitle: ({ palette }) => ({
    color: palette.grey[500],
    my: 4,
  }),
  hasButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
}

export type VideoSettingModalProps = {
  handleCloseSettings: () => void
  data: GetContentsByEntityTypeQueryResult
  refetch: () => void
}

export default function VideoSettingModal(props: VideoSettingModalProps) {
  const [hasButton, setHasButton] = useState<boolean>(false)
  const [url, setUrl] = useState<string>('')
  const [link, setLink] = useState<string>('')
  const [isFirstLoad, setisFirstLoad] = useState<boolean>(true)
  const {
    handleCloseSettings,
    data: { metaData = '', id, name, title, description, ...otherProps },
    refetch,
  } = props
  const { formatMessage } = useIntl()
  const [updateImages, { error }] = usePutAdminCmsContentsByIdMutation()
  let formData = {}
  try {
    formData = JSON.parse(metaData!)
  } catch (error) {
    formData = {}
  }

  const { data: { data: { items: businessTypeData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessTypeCode: BusinessTypeEnums.LinkNavigationType,
      pageSize: 1000,
    })

  useEffect(() => {
    if (error) {
      openToast({
        message: errorsToString(error),
        type: 'error',
      })
    }
  }, [error])

  useEffect(() => {
    if (isFirstLoad) {
      setHasButton((formData as any)?.hasButton)
      setUrl((formData as any)?.url)
      setLink((formData as any)?.button.link)
      setisFirstLoad(false)
    }
  }, [formData])

  const onChangeSwitch = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setHasButton(checked)
  }

  const onChangeUrl = (value: string) => {
    setUrl(value)
  }

  const onChangeLink = (value: string) => {
    setLink(value)
  }

  return (
    <HBForm<updateVideosInputType>
      defaultValues={{
        ...formData,
        name: name ?? '',
        description: description ?? '',
        title: title ?? '',
      }}
      onSubmit={({ name, title, description, ...value }) => {
        updateImages({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          id: String(id!),
          //@ts-ignore//
          updateContentModel: {
            ...otherProps!,
            metadata: JSON.stringify({ ...value }),
            name,
            title,
            description,
          },
        }).then(() => {
          refetch()
          handleCloseSettings()
        })
      }}
    >
      <Box sx={classes.modalContainer}>
        <Box sx={classes.modalHeader}>
          <Typography variant="h5">
            {formatMessage(HBContentUploaderFormMessages.videoModalMainTitle)}
          </Typography>
          <HBIconButton onClick={handleCloseSettings} variant="text" icon="times" />
        </Box>
        <Typography sx={classes.modalSubTitle}>
          {formatMessage(HBContentUploaderFormMessages.videoModalTitle)}
        </Typography>

        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <HBFormItemTextField
              label={formatMessage(HBContentUploaderFormMessages.videoModalName)}
              formName="name"
              InputLabelProps={{ required: true }}
              rules={{
                required: {
                  value: true,
                  message: formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(HBContentUploaderFormMessages.videoModalName),
                  }),
                },
                validate: (value) =>
                  !!value.trim() ||
                  `${formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(HBContentUploaderFormMessages.videoModalName),
                  })}`,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={classes.hasButton}>
              <Typography>{formatMessage(HBContentUploaderFormMessages.hasButton)}</Typography>
              <HBSwitchController name="hasButton" disabled={false} onChange={onChangeSwitch} />
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
              disabled={!hasButton}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBFormItemTextField
              label={formatMessage(HBContentUploaderFormMessages.buttonLink)}
              formName="url"
              onChange={(e) => onChangeUrl(e.target.value)}
              rules={{ required: false }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBFormItemTextField
              label={formatMessage(HBContentUploaderFormMessages.buttonLink)}
              formName="button.link"
              disabled={!hasButton}
              onChange={(e) => onChangeLink(e.target.value)}
              rules={{ required: false }}
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
              label={formatMessage(HBContentUploaderFormMessages.linkNavigationType)}
              name={'linkNavigationType'}
              menuItem={
                businessTypeData?.map((item) => ({
                  title: String(item.title),
                  value: item.id || 0,
                })) || []
              }
              disabled={!url}
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
              label={formatMessage(HBContentUploaderFormMessages.linkNavigationType)}
              name={'button.linkNavigationType'}
              menuItem={
                businessTypeData?.map((item) => ({
                  title: String(item.title),
                  value: item.id || 0,
                })) || []
              }
              disabled={!hasButton || !link}
              formRules={{ required: false }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBFormItemColorPicker
              label={formatMessage(HBContentUploaderFormMessages.fontColor)}
              formName="fontColor"
              saveButtonLabel={formatMessage(phrasesMessages.save)}
              cancelButtonLabel={formatMessage(phrasesMessages.cancel)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBFormItemColorPicker
              label={formatMessage(HBContentUploaderFormMessages.buttonFontColor)}
              formName="button.fontColor"
              saveButtonLabel={formatMessage(phrasesMessages.save)}
              cancelButtonLabel={formatMessage(phrasesMessages.cancel)}
              disabled={!hasButton}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <HBTinyEditorController name={`description`} init={{ max_height: 200 }} />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <HBButton type="submit">{formatMessage(phrasesMessages.save)}</HBButton>
        </Box>
      </Box>
    </HBForm>
  )
}
