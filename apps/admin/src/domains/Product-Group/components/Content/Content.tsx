import { HBContentLink } from '@hasty-bazar/admin-shared/containers/HBContentLink'
import { HBContentUploader } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  GetTagQueryResult,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
  usePostAdminCmsContentsMutation,
  usePutAdminCmsContentsByIdMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBIcon, openToast } from '@hasty-bazar/core'
import { Box, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupMessages from '../../ProductGroup.messages'
import DescriptionController from './containers/fromControls/DescriptionController'
import SeoController from './containers/fromControls/SeoController'
import TitleController from './containers/fromControls/TitleController'
import { Tags } from './containers/Tags'

export interface ICategoryAttributeForm {
  contentId?: string
  contentTitle?: string
  contentDescription?: string
  contentSeo?: string
  contentTags?: GetTagQueryResult[]
}

export default function Content() {
  const { formatMessage } = useIntl()
  const [addContentValue] = usePostAdminCmsContentsMutation()
  const [updateContentValue] = usePutAdminCmsContentsByIdMutation()
  const { getValues, setValue, trigger } = useFormContext()
  const [defaultTag, setDefaultTag] = useState<GetTagQueryResult[]>([])

  const {
    data: contentData,
    refetch: refreshData,
    isFetching,
  } = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      entityTypeId: EntityTypeEnums.Category,
      entityId: getValues('id'),
      contentType: ContentTypeEnums.Html,
    },
    { skip: !getValues('id') },
  )

  useEffect(() => {
    refreshData()
  }, [getValues('id')])

  useEffect(() => {
    const contentHtmlData = contentData?.data?.items?.[0]
    setValue('contentId', contentHtmlData?.id || '')
    setValue('contentDescription', contentHtmlData?.value || '')
    setValue('contentTitle', contentHtmlData?.title || '')
    setValue('contentSeo', contentHtmlData?.description || '')
    setValue('contentTags', contentHtmlData?.tags || [])
    setDefaultTag((contentHtmlData?.tags as GetTagQueryResult[]) || [])
  }, [isFetching, contentData?.data?.items])

  const handleAddContent = async () => {
    const result = await trigger([
      'contentTitle',
      'contentDescription',
      'contentSeo',
      'contentTags',
    ])

    if (result && !getValues('contentId')) {
      await addContentValue({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        createContentModel: {
          contentType: ContentTypeEnums.Html,
          entityId: getValues('id'),
          entityTypeId: EntityTypeEnums.Category + '',
          title: getValues().contentTitle,
          value: getValues().contentDescription,
          description: getValues().contentSeo,
          tags: getValues().contentTags || [],
          metadata: '',
        },
      })
        .catch((e) => {})
        .finally(() => {
          refreshData()
        })
    } else if (result && getValues('contentId')) {
      await updateContentValue({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: getValues('contentId'),
        updateContentModel: {
          title: getValues().contentTitle,
          value: getValues().contentDescription,
          description: getValues().contentSeo,
          tags: getValues().contentTags || [],
          metadata: '',
          name: getValues('contentId'),
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(productGroupMessages.contentUpdated),
            type: 'success',
          })
          refreshData()
        }
      })
    }
  }

  const handleChangeTags = (tags: GetTagQueryResult[]) => {
    setDefaultTag(tags)
  }

  return (
    <Box sx={{ my: 6, position: 'relative' }}>
      <IconButton
        onClick={handleAddContent}
        color="primary"
        size="large"
        sx={{
          position: 'absolute',
          right: 40,
          top: -84,
        }}
      >
        <HBIcon type="check" />
      </IconButton>

      <TitleController />
      <DescriptionController />
      <SeoController />
      <Tags defaultTag={defaultTag} changeDefaultTag={handleChangeTags} />
      <HBContentLink entityId={getValues('id')} entityTypeId={EntityTypeEnums.Category} />
      <HBContentUploader
        entityId={getValues('id')}
        entityTypeId={EntityTypeEnums.Category}
        fileType={ContentTypeEnums.Image}
        title={formatMessage(productGroupMessages.imageUploaderTitle)}
      />
      <HBContentUploader
        entityId={getValues('id')}
        entityTypeId={EntityTypeEnums.Category}
        fileType={ContentTypeEnums.Video}
        title={formatMessage(productGroupMessages.videoUploaderTitle)}
      />
    </Box>
  )
}
