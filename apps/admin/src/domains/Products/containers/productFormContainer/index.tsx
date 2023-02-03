import {
  useGetAdminCatalogConfigurableProductsByIdQuery,
  useGetAdminCatalogConfigurableProductsByIdSystemNameQuery,
  useGetAdminCatalogSimpleProductsByIdQuery,
  useGetAdminCatalogSimpleProductsByIdSystemNameQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBIconType, HBTextField } from '@hasty-bazar/core'
import { Box, Grid, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { getProductType } from '../../utils'
import AddSimpleProduct from '../productForm/addProduct/AddProduct.messages'
import ContentSettingsMessages from '../productForm/contentSettings/ContentSettings.messages'
import ProductsDataGrid from '../productForm/ProductsDataGrid'
import { ProductsStepper } from '../Stepper'
import { ProductsStepperProps } from '../Stepper/ProductsStepper'
import ProductFormContainerMessages from './ProductFormContainer.messages'

export interface ProductFormContainerProps {
  children: React.ReactNode
  stepperProps?: ProductsStepperProps
  withDetails?: boolean
  productType?: 'simple' | 'configurable'
}

export const steps = (productType: 'simple' | 'configurable') => ({
  'product-details': 0,
  ...(productType === 'configurable' ? { 'duplication-settings': 1 } : {}),
  'content-settings': productType === 'simple' ? 1 : 2,
  ordering: 2 + (productType === 'configurable' ? 1 : 0),
  'communication-between-product-and-send': 3 + (productType === 'configurable' ? 1 : 0),
})
function ProductFormContainer({ children, stepperProps, withDetails }: ProductFormContainerProps) {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const action = router.query.action as string

  const type = router.query.type as string
  const parentId = router.query.parentId as string
  const productType = getProductType(router.pathname)
  const stepsKeys = Object.keys(steps(productType)) as Array<keyof typeof steps>
  const step = getCurrentStep(router.pathname, steps(productType))
  const productSteps: {
    label: string
    icon: HBIconType
  }[] = [
    {
      label: formatMessage(AddSimpleProduct.createProduct),
      icon: 'checkCircle',
    },
    ...((productType === 'simple'
      ? []
      : [
          {
            label: formatMessage(ContentSettingsMessages.duplicationPoint),
            icon: 'fileCopyAlt',
          },
        ]) as any[]),
    {
      label: formatMessage(AddSimpleProduct.contentSettings),
      icon: 'subject',
    },
    {
      label: formatMessage(AddSimpleProduct.ordering),
      icon: 'shoppingBag',
    },
    {
      label: formatMessage(AddSimpleProduct.communicationBetweenProductAndSend),
      icon: 'truck',
    },
  ]

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(ProductFormContainerMessages.home),
    },
    {
      url: '/products',
      title: formatMessage(ProductFormContainerMessages.products),
    },
    {
      url: '#',
      title: formatMessage(ProductFormContainerMessages.addProduct),
    },
  ]
  const id = router.query.id as unknown as string

  const args = {
    'client-name': 'admin',
    'client-version': '1.0.0',
    id: router.query.id as string,
  }
  const options = {
    skip: !router.query.id,
  }
  const productSystemTitle =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdSystemNameQuery(args, options)
      : useGetAdminCatalogConfigurableProductsByIdSystemNameQuery(args, options)
  const { data: productData, isError } =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdQuery(args, options)
      : useGetAdminCatalogConfigurableProductsByIdQuery(args, options)

  const onStepChange = (stepNumber: number) => {
    const stepName = stepsKeys[stepNumber]
    if (stepNumber < 2) {
      router.push(
        `/products/${productType}-product/edit/${stepName}/${parentId || router.query.id}`,
      )
      return
    }
    if (type) {
      const route = `/products/${productType}-product/edit/${stepName}/${router.query.id}`
      router.push({
        pathname: route,
        query: {
          type,
          parentId,
        },
      })
      return
    }
    router.push(`/products/${productType}-product/edit/${stepName}/${router.query.id}`)
  }
  const defaultStepperProps: ProductsStepperProps = {
    steps: productSteps,
    nextButtonProps: {
      onClick: (_, stepNumber) => onStepChange(stepNumber),
    },
    prevButtonProps: {
      onClick: (_, stepNumber) => onStepChange(stepNumber),
    },
    onStepChange: (stepNumber) => {
      onStepChange(stepNumber)
    },
  }

  const _withDetails = productType === 'simple' ? withDetails : withDetails && step < 2
  return (
    <>
      <BreadCrumbSection
        title={formatMessage(ProductFormContainerMessages.title)}
        breadItems={breadcrumbs}
      />
      <ProductsStepper activeItem={step} {...defaultStepperProps} {...stepperProps} />
      {_withDetails && (
        <Box bgcolor="common.white" sx={{ p: 4, borderRadius: 4, mb: 4 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <HBTextField
                fullWidth
                InputLabelProps={{
                  required: true,
                }}
                disabled
                value={productData?.data?.name}
                label={formatMessage(ContentSettingsMessages.productTitle)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <HBTextField
                value={productData?.data?.sku}
                fullWidth
                disabled
                label={formatMessage(ContentSettingsMessages.sku)}
              />
            </Grid>
            <Grid item xs={12}>
              <HBTextField
                fullWidth
                value={productSystemTitle.data?.data?.systemName}
                disabled
                label={formatMessage(ContentSettingsMessages.productSystemTitle)}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {productType === 'configurable' && step > 1 && (
        <Stack my={4}>
          <ProductsDataGrid />
        </Stack>
      )}
      {children}
    </>
  )
}

export default ProductFormContainer
function getCurrentStep(pathname: string, steps: Record<string, number>): number {
  const stepNames = Object.keys(steps) as Array<keyof typeof steps>
  const stepName = stepNames.find((stepName) => pathname.includes(stepName))
  return steps[stepName as keyof typeof steps]
}
