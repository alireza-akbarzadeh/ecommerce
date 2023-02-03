import { HBRecordHistory, HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { HBTagsContainer } from '@hasty-bazar/admin-shared/containers/HBTagsContainer'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  CreateConfigurableProductModel,
  useGetAdminCatalogProductsByIdHistoryQuery,
  useGetAdminCatalogProductsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery,
  useGetAdminCatalogProductsGetTransitionByEntityIdAndStateMachineCodeFactorQuery,
  usePostAdminCatalogConfigurableProductsMutation,
  usePostAdminCatalogProductsChangeStateMutation,
  usePutAdminCatalogConfigurableProductsByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  GetBusinessTypeValuesQueryResult,
  GetCurrenciesQueryResult,
  GetTaxTypesQueryResult,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAutocompleteController, HBButton, HBForm, HBFormItemTextField } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ProductFormContainer from '../../productFormContainer'
import { ProductPreviewButtons } from '../../productPreviewButtons'
import { RelationCategoryRenderController } from '../../relationCategoryRender'
import AddConfigurableProductMessages from './AddProduct.messages'
import ConfirmDialog from './confirmDialog'
import { classes } from './productForm.styles'
import SellerDataGrid from './sellerDataGrid'
import useProductRequirementData from './useProductRequirementData'
export type ProductFormType = CreateConfigurableProductModel

const NEW_PRODUCT_ID = 1019001
const AddConfigurableProduct: FC = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const id = router.query?.id as string
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [postProduct, { isLoading }] = usePostAdminCatalogConfigurableProductsMutation()
  const [putProduct, { isLoading: isPutLoading }] =
    usePutAdminCatalogConfigurableProductsByIdMutation()

  const {
    formProviderProps,
    handleSubmit,
    disabled,
    tags,
    setTags,
    productConditionItems,
    taxTypes,
    productGroup,
    currencies,
    productOrigin,
    action,
    categoryId,
    FORM_ID,
    vendorId,
    productData,
    refetch,
    categoryAcceptingItemsLoading,
  } = useProductRequirementData<ProductFormType>({
    createProduct(values) {
      return postProduct({
        'client-name': 'admin',
        'client-version': '1.0.0',
        createConfigurableProductModel: values,
      })
    },
    updateProduct(values) {
      return putProduct({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id,
        updateConfigurableProductModel: values,
      })
    },
  })

  const { dirtyFields } = formProviderProps.formState
  const dirtyFieldsCount = Object.keys(dirtyFields).length
  const onRejectConfirmation = useCallback(() => {
    setOpenConfirmDialog(false)
    router.push(`/products/configurable-product/edit/content-settings/${id}`)
  }, [])
  useEffect(() => {
    if (!isPutLoading) {
      setOpenConfirmDialog(false)
    }
  }, [isPutLoading])

  useEffect(() => {
    formProviderProps.setValue('acceptableConditionType', NEW_PRODUCT_ID)
  }, [])

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
        formProviderProps={formProviderProps}
        onSubmit={handleSubmit}
        mode="onSubmit"
        id={FORM_ID}
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
            {formatMessage(AddConfigurableProductMessages.subTitle)}
          </Typography>

          <Grid container spacing={6} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={3}>
              <HBFormItemTextField
                disabled
                value={productData?.data?.hsin}
                formName={'hsin'}
                label={formatMessage(AddConfigurableProductMessages.hsin)}
                rules={{
                  required: false,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <RelationCategoryRenderController
                disabled={disabled}
                categoriesData={productGroup}
                defaultValue={categoryId}
                label={formatMessage(AddConfigurableProductMessages.categoryId)}
                setValue={(value, defaultValue) => {
                  formProviderProps.setValue('categoryId', String(value))
                  categoryAcceptingItemsLoading.refetch()
                  if (!defaultValue) {
                    formProviderProps.setValue('acceptableConditionType', NEW_PRODUCT_ID)
                  }
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
                label={formatMessage(AddConfigurableProductMessages.acceptableConditionTypeCode)}
                disabled
                fieldName={'acceptableConditionType' as keyof ProductFormType}
                isOptionEqualToValue={(option, value) =>
                  option.value === (value as unknown as number)
                }
                textFiledProps={{
                  InputLabelProps: {
                    required: true,
                  },
                }}
                getOptionLabel={(option) => `${option.title}`}
                options={productConditionItems || []}
                required
                valueExtractor={(option) => option?.value}
                controllerProps={{
                  rules: {
                    required: {
                      value: true,
                      message: formatMessage(AddConfigurableProductMessages.requiredField),
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <HBAutocompleteController<ProductFormType, GetBusinessTypeValuesQueryResult>
                label={formatMessage(AddConfigurableProductMessages.originalityTypeCode)}
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
                      message: formatMessage(AddConfigurableProductMessages.requiredField),
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <HBFormItemTextField
                disabled={disabled}
                formName={'name' as keyof ProductFormType}
                label={formatMessage(AddConfigurableProductMessages.name)}
                rules={{
                  required: {
                    value: true,
                    message: formatMessage(AddConfigurableProductMessages.requiredField),
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
                label={formatMessage(AddConfigurableProductMessages.sku)}
                rules={{
                  required: {
                    value: true,
                    message: formatMessage(AddConfigurableProductMessages.requiredField),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <SellerDataGrid
                disabled={disabled}
                vendorId={vendorId}
                onSelectSeller={(seller) => {
                  formProviderProps.setValue('vendorId', seller?.id)
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <HBAutocompleteController<ProductFormType, GetCurrenciesQueryResult>
                label={formatMessage(AddConfigurableProductMessages.currencyId)}
                disabled
                fieldName={'currencyId'}
                isOptionEqualToValue={(option, value) => option.id == value}
                getOptionLabel={(option) => option.name!}
                valueExtractor={(option) => option?.id}
                options={currencies || []}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <HBAutocompleteController<ProductFormType, GetTaxTypesQueryResult>
                label={formatMessage(AddConfigurableProductMessages.taxType)}
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
                label={formatMessage(AddConfigurableProductMessages.systemName)}
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
                label={formatMessage(AddConfigurableProductMessages.seoText)}
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
                label={formatMessage(AddConfigurableProductMessages.defaultTags)}
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
                '&.Mui-disabled': {
                  bgcolor: 'primary.main',
                  opacity: '0.3',
                  color: 'background.paper',
                },
              })}
              loading={isLoading || isPutLoading}
              size="medium"
              color="primary"
              disabled={!formProviderProps.formState.isValid || isPutLoading || isLoading}
              type="submit"
            >
              {formatMessage(AddConfigurableProductMessages.submitButton)}
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
        isLoading={isPutLoading}
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

export default AddConfigurableProduct
