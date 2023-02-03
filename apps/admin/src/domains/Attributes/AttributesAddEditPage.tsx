import { HBAdminAccordion } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import { HBContentForm } from '@hasty-bazar/admin-shared/containers/HBContentForm'
import { EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  CreateAttributeModel,
  UpdateAttributeModel,
  usePostAdminCatalogApiAttributeMutation,
  usePutAdminCatalogApiAttributeByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import attributesPageMessages from './Attributes.messages'
import { useGetAdminCatalogApiAttributeByIdQuery } from './catalogApi.enhanced'
import { AttributesAddEditForm } from './containers'
import { AttributeKindTypeCode } from './containers/AttributesAddEditForm'
import AttributeDetailDataGrid from './containers/AttributesDetailDataGrid'
import { PeriodFilter } from './containers/PeriodFilter'

export interface AttributeAddEditFormType
  extends Omit<
    UpdateAttributeModel,
    | 'defultTag'
    | 'maxValue'
    | 'minValue'
    | 'numberOfDecimal'
    | 'displayType'
    | 'groupTypeCode'
    | 'productDisplayKind'
    | 'productDisplayType'
    | 'kindTypeCode'
    | 'kindType'
    | 'dataTypeEnum'
  > {
  defaultTag?: string[]
  maxValue?: number | string | null
  minValue?: number | string | null
  numberOfDecimal?: number | string
  displayType?: any
  groupTypeCode?: any
  productDisplayKind?: any
  productDisplayType?: any
  kindTypeCode?: any
  kindType?: any
  dataTypeEnum?: any
  businessEntityId?: any
}

export type ShowTostType = {
  open: boolean
  message: ReactNode
  type?: 'error' | 'success' | 'info' | 'warning'
}

const ProductAttributeAddEditPage: FC = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const id = router.query.id?.[0]
  const [isList, setIsList] = useState<boolean>(false)
  const [attributeType, setAttributeType] = useState<AttributeKindTypeCode>()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/attributes',
      title: formatMessage(attributesPageMessages.attributesFeatureSpecifications),
    },
    {
      url: '#',
      title: id
        ? formatMessage(attributesPageMessages.attributesEditValue)
        : formatMessage(attributesPageMessages.attributesAddValue),
    },
  ]

  const { data: attributeData } = useGetAdminCatalogApiAttributeByIdQuery(
    {
      'client-name': 'attribute',
      'client-version': '1.0.0',
      id: id!,
    },
    {
      skip: !id,
    },
  )

  const [createAttribute, { data }] = usePostAdminCatalogApiAttributeMutation()
  const [updateAttribute] = usePutAdminCatalogApiAttributeByIdMutation()

  useEffect(() => {
    if (data?.data?.id) {
      router.replace(`/attributes/edit/${data.data.id}`)
    }
  }, [data?.data?.id])
  const handleSubmit = async (values: AttributeAddEditFormType) => {
    const defaultTag = values?.defaultTag?.join(',') || ''

    if (!values.maxValue) {
      values.maxValue = null
      values.minValue = null
    }

    const body = {
      ...values,
      kindTypeCode: String(values.kindType?.value),
      kindType: values.kindType?.value,
      defultTag: defaultTag,
      isActive: values.isActive,
      //@ts-ignore
      relatedEntityId: values?.relatedEntityId || '1',
      unitOfMeasurementId: values?.unitOfMeasurementId || null,
      numberOfDecimal: values?.numberOfDecimal || null,
      groupTypeCode: values?.groupTypeCode?.id ? values?.groupTypeCode.id : null,
      displayType: values?.displayType?.value,
      productDisplayKind: values?.productDisplayKind?.value
        ? +values?.productDisplayKind?.value
        : null,
      productDisplayType: values?.productDisplayType?.value
        ? +values?.productDisplayType?.value
        : null,
      minValue: values.minValue || null,
      maxValue: values.maxValue || null,
      dataTypeEnum: values.dataTypeEnum?.value,
      businessEntityId: values.businessEntityId?.value,
    } as UpdateAttributeModel | CreateAttributeModel

    if (!id) {
      createAttribute({
        'client-name': 'create-attribute',
        'client-version': '1.0.0',
        // @ts-ignore
        createAttributeModel: body,
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(attributesPageMessages.attributeAddedSuccessfully),
              type: 'success',
            })
          }
        })
    } else {
      body.isActive = !!body.isActive

      updateAttribute({
        'client-name': 'update-attribute',
        'client-version': '1.0.0',
        updateAttributeModel: body,
        id,
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(attributesPageMessages.attributeUpdatedSuccessfully),
              type: 'success',
            })
          }
        })
    }
  }

  const handleSetShowList = useCallback((value: boolean, type?: AttributeKindTypeCode) => {
    setIsList(value)
    setAttributeType(type)
  }, [])

  const AttributeDetailGrid = useCallback(() => {
    return (
      <AttributeDetailDataGrid isList={isList} attributeId={id} attributeType={attributeType} />
    )
  }, [isList, id, attributeType])

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(attributesPageMessages.attributesFeatureSpecifications)}
        breadItems={breadcrumbs}
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={20}
        sx={(theme) => ({
          borderRadius: theme.spacing(1),
          border: `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        })}
      >
        <HBForm<AttributeAddEditFormType>
          onSubmit={handleSubmit}
          defaultValues={{
            isActive: true,
            displayType: null,
            groupTypeCode: null,
            productDisplayKind: null,
            productDisplayType: null,
          }}
          mode="all"
        >
          <AttributesAddEditForm setShowList={handleSetShowList} attributeData={attributeData} />
        </HBForm>
      </Box>
      <HBAdminAccordion
        title={formatMessage(attributesPageMessages.attributesValues)}
        expanded={isList}
        sx={{ borderRadius: 1 }}
      >
        <AttributeDetailGrid />
      </HBAdminAccordion>
      <HBAdminAccordion
        hidden
        title={formatMessage(attributesPageMessages.attributesDefinitionFilterIntervals)}
        icon="filter"
      >
        <Box></Box>
      </HBAdminAccordion>
      <HBContentForm entityId={id} entityTypeId={EntityTypeEnums.Attribute} />
      <HBAdminAccordion
        title={formatMessage(attributesPageMessages.attributePeriodFilter)}
        icon="filter"
        disabled={!isList}
        sx={{ borderRadius: 1 }}
      >
        <PeriodFilter />
      </HBAdminAccordion>
      <HBRecordHistory data={attributeData?.data} isBorder isShowAccordion disabled={!id} />
    </>
  )
}
export default ProductAttributeAddEditPage
