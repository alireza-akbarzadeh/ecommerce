import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import HBNumericFormatController from '@hasty-bazar/admin-shared/containers/HBNumericFormatController'
import HBRadioController from '@hasty-bazar/admin-shared/containers/HBRadioController'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { usePutAdminCatalogConfigurableProductsByIdGroupEditingChildrenShippingInformationMutation } from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  SetShippingInformationModel,
  useGetAdminCatalogConfigurableProductsByIdShippingInformationQuery,
  useGetAdminCatalogSimpleProductsByIdShippingInformationQuery,
  usePutAdminCatalogConfigurableProductsByIdShippingInformationMutation,
  usePutAdminCatalogSimpleProductsByIdShippingInformationMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminIdrVendorsByIdAddressQuery } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { convertDataToSelectItems, removeEmptyFields } from '@hasty-bazar/admin-shared/utils'
import { HBForm } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ProductContext } from '../../../contexts/productContext'
import communicationMessages from '../communicationBetweenProduct.messages'
import shippingInformation from './shippingInformation.messages'
export type ShippingInformationFormType = Omit<SetShippingInformationModel, 'isDefaultAddress'> & {
  isDefaultAddress: '0' | '1'
  saveForAllChildren?: boolean
}

function ShippingInformation() {
  const { formatMessage } = useIntl()
  const router = useRouter()

  const defaultProductType = getProductType(router.pathname)
  const productType = getProductType(router.asPath) || defaultProductType
  const id = router.query.id! as string
  const { showToast } = useToast()
  const { productState, productDetails } = useContext(ProductContext)

  const disabled =
    productState !== EnumFormHeaderStatus.draft && productState !== EnumFormHeaderStatus.published

  const queryArgs = {
    'client-name': 'shipment-management-api',
    'client-version': '1',
    id,
  }

  const shippingInformationData =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdShippingInformationQuery(queryArgs)
      : useGetAdminCatalogConfigurableProductsByIdShippingInformationQuery(queryArgs)

  const [submitForm, submitFormStates] =
    productType === 'simple'
      ? usePutAdminCatalogSimpleProductsByIdShippingInformationMutation()
      : usePutAdminCatalogConfigurableProductsByIdShippingInformationMutation()

  const [groupEdit, groupEditStates] =
    usePutAdminCatalogConfigurableProductsByIdGroupEditingChildrenShippingInformationMutation()
  const addresses = useGetAdminIdrVendorsByIdAddressQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: String(productDetails?.vendorId)!,
    },
    {
      skip: !productDetails?.vendorId,
    },
  )

  const addressesItems = useMemo(
    () => convertDataToSelectItems(addresses.data?.data?.items || [], 'id', 'title'),
    [addresses],
  )

  const formProviderProps = useForm<ShippingInformationFormType>({
    mode: 'onSubmit',
    defaultValues: {
      isDefaultAddress: '1',
    },
  })

  const formValues = useWatch({
    control: formProviderProps.control,
  })

  const handleSubmit = (data: ShippingInformationFormType) => {
    const { saveForAllChildren, ...rest } = data
    if (saveForAllChildren) {
      groupEdit({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: router.query?.parentId as string,
        setShippingInformationModel: {
          ...removeEmptyFields({
            ...rest,
            isDefaultAddress: Boolean(Number(data.isDefaultAddress || 0)),
          }),
        },
      })
    } else {
      submitForm({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id,
        setShippingInformationModel: {
          ...removeEmptyFields({
            ...rest,
            isDefaultAddress: Boolean(Number(data.isDefaultAddress || 0)),
          }),
        },
      })
    }
  }

  useEffect(() => {
    if (submitFormStates.isSuccess || groupEditStates.isSuccess) {
      showToast(formatMessage(communicationMessages.success), 'success')
      shippingInformationData.refetch()
    }
  }, [submitFormStates.error, submitFormStates.isSuccess, groupEditStates.isSuccess])
  const hasEditData = !!Object.keys(removeEmptyFields(shippingInformationData.data?.data || {}))
    .length
  useEffect(() => {
    if (hasEditData) {
      formProviderProps.reset({
        ...shippingInformationData.data?.data,
        isDefaultAddress: shippingInformationData.data?.data?.isDefaultAddress ? '1' : '0',
      } as unknown as ShippingInformationFormType)
    }
  }, [shippingInformationData.isFetching])

  const valueFieldsCount = hasEditData ? 1 : 0

  return (
    <ProductExplanation
      disabled={!productDetails?.vendorId || productType === 'configurable'}
      summaryProps={{
        icon: 'infoCircle',
        statusLabel: String(valueFieldsCount),
        submitButton: true,

        submitButtonProps: {
          onClick: disabled ? undefined : formProviderProps.handleSubmit(handleSubmit),
          tooltipTitle: formatMessage(communicationMessages.saveForOneRecord),
        },
        groupSubmitButtonProps:
          defaultProductType !== productType
            ? {
                onClick: disabled
                  ? undefined
                  : formProviderProps.handleSubmit((data) =>
                      handleSubmit({
                        ...data,
                        saveForAllChildren: true,
                      }),
                    ),
                tooltipTitle: formatMessage(communicationMessages.saveForAllRecords),
              }
            : undefined,
        title: formatMessage(communicationMessages.shippingInformation),
      }}
    >
      <HBForm formProviderProps={formProviderProps} onSubmit={handleSubmit}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} md={3}>
            <HBNumericFormatController<ShippingInformationFormType>
              fullWidth
              disabled={disabled}
              label={formatMessage(shippingInformation.preparationSupplyTime)}
              name={'preparationTime' as keyof ShippingInformationFormType}
              formRules={{
                min: {
                  value: 0,
                  message: formatMessage(shippingInformation.minValueError),
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <HBNumericFormatController<ShippingInformationFormType>
              fullWidth
              disabled={disabled}
              formRules={
                formValues?.latestDeliveryTime
                  ? {
                      max: {
                        value: formValues.latestDeliveryTime,
                        message: formatMessage(shippingInformation.earliestShippingTimeError),
                      },
                      required: false,
                      min: {
                        value: 0,
                        message: formatMessage(shippingInformation.minValueError),
                      },
                    }
                  : {
                      required: false,
                      min: {
                        value: 0,
                        message: formatMessage(shippingInformation.minValueError),
                      },
                    }
              }
              label={formatMessage(shippingInformation.earliestShippingTime)}
              name={'earliestDeliveryTime' as keyof ShippingInformationFormType}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HBNumericFormatController<ShippingInformationFormType>
              fullWidth
              disabled={disabled}
              formRules={
                formValues.earliestDeliveryTime
                  ? {
                      min: {
                        value: formValues.earliestDeliveryTime || 0,
                        message: formValues.earliestDeliveryTime
                          ? formatMessage(shippingInformation.latestShippingTimeError)
                          : formatMessage(shippingInformation.minValueError),
                      },

                      required: false,
                    }
                  : {
                      required: false,
                    }
              }
              label={formatMessage(shippingInformation.latestShippingTime)}
              name={'latestDeliveryTime' as keyof ShippingInformationFormType}
            />
          </Grid>
          <Grid item container xs={12} spacing={6}>
            <Grid item xs={12} sm={6} md={3}>
              <HBRadioController
                name={'isDefaultAddress' as keyof ShippingInformationFormType}
                disabled={disabled}
                label={formatMessage(shippingInformation.sendLocationAddress)}
                radioGroupItem={[
                  {
                    title: formatMessage(shippingInformation.defaultVendorAddress),
                    value: '1',
                  },
                  {
                    title: formatMessage(shippingInformation.chooseAddress),
                    value: '0',
                  },
                ]}
              />
            </Grid>
            {Boolean(Number(formValues.isDefaultAddress)) === false && (
              <Grid item xs={12} sm={6} md={3}>
                <HBSelectController
                  fullWidth
                  disabled={disabled}
                  menuItem={addressesItems}
                  label={formatMessage(shippingInformation.vendorAddresses)}
                  name={'shippingAddress' as keyof ShippingInformationFormType}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </HBForm>
    </ProductExplanation>
  )
}

export default ShippingInformation
