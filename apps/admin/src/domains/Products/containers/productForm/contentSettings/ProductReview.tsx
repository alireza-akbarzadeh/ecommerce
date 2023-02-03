import { HBTinyEditor } from '@hasty-bazar/admin-shared/components'
import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import { useGetAdminCatalogConfigurableProductsByIdProductItemsQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  useGetAdminCmsContentsQuery,
  usePostAdminCmsContentsCreateMultiItemMutation,
  usePostAdminCmsContentsMutation,
  usePutAdminCmsContentsByIdMutation,
  usePutAdminCmsContentsUpdateEntitiesContentMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { openToast } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ContentSettingsMessages from './ContentSettings.messages'
export const PREVIEW_FACTOR = 'Review'
interface ProductReviewProps {
  disabled: boolean
}
function ProductReview({ disabled }: ProductReviewProps) {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const entityId = (router.query.id || '') as string
  const [value, setValue] = useState('')
  const defaultProductType = getProductType(router.pathname)
  const [updateContentValue, { error: updateError, isSuccess: updateSuccess, reset: updateReset }] =
    usePutAdminCmsContentsByIdMutation()
  const { data, isLoading, refetch } = useGetAdminCmsContentsQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    entityId,
    entityTypeId: String(EntityTypeEnums.Product),
  })
  const products = useGetAdminCatalogConfigurableProductsByIdProductItemsQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '',
      id: entityId,
    },
    {
      skip: defaultProductType !== 'configurable',
    },
  )
  const [addContentValue, { error, isSuccess, reset }] = usePostAdminCmsContentsMutation()
  const [addContentValues, addContentValuesStates] =
    usePostAdminCmsContentsCreateMultiItemMutation()
  const [updateContentValues, updateContentValuesStates] =
    usePutAdminCmsContentsUpdateEntitiesContentMutation()
  const handleSubmit = () => {
    reset()
    updateContentValuesStates.reset()
    addContentValuesStates.reset()
    updateReset()

    const introduction = data?.data?.items?.find((item) => item.factor === PREVIEW_FACTOR)

    const formData = {
      tags: [],
      description: '',
      title: '',
      metadata: '',
      name: '',
      value,
      contentType: ContentTypeEnums.Html,
      entityTypeId: String(EntityTypeEnums.Product),
      factor: PREVIEW_FACTOR,
      ...(defaultProductType === 'configurable'
        ? { entityIds: products.data?.data?.productItems?.map((item) => item.id) as string[] }
        : {
            entityId,
          }),
    }
    if (defaultProductType === 'configurable') {
      if (introduction) {
        updateContentValues({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          updateContentOfEntitiesModel: formData,
        })
      } else {
        addContentValues({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          createContentsModel: formData,
        })
      }
    } else {
      if (introduction) {
        updateContentValue({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          id: introduction.id!,
          updateContentModel: formData,
        })
        return
      }
      addContentValue({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        createContentModel: formData,
      })
    }
  }

  useEffect(() => {
    if (
      isSuccess ||
      updateSuccess ||
      addContentValuesStates.isSuccess ||
      updateContentValuesStates.isSuccess
    ) {
      refetch()
      openToast({
        message: isSuccess
          ? formatMessage(ContentSettingsMessages.reviewAdded)
          : formatMessage(ContentSettingsMessages.reviewUpdated),
        type: 'success',
      })
    }
  }, [
    error,
    isSuccess,
    updateError,
    updateSuccess,
    addContentValuesStates.isSuccess,
    updateContentValuesStates.isSuccess,
  ])

  useEffect(() => {
    if (data?.data?.items) {
      const review = data.data.items.find((item) => item.factor === PREVIEW_FACTOR)
      if (review) {
        setValue(review?.value!)
      }
    }
  }, [data])

  return (
    <ProductExplanation
      summaryProps={{
        icon: 'infoCircle',
        statusLabel: value ? '1' : '0',
        submitButton: true,
        submitButtonProps: {
          onClick: handleSubmit,
          disabled: !value || disabled,
        },
        title: formatMessage(ContentSettingsMessages.productReview),
      }}
    >
      <HBTinyEditor
        disabled={disabled}
        value={value}
        onChange={(event: string) => setValue(event)}
      />
    </ProductExplanation>
  )
}

export default ProductReview
