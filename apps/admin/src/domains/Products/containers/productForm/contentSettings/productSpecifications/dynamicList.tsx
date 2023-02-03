import instance from '@hasty-bazar/admin-shared/core/handler'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  useGetAdminCatalogConfigurableProductsByIdQuery,
  useGetAdminCatalogSimpleProductsByIdQuery,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import { CategoryAttributeModel } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataBusinessEntitiesQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAutocompleteController } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { getValue, importantTypeCode } from './formItem'
const TARGET_USAGE = 2
function DynamicList({
  attribute,
  hasFormRule,
  disabled,
}: {
  attribute: CategoryAttributeModel
  hasFormRule?: boolean
  disabled?: boolean
}) {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const productId = router.query?.id as string

  const defaultProductType = getProductType(router.pathname)
  const productType = getProductType(router.asPath) || defaultProductType
  const businessEntities = useGetAdminGeneralDataBusinessEntitiesQuery({
    targetUsage: TARGET_USAGE,
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
  })

  const id = attribute.businessEntityId

  const businessEntity = useMemo(() => {
    return businessEntities.data?.data?.items?.find((item) => item.id === id)
  }, [businessEntities.data, id])

  const { setValue } = useFormContext()
  const [{ data, loading }, setFetchDataStates] = useState<{
    loading: boolean
    data: any[]
  }>({
    loading: false,
    data: [],
  })
  const value = useMemo(
    () => getValue(attribute.attributeValues || [], attribute.attributeDisplayType!),
    [attribute.attributeValues, attribute.attributeDisplayType],
  )
  useEffect(() => {
    if (value) {
      setValue(attribute.attributeId as unknown as any, value)
    }
  }, [])

  const isRequired = hasFormRule
    ? Number(attribute.importantTypeCode) === importantTypeCode.Mandatory
    : false

  const formRules = {
    required: {
      value: isRequired,
      message: `${formatMessage(validationsMessages.isRequired, {
        msg: attribute.attributeName,
      })}`,
    },
  }
  const queryArgs = {
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    id: productId,
  }
  const options = {
    skip: !id,
  }
  const productData =
    productType === 'configurable'
      ? useGetAdminCatalogConfigurableProductsByIdQuery(queryArgs, options)
      : useGetAdminCatalogSimpleProductsByIdQuery(queryArgs, options)

  const fetchData = async () => {
    setFetchDataStates({ loading: true, data: [] })

    const baseUrl = process.env.NEXT_PUBLIC_GATEWAY
    try {
      const res = await instance.get(
        `${baseUrl}${businessEntity?.metaDataObject?.apiAddress}?PageSize=10000&${
          businessEntity?.name === 'Brand'
            ? `StateCode=2&IsActive=true&CategoryId=${productData.data?.data?.categoryId}&Filter=StateCode_Equal_--StateCode%20%26%20IsActive_Equal_--IsActive%20`
            : `Filter=${attribute.whereCondition}`
        }`,
      )
      setFetchDataStates({ loading: false, data: res.data.data.items })
    } catch (error) {
    } finally {
      setFetchDataStates((prev) => ({ loading: false, data: prev.data }))
    }
  }

  useEffect(() => {
    if (businessEntity && productData.data?.data?.categoryId) {
      fetchData()
    }
  }, [businessEntity, productData.data?.data?.categoryId, productData.data?.data])

  return (
    <HBAutocompleteController<any, any>
      fieldName={attribute.attributeId as unknown as string}
      options={data}
      controllerProps={{
        rules: formRules,
      }}
      autoCompleteProps={{
        onChange: (_, value) => {
          value && setValue(attribute.attributeId as unknown as string, value?.id)
        },
        loading,
      }}
      disabled={Boolean(disabled || attribute?.isReadonly)}
      textFiledProps={{
        InputLabelProps: {
          required: isRequired,
        },
      }}
      getOptionLabel={(option) => option?.name || option?.title}
      isOptionEqualToValue={(option, value) => option?.id === value}
      label={attribute.attributeName || ''}
    />
  )
}

export default DynamicList
