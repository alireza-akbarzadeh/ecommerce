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

export const INTRODUCTION_FACTOR = 'Introduction'

interface ProductIntroductionProps {
  disabled: boolean
}
function ProductIntroduction({ disabled }: ProductIntroductionProps) {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const [value, setValue] = useState('')
  const defaultProductType = getProductType(router.pathname)
  const productType = getProductType(router.asPath) || defaultProductType
  const [addContentValue, { error, isSuccess, reset: createReset }] =
    usePostAdminCmsContentsMutation()
  const [updateContentValue, { error: updateError, isSuccess: updateSuccess, reset: updateReset }] =
    usePutAdminCmsContentsByIdMutation()
  const [addContentValues, addContentValuesStates] =
    usePostAdminCmsContentsCreateMultiItemMutation()
  const [updateContentValues, updateContentValuesStates] =
    usePutAdminCmsContentsUpdateEntitiesContentMutation()

  const entityId = (router.query.id || '') as string
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
      skip: productType !== 'configurable',
    },
  )

  const handleSubmit = () => {
    createReset()
    updateContentValuesStates.reset()
    addContentValuesStates.reset()
    updateReset()

    const introduction = data?.data?.items?.find((item) => item.factor === INTRODUCTION_FACTOR)

    const formData = {
      tags: [],
      description: '',
      title: '',
      metadata: '',
      name: '',
      value,
      contentType: ContentTypeEnums.Html,
      entityTypeId: String(EntityTypeEnums.Product),
      factor: INTRODUCTION_FACTOR,
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
          ? formatMessage(ContentSettingsMessages.productIntroductionAdded)
          : formatMessage(ContentSettingsMessages.productIntroductionUpdated),
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
      const introduction = data.data.items.find((item) => item.factor === INTRODUCTION_FACTOR)
      if (introduction) {
        setValue(introduction?.value!)
      }
    }
  }, [data])

  return (
    <ProductExplanation
      summaryProps={{
        title: formatMessage(ContentSettingsMessages.productIntroduction),
        icon: 'questionCircle',
        statusLabel: value ? '1' : '0',
        submitButton: true,
        submitButtonProps: {
          onClick: handleSubmit,
          disabled: disabled || !value,
        },
      }}
    >
      <HBTinyEditor
        disabled={disabled}
        value={value}
        onChange={(value: string) => setValue(value)}
      />
    </ProductExplanation>
  )
}

export default ProductIntroduction
