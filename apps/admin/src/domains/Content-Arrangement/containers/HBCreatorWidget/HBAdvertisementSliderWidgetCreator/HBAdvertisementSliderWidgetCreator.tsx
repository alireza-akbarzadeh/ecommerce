import { HBContentUploader } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import HBTinyEditorController from '@hasty-bazar/admin-shared/containers/HBTinyEditorController'
import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import ContentManagementPageMessages from '@hasty-bazar-admin/domains/Content-Arrangement/ContentManagementPage.messages'
import {
  ContentType,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
  usePostAdminCmsContentsMutation,
  usePutAdminCmsContentsByIdMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { checkPositiveNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import { HBForm, HBFormItemTextField, openToast } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import HBFormItemColorPicker from '../../HBFormItemColorPicker'
import HBAdvertisementSliderWidgetCreatorFormMessages from './HBAdvertisementSliderWidgetCreator.message'
type HBAdvertisementSliderWidgetCreatorProps = {
  widgetProviderProps: UseFormReturn
  widgetId: number
}
export default function HBAdvertisementSliderWidgetCreator({
  widgetProviderProps,
  widgetId,
}: HBAdvertisementSliderWidgetCreatorProps) {
  const { formatMessage } = useIntl()
  const { query } = useRouter()
  const { sectionId } = query
  const [addContent] = usePostAdminCmsContentsMutation()
  const [updateContent] = usePutAdminCmsContentsByIdMutation()
  const [parentId, setParentId] = useState<string>('')

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
  useEffect(() => {
    if (items) {
      const { metaData, name, title, value, id, description } = items[0] || {}
      let otherData: any = {}
      try {
        otherData = JSON.parse(metaData || '{}')
      } catch (error) {}

      widgetProviderProps.setValue(String(widgetId), {
        name: name ?? '',
        title: title ?? '',
        value: value ?? '',
        description: description ?? '',
        id: id ?? '',
        ...otherData,
        delayTime: String(otherData?.delayTime ?? 1),
      })

      if (id) {
        setParentId(String(id))
      }
    }
  }, [items])

  useEffect(() => {
    if (sectionId) refetch()
  }, [sectionId])

  return (
    <HBForm
      id="widgetDetails"
      formProviderProps={widgetProviderProps}
      onSubmit={({ [widgetId]: value }) => {
        const model = {
          title: value.title,
          entityId: sectionId as string,
          entityTypeId: EntityTypeEnums.Section + '',
          description: value.description,
          metadata: JSON.stringify({
            backgroundColor: value.backgroundColor,
            fontColor: value.fontColor,
            delayTime: +value.delayTime,
            shortDesc: value.shortDesc,
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
          }).then(() => {
            openToast({ type: 'success', message: formatMessage(phrasesMessages.successUpdate) })
            refetch()
          })
        } else
          addContent({
            'client-name': '1',
            'client-version': '22',
            createContentModel: model,
          }).then((res: any) => {
            openToast({ type: 'success', message: formatMessage(phrasesMessages.successAdd) })
            setParentId(String(res?.data?.data?.id))
            refetch()
          })
      }}
    >
      <Grid container spacing={4} rowSpacing={6} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={4}>
          <HBFormItemTextField
            formName={`${widgetId}.title`}
            label={formatMessage(HBAdvertisementSliderWidgetCreatorFormMessages.title)}
            required
            rules={{ required: true }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <HBFormItemTextField
            formName={`${widgetId}.shortDesc`}
            label={formatMessage(HBAdvertisementSliderWidgetCreatorFormMessages.shortTitle)}
            required
            rules={{ required: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBFormItemColorPicker
            label={formatMessage(HBAdvertisementSliderWidgetCreatorFormMessages.backgroundColor)}
            formName={`${widgetId}.backgroundColor`}
            saveButtonLabel={formatMessage(HBAdvertisementSliderWidgetCreatorFormMessages.save)}
            cancelButtonLabel={formatMessage(HBAdvertisementSliderWidgetCreatorFormMessages.cancel)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBFormItemColorPicker
            label={formatMessage(HBAdvertisementSliderWidgetCreatorFormMessages.fontColor)}
            formName={`${widgetId}.fontColor`}
            saveButtonLabel={formatMessage(HBAdvertisementSliderWidgetCreatorFormMessages.save)}
            cancelButtonLabel={formatMessage(HBAdvertisementSliderWidgetCreatorFormMessages.cancel)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBFormItemTextField
            formName={`${widgetId}.delayTime`}
            label={formatMessage(HBAdvertisementSliderWidgetCreatorFormMessages.delayTime)}
            type="number"
            required
            rules={{ required: true }}
            onInput={checkPositiveNumber}
          />
        </Grid>
        <Grid item xs={12}>
          <HBTinyEditorController name={`${widgetId}.description`} init={{ max_height: 250 }} />
        </Grid>
      </Grid>
      <>
        {parentId && (
          <HBContentUploader
            entityId={String(sectionId)}
            entityTypeId={EntityTypeEnums.Section}
            fileType={ContentTypeEnums.Image}
            title={formatMessage(ContentManagementPageMessages.pictureUpload)}
            parentId={parentId as string}
            onChange={(data) => {
              widgetProviderProps.setValue(String(`${widgetId}.images`), data)
            }}
          />
        )}
      </>
    </HBForm>
  )
}
