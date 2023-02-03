import ContentLinks from '@hasty-bazar/admin-shared/containers/HBContentLink/HBContentLink'
import { HBContentUploader } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import HBTagsController from '@hasty-bazar/admin-shared/containers/HBTagsController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import HBTinyEditorController from '@hasty-bazar/admin-shared/containers/HBTinyEditorController'
import { ContentTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  EntityType,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
  usePostAdminCmsContentsMutation,
  usePutAdminCmsContentsByIdMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBForm, HBFormItemTextField, HBIcon, openToast } from '@hasty-bazar/core'
import { Box, IconButton, Stack } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ContentFormType, ContentType } from '../HBContentForm'
import contentFormMessages from '../HBContentForm.messages'

export default function ContentForm({
  entityId: id,
  entityTypeId,
  children,
  isShowImage = true,
  isShowLink = true,
  isShowVideo = true,
  isShowAccordion = true,
  isShowBanner,
  onFileUploaded,
}: ContentFormType) {
  const { formatMessage } = useIntl()
  const [addContentValue] = usePostAdminCmsContentsMutation()
  const [updateContentValue] = usePutAdminCmsContentsByIdMutation()

  const contentFormProvider = useForm<ContentType>({ mode: 'all' })
  const { isDirty, isValid } = contentFormProvider.formState

  const { id: contentId } = useWatch({
    control: contentFormProvider.control,
  })

  const { data: { data: { items: contentData = [] } = {} } = {}, refetch: refetchContent } =
    useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery(
      {
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        contentType: ContentTypeEnums.Html,
        entityId: id!,
        entityTypeId: entityTypeId! as unknown as EntityType,
      },
      { skip: !id },
    )

  const content = useMemo(() => contentData?.[contentData?.length - 1] || {}, [contentData])

  useEffect(() => {
    contentFormProvider.reset({
      id: content?.id!,
      title: content?.title!,
      value: content?.value!,
      description: content?.description!,
      tags: content?.tags!,
    })
  }, [content?.id, content?.title, content?.value, content?.description, content?.tags])

  const handleSubmitContent = async (values: ContentType) => {
    if (!values.tags) values.tags = []
    if (!contentId) {
      addContentValue({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        createContentModel: {
          contentType: ContentTypeEnums.Html,
          entityId: id,
          entityTypeId: String(entityTypeId),
          tags: [],
          metadata: '',
          ...values,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(contentFormMessages.contentAdded),
            type: 'success',
          })
          refetchContent()
        }
      })
    } else {
      updateContentValue({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: contentId!,
        updateContentModel: {
          name: contentId!,
          tags: [],
          metadata: '',
          ...values,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(contentFormMessages.contentUpdated),
            type: 'success',
          })
          refetchContent()
        }
      })
    }
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <HBForm<ContentType> formProviderProps={contentFormProvider} onSubmit={() => {}} mode="all">
        <IconButton
          color="primary"
          size="medium"
          type="button"
          onClick={contentFormProvider.handleSubmit(handleSubmitContent)}
          disabled={!isDirty || !isValid}
          sx={{
            position: 'absolute',
            right: 20,
            top: isShowAccordion ? -70 : -58,
          }}
        >
          <HBIcon type="check" />
        </IconButton>
        <Stack spacing={6}>
          <HBTextFieldController
            required
            name={'title'}
            label={formatMessage(contentFormMessages.contentTitle)}
            multiline
            rows={3}
            formRules={{
              maxLength: {
                value: 500,
                message: formatMessage(contentFormMessages.maxChar, { max: 500 }),
              },
              required: {
                value: true,
                message: formatMessage(contentFormMessages.isRequired),
              },
            }}
          />
          <HBTinyEditorController
            name={`value`}
            init={{ max_height: 300 }}
            formRules={{ required: true }}
            label={formatMessage(contentFormMessages.contentDescription)}
            required
          />

          <HBFormItemTextField
            required
            formName={'description'}
            label={formatMessage(contentFormMessages.contentSeo)}
            multiline
            rows={5}
            rules={{
              maxLength: {
                value: 4000,
                message: formatMessage(contentFormMessages.maxChar, { max: 4000 }),
              },
              required: {
                value: true,
                message: formatMessage(contentFormMessages.isRequired),
              },
            }}
          />
          <HBTagsController
            name="tags"
            label={formatMessage(contentFormMessages.contentTags)}
            required
            formRules={{
              required: false,
            }}
          />
          {isShowLink && <ContentLinks entityId={id!} entityTypeId={entityTypeId} />}
          {isShowImage && (
            <Box display="flex" gap={4}>
              <HBContentUploader
                title={formatMessage(contentFormMessages.uploadImageTitleMain)}
                entityId={id!}
                entityTypeId={entityTypeId}
                fileType={ContentTypeEnums.Image}
                factor="main"
                max={1}
                sx={{ flex: 1 }}
                onUploaded={(props, files, isLoad) => onFileUploaded?.(props, 'main', isLoad)}
              />
              <HBContentUploader
                title={formatMessage(contentFormMessages.uploadImageTitle)}
                entityId={id!}
                entityTypeId={entityTypeId}
                fileType={ContentTypeEnums.Image}
                factor="other"
                sx={{ flex: 2 }}
                onUploaded={(props) => onFileUploaded?.(props, 'other')}
              />
            </Box>
          )}
          {isShowBanner && (
            <Box display="flex" gap={4}>
              <HBContentUploader
                title={formatMessage(contentFormMessages.uploadBannerTitle)}
                entityId={id!}
                entityTypeId={entityTypeId}
                fileType={ContentTypeEnums.Image}
                factor="banner"
                sx={{ flex: 2 }}
                onUploaded={(props) => onFileUploaded?.(props, 'banner')}
              />
            </Box>
          )}
          {isShowVideo && (
            <HBContentUploader
              entityId={id!}
              entityTypeId={entityTypeId}
              fileType={ContentTypeEnums.Video}
              title={formatMessage(contentFormMessages.uploadVideoTitle)}
            />
          )}
        </Stack>
        <Box mt={8}>{children}</Box>
      </HBForm>
    </Box>
  )
}
