import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import HBTinyEditorController from '@hasty-bazar/admin-shared/containers/HBTinyEditorController'
import { EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  ContentType,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
  usePostAdminCmsContentsMutation,
  usePutAdminCmsContentsByIdMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import HBHtmlWidgetCreatorFormMessages from './HBHtmlWidgetCreator.message'

type HBHtmlWidgetCreatorProps = {
  widgetId: number
}
const HBHtmlWidgetCreator = ({ widgetId }: HBHtmlWidgetCreatorProps) => {
  const { formatMessage } = useIntl()
  const widgetProvider = useForm({
    mode: 'all',
  })
  const {
    query: { sectionId },
  } = useRouter()
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

  useEffect(() => {
    if (items) {
      const { metaData, name, title, value, id } = items[0] || {}
      let otherData = {}
      try {
        otherData = JSON.parse(metaData || '{}')
      } catch (error) {}
      widgetProvider.reset({
        name: name ?? '',
        title: title ?? '',
        value: value ?? '',
        id: id ?? '',
        ...otherData,
      })
    }
  }, [items])

  useEffect(() => {
    refetch()
  }, [sectionId])

  return (
    <HBForm
      formProviderProps={widgetProvider}
      onSubmit={(value) => {
        const model = {
          title: value.title,
          entityId: sectionId as string,
          entityTypeId: EntityTypeEnums.Section + '',
          metadata: '',
          value: value.value,
          contentType: widgetId as ContentType,
          tags: [],
          name: value.name,
        }
        if (items && items.length > 0 && value.id) {
          updateContent({
            'client-name': '1',
            'client-version': '22',
            id: value.id,
            updateContentModel: model,
          }).then(() => {
            openToast({ type: 'success', message: formatMessage(phrasesMessages.successUpdate) })
          })
        } else
          addContent({
            'client-name': '1',
            'client-version': '22',
            createContentModel: model,
          }).then((res: any) => {
            openToast({ type: 'success', message: formatMessage(phrasesMessages.successAdd) })
          })
      }}
      id="widgetDetails"
    >
      <Grid container spacing={4} rowSpacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <HBTextFieldController
            name={`name`}
            label={formatMessage(HBHtmlWidgetCreatorFormMessages.name)}
            formRules={{
              required: true,
              validate: (value) =>
                !!value.trim() ||
                `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(HBHtmlWidgetCreatorFormMessages.name),
                })}`,
            }}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <HBTextFieldController
            name={`title`}
            label={formatMessage(HBHtmlWidgetCreatorFormMessages.title)}
            formRules={{
              required: true,
              maxLength: 150,
              validate: (value) =>
                !!value.trim() ||
                `${formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(HBHtmlWidgetCreatorFormMessages.title),
                })}`,
            }}
            fullWidth
            required
          />
        </Grid>
        <Grid item sm={12} md={12}>
          <HBTinyEditorController
            name={`value`}
            init={{ max_height: 250, width: '100%' }}
            formRules={{
              required: {
                value: true,
                message: formatMessage(validationsMessages.isRequired),
              },
              validate: (value) => {
                return !!value
                  .replace(/(<([^>]+)>)/gi, '')
                  .replace(/&nbsp;/g, '')
                  .trim()
              },
            }}
          />
        </Grid>
      </Grid>
    </HBForm>
  )
}

export default HBHtmlWidgetCreator
