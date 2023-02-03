import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import HBTinyEditorController from '@hasty-bazar/admin-shared/containers/HBTinyEditorController'
import { BusinessTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  ContentType,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  usePostAdminCmsContentsMutation,
  usePutAdminCmsContentsByIdMutation,
} from '../../../cmsApi.generated.enhanced'
import {
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
  useGetAdminGeneralDataCollectionQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { checkPositiveNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import {
  HBButton,
  HBForm,
  HBFormItemTextField,
  HBIcon,
  HBSelectProps,
  openToast,
} from '@hasty-bazar/core'
import { buttonClasses, Grid, Modal, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import HBFormItemColorPicker from '../../HBFormItemColorPicker'
import ButtonSettingModal from './ButtonSettingModal'
import HBBusinessSliderWidgetCreatorFormMessages from './HBBusinessSliderWidgetCreator.messages'

type HBBusinessSliderWidgetCreatorProps = {
  formProviderProps: UseFormReturn
  widgetProviderProps: UseFormReturn
  widgetId: number
}
export type SelectBoxOptionsType = HBSelectProps['menuItem']

export default function HBBusinessSliderWidgetCreator({
  formProviderProps,
  widgetId,
}: HBBusinessSliderWidgetCreatorProps) {
  const {
    query: { sectionId },
  } = useRouter()
  const widgetProvider = useForm({
    mode: 'all',
  })
  const { setValue, getValues, watch } = widgetProvider
  const { formatMessage } = useIntl()
  const [openSettings, setOpenSettings] = useState<boolean>(false)
  const [disabledSettings, setDisabledSettings] = useState<boolean>(false)
  const handleCloseSettings = (button?: object) => {
    if (button) setValue(`button`, button)
    setOpenSettings(false)
  }
  const saveButtonText = formatMessage(HBBusinessSliderWidgetCreatorFormMessages.save)
  const cancelButtonText = formatMessage(HBBusinessSliderWidgetCreatorFormMessages.cancel)

  const { data: queryTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessType: BusinessTypeEnums.QueryType,
    })

  const queryTypeItems = useMemo(
    () =>
      (queryTypeData?.data?.items?.map((item: any) => ({
        title: item.title,
        value: item.fullCode,
      })) || []) as SelectBoxOptionsType,
    [queryTypeData],
  )

  const [addContent] = usePostAdminCmsContentsMutation()
  const [updateContent] = usePutAdminCmsContentsByIdMutation()
  const { data: { data: { items = [] } = {} } = {}, refetch } =
    useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery(
      {
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        entityId: String(sectionId),
        entityTypeId: EntityTypeEnums.Section,
        contentType: widgetId as ContentType,
      },
      { skip: !sectionId },
    )

  const { data: { data: collectionQuery } = {}, refetch: refetchCollection } =
    useGetAdminGeneralDataCollectionQuery(
      {
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        stateCode: '2',
        collectionType: formProviderProps.watch('outputQueryType')?.value,
        filter: `StateCode_Equal_--StateCode And CollectionType_Equal_--CollectionType`,
        pageSize: 1000,
      },
      { skip: !formProviderProps.watch('outputQueryType')?.value },
    )

  useEffect(() => {
    refetchCollection()
    setValue(`queryId`, null)
  }, [formProviderProps.watch('outputQueryType')?.value])

  const collectionQueryData = useMemo(
    () =>
      collectionQuery?.items?.map(({ name: title, id: value }) => ({
        title,
        value,
      })),
    [collectionQuery?.items],
  ) as HBSelectProps['menuItem']

  useEffect(() => {
    if (items) {
      const { metaData, name, title, value, id, description } = items[0] || {}
      let otherData: any = {}
      try {
        otherData = JSON.parse(metaData || '{}')
      } catch (error) {}
      widgetProvider.reset({
        name: name ?? '',
        title: title ?? '',
        value: value ?? '',
        description: description ?? '',
        id: id ?? '',
        ...otherData,
        delayTime: String(otherData?.delayTime ?? 1),
      })
      setDisabledSettings(otherData.hasButton)
    }
  }, [items, collectionQuery])

  useEffect(() => {
    if (sectionId) {
      refetch()
    }
  }, [sectionId])

  return (
    <HBForm
      formProviderProps={widgetProvider}
      //@ts-ignore
      onSubmit={(value) => {
        const model = {
          title: value.title,
          entityId: sectionId as string,
          entityTypeId: EntityTypeEnums.Section + '',
          description: value.description,
          metadata: JSON.stringify({
            backgroundColor: value.backgroundColor,
            fontColor: value.fontColor,
            delayTime: +value.delayTime,
            queryType: +value.queryType,
            queryId: value.queryId,
            hasButton: value.hasButton,
            button: value.button,
          }),
          value: '',
          contentType: widgetId as ContentType,
          tags: [],
          name: value.title,
        }
        if (items && items.length > 0 && value.id) {
          updateContent({
            'client-name': '1',
            'client-version': '22',
            id: value.id,
            updateContentModel: model,
          }).then((res: any) => {
            if (res && res?.data?.success) {
              openToast({ type: 'success', message: formatMessage(phrasesMessages.successUpdate) })
              refetch()
            }
          })
        } else
          addContent({
            'client-name': '1',
            'client-version': '22',
            createContentModel: model,
          }).then((res: any) => {
            if (res && res?.data?.success) {
              openToast({ type: 'success', message: formatMessage(phrasesMessages.successAdd) })
              refetch()
            }
          })
      }}
      id="widgetDetails"
    >
      <Grid container spacing={4} rowSpacing={6} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            name={`title`}
            label={`${formatMessage(HBBusinessSliderWidgetCreatorFormMessages.title)}`}
            required
            formRules={{
              required: true,
              validate: (value) =>
                !!value.trim() ||
                `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(HBBusinessSliderWidgetCreatorFormMessages.title),
                })}`,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBFormItemColorPicker
            label={formatMessage(HBBusinessSliderWidgetCreatorFormMessages.backgroundColor)}
            formName={`backgroundColor`}
            saveButtonLabel={saveButtonText}
            cancelButtonLabel={cancelButtonText}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBFormItemColorPicker
            label={formatMessage(HBBusinessSliderWidgetCreatorFormMessages.fontColor)}
            formName={`fontColor`}
            saveButtonLabel={saveButtonText}
            cancelButtonLabel={cancelButtonText}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBFormItemTextField
            formName={`delayTime`}
            label={formatMessage(HBBusinessSliderWidgetCreatorFormMessages.delayTime)}
            type={'number'}
            required
            rules={{ required: true }}
            onInput={checkPositiveNumber}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBSelectController
            fullWidth
            label={formatMessage(HBBusinessSliderWidgetCreatorFormMessages.queryType)}
            name={`queryType`}
            menuItem={queryTypeItems}
            required
            formRules={{ required: true }}
            inputLabelProps={{ required: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBSelectController
            fullWidth
            label={formatMessage(HBBusinessSliderWidgetCreatorFormMessages.dynamicQuery)}
            name={`queryId`}
            menuItem={collectionQueryData || []}
            required
            formRules={{ required: true }}
            inputLabelProps={{ required: true }}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <HBTinyEditorController name={`description`} init={{ max_height: 200 }} />
        </Grid>
        <Grid item container xs={12} md={6} alignItems="center">
          <Typography>
            {formatMessage(HBBusinessSliderWidgetCreatorFormMessages.hasButton)}
          </Typography>
          <HBSwitchController
            sx={{ mx: 2 }}
            name={`hasButton`}
            disabled={false}
            onChange={(e, value) => {
              setDisabledSettings(value)
              if (value) {
                setOpenSettings(true)
              }
            }}
          />
          <HBButton
            onClick={() => setOpenSettings(true)}
            sx={{
              [`&.${buttonClasses.disabled}`]: {
                bgcolor: 'background.paper',
              },
            }}
            endIcon={
              <HBIcon
                sx={{
                  color: 'info.main',
                }}
                type="setting"
              />
            }
            variant="text"
            disabled={!disabledSettings}
          >
            <Typography variant="subtitle1" sx={{ color: 'info.main' }}>
              {formatMessage(HBBusinessSliderWidgetCreatorFormMessages.setting)}
            </Typography>
          </HBButton>
        </Grid>
        <Modal open={!!openSettings}>
          <ButtonSettingModal
            handleCloseSettings={handleCloseSettings}
            value={getValues(`button`)}
          />
        </Modal>
      </Grid>
    </HBForm>
  )
}
