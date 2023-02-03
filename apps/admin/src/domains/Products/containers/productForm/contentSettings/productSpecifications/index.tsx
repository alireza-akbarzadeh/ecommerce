import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import { removeEmptyFields } from '@hasty-bazar/admin-shared/utils'
import { HBForm, HBSelectProps, openToast } from '@hasty-bazar/core'
import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import {
  useGetAdminCatalogConfigurableProductsByIdSharedAttributesQuery,
  useGetAdminCatalogSimpleProductsByIdAttributesQuery,
  usePostAdminCatalogConfigurableProductsByIdAttributesMutation,
  usePostAdminCatalogSimpleProductsByIdAttributesMutation,
} from '../../../../catalogApi.enhanced'
import ContentSettingsMessages from '../ContentSettings.messages'
import ControlUpdateAttribute, { CONTROL_FILED_NAME_PREFIX } from './controlUpdateAttributeItem'
import FormItem from './formItem'

export type SelectBoxOptionsType = HBSelectProps['menuItem']

const FORM_ID = 'product-specifications'

interface ProductSpecificationsProps {
  expanded?: boolean
  onNext?: () => void
  onPrev?: () => void
  disabled?: boolean
  onSuccess?: () => void
  title?: string
}

function ProductSpecifications({
  expanded,
  onNext,
  title,
  onPrev,
  disabled,
  onSuccess,
}: ProductSpecificationsProps) {
  const router = useRouter()
  const defaultProductType = getProductType(router.pathname)
  const productType = getProductType(router.asPath) || defaultProductType
  const { formatMessage } = useIntl()

  const formProviderProps = useForm({
    mode: 'onBlur',
  })

  const formValues = useWatch({
    control: formProviderProps.control,
  })
  const fieldCounts = Object.values(removeEmptyFields(formValues)).length ? '1' : '0'

  const args = {
    'client-name': 'admin',
    'client-version': '1.0.0',
    id: router.query.id! as string,
  }
  const attributesData =
    productType === 'configurable'
      ? useGetAdminCatalogConfigurableProductsByIdSharedAttributesQuery(args, {
          skip: expanded === undefined ? false : !expanded,
        })
      : useGetAdminCatalogSimpleProductsByIdAttributesQuery(args)

  const { attributesWithTitle, attributesWithoutTitle } = useMemo(() => {
    const attributesWithoutTitle = attributesData.data?.data?.items?.filter(
      (item) => !item.groupTypeCodeTitle,
    )
    const attributesWithTitle = attributesData.data?.data?.items?.filter(
      (item) => item.groupTypeCodeTitle,
    )
    return {
      attributesWithoutTitle,
      attributesWithTitle,
    }
  }, [attributesData.data?.data?.items])
  const [postData, { isSuccess, isLoading }] =
    productType === 'simple'
      ? usePostAdminCatalogSimpleProductsByIdAttributesMutation()
      : usePostAdminCatalogConfigurableProductsByIdAttributesMutation()
  const handleSubmit = (data: any) => {
    postData({
      'client-name': 'admin',
      'client-version': '1.0.0',
      id: router.query.id! as string,
      setAttributesModel: {
        attributeValues: removeEmptyFields(
          convertDataToValidFormData(
            data,
            formatMessage(ContentSettingsMessages.addNewValue),
            productType,
          ),
        ),
      },
    })
  }

  useEffect(() => {
    if (isSuccess) {
      openToast({
        message: formatMessage(ContentSettingsMessages.saveSuccess),
        type: 'success',
      })
      onSuccess?.()
      onNext?.()
    }
  }, [isSuccess, isLoading])

  useEffect(() => {
    attributesData.refetch()
  }, [router.query.id])
  return (
    <ProductExplanation
      summaryProps={{
        icon: 'infoCircle',
        statusLabel: String(fieldCounts),
        submitButton: !onNext,
        submitButtonProps: {
          type: 'submit',
          form: FORM_ID,
          disabled: disabled || isLoading,
          onClick: formProviderProps.handleSubmit(handleSubmit),
        },
        title: title ? title : formatMessage(ContentSettingsMessages.productProperties),
      }}
      expanded={expanded}
      prevStepButtonProps={{ onClick: onPrev }}
      nextStepButtonProps={{
        onClick: expanded !== undefined ? formProviderProps.handleSubmit(handleSubmit) : undefined,
        loading: isLoading,
      }}
    >
      <HBForm<any> id={FORM_ID} formProviderProps={formProviderProps} onSubmit={handleSubmit}>
        <Grid container display={'flex'} spacing={6}>
          {attributesWithoutTitle?.map((attributes) => (
            <Grid container gap={6} item xs={12} key={attributes.groupTypeCode}>
              {[...(attributes?.categoryAttributes ? attributes.categoryAttributes : [])]
                ?.sort((a, b) => {
                  return Number(a.displayOrder || 0) - Number(b.displayOrder || 0)
                })
                ?.map((attribute, index) => {
                  return (
                    <Grid container key={attribute.attributeId} gap={6} item xs={12}>
                      <Grid item display={'flex'} direction="column" sm={3} xs={12}>
                        <FormItem
                          hasFormRule={expanded === undefined}
                          disabled={disabled}
                          attribute={attribute}
                        />
                      </Grid>
                      {productType === 'configurable' && (
                        <ControlUpdateAttribute attribute={attribute} />
                      )}
                    </Grid>
                  )
                })}
            </Grid>
          ))}
          {attributesWithTitle?.map((attributes) => (
            <Grid container gap={6} item xs={12} key={attributes.groupTypeCode}>
              <Typography variant={'h6'}>{attributes.groupTypeCodeTitle}</Typography>
              {[...(attributes?.categoryAttributes ? attributes.categoryAttributes : [])]
                ?.sort((a, b) => {
                  return Number(a.displayOrder || 0) - Number(b.displayOrder || 0)
                })
                ?.map((attribute) => {
                  return (
                    <Grid container gap={6} item xs={12}>
                      <Grid item display={'flex'} direction="column" gap={6} sm={3} xs={12}>
                        <FormItem
                          hasFormRule={expanded === undefined}
                          disabled={disabled}
                          attribute={attribute}
                        />
                      </Grid>
                      {productType === 'configurable' && (
                        <ControlUpdateAttribute disabled={disabled} attribute={attribute} />
                      )}
                    </Grid>
                  )
                })}
            </Grid>
          ))}
        </Grid>
      </HBForm>
    </ProductExplanation>
  )
}

export default ProductSpecifications
function convertDataToValidFormData(
  data: Record<string, string | string[]>,
  removeItemValueTitle?: string,
  productType: 'simple' | 'configurable' = 'simple',
): Record<
  string,
  {
    value: string
    onlyChangeableByParent: boolean
  }
> {
  const result: Record<string, string> = {}
  const removedControlFields: Record<string, any> = {}
  const controlFields: Record<string, any> = {}
  Object.keys(data)
    .filter((key) => !key.includes('control'))
    .forEach((key) => (removedControlFields[key] = data[key]))
  Object.keys(data)
    .filter((key) => key.includes('control'))
    .forEach((key) => (controlFields[key] = data[key]))
  Object.keys(removedControlFields).forEach((key) => {
    if (key.includes('new')) {
      result[(key as any).split('-')[0] as any] = (
        data[(key as any).split('-')[0]] !== removeItemValueTitle
          ? data[(key as any).split('-')[0]]
          : data[key]
      ) as string
      return
    }
    result[key as keyof typeof result] = (
      Array.isArray(data[key]) ? (data[key] as string[]).join(',') : data[key]
    ) as string
  })

  const controlResult: Record<
    string,
    {
      value: string
      onlyChangeableByParent: boolean
    }
  > = {}
  Object.keys(result).forEach((key) => {
    controlResult[key] = {
      value: result[key],
      onlyChangeableByParent:
        productType === 'simple'
          ? true
          : controlFields[`${CONTROL_FILED_NAME_PREFIX}${key}`] === 0
          ? false
          : true,
    }
  })

  return controlResult
}
