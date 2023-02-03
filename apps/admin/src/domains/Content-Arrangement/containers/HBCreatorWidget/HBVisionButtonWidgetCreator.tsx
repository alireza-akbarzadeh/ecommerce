import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
  usePostAdminCmsContentsMutation,
  usePutAdminCmsContentsByIdMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBButton, HBForm, HBFormItemTextField, HBToast } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ShowTostType } from '../../ContentManagementPage'
import HBFormItemColorPicker from '../HBFormItemColorPicker'
import HBVisionButtonWidgetCreatorFormMessages from './HBVisionButtonWidgetCreator.message'

type formType = {
  name: string
  title: string
  backgroundColor: string
  fontColor: string
  link: string
  value: string
  id: string
}
type HBBusinessSliderWidgetCreatorProps = {
  widgetProviderProps: UseFormReturn
}
export default function HBVisionButtonWidgetCreator({
  widgetProviderProps: formProvider,
}: HBBusinessSliderWidgetCreatorProps) {
  const {
    query: { sectionId },
  } = useRouter()
  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })
  const [addContent] = usePostAdminCmsContentsMutation()
  const [updateContent] = usePutAdminCmsContentsByIdMutation()
  const { formatMessage } = useIntl()
  const { data: { data: { items = [] } = {} } = {}, refetch } =
    useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery(
      {
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        entityId: String(sectionId),
        entityTypeId: EntityTypeEnums.Section,
        contentType: ContentTypeEnums.Button,
      },
      { skip: !sectionId },
    )

  useEffect(() => {
    if (items) {
      const { metaData, name, title, value, id } = items[0] || {}
      let otherData = {}
      try {
        otherData = JSON.parse(metaData || '{}')
      } catch (error) {}
      formProvider.reset({
        name: name ?? '',
        title: title ?? '',
        value: value ?? '',
        id: id ?? '',
        ...otherData,
      })
    }
  }, [items])

  return (
    <HBForm
      formProviderProps={formProvider}
      onSubmit={(value: formType) => {
        const model = {
          title: value.title,
          entityId: sectionId as string,
          entityTypeId: EntityTypeEnums.Section + '',
          metadata: JSON.stringify({
            backgroundColor: value.backgroundColor,
            fontColor: value.fontColor,
            text: value.title,
            link: value.link,
          }),
          value: '',
          contentType: ContentTypeEnums.Button,
          tags: [],
          name: value.name,
        }
        if (items && items.length > 0 && value.id) {
          updateContent({
            'client-name': '1',
            'client-version': '22',
            id: value.id,
            updateContentModel: model,
          })
        } else
          addContent({
            'client-name': '1',
            'client-version': '22',
            createContentModel: model,
          })
      }}
    >
      <Grid container spacing={4} rowSpacing={6} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={4}>
          <HBFormItemTextField
            formName="name"
            label={formatMessage(HBVisionButtonWidgetCreatorFormMessages.name)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBFormItemTextField
            formName="title"
            label={formatMessage(HBVisionButtonWidgetCreatorFormMessages.title)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HBFormItemColorPicker
            label={formatMessage(HBVisionButtonWidgetCreatorFormMessages.backgroundColor)}
            formName="backgroundColor"
            saveButtonLabel={formatMessage(phrasesMessages.save)}
            cancelButtonLabel={formatMessage(phrasesMessages.cancel)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <HBFormItemColorPicker
            label={formatMessage(HBVisionButtonWidgetCreatorFormMessages.textColor)}
            formName="fontColor"
            saveButtonLabel={formatMessage(phrasesMessages.save)}
            cancelButtonLabel={formatMessage(phrasesMessages.cancel)}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <HBFormItemTextField
            formName="link"
            label={formatMessage(HBVisionButtonWidgetCreatorFormMessages.url)}
          />
        </Grid>
        <Grid item xs={12}>
          <HBButton type="submit">
            {items && items?.length > 0
              ? formatMessage(HBVisionButtonWidgetCreatorFormMessages.update)
              : formatMessage(phrasesMessages.save)}
          </HBButton>
        </Grid>
      </Grid>
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />
    </HBForm>
  )
}
