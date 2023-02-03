import {
  useGetAdminCatalogConfigurableProductsByIdVariantEffectiveAttributeValuesQuery,
  useGetAdminCatalogConfigurableProductsByIdVariantValuesQuery,
  usePutAdminCatalogConfigurableProductsByIdVariantValuesMutation,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { ProductVariantValue } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { openToast } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { DuplicationSectionProps } from '..'
import duplicationSettings from '../duplicationSettings.messages'
import AttributeGrid, { AttributeDataType } from './attributeGrid'
import DuplicationFactorsValuesMessages from './duplicationFactorsValues.messages'

export type FormDataType = ProductVariantValue

function DuplicationFactorsValues({ expanded, onNext, onPrev }: DuplicationSectionProps) {
  const router = useRouter()
  const id = router.query.id as string

  const { data: productAttrData, refetch } =
    useGetAdminCatalogConfigurableProductsByIdVariantEffectiveAttributeValuesQuery({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id,
    })

  const { data: variantValuesData } = useGetAdminCatalogConfigurableProductsByIdVariantValuesQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    id,
  })

  const { formatMessage } = useIntl()

  const [putMutation, { isLoading: isPutLoading }] =
    usePutAdminCatalogConfigurableProductsByIdVariantValuesMutation()

  const [formData, setFormData] = useState<FormDataType[]>([])

  const onChangeData = (data: AttributeDataType[], attributeId: string) => {
    const newFormData = data.map<FormDataType>((item) => ({ ...item, attributeId }))
    setFormData((prev) => [
      ...prev.filter((item) => item.attributeId !== attributeId),
      ...newFormData,
    ])
  }

  const handleSubmit = async () => {
    try {
      await putMutation({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id,
        setProductVariantValuesModel: {
          variantValues: formData,
        },
      }).unwrap()
      openToast({
        message: formatMessage(DuplicationFactorsValuesMessages.successPut),
        type: 'success',
      })
      onNext()
    } catch (error) {}
  }

  useEffect(() => {
    if (expanded) {
      refetch()
    }
  }, [expanded])

  return (
    <ProductExplanation
      summaryProps={{
        title: formatMessage(duplicationSettings.duplicationFactorsValues),
        icon: 'tagAlt',
        statusLabel: variantValuesData?.data?.variantValueItems?.length ? '1' : '0',
      }}
      expanded={expanded}
      nextStepButtonProps={{
        onClick: handleSubmit,
        loading: isPutLoading,
      }}
      prevStepButtonProps={{ onClick: onPrev }}
    >
      {productAttrData?.data?.items?.map((item, index) => (
        <AttributeGrid
          key={`${item?.attributeId}-${index}`}
          variantValueItems={variantValuesData?.data?.variantValueItems!}
          columnName={item?.attributName!}
          columnData={item?.attributeValues!}
          isDisplayEffective={item?.isDisplayEffective!}
          onDataChange={(data) => onChangeData(data, item?.attributeId!)}
        />
      ))}
    </ProductExplanation>
  )
}

export default DuplicationFactorsValues
