import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import {
  CopyProductModel,
  CopyProductOption,
  GetCopyProductNewVariantAttributeValuesQueryModel,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { removeEmptyFields } from '@hasty-bazar/admin-shared/utils'
import {
  HBButton,
  HBCheckBox,
  HBForm,
  HBIcon,
  HBSelect,
  HBSwitch,
  HBTextField,
  openToast,
} from '@hasty-bazar/core'
import { Box, FormControlLabel, Grid, IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import {
  useGetAdminCatalogProductsByIdCopyProductQuery,
  useGetAdminCatalogProductsByIdCopyProductVariantOptionsQuery,
  usePostAdminCatalogProductsByIdCopyProductMutation,
} from '../../catalogApi.enhanced'
import SellerDataGrid from '../productForm/addProduct/sellerDataGrid'
import copyProductMessages from './copyProduct.messages'

export const enum CopyProductTypeEnum {
  SimpleProduct = 1,
  ConfigurableProduct = 2,
  SimpleProductBelowTheConfigurableProduct = 3,
}
export const enum SimpleProductBelowTheConfigurableCopyTypeEnum {
  SimpleProduct = 1,
  NewVariantBelowTheConfigurableProduct = 2,
}

type FormType = CopyProductModel & {
  copyProductType: SimpleProductBelowTheConfigurableCopyTypeEnum
}
interface ModalContentProps {
  onClose: VoidFunction
  id: string
}
function ModalContent({ id, onClose }: ModalContentProps) {
  const { formatMessage } = useIntl()
  const [disabledVendor, setDisabledVendor] = useState(true)
  const [variants, setVariants] = useState<Record<string, string>>()
  const [options, setOptions] = useState<CopyProductOption[]>([])
  const [productVariantsArgs, setProductVariantsArgs] = useState<{
    referenceAttributeId: string
    referenceAttributeValueId: string
  }>()
  const formProviderProps = useForm<FormType>({
    defaultValues: {},
  })
  const { control } = formProviderProps
  const formValues = useWatch({ control })
  const productVariants = useGetAdminCatalogProductsByIdCopyProductVariantOptionsQuery({
    id,
    'client-name': 'admin',
    'client-version': '1.0.0',
  })

  const filteredProductVariants = useGetAdminCatalogProductsByIdCopyProductVariantOptionsQuery({
    id,
    'client-name': 'admin',
    'client-version': '1.0.0',
    referenceAttributeId: productVariantsArgs?.referenceAttributeId,
    referenceAttributeValueId: productVariantsArgs?.referenceAttributeValueId,
  })
  const copyProductData = useGetAdminCatalogProductsByIdCopyProductQuery({
    'client-name': 'admin',
    'client-version': '0.0.0',
    id,
  })
  const [postCopyProduct, copyProductStates] = usePostAdminCatalogProductsByIdCopyProductMutation()
  const handleSubmit = (data: FormType) => {
    copyProductStates.reset()
    const formData: CopyProductModel = {
      copyType: data.copyProductType,
      options:
        options.map((option) => ({
          isSelected: option.isSelected,
          optionName: option.optionName,
        })) || [],
      vendorId: data.vendorId || copyProductData.data?.data?.vendorId,
      newVariantAttributeValues: Object.keys(variants || {}).map((key) => ({
        attributeId: key,
        attributeValueId: variants![key as keyof typeof variants],
      })),
    }
    postCopyProduct({
      'client-name': 'admin',
      'client-version': '0.0.0',
      id,
      copyProductModel: removeEmptyFields(formData),
    })
  }
  const defaultOptions = useMemo(
    () =>
      [...(copyProductData.data?.data?.options || [])]?.sort(
        (a, b) => (a.order || 0) - (b.order || 0),
      ),
    [copyProductData.data?.data?.options],
  )

  const showSelectCopyType =
    copyProductData.data?.data?.copyType ===
      CopyProductTypeEnum.SimpleProductBelowTheConfigurableProduct &&
    copyProductData.isLoading === false
  const showProductVariants =
    formValues.copyProductType ===
      SimpleProductBelowTheConfigurableCopyTypeEnum.NewVariantBelowTheConfigurableProduct &&
    copyProductData.isLoading === false
  const showVendors =
    formValues.copyProductType !==
      SimpleProductBelowTheConfigurableCopyTypeEnum.NewVariantBelowTheConfigurableProduct &&
    copyProductData.isLoading === false
  const handleCheckBoxChange = (option: CopyProductOption) => {
    setOptions((prev) => {
      return prev.map((opt) => {
        if (opt.optionName === option.optionName) {
          return {
            ...opt,
            isSelected: !opt.isSelected,
          }
        }
        return opt
      })
    })
  }

  const productVariantsOptions = useMemo(() => {
    const options = productVariants.data?.data?.items?.map((item) => {
      const filteredProductVariantsOption = filteredProductVariants.data?.data?.items?.find(
        (variant) => variant.attributeName === item.attributeName,
      )
      if (filteredProductVariantsOption) {
        return filteredProductVariantsOption
      }
      return item
    })
    return options || []
  }, [productVariants.data?.data?.items, filteredProductVariants.data?.data?.items])

  const onProductVariantChange = (
    item: GetCopyProductNewVariantAttributeValuesQueryModel,
    value: string,
  ) => {
    const { attributeId } = item || {}
    setVariants({
      ...variants,
      [attributeId!]: value,
    })
    setProductVariantsArgs({
      referenceAttributeId: attributeId!,
      referenceAttributeValueId: value,
    })
  }
  useEffect(() => {
    if (defaultOptions.length > 0) {
      setOptions(defaultOptions)
    }
  }, [defaultOptions])

  useEffect(() => {
    if (copyProductStates.isSuccess) {
      openToast({
        message: formatMessage(copyProductMessages.copyProductSuccess),
        type: 'success',
      })
      onClose()
    }
  }, [copyProductStates.isLoading])

  useEffect(() => {
    formProviderProps.setValue('vendorId', copyProductData.data?.data?.vendorId)
  }, [copyProductData.data?.data?.vendorId])

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 4,
        maxHeight: '90vh',
        overflow: 'auto',
        p: 6,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack display="flex" flexDirection={'row'} justifyContent="space-between">
          <Typography color={'gray.900'} component="h6" fontWeight={'bold'}>
            {formatMessage(copyProductMessages.copyProduct)}
          </Typography>
          <IconButton onClick={onClose}>
            <HBIcon type="times" size="small" sx={{ color: 'grey.500' }} />
          </IconButton>
        </Stack>
        <HBForm formProviderProps={formProviderProps} onSubmit={handleSubmit}>
          <Grid
            sx={{
              py: 3,
              pb: showSelectCopyType ? 3 : 6,
            }}
            container
          >
            <Grid item xs={12} md={3}>
              <HBTextField
                fullWidth
                value={copyProductData.data?.data?.copyTypeName || ''}
                disabled
                label={''}
              />
            </Grid>
          </Grid>

          <Grid my={6} display={showSelectCopyType ? 'block' : 'none'} container>
            <Grid item xs={12} md={3}>
              <HBSelectController
                fullWidth
                formRules={{ required: showSelectCopyType }}
                name="copyProductType"
                label={formatMessage(copyProductMessages.copyProductType)}
                menuItem={[
                  {
                    title: formatMessage(copyProductMessages.simpleProduct),
                    value: SimpleProductBelowTheConfigurableCopyTypeEnum.SimpleProduct,
                  },
                  {
                    title: formatMessage(copyProductMessages.newVariantBelowTheConfigurableProduct),
                    value:
                      SimpleProductBelowTheConfigurableCopyTypeEnum.NewVariantBelowTheConfigurableProduct,
                  },
                ]}
              />
            </Grid>
          </Grid>
          <Grid mb={6} display={showProductVariants ? 'flex' : 'none'} container gap={6}>
            {!productVariantsOptions.length ? (
              <Typography>{formatMessage(copyProductMessages.noProductVariants)}</Typography>
            ) : (
              productVariantsOptions?.map((item) => {
                const menuItems =
                  [...(item.attributeValues || [])]
                    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                    ?.map((value) => ({
                      title: value.value || '',
                      value: value.attributeValueId || '',
                    })) || []
                return (
                  <Grid item key={item.attributeId} xs={12} md={3}>
                    <HBSelect
                      fullWidth
                      disabled={productVariants.isLoading}
                      size="small"
                      name={item.attributeId!}
                      label={item.attributeName!}
                      menuItem={menuItems}
                      defaultValue={menuItems[0].value}
                      value={variants?.[item.attributeId!]}
                      onChange={(event) =>
                        onProductVariantChange(item, event.target.value as unknown as string)
                      }
                    />
                  </Grid>
                )
              })
            )}
          </Grid>
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Typography color={'gray.900'} component="h6" fontWeight={'bold'}>
              {formatMessage(copyProductMessages.copyProduct)}
            </Typography>
          </Box>
          <Grid container py={6} spacing={2}>
            {options.map((option) => (
              <Grid item key={option.optionName} xs={12} md={6}>
                <FormControlLabel
                  checked={option.isSelected}
                  control={
                    <HBCheckBox size="small" onChange={() => handleCheckBoxChange(option)} />
                  }
                  label={option.optionTitle}
                />
              </Grid>
            ))}
          </Grid>
          <Box
            display={showVendors ? 'flex' : 'none'}
            gap={2}
            justifyContent="flex-start"
            flexDirection={{
              md: 'row',
              xs: 'column',
            }}
          >
            <FormControlLabel
              control={
                <HBSwitch
                  sx={{ mr: 2 }}
                  size="small"
                  checked={!disabledVendor}
                  onChange={(event) => setDisabledVendor(!event.target.checked)}
                />
              }
              label={formatMessage(copyProductMessages.vendor)}
            />
            <Stack
              width={{
                sm: '100%',
                md: 255,
              }}
            >
              <SellerDataGrid
                disabled={disabledVendor}
                vendorId={formValues.vendorId || undefined}
                onSelectSeller={(vendor) => {
                  formProviderProps.setValue('vendorId', vendor?.id)
                }}
              />
            </Stack>
          </Box>
          <Box display={'flex'} justifyContent="flex-end">
            <HBButton
              loading={copyProductStates.isLoading}
              disabled={copyProductStates.isLoading}
              type="submit"
              color="primary"
            >
              <Typography fontSize={14}>
                {formatMessage(copyProductMessages.copyProduct)}
              </Typography>
            </HBButton>
          </Box>
        </HBForm>
      </Box>
    </Box>
  )
}
export default ModalContent
