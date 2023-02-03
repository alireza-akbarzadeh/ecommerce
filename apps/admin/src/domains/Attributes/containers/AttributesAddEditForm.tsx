import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { AttributeDataTypeEnums } from '@hasty-bazar/admin-shared/core/enums/AttributeDataType '
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetAttributeQueryResult,
  GetAttributeQueryResultApiResult,
  useGetAdminCatalogFeatureDisplayTypeQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  GetBusinessTypeValuesQueryResult,
  useGetAdminGeneralDataBusinessEntitiesQuery,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBButton, HBDialog, HBSelectProps, openToast } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import attributesPageMessages from '../Attributes.messages'
import { AttributeAddEditFormType } from '../AttributesAddEditPage'
import {
  useGetAdminCatalogApiAttributeValueGetAllQuery,
  useGetAdminCatalogApiUnitOfMeasurementGetAllQuery,
} from '../catalogApi.enhanced'
import AttributesForm from './FormControls/AttributesForm'

type AttributeCustomType = Omit<GetAttributeQueryResult, 'dataTypeEnum'> & {
  dataTypeEnum: any
}

export const enum AttributeKindTypeCode {
  Integer = 1017001,
  Date = 1017002,
  FixedList = 1017003,
  DynamicList = 1017004,
  Text = 1017005,
  Decimal = 1017006,
  Color = 1017007,
  Money = 1017008,
}

export interface AttributesAddEditFormProps {
  setShowList?: (value: boolean, type?: AttributeKindTypeCode) => void
  attributeData?: GetAttributeQueryResultApiResult
}

export const enum BusinessTypeEnum {
  AttributeKindTypeCode = BusinessTypeEnums.AttributeKindType, // 23
  AttributeDataTypeCode = BusinessTypeEnums.AttributeDataType,
  UnitOfMeasurementId = BusinessTypeEnums.MeasuringUnitType,
  AttributeGroupTypeCode = BusinessTypeEnums.AttributeGroupType,
  AttributeDisplayTypeCode = BusinessTypeEnums.AttributeDisplayType,
  ProductDisplayKindCode = BusinessTypeEnums.ProductDisplayKind,
  ProductDisplayTypeCode = BusinessTypeEnums.ProductDisplayType,
}

export type SelectBoxOptionsType = HBSelectProps['menuItem']
const AttributesAddEditForm: FC<AttributesAddEditFormProps> = ({ attributeData, setShowList }) => {
  const router = useRouter()
  const { formatMessage } = useIntl()

  const id = router.query.id?.[0]
  const attributeValues = useGetAdminCatalogApiAttributeValueGetAllQuery(
    {
      attributeId: id,
      'client-name': 'attributeValues',
      'client-version': '1',
    },
    {
      skip: !id,
    },
  )

  const { data: unitOfMeasurementData } = useGetAdminCatalogApiUnitOfMeasurementGetAllQuery({
    'client-name': 'unitOfMeasurement',
    'client-version': '1.0.0',
  })

  const { data, isLoading } = useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })
  const {
    formState: { isValid, isDirty, touchedFields },
    reset,
    control,
    setValue,
  } = useFormContext<AttributeAddEditFormType>()

  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [
    {
      AttributeDataTypeCodes,
      AttributeDisplayTypeCodes,
      AttributeGroupTypeCodes,
      AttributeKindTypeCodes,
      ProductDisplayKindCodes,
      ProductDisplayTypeCodes,
    },
    setBusinessTypes,
  ] = useState<Record<string, SelectBoxOptionsType>>({
    AttributeDataTypeCodes: [],
    AttributeDisplayTypeCodes: [],
    AttributeGroupTypeCodes: [],
    AttributeKindTypeCodes: [],
    ProductDisplayKindCodes: [],
    ProductDisplayTypeCodes: [],
  })

  const { breakpoints } = useTheme()
  const ref = useRef<HTMLButtonElement>(null)
  const [tag, setTag] = useState<string>('')

  const { data: { data: { items: AttributeGroupTypeCodesData = [] } = {} } = {} } =
    useGetAdminCatalogFeatureDisplayTypeQuery({
      'client-name': 'featureDisplayType',
      'client-version': '1.0.0',
      pageSize: 1000,
    })

  const {
    defaultTag: defaultTag,
    canBeAddedByVendor,
    dataTypeEnum,
    minValue,
    maxValue,
  } = useWatch({
    control,
  })

  const handleAdd = () => {
    if (!tag) return
    if (defaultTag?.find((item) => item === tag)) {
      openToast({
        message: formatMessage(attributesPageMessages.attributesTagHasAlready),
        type: 'error',
      })
      return
    }
    setValue('defaultTag', [...(defaultTag ? defaultTag : []), tag])
    setTag('')
  }
  const handleRemove = (index: number) => {
    setValue('defaultTag', defaultTag?.filter((item, idx) => idx !== index) || [''])
  }

  const handleSave = () => {
    if (isValid) {
      ref.current?.click()
    }
    setOpenConfirmModal(false)
  }

  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.back()
  }

  const handleGoBack = () => {
    if (isEmpty(touchedFields)) {
      router.replace('/attributes')
    } else {
      setOpenConfirmModal(true)
    }
  }
  const getBusinessTypes = (businessTypes: GetBusinessTypeValuesQueryResult[]) => {
    const convertToSelectData = (
      data: GetBusinessTypeValuesQueryResult[],
    ): SelectBoxOptionsType => {
      return data.map((item) => ({
        title: String(item.title),
        value: item.id || 0,
      }))
    }
    const AttributeKindTypeCodes = convertToSelectData(
      businessTypes.filter(
        (item) => item.businessTypeId === BusinessTypeEnum.AttributeKindTypeCode + '',
      ),
    )
    const AttributeDisplayTypeCodes = convertToSelectData(
      businessTypes.filter(
        (item) => item.businessTypeId === BusinessTypeEnum.AttributeDisplayTypeCode + '',
      ),
    )
    const UnitOfMeasurementIds = convertToSelectData(
      businessTypes.filter(
        (item) => item.businessTypeId === BusinessTypeEnum.UnitOfMeasurementId + '',
      ),
    )

    const ProductDisplayKindCodes = convertToSelectData(
      businessTypes.filter(
        (item) => item.businessTypeId === BusinessTypeEnum.ProductDisplayKindCode + '',
      ),
    )
    const ProductDisplayTypeCodes = convertToSelectData(
      businessTypes.filter(
        (item) => item.businessTypeId === BusinessTypeEnum.ProductDisplayTypeCode + '',
      ),
    )
    const AttributeDataTypeCodes = convertToSelectData(
      businessTypes
        .filter((item) => item.businessTypeId === BusinessTypeEnum.AttributeDataTypeCode + '')
        .sort((a, b) => a?.displayOrder! - b?.displayOrder!),
    )
    setBusinessTypes({
      AttributeKindTypeCodes,
      AttributeDisplayTypeCodes,
      UnitOfMeasurementIds,
      AttributeGroupTypeCodes,
      AttributeDataTypeCodes,
      ProductDisplayKindCodes,
      ProductDisplayTypeCodes,
    })
  }

  const { data: relatedData } = useGetAdminGeneralDataBusinessEntitiesQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    targetUsage: 2,
    pageSize: 1000,
  })

  const relatedSelectedData = useMemo(() => {
    return (
      relatedData?.data?.items?.map((item) => {
        return {
          value: item.id!,
          title: item.title!,
        }
      }) || []
    )
  }, [relatedData])

  useEffect(() => {
    if (data?.data?.items) {
      getBusinessTypes(data.data.items)
    }
  }, [data])

  useEffect(() => {
    if (id && attributeData?.data) {
      const {
        unitOfMeasurementId,
        defultTag: defultTagString,
        maxValue,
        minValue,
        numberOfDecimal,
        displayType,
        groupTypeCode,
        productDisplayKind,
        productDisplayType,
        kindType,
        dataTypeEnum,
        businessEntityId,
        ..._data
      } = attributeData.data as AttributeCustomType
      const defultTag = defultTagString ? defultTagString?.split(',') || [] : []
      if (
        attributeData.data.dataTypeEnum == AttributeKindTypeCode.FixedList ||
        attributeData.data.dataTypeEnum == AttributeKindTypeCode.Color
      ) {
        setShowList?.(true, attributeData.data.dataTypeEnum)
      } else {
        setShowList?.(false)
      }

      reset({
        ...(_data as AttributeAddEditFormType),
        maxValue: maxValue?.toString(),
        minValue: minValue?.toString(),
        numberOfDecimal: numberOfDecimal ? String(numberOfDecimal) : undefined,
        unitOfMeasurementId: unitOfMeasurementId ? String(unitOfMeasurementId) : undefined,
        //@ts-ignore
        defaultTag: defultTag,
        displayType: AttributeDisplayTypeCodes.find((item) => item.value == displayType),
        groupTypeCode: AttributeGroupTypeCodesData?.find((item) => item.id == groupTypeCode),
        productDisplayKind: ProductDisplayKindCodes.find(
          (item) => item.value == productDisplayKind,
        ),
        productDisplayType: ProductDisplayTypeCodes.find(
          (item) => item.value == productDisplayType,
        ),
        kindType: AttributeKindTypeCodes?.find((item) => item.value == kindType),
        dataTypeEnum: AttributeDataTypeCodes?.find((item) => item.value == dataTypeEnum),
        businessEntityId: relatedSelectedData?.find((item) => item.value == businessEntityId),
        // businessEntityId: businessEntityId == '1' ? undefined : (businessEntityId as string), TODO: 1 is true here? do I check it?
      })
    }
  }, [
    attributeData,
    AttributeDisplayTypeCodes,
    AttributeGroupTypeCodes,
    ProductDisplayKindCodes,
    ProductDisplayTypeCodes,
    relatedData,
  ])

  const isCountable =
    dataTypeEnum?.value == AttributeKindTypeCode.Decimal ||
    dataTypeEnum?.value == AttributeKindTypeCode.Integer ||
    dataTypeEnum?.value == AttributeKindTypeCode.Money ||
    dataTypeEnum?.value == AttributeKindTypeCode.Text

  useEffect(() => {
    const data = attributeData?.data as AttributeCustomType
    if (data?.dataTypeEnum && data?.dataTypeEnum?.value) {
      setShowList?.(
        Number(data?.dataTypeEnum?.value) == AttributeKindTypeCode.FixedList ||
          Number(data?.dataTypeEnum?.value) == AttributeKindTypeCode.Color,
        data?.dataTypeEnum?.value,
      )
    }
  }, [dataTypeEnum?.value])

  const handleChangeDataTypeCode = useCallback(
    (event: React.SyntheticEvent<Element, Event>, newValue: { title: ReactNode; value: any }) => {
      setValue('dataTypeEnum', newValue)
      setShowList?.(
        newValue?.value == AttributeKindTypeCode.FixedList ||
          newValue?.value == AttributeKindTypeCode.Color,
        newValue?.value,
      )

      if (
        newValue?.value != AttributeDataTypeEnums.Integer &&
        newValue?.value != AttributeDataTypeEnums.Decimal
      ) {
        setValue('numberOfDecimal', undefined)
        setValue('maxValue', undefined)
        setValue('minValue', undefined)
      }

      if (newValue?.value != AttributeDataTypeEnums.DynamicList) {
        //@ts-ignore
        setValue('businessEntityId', undefined)
        setValue('whereCondition', undefined)
      }
      setShowList?.(false)
    },
    [],
  )

  const disabledDataTypeCode = id ? !isEmpty(attributeValues.data?.data?.items) : false
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Grid container>
          <Grid item xs={12}>
            <Stack>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="h4" mb={8} color="text.primary">
                  {formatMessage(attributesPageMessages.attributesFeatureSpecifications)}
                </Typography>
                <Stack spacing={4} display="flex" direction="row" justifyContent="flex-end">
                  <Typography component="label" variant="body1" color="text.primary">
                    {formatMessage(attributesPageMessages.attributesFeatureStatus)}
                  </Typography>
                  <HBSwitchController name="isActive" />
                </Stack>
              </Stack>
              <AttributesForm
                AttributeDataTypeCodes={AttributeDataTypeCodes}
                AttributeKindTypeCodes={AttributeKindTypeCodes}
                AttributeDisplayTypeCodes={AttributeDisplayTypeCodes}
                AttributeGroupTypeCodes={AttributeGroupTypeCodesData || []}
                ProductDisplayKindCodes={ProductDisplayKindCodes}
                ProductDisplayTypeCodes={ProductDisplayTypeCodes}
                canBeAddedByVendor={canBeAddedByVendor!}
                dataTypeEnum={dataTypeEnum?.value || undefined}
                disabledDataTypeCode={disabledDataTypeCode}
                handleChangeDataTypeCode={handleChangeDataTypeCode}
                defultTag={defaultTag}
                handleAdd={handleAdd}
                handleRemove={handleRemove}
                isCountable={isCountable}
                maxValue={maxValue}
                minValue={minValue}
                setTag={setTag}
                tag={tag}
                unitOfMeasurementData={unitOfMeasurementData!}
                isLoading={isLoading}
                relatedSelectedData={relatedSelectedData}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={8}>
        <HBButton
          size={breakpoints.down('sm') ? 'medium' : 'small'}
          variant="outlined"
          onClick={handleGoBack}
        >
          {formatMessage(phrasesMessages.back)}
        </HBButton>
        <HBButton
          size={breakpoints.down('sm') ? 'medium' : 'small'}
          sx={({ spacing }) => ({
            width: 152,
            mx: spacing(1),
            '&.Mui-disabled': {
              bgcolor: 'primary.main',
              opacity: '0.3',
              color: 'background.paper',
            },
          })}
          ref={ref}
          type="submit"
          disabled={!isValid || !isDirty}
          color="primary"
        >
          {formatMessage(phrasesMessages.confirm)}
        </HBButton>
      </Box>
      <HBDialog
        title={formatMessage(phrasesMessages.saveSuccess)}
        content={formatMessage(attributesPageMessages.attributesLikeToSave)}
        onAccept={handleSave}
        onReject={handleCancel}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}

export default AttributesAddEditForm
