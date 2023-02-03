import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import {
  usePutAdminCatalogConfigurableProductsByIdProductPackagingMutation,
  usePutAdminCatalogSimpleProductsByIdProductPackagingMutation,
  useGetAdminCatalogApiUnitOfMeasurementGetAllQuery,
  useGetAdminCatalogConfigurableProductsByIdProductPackagingQuery,
  useGetAdminCatalogSimpleProductsByIdProductPackagingQuery,
  usePutAdminCatalogConfigurableProductsByIdGroupEditingChildrenProductPackagingMutation,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'

import { useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { convertDataToSelectItems, removeEmptyFields } from '@hasty-bazar/admin-shared/utils'
import { HBForm } from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ProductContext } from '../../../contexts/productContext'
import communicationMessages from '../communicationBetweenProduct.messages'
import productPackagingInformation from './productPackagingInformation.messages'
import { SetProductPackagingModel } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import HBNumericFormatController from '@hasty-bazar/admin-shared/containers/HBNumericFormatController'

export type ProductPackagingInformationFormType = SetProductPackagingModel & {
  saveForAllChildren?: boolean
}

const PACKAGING_TYPE_CODE = '1092'
const PAGE_SIZE = 1000
export const PACKAGING_INFORMATION_fORM_ID = 'ProductPackagingInformation'
const PUBLISH_STATE_CODE = '2'
function ProductPackagingInformation() {
  const router = useRouter()
  const id = router.query.id! as string

  const defaultExpanded = router.asPath.includes(PACKAGING_INFORMATION_fORM_ID)

  const { formatMessage } = useIntl()
  const defaultProductType = getProductType(router.pathname)
  const { productState } = useContext(ProductContext)

  const productType = getProductType(router.asPath) || defaultProductType
  const { showToast } = useToast()
  const queryArgs = {
    'client-name': 'shipment-management-api',
    'client-version': '1',
    id,
  }
  const ProductPackagingInformationData =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdProductPackagingQuery(queryArgs)
      : useGetAdminCatalogConfigurableProductsByIdProductPackagingQuery(queryArgs)
  const unitMeasurement = useGetAdminCatalogApiUnitOfMeasurementGetAllQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',

    pageSize: PAGE_SIZE,
  })
  const formProviderProps = useForm<ProductPackagingInformationFormType>({
    mode: 'all',
    defaultValues: {},
  })
  const unitOfMeasurementItems = useMemo(
    () =>
      convertDataToSelectItems(
        unitMeasurement.data?.data?.items?.filter(
          ({ measuringUnitType }) => measuringUnitType === 1002002,
        ) || [],
        'id',
        'name',
      ) || [],
    [unitMeasurement],
  )

  const dimensionUnitItems = useMemo(
    () =>
      convertDataToSelectItems(
        unitMeasurement.data?.data?.items?.filter(
          ({ measuringUnitType }) => measuringUnitType === 1002001,
        ) || [],
        'id',
        'name',
        'stateCode',
        PUBLISH_STATE_CODE,
      ) || [],

    [unitMeasurement],
  )

  const PackagingTypes = useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    businessTypeId: PACKAGING_TYPE_CODE,
  })
  const packagingTypesItems = useMemo(
    () =>
      convertDataToSelectItems(PackagingTypes.data?.data?.items || [], 'fullCode', 'title') || [],
    [PackagingTypes],
  )

  const commodityMeasurementUnitItems = useMemo(
    () =>
      convertDataToSelectItems(
        unitMeasurement.data?.data?.items || [],
        'id',
        'name',
        'stateCode',
        PUBLISH_STATE_CODE,
      ) || [],
    [unitMeasurement],
  )

  const [submitForm, submitFormStates] =
    productType === 'simple'
      ? usePutAdminCatalogSimpleProductsByIdProductPackagingMutation()
      : usePutAdminCatalogConfigurableProductsByIdProductPackagingMutation()

  const [groupEdit, groupEditStates] =
    usePutAdminCatalogConfigurableProductsByIdGroupEditingChildrenProductPackagingMutation()

  const handleSubmit = (data: ProductPackagingInformationFormType) => {
    const { saveForAllChildren, ...formData } = data
    if (saveForAllChildren) {
      groupEdit({
        'client-name': 'package-client',
        'client-version': '1',
        id: router.query?.parentId as string,
        setProductPackagingModel: removeEmptyFields(formData),
      })
    } else {
      submitForm({
        'client-name': 'package-client',
        'client-version': '1',
        id,
        setProductPackagingModel: removeEmptyFields(formData),
      })
    }
  }

  const hasEditData =
    Object.values(removeEmptyFields(ProductPackagingInformationData.data?.data || {})).length > 0
  useEffect(() => {
    if (submitFormStates.isSuccess || groupEditStates.isSuccess) {
      showToast(formatMessage(communicationMessages.success), 'success')
      ProductPackagingInformationData.refetch()
    }
  }, [
    submitFormStates.error,
    submitFormStates.isSuccess,
    groupEditStates.isSuccess,
    groupEditStates.error,
  ])
  useEffect(() => {
    if (hasEditData) {
      formProviderProps.reset({
        ...ProductPackagingInformationData.data?.data,
        dimensionsId:
          ProductPackagingInformationData.data?.data?.unitOfDimensionsUnitOfMeasurementId,
        weightMeasurementId:
          ProductPackagingInformationData.data?.data?.unitOfWeightUnitOfMeasurementId,
        unitOfMeasurementId: ProductPackagingInformationData.data?.data?.unitOfMeasurementId,
      } as unknown as ProductPackagingInformationFormType)
    }
  }, [ProductPackagingInformationData.isFetching])

  const disabled = productState !== EnumFormHeaderStatus.draft
  const valueFieldsCount = hasEditData ? 1 : 0

  return (
    <ProductExplanation
      disabled={productType === 'configurable'}
      defaultExpanded={defaultExpanded}
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
        title: formatMessage(communicationMessages.productPackagingInformation),
      }}
    >
      <HBForm
        id={PACKAGING_INFORMATION_fORM_ID}
        formProviderProps={formProviderProps}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={6}>
          <Grid item container spacing={6} xs={12}>
            <Grid item xs={12} sm={6} md={3}>
              <HBSelectController
                fullWidth
                disabled={disabled}
                menuItem={commodityMeasurementUnitItems}
                label={formatMessage(productPackagingInformation.commodityMeasurementUnit)}
                name={'unitOfMeasurementId' as keyof ProductPackagingInformationFormType}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <HBSelectController
                fullWidth
                formRules={{
                  required: false,
                }}
                disabled={disabled}
                menuItem={packagingTypesItems}
                label={formatMessage(productPackagingInformation.packagingType)}
                name={'packagingType' as keyof ProductPackagingInformationFormType}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={6} xs={12}>
            <Grid item xs={12} sm={6} md={3}>
              <HBSelectController
                fullWidth
                disabled={disabled}
                formRules={{
                  required: false,
                }}
                menuItem={unitOfMeasurementItems}
                label={formatMessage(productPackagingInformation.weightUnit)}
                name={'weightMeasurementId' as keyof ProductPackagingInformationFormType}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <HBNumericFormatController<ProductPackagingInformationFormType>
                fullWidth
                disabled={disabled}
                formRules={{
                  required: false,
                  min: {
                    value: 0,
                    message: formatMessage(productPackagingInformation.minValueError),
                  },
                }}
                label={formatMessage(productPackagingInformation.weight)}
                name={'weight'}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={6} xs={12}>
            <Grid item xs={12} sm={6} md={3}>
              <HBSelectController
                fullWidth
                formRules={{
                  required: false,
                }}
                disabled={disabled}
                menuItem={dimensionUnitItems}
                label={formatMessage(productPackagingInformation.dimensionUnit)}
                name={'dimensionsId' as keyof ProductPackagingInformationFormType}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <HBNumericFormatController<ProductPackagingInformationFormType>
                fullWidth
                disabled={disabled}
                formRules={{
                  required: false,
                  min: {
                    value: 0,
                    message: formatMessage(productPackagingInformation.minValueError),
                  },
                }}
                label={formatMessage(productPackagingInformation.length)}
                name={'length'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <HBNumericFormatController<ProductPackagingInformationFormType>
                fullWidth
                formRules={{
                  required: false,
                  min: {
                    value: 0,
                    message: formatMessage(productPackagingInformation.minValueError),
                  },
                }}
                disabled={disabled}
                label={formatMessage(productPackagingInformation.width)}
                name={'width'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <HBNumericFormatController<ProductPackagingInformationFormType>
                fullWidth
                formRules={{
                  required: false,
                  min: {
                    value: 0,
                    message: formatMessage(productPackagingInformation.minValueError),
                  },
                }}
                disabled={disabled}
                label={formatMessage(productPackagingInformation.height)}
                name={'height'}
              />
            </Grid>
          </Grid>
        </Grid>
      </HBForm>
    </ProductExplanation>
  )
}

export default ProductPackagingInformation
