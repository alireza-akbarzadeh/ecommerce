import { HBRecordHistory, HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import HBNumericFormatController from '@hasty-bazar/admin-shared/containers/HBNumericFormatController'
import { HBTagsContainer } from '@hasty-bazar/admin-shared/containers/HBTagsContainer'
import HBTextFieldSelect from '@hasty-bazar/admin-shared/containers/HBTextFieldSelect/HBTextFieldSelect'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  usePostAdminCatalogSimpleProductsMutation,
  usePutAdminCatalogSimpleProductsByIdMutation,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import {
  CreateSimpleProductModel,
  useGetAdminCatalogProductsByIdHistoryQuery,
  useGetAdminCatalogProductsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery,
  useGetAdminCatalogProductsGetTransitionByEntityIdAndStateMachineCodeFactorQuery,
  usePostAdminCatalogProductsChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  GetBusinessTypeValuesQueryResult,
  GetCurrenciesQueryResult,
  GetTaxTypesQueryResult,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAutocompleteController, HBButton, HBForm, HBFormItemTextField } from '@hasty-bazar/core'
import { Box, buttonClasses, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ProductFormContainer from '../../productFormContainer'
import { ProductPreviewButtons } from '../../productPreviewButtons'
import { RelationCategoryRenderController } from '../../relationCategoryRender'
import { PACKAGING_INFORMATION_fORM_ID } from '../communicationBetweenProduct/productPackagingInformation'
import { INVENTORY_FORM_ID } from '../ordering'
import AddSimpleProductMessages from './AddProduct.messages'
import ConfirmDialog from './confirmDialog'
import { classes } from './productForm.styles'
import SellerDataGrid from './sellerDataGrid'
import useProductRequirementData from './useProductRequirementData'
export type ProductFormType = CreateSimpleProductModel
const AddSimpleProduct: FC = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()

  const id = router.query?.id as string
  const [postProduct, { isLoading: isLoadingPost }] = usePostAdminCatalogSimpleProductsMutation()
  const [putProduct, { isLoading: isLoadingPut }] = usePutAdminCatalogSimpleProductsByIdMutation()
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const {
    formProviderProps,
    handleSubmit,
    disabled,
    disabledFinalPrice,
    tags,
    setTags,
    productConditionItems,
    unitMeasurementItems,
    taxTypes,
    isLoading,
    productGroup,
    unitOfMeasureId,
    currencies,
    productOrigin,
    productType,
    action,
    categoryId,
    FORM_ID,
    vendorId,
    weight,
    defaultCurrencyTitle,
    productData,
    refetch,
  } = useProductRequirementData<ProductFormType>({
    createProduct(values) {
      return postProduct({
        'client-name': 'admin',
        'client-version': '1.0.0',
        createSimpleProductModel: values,
      })
    },
    updateProduct(values) {
      return putProduct({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id,
        updateSimpleProductModel: values,
      })
    },
  })
  useEffect(() => {
    if (
      categoryId &&
      categoryId !== productData?.data?.categoryId &&
      typeof isLoading === 'boolean' &&
      !isLoading
    ) {
      formProviderProps.setValue('acceptableConditionType', undefined)
    }
  }, [categoryId, productData?.data?.categoryId, isLoading])

  const { originalPrice } = useWatch({
    control: formProviderProps.control,
  })

  const { dirtyFields } = formProviderProps.formState
  const dirtyFieldsCount = Object.keys(dirtyFields).length

  const onRejectConfirmation = useCallback(() => {
    setOpenConfirmDialog(false)
    router.push(`/products/simple-product/edit/content-settings/${id}`)
  }, [])
  useEffect(() => {
    if (!isLoadingPut) {
      setOpenConfirmDialog(false)
    }
  }, [isLoadingPut])

  return (
    <ProductFormContainer
      stepperProps={{
        nextButtonProps: {
          type: dirtyFieldsCount === 0 ? 'submit' : 'button',
          form: FORM_ID,
          onClick:
            dirtyFieldsCount === 0 && action === 'edit'
              ? undefined
              : () => {
                  setOpenConfirmDialog(true)
                },
          disabled: !formProviderProps.formState.isValid,
        },
      }}
    >
      <HBForm<ProductFormType>
        id={FORM_ID}
        formProviderProps={formProviderProps}
        onSubmit={handleSubmit}
        mode="onSubmit"
        criteriaMode="all"
      >
        <Box sx={classes.mainContainer} bgcolor="common.white">
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            {action === 'edit' && id && (
              <HBWorkflow
                factor="1"
                entityId={id!}
                machineCode={StateMachineCode.Products}
                useGetStateList={
                  useGetAdminCatalogProductsGetTransitionByEntityIdAndStateMachineCodeFactorQuery
                }
                useGetState={
                  useGetAdminCatalogProductsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery
                }
                useChangeState={usePostAdminCatalogProductsChangeStateMutation}
                stateCode={productData?.data?.productStatus! as unknown as string}
                onChangeState={refetch}
              />
            )}
          </Box>

          <Typography sx={{ color: 'grey.500' }}>
            {formatMessage(AddSimpleProductMessages.subTitle)}
          </Typography>

          <Grid container spacing={6} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={3}>
              <HBFormItemTextField
                disabled
                value={productData?.data?.hsin}
                formName={'hsin'}
                label={formatMessage(AddSimpleProductMessages.hsin)}
                rules={{
                  required: false,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <RelationCategoryRenderController
                disabled={disabled}
                label={formatMessage(AddSimpleProductMessages.categoryId)}
                categoriesData={productGroup}
                defaultValue={categoryId}
                setValue={(value, defaultValue) => {
                  formProviderProps.setValue('categoryId', String(value))
                }}
                categoryId={categoryId}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <HBAutocompleteController<
                ProductFormType,
                {
                  value: number
                  title: string
                }
              >
                label={formatMessage(AddSimpleProductMessages.acceptableConditionTypeCode)}
                disabled={disabled}
                fieldName={'acceptableConditionType'}
                isOptionEqualToValue={(option, value) =>
                  option.value === (value as unknown as number)
                }
                getOptionLabel={(option) => `${option.title}`}
                valueExtractor={(option) => option?.value}
                options={productConditionItems || []}
                required
                controllerProps={{
                  rules: {
                    required: {
                      value: true,
                      message: formatMessage(AddSimpleProductMessages.requiredField),
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <HBAutocompleteController<ProductFormType, GetBusinessTypeValuesQueryResult>
                label={formatMessage(AddSimpleProductMessages.originalityTypeCode)}
                disabled={disabled}
                valueExtractor={(option) => option?.fullCode}
                fieldName={'originalityType'}
                isOptionEqualToValue={(option, value) => option.fullCode == value}
                getOptionLabel={(option) => option.title!}
                options={productOrigin || []}
                required
                controllerProps={{
                  rules: {
                    required: {
                      value: true,
                      message: formatMessage(AddSimpleProductMessages.requiredField),
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <HBFormItemTextField
                disabled={disabled}
                formName={'name' as keyof ProductFormType}
                label={formatMessage(AddSimpleProductMessages.name)}
                rules={{
                  required: {
                    value: true,
                    message: formatMessage(AddSimpleProductMessages.requiredField),
                  },
                }}
                onChange={({ target: { value } }) => {
                  formProviderProps.setValue('sku', value)
                  formProviderProps.setValue('name', value)
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <HBFormItemTextField
                disabled={disabled}
                formName={'sku' as keyof ProductFormType}
                label={formatMessage(AddSimpleProductMessages.sku)}
                rules={{
                  required: {
                    value: true,
                    message: formatMessage(AddSimpleProductMessages.requiredField),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <SellerDataGrid
                disabled={disabled}
                vendorId={vendorId || undefined}
                onSelectSeller={(seller) => {
                  formProviderProps.setValue('vendorId', seller?.id)
                  formProviderProps.setValue('onHandQty', null)
                  formProviderProps.setValue('originalPrice', null)
                  formProviderProps.setValue('finalPrice', null)
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <HBNumericFormatController<ProductFormType>
                disabled={!vendorId}
                name={'onHandQty'}
                label={formatMessage(AddSimpleProductMessages.onHandQty)}
                fullWidth
                decimalScale={0}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <HBTextFieldSelect
                textFieldDisabled={disabled}
                selectItemsDisabled={disabled}
                InputLabelProps={{
                  shrink: !!weight,
                }}
                textFieldLabel={formatMessage(AddSimpleProductMessages.weight)}
                selectItems={unitMeasurementItems}
                textFieldReturnValue={(value: string) => {
                  formProviderProps.setValue('weight', Math.abs(Number(value)))
                }}
                value={weight}
                selectProps={{
                  value: String(unitOfMeasureId),
                  onChange: (event) =>
                    formProviderProps.setValue('unitOfMeasureId', String(event.target.value)),
                }}
                type="number"
              />

              {action === 'edit' && (
                <Typography
                  variant="caption"
                  sx={{ color: 'grey.500', cursor: 'pointer', mt: 2, display: 'block' }}
                  onClick={() =>
                    router.push(
                      `/products/${productType}-product/edit/communication-between-product-and-send/${id}#${PACKAGING_INFORMATION_fORM_ID}`,
                    )
                  }
                >
                  {formatMessage(AddSimpleProductMessages.moreInfo)}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              <HBAutocompleteController<ProductFormType, GetCurrenciesQueryResult>
                label={formatMessage(AddSimpleProductMessages.currencyId)}
                disabled
                fieldName={'currencyId'}
                isOptionEqualToValue={(option, value) => option.id == value}
                getOptionLabel={(option) => option.name!}
                valueExtractor={(option) => option?.id}
                options={currencies || []}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <HBNumericFormatController<ProductFormType>
                disabled={!vendorId}
                name={'originalPrice'}
                label={formatMessage(AddSimpleProductMessages.originalPrice, {
                  type: defaultCurrencyTitle,
                })}
                formRules={{
                  min: {
                    value: 1,
                    message: formatMessage(AddSimpleProductMessages.minimumPrice, {
                      min: 1,
                    }),
                  },
                }}
                thousandSeparator=","
                fullWidth
                onChange={({ target: { value } }) => {
                  if (!value) {
                    formProviderProps.setValue('finalPrice', undefined)
                  }
                }}
              />
              {action === 'edit' && (
                <Typography
                  variant="caption"
                  sx={{ color: 'grey.500', cursor: 'pointer', mt: 2, display: 'block' }}
                  onClick={() =>
                    router.push(
                      `/products/${productType}-product/edit/ordering/${id}#${INVENTORY_FORM_ID}`,
                    )
                  }
                >
                  {formatMessage(AddSimpleProductMessages.moreInfo)}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              <HBNumericFormatController<ProductFormType>
                disabled={disabledFinalPrice}
                name={'finalPrice'}
                label={formatMessage(AddSimpleProductMessages.finalPrice)}
                formRules={{
                  required: false,
                  ...(!originalPrice
                    ? {}
                    : {
                        min: {
                          value: 1,
                          message: formatMessage(AddSimpleProductMessages.minimumPrice, {
                            min: 1,
                          }),
                        },
                      }),
                }}
                thousandSeparator=","
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <HBAutocompleteController<ProductFormType, GetTaxTypesQueryResult>
                label={formatMessage(AddSimpleProductMessages.taxType)}
                disabled={disabled}
                valueExtractor={(option) => option?.id}
                fieldName={'taxType'}
                isOptionEqualToValue={(option, value) => option.id == value}
                getOptionLabel={(option) => option?.name || ''}
                options={taxTypes || []}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <HBFormItemTextField
                disabled
                value={productData?.data?.systemName}
                formName={'systemName'}
                label={formatMessage(AddSimpleProductMessages.systemName)}
                rules={{
                  required: false,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <HBFormItemTextField
                multiline
                rows={4}
                formName={'seo' as keyof ProductFormType}
                label={formatMessage(AddSimpleProductMessages.seoText)}
                rules={{
                  required: false,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <HBTagsContainer
                disabled={disabled}
                tags={tags}
                tagsArray={(tags: string[]) => setTags(tags)}
                label={formatMessage(AddSimpleProductMessages.defaultTags)}
              />
            </Grid>
          </Grid>
          <ProductPreviewButtons />

          <Box sx={classes.buttonContainer}>
            <HBButton
              variant="outlined"
              onClick={() =>
                router.push({
                  pathname: '/products',
                })
              }
            >
              {formatMessage(phrasesMessages.back)}
            </HBButton>

            <HBButton
              sx={({ spacing }) => ({
                width: 152,
                mx: spacing(1),
                [`&.${buttonClasses.disabled}`]: {
                  bgcolor: 'primary.main',
                  opacity: '0.3',
                  color: 'background.paper',
                },
              })}
              size="medium"
              color="primary"
              loading={isLoadingPost || isLoadingPut}
              disabled={!formProviderProps.formState.isValid || isLoadingPost || isLoadingPut}
              type="submit"
            >
              {formatMessage(AddSimpleProductMessages.submitButton)}
            </HBButton>
          </Box>
        </Box>
        <HBRecordHistory
          entityId={id}
          useGetHistory={useGetAdminCatalogProductsByIdHistoryQuery}
          isBorder
          isShowAccordion
          disabled={!id}
        />
      </HBForm>
      <ConfirmDialog
        count={dirtyFieldsCount}
        open={openConfirmDialog}
        isLoading={isLoadingPut}
        onClose={onRejectConfirmation}
        onConfirm={() => {
          return {}
        }}
        onAcceptBtnProps={{
          type: 'submit',
          form: FORM_ID,
          disabled: !formProviderProps.formState.isValid,
        }}
      />
    </ProductFormContainer>
  )
}

export default AddSimpleProduct
