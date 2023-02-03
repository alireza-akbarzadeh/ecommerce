import HBTable, { HBDataGridClasses, TheadType } from '@hasty-bazar/admin-shared/components/HBTable'
import HBNumericFormatController from '@hasty-bazar/admin-shared/containers/HBNumericFormatController'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import {
  useGetAdminCatalogConfigurableProductsByIdAttributeValuesAndAttributeIdQuery,
  useGetAdminCatalogConfigurableProductsByIdPriceEffectiveAttributesQuery,
  usePutAdminCatalogConfigurableProductsByIdVariantInventoryPricingMutation,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import {
  GetAttributeValueListByAttributeIdQueryModel,
  useGetAdminCatalogConfigurableProductsByIdQuery,
  VariantAttributeInventoryType,
  VariantAttributePricingType,
  VariantAttributeValuePricing,
  VariantInventoryPricingModel,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  BusinessType,
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
  useGetAdminGeneralDataCurrencyGetAllQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { convertDataToSelectItems, removeEmptyFields } from '@hasty-bazar/admin-shared/utils'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Grid, SelectChangeEvent, styled } from '@mui/material'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import React, { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { DuplicationSectionProps } from '..'
import duplicationSettings from '../duplicationSettings.messages'
import duplicationProductsPricingMessages from './duplicationProductsPricing.messages'

const RootGrid = styled(Grid)(({ theme }) => ({
  [`& .${HBDataGridClasses.th}`]: {
    backgroundColor: theme.palette.grey['200'],
    color: theme.palette.text.primary,
    fontSize: theme.typography.subtitle1,

    fontWeight: theme.typography.fontWeightMedium,
  },
}))

const VARIANT_AGENTS_TYPE_ID: BusinessType = 1054
const VARIANT_PRICING_AGENTS: BusinessType = 1055

export type FormDataType = VariantInventoryPricingModel
export type VariantAttributeValuesPricingType = GetAttributeValueListByAttributeIdQueryModel
export const enum variantAgentsEnum {
  Fixed = 1054001,
  RegardlessOfPricing = 1054003,
  DifferentPrice = 1054002,
}
export const enum variantPricingAgentsEnum {
  Fixed = 1055001,
  RegardlessOfInventory = 1055003,
  DifferentInventory = 1055002,
}
const DuplicationProductsPricing = ({ expanded, onNext, onPrev }: DuplicationSectionProps) => {
  const router = useRouter()
  const id = router.query.id as string
  const { formatMessage } = useIntl()

  const formProviderProps = useForm<FormDataType>({
    mode: 'onBlur',
    shouldUnregister: true,
  })

  const formValues = useWatch({
    control: formProviderProps.control,
  })

  const { data: productData } = useGetAdminCatalogConfigurableProductsByIdQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id,
    },
    {
      skip: !id,
    },
  )
  const { data: { data: { items: currencies = [] } = {} } = {} } =
    useGetAdminGeneralDataCurrencyGetAllQuery({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
    })

  const currencyName = useMemo(() => {
    const foundCurrencyName = currencies?.find(
      (currency) => currency?.id === productData?.data?.currencyId,
    )
    return foundCurrencyName?.name
  }, [productData, currencies])

  const variantAgents = useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
    'client-name': 'hasty-bazar-admin',
    businessType: VARIANT_AGENTS_TYPE_ID,
    'client-version': '1.0.0',
  })

  const variantPricingAgents =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'hasty-bazar-admin',
      businessType: VARIANT_PRICING_AGENTS,
      'client-version': '1.0.0',
    })

  const variantPriceEffective =
    useGetAdminCatalogConfigurableProductsByIdPriceEffectiveAttributesQuery({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id,
    })

  const variantPriceEffectiveItems = useMemo(() => {
    return convertDataToSelectItems(
      variantPriceEffective.data?.data?.items || [],
      'attributeId',
      'attributeName',
    )
  }, [variantPriceEffective.data])

  const variantAgentsItems = useMemo(
    () =>
      convertDataToSelectItems(variantAgents.data?.data?.items || [], 'fullCode', 'title') || [],
    [variantAgents.data],
  )

  const variantPricingAgentsItems = useMemo(
    () =>
      convertDataToSelectItems(variantPricingAgents.data?.data?.items || [], 'fullCode', 'title') ||
      [],
    [variantPricingAgents.data],
  )

  const [submitForm, submitFormStates] =
    usePutAdminCatalogConfigurableProductsByIdVariantInventoryPricingMutation()
  const handleSubmit = (values: FormDataType) => {
    if ((values?.price as unknown as string) === '') {
      values.price = null
    }
    const hasPriceError = values?.variantAttributeValuesPricing?.filter((item) => {
      if (item?.finalPrice && item?.originalPrice)
        return item?.finalPrice <= 0 || item?.originalPrice <= 0
      return false
    }).length

    if (hasPriceError) {
      openToast({
        message: formatMessage(duplicationProductsPricingMessages.zeroPriceError),
        type: 'error',
      })
      return
    }
    submitForm({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id,
      variantInventoryPricingModel: removeEmptyFields<FormDataType>(values, {
        exclude: ['price'],
      }),
    })
  }
  const {
    attributeId,
    inventoryAttributeId,
    variantAttributePricingType,
    variantAttributeInventoryType,
  } = useWatch({
    control: formProviderProps.control,
  })

  const attributesValues =
    useGetAdminCatalogConfigurableProductsByIdAttributeValuesAndAttributeIdQuery(
      {
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id,
        attributeId: String(attributeId || variantPriceEffectiveItems?.[0]?.value),
      },
      { skip: !attributeId || !variantPriceEffectiveItems.length },
    )

  const inventoryAttributeValues =
    useGetAdminCatalogConfigurableProductsByIdAttributeValuesAndAttributeIdQuery(
      {
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id,
        attributeId: String(inventoryAttributeId || variantPriceEffectiveItems?.[0]?.value),
      },
      {
        skip: !inventoryAttributeId || !variantPriceEffectiveItems.length,
      },
    )
  const inventoryAttributeValuesTableData = useMemo<VariantAttributeValuesPricingType[]>(() => {
    return inventoryAttributeValues.data?.data?.items || []
  }, [inventoryAttributeValues.data?.data?.items])
  const attributesValuesTableData = useMemo<VariantAttributeValuesPricingType[]>(() => {
    return attributesValues.data?.data?.items || []
  }, [attributesValues.data?.data?.items])

  const handleChange = (
    value: string,
    rowData: GetAttributeValueListByAttributeIdQueryModel,
    inputName: string,
  ) => {
    const prevValue =
      formValues.variantAttributeValuesPricing?.find(
        (item) => item.attributeValueId === rowData.id,
      ) || {}
    const newValue: VariantAttributeValuePricing = {
      ...prevValue,
      attributeValueId: rowData.id,
      [inputName]: value,
    }
    const variantAttributeValuesPricing = formValues.variantAttributeValuesPricing || []
    const newVariantAttributeValuesPricing = [
      ...variantAttributeValuesPricing?.filter((item) => item.attributeValueId != rowData.id),
      newValue,
    ]
    formProviderProps.setValue('variantAttributeValuesPricing', newVariantAttributeValuesPricing)
  }
  const handleVariantAttributeInventoryChange = (
    value: string,
    rowData: GetAttributeValueListByAttributeIdQueryModel,
    inputName: string,
  ) => {
    const prevValue =
      formValues.variantAttributeValueInventories?.find(
        (item) => item.attributeValueId === rowData.id,
      ) || {}
    const newValue: VariantAttributeValuePricing = {
      ...prevValue,
      attributeValueId: rowData.id,
      [inputName]: value,
    }
    const variantAttributeValueInventories = formValues.variantAttributeValueInventories || []
    const newVariantAttributeValueInventories = [
      ...variantAttributeValueInventories?.filter((item) => item.attributeValueId != rowData.id),
      newValue,
    ]
    formProviderProps.setValue(
      'variantAttributeValueInventories',
      newVariantAttributeValueInventories,
    )
  }

  const variantAttributeValuesPricingColumns: TheadType<VariantAttributeValuesPricingType>[] = [
    {
      title: variantPriceEffectiveItems.find((item) => item.value === attributeId)?.title || '',
      key: 'value',
    },
    {
      key: 'originalPrice',
      title: formatMessage(duplicationProductsPricingMessages.originalPrice, {
        unit: currencyName,
      }),
      render: (param, rowData) => {
        return (
          <HBTextFieldController
            formRules={{
              required: false,
              max: formValues.variantAttributeValuesPricing?.find(
                (item) => item.attributeValueId === rowData.id,
              )?.originalPrice,
            }}
            maskOptions={{
              mask: Number,
              thousandsSeparator: ',',
              valueType: 'unmaskedValue',
            }}
            value={
              formValues.variantAttributeValuesPricing?.find(
                (item) => item.attributeValueId === rowData.id,
              )?.originalPrice
            }
            onChange={({ target: { value } }) => {
              handleChange(value, rowData, 'originalPrice')
            }}
            name={`originalPrice`}
            label={formatMessage(duplicationProductsPricingMessages.originalPrice, {
              unit: currencyName,
            })}
          />
        )
      },
    },

    {
      key: 'afterDiscount',
      title: formatMessage(duplicationProductsPricingMessages.priceAfterDiscount, {
        unit: currencyName,
      }),
      render: (param, rowData) => {
        return (
          <HBTextFieldController
            formRules={{
              required: false,
              max: formValues.variantAttributeValuesPricing?.find(
                (item) => item.attributeValueId === rowData.id,
              )?.originalPrice,
            }}
            maskOptions={{
              mask: Number,
              thousandsSeparator: ',',
              valueType: 'unmaskedValue',
            }}
            value={
              formValues.variantAttributeValuesPricing?.find(
                (item) => item.attributeValueId === rowData.id,
              )?.finalPrice
            }
            onChange={({ target: { value } }) => {
              handleChange(value, rowData, 'finalPrice')
            }}
            name={'finalPrice'}
            label={formatMessage(duplicationProductsPricingMessages.priceAfterDiscount, {
              unit: currencyName,
            })}
          />
        )
      },
    },
  ]

  const variantAttributeInventoryTypeColumns: TheadType<GetAttributeValueListByAttributeIdQueryModel>[] =
    [
      {
        title:
          variantPriceEffectiveItems.find((item) => item.value === inventoryAttributeId)?.title ||
          '',
        key: 'value',
      },
      {
        key: 'qty',
        title: formatMessage(duplicationProductsPricingMessages.salableInventory),
        render: (param, rowData) => {
          return (
            <HBTextFieldController
              formRules={{
                required: false,
              }}
              maskOptions={{
                mask: Number,
                scale: 0,
              }}
              onChange={({ target: { value } }) => {
                if (Number(value) < 0) return
                handleVariantAttributeInventoryChange(value, rowData, 'qty')
              }}
              value={
                formValues.variantAttributeValueInventories?.find(
                  (item) => item.attributeValueId === rowData.id,
                )?.qty
              }
              label={formatMessage(duplicationProductsPricingMessages.salableInventory)}
              name={'qty'}
            />
          )
        },
      },
    ]

  const handleVariantAttributePricingTypeChange: (
    event: SelectChangeEvent<VariantAttributePricingType>,
  ) => void = (event) => {
    formProviderProps.setValue(
      'variantAttributePricingType',
      event.target.value as VariantAttributePricingType,
    )
    formProviderProps.setValue('price', undefined)
    formProviderProps.setValue('oldPrice', undefined)
    formProviderProps.setValue('variantAttributeValuesPricing', undefined)
    formProviderProps.clearErrors('oldPrice')
    formProviderProps.clearErrors('price')
    formProviderProps.clearErrors('attributeId')
  }

  const handleVariantAttributeInventoryTypeChange: (
    event: SelectChangeEvent<VariantAttributePricingType>,
  ) => void = (event) => {
    formProviderProps.setValue('inventoryQty', undefined)
    formProviderProps.setValue('variantAttributeValueInventories', undefined)
    formProviderProps.setValue(
      'variantAttributeInventoryType',
      event.target.value as VariantAttributeInventoryType,
    )
    formProviderProps.clearErrors('variantAttributeValueInventories')
    formProviderProps.clearErrors('inventoryAttributeId')
  }

  function resetForm() {
    formProviderProps.reset({})
  }
  useEffect(() => {
    if (submitFormStates.isSuccess) {
      openToast({
        message: formatMessage(duplicationSettings.successfullyMessage),
        type: 'success',
      })

      onNext()
      resetForm()
    }
  }, [submitFormStates.isSuccess])

  return (
    <ProductExplanation
      summaryProps={{
        title: formatMessage(duplicationSettings.duplicationProductsPricing),
        statusLabel: Object.values(formValues).length ? '1' : '0',
        icon: 'dollarSign',
      }}
      expanded={expanded}
      nextStepButtonProps={{
        loading: submitFormStates.isLoading,
        disabled:
          (!isEmpty(formProviderProps.formState.errors) && isEmpty(formValues)) ||
          submitFormStates.isLoading,
        onClick: formProviderProps.handleSubmit(handleSubmit),
        text: formatMessage(duplicationProductsPricingMessages.createDuplication),
      }}
      prevStepButtonProps={{ onClick: onPrev }}
    >
      <HBForm formProviderProps={formProviderProps} onSubmit={handleSubmit}>
        <Grid container spacing={6}>
          <Grid container item xs={12} spacing={6}>
            <Grid item xs={12} sm={6} md={4}>
              <HBSelectController
                fullWidth
                menuItem={variantAgentsItems}
                label={formatMessage(
                  duplicationProductsPricingMessages.howToPriceReproductionAgents,
                )}
                value={variantAttributePricingType}
                onChange={handleVariantAttributePricingTypeChange}
                name={'variantAttributePricingType' as keyof FormDataType}
              />
            </Grid>
            <Grid item xs={12} sm={12} container md={6} spacing={6}>
              {variantAttributePricingType === variantAgentsEnum.DifferentPrice && (
                <Grid item xs={12} sm={6}>
                  <HBSelectController
                    fullWidth
                    menuItem={variantPriceEffectiveItems}
                    label={formatMessage(
                      duplicationProductsPricingMessages.SelectedFeatureEffectiveInPrice,
                    )}
                    value={attributeId}
                    onChange={(event) => {
                      formProviderProps.setValue('attributeId', event.target.value as string)
                    }}
                    name={'attributeId' as keyof FormDataType}
                  />
                </Grid>
              )}
              {variantAttributePricingType === variantAgentsEnum.Fixed && (
                <>
                  <Grid item xs={12} sm={6}>
                    <HBNumericFormatController<FormDataType>
                      fullWidth
                      label={formatMessage(duplicationProductsPricingMessages.originalPrice, {
                        unit: currencyName,
                      })}
                      thousandSeparator=","
                      name={'oldPrice'}
                      formRules={{
                        required: true,
                        min: {
                          value: 1,
                          message: formatMessage(duplicationProductsPricingMessages.minPrice, {
                            minPrice: 1,
                          }),
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <HBNumericFormatController<FormDataType>
                      fullWidth
                      formRules={{
                        required: false,
                      }}
                      label={formatMessage(duplicationProductsPricingMessages.priceAfterDiscount, {
                        unit: currencyName,
                      })}
                      thousandSeparator=","
                      name={'price'}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          {variantAttributePricingType === variantAgentsEnum.DifferentPrice &&
            attributesValuesTableData.length !== 0 && (
              <RootGrid item xs={8} spacing={6}>
                <HBTable
                  columns={variantAttributeValuesPricingColumns}
                  data={attributesValuesTableData}
                  keyExtractor={(item) => String(item.id)}
                />
              </RootGrid>
            )}
          <Grid container item xs={12} spacing={6}>
            <Grid item xs={12} sm={6} md={4}>
              <HBSelectController
                fullWidth
                menuItem={variantPricingAgentsItems}
                label={formatMessage(
                  duplicationProductsPricingMessages.HowToDetermineTheInventoryOfReproductionFactors,
                )}
                value={variantAttributeInventoryType}
                onChange={handleVariantAttributeInventoryTypeChange}
                name={'variantAttributeInventoryType' as keyof FormDataType}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Grid item xs={12}>
                {variantAttributeInventoryType === variantPricingAgentsEnum.DifferentInventory && (
                  <HBSelectController
                    fullWidth
                    menuItem={variantPriceEffectiveItems}
                    label={formatMessage(
                      duplicationProductsPricingMessages.selectedFeatureEffectiveInExists,
                    )}
                    value={inventoryAttributeId}
                    onChange={(event) => {
                      inventoryAttributeValues.refetch()
                      formProviderProps.setValue(
                        'inventoryAttributeId',
                        event.target.value as string,
                      )
                    }}
                    name={'inventoryAttributeId' as keyof FormDataType}
                  />
                )}
                {variantAttributeInventoryType === variantPricingAgentsEnum.Fixed && (
                  <HBTextFieldController
                    fullWidth
                    type={'number'}
                    value={Number(formValues.inventoryQty).toFixed(0)}
                    label={formatMessage(duplicationProductsPricingMessages.salableInventory)}
                    name={'inventoryQty' as keyof FormDataType}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
          {variantAttributeInventoryType === variantPricingAgentsEnum.DifferentInventory &&
            inventoryAttributeValuesTableData.length !== 0 && (
              <RootGrid item xs={12} md={6} spacing={6}>
                <HBTable
                  columns={variantAttributeInventoryTypeColumns}
                  data={inventoryAttributeValuesTableData}
                  keyExtractor={(item) => String(item.id)}
                />
              </RootGrid>
            )}
        </Grid>
      </HBForm>
    </ProductExplanation>
  )
}

export default DuplicationProductsPricing
