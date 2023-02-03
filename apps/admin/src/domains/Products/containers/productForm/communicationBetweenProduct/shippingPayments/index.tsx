import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { HBTextFieldSelect } from '@hasty-bazar/admin-shared/containers/HBTextFieldSelect'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import { usePutAdminCatalogConfigurableProductsByIdGroupEditingChildrenShippingPaymentMutation } from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  CostCoverageType,
  SetShippingPaymentModel,
  ShippingObligationType,
  useGetAdminCatalogConfigurableProductsByIdShippingPaymentQuery,
  useGetAdminCatalogSimpleProductsByIdShippingPaymentQuery,
  usePutAdminCatalogConfigurableProductsByIdShippingPaymentMutation,
  usePutAdminCatalogSimpleProductsByIdShippingPaymentMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  BusinessType,
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
  useGetAdminGeneralDataCurrencyGetAllQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  commafy,
  convertDataToSelectItems,
  removeEmptyFields,
  uncommafy,
} from '@hasty-bazar/admin-shared/utils'
import { HBForm, useYupValidationResolver } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import * as yup from 'yup'
import { ProductContext } from '../../../contexts/productContext'
import communicationMessages from '../communicationBetweenProduct.messages'
import shippingInformation from './shippingCostInformation.messages'
export type ShippingInformationFormType = SetShippingPaymentModel & {
  saveForAllChildren?: boolean
}

const RESPONSIBLE_FOR_SHIPPINGS_BUSHINESS_TYPE_ID: BusinessType = 1049
const COVERAGE_TYPE_BUSHINESS_TYPE_ID: BusinessType = 1051

export const enum ShipmentPaymentType {
  Platform = 1049001,
  Seller = 1049002,
}
export const enum CoverageType {
  AllCost = 1051001,
  CoverageAmount = 1051002,
}

const FORM_ID = 'shippingPaymentsForm'
function ShippingPayments() {
  const { formatMessage } = useIntl()
  const router = useRouter()

  const defaultProductType = getProductType(router.pathname)
  const productType = getProductType(router.asPath) || defaultProductType
  const { productDetails } = useContext(ProductContext)

  const schema = yup.object().shape({
    shippingObligationType: yup
      .number()
      .required(formatMessage(communicationMessages.requiredField)),

    costCoverageType: yup.number().when('shippingObligationType', {
      is: ShipmentPaymentType.Platform,
      then: yup.number().required(formatMessage(communicationMessages.requiredField)),
    }),
    coverageAmount: yup.number().when('costCoverageType', {
      is: CoverageType.CoverageAmount,
      then: yup.number().required(formatMessage(communicationMessages.requiredField)),
    }),
    shippingCostInOriginPrice: yup.number().when('shippingObligationType', {
      is: ShipmentPaymentType.Seller,
      then: yup.number().required(formatMessage(communicationMessages.requiredField)),
    }),
    shippingCostInElseWherePrice: yup.number().when('shippingObligationType', {
      is: ShipmentPaymentType.Seller,
      then: yup.number().required(formatMessage(communicationMessages.requiredField)),
    }),
  })
  const id = router.query.id! as string
  const { productState } = useContext(ProductContext)
  const disabled =
    productState !== EnumFormHeaderStatus.draft && productState !== EnumFormHeaderStatus.published
  const { showToast } = useToast()
  const queryArgs = useMemo(() => {
    return {
      'client-name': 'shipment-management-api',
      'client-version': '1',
      id,
    }
  }, [id])
  const shippingPaymentsData =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdShippingPaymentQuery(queryArgs)
      : useGetAdminCatalogConfigurableProductsByIdShippingPaymentQuery(queryArgs)

  const currencies = useGetAdminGeneralDataCurrencyGetAllQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
  })

  const [submitForm, submitFormStates] =
    productType === 'simple'
      ? usePutAdminCatalogSimpleProductsByIdShippingPaymentMutation()
      : usePutAdminCatalogConfigurableProductsByIdShippingPaymentMutation()

  const [groupEdit, groupEditStates] =
    usePutAdminCatalogConfigurableProductsByIdGroupEditingChildrenShippingPaymentMutation()
  const responsibleForShipping =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'hasty-bazar-admin',
      businessType: RESPONSIBLE_FOR_SHIPPINGS_BUSHINESS_TYPE_ID,
      'client-version': '1.0.0',
    })

  const coverageTypes = useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
    'client-name': 'hasty-bazar-admin',
    businessType: COVERAGE_TYPE_BUSHINESS_TYPE_ID,
    'client-version': '1.0.0',
  })

  const responsibleForShippingItems = useMemo(
    () =>
      convertDataToSelectItems(responsibleForShipping.data?.data?.items || [], 'fullCode', 'title'),
    [responsibleForShipping.data?.data?.items],
  )

  const formProviderProps = useForm<ShippingInformationFormType>({
    mode: 'all',
    defaultValues: {
      shippingObligationType: ShipmentPaymentType.Platform,
      costCoverageType: CoverageType.CoverageAmount,
    },
    resolver: useYupValidationResolver(schema),
  })

  const {
    formState: { errors },
  } = formProviderProps
  const coverageTypesItems = useMemo(
    () => convertDataToSelectItems(coverageTypes.data?.data?.items || [], 'fullCode', 'title'),
    [coverageTypes.data?.data?.items],
  )

  const formValues = useWatch({
    control: formProviderProps.control,
  })
  const currenciesItems = useMemo(() => {
    return convertDataToSelectItems(currencies.data?.data?.items || [], 'id', 'name')
  }, [currencies])

  const { shippingObligationType } = formValues

  const productData = productDetails

  const showCitiesCostInput = shippingObligationType === ShipmentPaymentType.Seller

  const handleSubmit = ({ saveForAllChildren, ...data }: ShippingInformationFormType) => {
    if (saveForAllChildren) {
      groupEdit({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: router?.query?.parentId as string,
        setShippingPaymentModel: removeEmptyFields(data),
      })
    } else {
      submitForm({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id,
        setShippingPaymentModel: removeEmptyFields(data),
      })
    }
  }

  useEffect(() => {
    if (submitFormStates.isSuccess || groupEditStates.isSuccess) {
      showToast(formatMessage(communicationMessages.success), 'success')
      shippingPaymentsData.refetch()
    }
  }, [submitFormStates.isSuccess, groupEditStates.isSuccess])

  const hasEditData = !!Object.keys(removeEmptyFields(shippingPaymentsData.data?.data || {})).length
  useEffect(() => {
    if (hasEditData && shippingPaymentsData?.data?.data) {
      formProviderProps.reset({
        ...formValues,
        ...removeEmptyFields<ShippingInformationFormType>(shippingPaymentsData?.data?.data),
      })
    }
  }, [shippingPaymentsData.isFetching, shippingPaymentsData.data?.data])

  const currencyTitle = useAppSelector((state) => String(state.app.defaultCurrencyTitle))
  const foundCurrency = useMemo(
    () => currencies.data?.data?.items?.find((item) => item.name === currencyTitle)?.id,
    [currencies.data?.data?.items, currencyTitle],
  )
  useEffect(() => {
    if (foundCurrency) {
      if (foundCurrency) {
        formProviderProps.setValue('coverageCurrencyId', foundCurrency)
        formProviderProps.setValue('shippingCostInOriginCurrencyId', foundCurrency)
        formProviderProps.setValue('shippingCostInElseWhereCurrencyId', foundCurrency)
      }
    }
  }, [foundCurrency])

  const valueFieldsCount = hasEditData ? 1 : 0

  return (
    <ProductExplanation
      disabled={!productData?.vendorId || productType === 'configurable'}
      summaryProps={{
        icon: 'infoCircle',
        statusLabel: String(valueFieldsCount),
        submitButton: true,
        submitButtonProps: {
          onClick: disabled ? undefined : formProviderProps.handleSubmit(handleSubmit),
          tooltipTitle: formatMessage(communicationMessages.saveForOneRecord),
        },
        groupSubmitButtonProps: {
          onClick: disabled
            ? undefined
            : formProviderProps.handleSubmit((data) =>
                handleSubmit({
                  ...data,
                  saveForAllChildren: true,
                }),
              ),
          tooltipTitle: formatMessage(communicationMessages.saveForAllRecords),
        },
        title: formatMessage(communicationMessages.shippingCostsInformation),
      }}
    >
      <HBForm formProviderProps={formProviderProps} onSubmit={handleSubmit}>
        <Grid container spacing={6}>
          <Grid container item xs={12} spacing={6}>
            <Grid item xs={12} sm={6} md={3}>
              <HBSelectController
                fullWidth
                disabled={disabled}
                menuItem={responsibleForShippingItems}
                onChange={(value) => {
                  formProviderProps.reset({
                    shippingObligationType: value.target.value as ShippingObligationType,
                    shippingCostInElseWhereCurrencyId: foundCurrency,
                    shippingCostInOriginCurrencyId: foundCurrency,
                  })
                }}
                label={formatMessage(shippingInformation.responsibleForShipping)}
                error={!!errors.shippingObligationType?.message}
                helperText={errors.shippingObligationType?.message}
                name={'shippingObligationType' as keyof ShippingInformationFormType}
              />
            </Grid>
          </Grid>
          {shippingObligationType === ShipmentPaymentType.Platform && (
            <Grid container item xs={12} spacing={6}>
              <Grid item xs={12} sm={6} md={3}>
                <HBSelectController
                  fullWidth
                  disabled={disabled}
                  name={'costCoverageType' as keyof ShippingInformationFormType}
                  onChange={(value) => {
                    const _shippingObligationType = formValues.shippingObligationType
                    formProviderProps.reset({
                      shippingObligationType: _shippingObligationType as ShippingObligationType,
                      costCoverageType: value.target.value as CostCoverageType,

                      coverageCurrencyId: foundCurrency,
                    })
                  }}
                  menuItem={coverageTypesItems}
                  label={formatMessage(shippingInformation.typeOfCostCoverage)}
                  error={!!errors.costCoverageType?.message}
                  helperText={errors.costCoverageType?.message}
                />
              </Grid>
              {formValues.costCoverageType === CoverageType.CoverageAmount && (
                <Grid container item xs={12} spacing={6}>
                  <Grid item xs={12} sm={6} md={3}>
                    <HBTextFieldSelect
                      disabled={disabled}
                      textFieldLabel={formatMessage(shippingInformation.coverageAmount)}
                      selectItems={currenciesItems}
                      error={!!errors.coverageAmount?.message}
                      helperText={errors.coverageAmount?.message}
                      value={commafy(formValues?.coverageAmount)}
                      onChange={(e) => {
                        const value = e.target.value as string
                        const isNumber = Number(uncommafy(value))
                        if (isNaN(isNumber)) {
                          return
                        }
                        formProviderProps.setValue('coverageAmount', Number(uncommafy(value)))
                      }}
                      selectProps={{
                        value: formValues.coverageCurrencyId || '',
                        disabled: true,
                        onChange: (e) => {
                          formProviderProps.setValue('coverageCurrencyId', e.target.value as string)
                        },
                      }}
                      textFieldReturnValue={(value) => {}}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
          {showCitiesCostInput && (
            <Grid container item xs={12} spacing={6}>
              <Grid item xs={12} sm={6} md={3}>
                <HBTextFieldSelect
                  disabled={disabled}
                  textFieldLabel={formatMessage(shippingInformation.shippingCostInTheSellersCity)}
                  selectItems={currenciesItems}
                  value={commafy(formValues?.shippingCostInOriginPrice)}
                  onChange={(e) => {
                    const value = e.target.value as string
                    const isNumber = Number(uncommafy(value))
                    if (isNaN(isNumber)) {
                      return
                    }
                    formProviderProps.setValue(
                      'shippingCostInOriginPrice',
                      Number(uncommafy(value)),
                    )
                  }}
                  error={!!errors?.shippingCostInOriginPrice?.message}
                  helperText={errors?.shippingCostInOriginPrice?.message}
                  selectProps={{
                    disabled: true,
                    value: formValues.shippingCostInOriginCurrencyId || '',
                    onChange: (e) => {
                      formProviderProps.setValue(
                        'shippingCostInOriginCurrencyId',
                        e.target.value as string,
                      )
                    },
                  }}
                  textFieldReturnValue={(value) => {}}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <HBTextFieldSelect
                  disabled={disabled}
                  textFieldLabel={formatMessage(shippingInformation.shippingCostInOtherCities)}
                  selectItems={currenciesItems}
                  error={!!errors?.shippingCostInElseWherePrice?.message}
                  helperText={errors?.shippingCostInElseWherePrice?.message}
                  value={commafy(formValues?.shippingCostInElseWherePrice)}
                  onChange={(e) => {
                    const value = e.target.value as string
                    const isNumber = Number(uncommafy(value))
                    if (isNaN(isNumber)) {
                      return
                    }
                    formProviderProps.setValue(
                      'shippingCostInElseWherePrice',
                      Number(uncommafy(value)),
                    )
                  }}
                  selectProps={{
                    disabled: true,
                    value: formValues.shippingCostInElseWhereCurrencyId || '',
                    onChange: (e) => {
                      formProviderProps.setValue(
                        'shippingCostInElseWhereCurrencyId',
                        e.target.value as string,
                      )
                    },
                  }}
                  textFieldReturnValue={(value) => {}}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </HBForm>
    </ProductExplanation>
  )
}

export default ShippingPayments
